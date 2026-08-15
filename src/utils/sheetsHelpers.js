export function serializeIncomeRow(month, amount) {
  return [month, Number(amount), new Date().toISOString()]
}

export function serializeExpenseRow(date, category, description, amount) {
  return [date, category, description || '', Number(amount), new Date().toISOString()]
}

export function deserializeRows(headers, rawRows = []) {
  if (!rawRows.length) return []
  const [headerRow, ...body] = rawRows
  if (!headerRow || !headerRow.length) return []
  return body
    .filter((row) => row.length > 0 && row.some((cell) => cell !== ''))
    .map((row) => {
      const record = {}
      headers.forEach((header, i) => {
        const value = row[i] ?? ''
        record[header] = header === 'amount' ? Number(value) || 0 : String(value)
      })
      return record
    })
}
