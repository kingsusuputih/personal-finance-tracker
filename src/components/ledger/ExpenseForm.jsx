import { useState } from 'react'
import { useSpreadsheet } from '../../hooks/useSpreadsheet.js'
import { useToast } from '../ui/Toast.jsx'
import { Button } from '../ui/Button.jsx'
import { Card } from '../ui/Card.jsx'
import { SHEETS, EXPENSE_CATEGORIES } from '../../constants/sheets.js'
import { serializeExpenseRow } from '../../utils/sheetsHelpers.js'
import { currentDateKey } from '../../utils/financeFormulas.js'

export function ExpenseForm() {
  const { addTransaction } = useSpreadsheet()
  const toast = useToast()
  const [date, setDate] = useState(currentDateKey())
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    const value = Math.round(Number(amount))
    if (!value || value <= 0) {
      setError('Amount must be greater than 0')
      return
    }
    if (!category) {
      setError('Category is required')
      return
    }
    setError('')
    setSaving(true)
    try {
      await addTransaction(SHEETS.EXPENSES, serializeExpenseRow(date, category, description, value))
      toast.success('Expense saved')
      setAmount('')
      setDescription('')
    } catch (err) {
      toast.error(err.message || 'Failed to save expense')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-5">
      <h2 className="mb-4 text-base font-semibold text-ink">Expense</h2>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="kbd mb-1.5 block text-[10px] text-ink-3">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="field"
              required
            />
          </label>
          <label className="block">
            <span className="kbd mb-1.5 block text-[10px] text-ink-3">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="field"
              required
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="kbd mb-1.5 block text-[10px] text-ink-3">Description (optional)</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Groceries"
            className="field"
          />
        </label>
        <label className="block">
          <span className="kbd mb-1.5 block text-[10px] text-ink-3">Amount (IDR)</span>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 250000"
            className="field"
            required
          />
        </label>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" loading={saving} className="w-full">
          Save expense
        </Button>
      </form>
    </Card>
  )
}
