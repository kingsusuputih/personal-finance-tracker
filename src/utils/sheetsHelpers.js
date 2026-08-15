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
    .map((row, i) => {
      const record = { rowNumber: i + 2 }
      let hasData = false
      headers.forEach((header, j) => {
        const value = row[j] ?? ''
        if (header === 'amount') record[header] = Number(value) || 0
        else record[header] = String(value)
        if (String(value).trim() !== '') hasData = true
      })
      return hasData ? record : null
    })
    .filter(Boolean)
}
