import { useState } from 'react'
import { useSpreadsheet } from '../../hooks/useSpreadsheet.js'
import { useToast } from '../ui/Toast.jsx'
import { Button } from '../ui/Button.jsx'
import { Card } from '../ui/Card.jsx'
import { useT } from '../../i18n/LanguageProvider.jsx'
import { SHEETS, EXPENSE_CATEGORIES } from '../../constants/sheets.js'
import { serializeExpenseRow } from '../../utils/sheetsHelpers.js'
import { currentDateKey } from '../../utils/financeFormulas.js'

export function ExpenseForm() {
  const { addTransaction } = useSpreadsheet()
  const toast = useToast()
  const t = useT()
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
      setError(t('form.err.amount'))
      return
    }
    if (!category) {
      setError(t('form.err.category'))
      return
    }
    setError('')
    setSaving(true)
    try {
      await addTransaction(SHEETS.EXPENSES, serializeExpenseRow(date, category, description, value))
      toast.success(t('expense.saved'))
      setAmount('')
      setDescription('')
    } catch (err) {
      toast.error(err.message || t('form.err.amount'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="p-5">
      <h2 className="mb-4 text-base font-semibold text-ink">{t('expense.title')}</h2>
      <form onSubmit={submit} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="kbd mb-1.5 block text-[10px] text-ink-3">{t('expense.date')}</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="field"
              required
            />
          </label>
          <label className="block">
            <span className="kbd mb-1.5 block text-[10px] text-ink-3">{t('expense.category')}</span>
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
          <span className="kbd mb-1.5 block text-[10px] text-ink-3">
            {t('expense.description')}
          </span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t('expense.descPlaceholder')}
            className="field"
          />
        </label>
        <label className="block">
          <span className="kbd mb-1.5 block text-[10px] text-ink-3">{t('expense.amount')}</span>
          <input
            type="number"
            inputMode="numeric"
            min="1"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={t('expense.placeholder')}
            className="field"
            required
          />
        </label>
        {error && <p className="text-sm text-danger">{error}</p>}
        <Button type="submit" loading={saving} className="w-full">
          {t('expense.save')}
        </Button>
      </form>
    </Card>
  )
}
