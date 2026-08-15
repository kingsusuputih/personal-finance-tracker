import { useState } from 'react'
import { useSpreadsheet } from '../../hooks/useSpreadsheet.js'
import { useToast } from '../ui/Toast.jsx'
import { Button } from '../ui/Button.jsx'
import { Card } from '../ui/Card.jsx'
import { SHEETS } from '../../constants/sheets.js'
import { serializeIncomeRow } from '../../utils/sheetsHelpers.js'
import { currentMonthKey } from '../../utils/financeFormulas.js'

export function IncomeForm() {
  const { addTransaction } = useSpreadsheet()
  const toast = useToast()
  const [month, setMonth] = useState(currentMonthKey())
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
    setError('')
    setSaving(true)
    try {
      await addTransaction(SHEETS.INCOME, serializeIncomeRow(month, value))
      toast.success(`Income saved for ${month}`)
      setAmount('')
    } catch (err) {
      toast.error(err.message || 'Failed to save income')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-5">
      <h2 className="mb-4 text-base font-semibold text-ink">Income</h2>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <label className="block">
          <span className="kbd mb-1.5 block text-[10px] text-ink-3">Month</span>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="field"
            required
          />
        </label>
        <label className="block">
          <span className="kbd mb-1.5 block text-[10px] text-ink-3">Total monthly income (IDR)</span>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g. 10000000"
            className="field"
            required
          />
        </label>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" loading={saving} className="w-full">
          Save income
        </Button>
      </form>
    </Card>
  )
}
