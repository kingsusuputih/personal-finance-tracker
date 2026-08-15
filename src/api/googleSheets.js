import { authedRequest } from './http.js'

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
