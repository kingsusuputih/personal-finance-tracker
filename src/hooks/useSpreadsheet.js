import { useCallback } from 'react'
import { useAuthStore } from '../store/authStore.js'
import { useFinanceStore } from '../store/financeStore.js'
import { getOrCreateSpreadsheet } from '../api/googleDrive.js'
import { getRows, appendRow, updateRow, deleteRow } from '../api/googleSheets.js'
import { INCOME_HEADERS, EXPENSE_HEADERS } from '../constants/sheets.js'
import { deserializeRows } from '../utils/sheetsHelpers.js'

export function useSpreadsheet() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const {
    spreadsheetId,
    income,
    transactions,
    provisioning,
    loading,
    setSpreadsheetId,
    setIncome,
    setTransactions,
    setProvisioning,
    setLoading,
  } = useFinanceStore()

  const ensureSpreadsheet = useCallback(async () => {
    if (!accessToken) return null
    const cached = useFinanceStore.getState().spreadsheetId
    if (cached) return cached
    setProvisioning(true)
    try {
      const id = await getOrCreateSpreadsheet(accessToken)
      setSpreadsheetId(id)
      return id
    } finally {
      setProvisioning(false)
    }
  }, [accessToken, setProvisioning, setSpreadsheetId])

  const loadData = useCallback(async () => {
    const id = useFinanceStore.getState().spreadsheetId
    if (!id || !accessToken) return
    setLoading(true)
    try {
      const [incomeRows, expenseRows] = await Promise.all([
        getRows(accessToken, id, 'Income'),
        getRows(accessToken, id, 'Expenses'),
      ])
      setIncome(deserializeRows(INCOME_HEADERS, incomeRows))
      setTransactions(deserializeRows(EXPENSE_HEADERS, expenseRows))
    } finally {
      setLoading(false)
    }
  }, [accessToken, setIncome, setTransactions, setLoading])

  const addTransaction = useCallback(
    async (sheetName, rowValues) => {
      const id = useFinanceStore.getState().spreadsheetId
      if (!id || !accessToken) throw new Error('Spreadsheet not ready')
      await appendRow(accessToken, id, sheetName, rowValues)
      await loadData()
    },
    [accessToken, loadData],
  )

  const updateTransaction = useCallback(
    async (sheetName, rowNumber, rowValues) => {
      const id = useFinanceStore.getState().spreadsheetId
      if (!id || !accessToken) throw new Error('Spreadsheet not ready')
      await updateRow(accessToken, id, sheetName, rowNumber, rowValues)
      await loadData()
    },
    [accessToken, loadData],
  )

  const deleteTransaction = useCallback(
    async (sheetName, rowNumber) => {
      const id = useFinanceStore.getState().spreadsheetId
      if (!id || !accessToken) throw new Error('Spreadsheet not ready')
      await deleteRow(accessToken, id, sheetName, rowNumber)
      await loadData()
    },
    [accessToken, loadData],
  )

  return {
    ensureSpreadsheet,
    loadData,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    spreadsheetId,
    income,
    transactions,
    provisioning,
    loading,
  }
}
