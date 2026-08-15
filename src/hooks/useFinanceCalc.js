import { useMemo } from 'react'
import { useFinanceStore } from '../store/financeStore.js'
import {
  calculateAllocations,
  calculateFundTargets,
  sumByCategory,
  sumForMonth,
  currentMonthKey,
} from '../utils/financeFormulas.js'

export function useFinanceCalc() {
  const income = useFinanceStore((s) => s.income)
  const transactions = useFinanceStore((s) => s.transactions)

  return useMemo(() => {
    const currentMonth = currentMonthKey()
    const monthIncomes = income.filter((r) => r.month === currentMonth)
    const monthlyIncome = monthIncomes.length ? monthIncomes[monthIncomes.length - 1].amount : 0
    const totalMonthlyExpenses = sumForMonth(transactions, currentMonth)
    const allocations = calculateAllocations(monthlyIncome)
    const fundTargets = calculateFundTargets(totalMonthlyExpenses)
    const actualSpending = {
      needs: sumByCategory(transactions, 'Needs', currentMonth),
      investments: sumByCategory(transactions, 'Investment', currentMonth),
      lifestyle: sumByCategory(transactions, 'Lifestyle', currentMonth),
    }
    return { currentMonth, monthlyIncome, totalMonthlyExpenses, allocations, fundTargets, actualSpending }
  }, [income, transactions])
}
