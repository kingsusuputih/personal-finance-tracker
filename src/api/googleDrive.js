import { authedRequest } from './http.js'
import { SPREADSHEET_NAME, SHEETS, INCOME_HEADERS, EXPENSE_HEADERS } from '../constants/sheets.js'

export async function findSpreadsheet(accessToken) {
  const q = encodeURIComponent(`name='${SPREADSHEET_NAME}' and trashed=false`)
  const res = await authedRequest(
    accessToken,
    `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name,mimeType)&spaces=drive`,
  )
  if (!res.ok) throw new Error('Failed to search Drive')
  const data = await res.json()
  const found = (data.files || []).find(
    (f) => f.mimeType === 'application/vnd.google-apps.spreadsheet',
  )
  return found ? found.id : null
}

async function writeHeaders(accessToken, spreadsheetId) {
  const res = await authedRequest(
    accessToken,
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        valueInputOption: 'RAW',
        data: [
          { range: `'${SHEETS.INCOME}'!A1:C1`, values: [INCOME_HEADERS] },
          { range: `'${SHEETS.EXPENSES}'!A1:E1`, values: [EXPENSE_HEADERS] },
        ],
      }),
    },
  )
  if (!res.ok) throw new Error('Failed to initialize spreadsheet')
}

export async function createSpreadsheet(accessToken) {
  const res = await authedRequest(accessToken, 'https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      properties: { title: SPREADSHEET_NAME },
      sheets: [
        { properties: { title: SHEETS.INCOME, index: 0 } },
        { properties: { title: SHEETS.EXPENSES, index: 1 } },
      ],
    }),
  })
  if (!res.ok) throw new Error('Failed to create spreadsheet')
  const data = await res.json()
  await writeHeaders(accessToken, data.spreadsheetId)
  return data.spreadsheetId
}

export async function getOrCreateSpreadsheet(accessToken) {
  const existing = await findSpreadsheet(accessToken)
  if (existing) return existing
  return createSpreadsheet(accessToken)
}
