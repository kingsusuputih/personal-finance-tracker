import { authedRequest } from './http.js'

const sheetIdCache = {}

async function resolveSheetId(accessToken, spreadsheetId, sheetName) {
  const cacheKey = `${spreadsheetId}:${sheetName}`
  if (sheetIdCache[cacheKey] !== undefined) return sheetIdCache[cacheKey]
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties(sheetId,title)`
  const res = await authedRequest(accessToken, url)
  if (!res.ok) throw new Error('Failed to load sheet metadata')
  const data = await res.json()
  const sheet = (data.sheets || []).find((s) => s.properties.title === sheetName)
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found`)
  sheetIdCache[cacheKey] = sheet.properties.sheetId
  return sheetIdCache[cacheKey]
}

export async function appendRow(accessToken, spreadsheetId, sheetName, rowValues) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`
  const res = await authedRequest(accessToken, url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [rowValues] }),
  })
  if (!res.ok) throw new Error('Failed to save row')
  return res.json()
}

export async function getRows(accessToken, spreadsheetId, sheetName) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}`
  const res = await authedRequest(accessToken, url)
  if (!res.ok) throw new Error('Failed to read rows')
  const data = await res.json()
  return data.values || []
}

export async function updateRow(accessToken, spreadsheetId, sheetName, rowNumber, rowValues) {
  const lastCol = String.fromCharCode(64 + rowValues.length)
  const range = `'${sheetName}'!A${rowNumber}:${lastCol}${rowNumber}`
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=RAW`
  const res = await authedRequest(accessToken, url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ values: [rowValues] }),
  })
  if (!res.ok) throw new Error('Failed to update row')
  return res.json()
}

export async function deleteRow(accessToken, spreadsheetId, sheetName, rowNumber) {
  const sheetId = await resolveSheetId(accessToken, spreadsheetId, sheetName)
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`
  const res = await authedRequest(accessToken, url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requests: [
        {
          deleteDimension: {
            range: { sheetId, dimension: 'ROWS', startIndex: rowNumber - 1, endIndex: rowNumber },
          },
        },
      ],
    }),
  })
  if (!res.ok) throw new Error('Failed to delete row')
  return res.json()
}
