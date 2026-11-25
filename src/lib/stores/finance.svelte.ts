import type { Budget, SavingsGoal, Transaction } from '../types/finance';
import {
	formatMoney,
	formatMonth,
	getDemoBudgets,
	getDemoGoals,
	getDemoTransactions,
	isBudgetList,
	isSavingsGoalList,
	isTransactionList
} from '../utils/finance';
import { setNotice } from './ui.svelte.js';

export const finance = $state<{
	transactions: Transaction[];
	budgets: Budget[];
	goals: SavingsGoal[];
	theme: 'light' | 'dark';
}>({
	transactions: getDemoTransactions(),
	budgets: getDemoBudgets(),
	goals: getDemoGoals(),
	theme: 'light'
});

export function initializeFinance(): string | null {
	try {
		const storedTransactions = localStorage.getItem('finora-transactions');
		if (storedTransactions === null) {
			localStorage.setItem('finora-transactions', JSON.stringify(finance.transactions));
		} else {
			const parsed: unknown = JSON.parse(storedTransactions);
			if (isTransactionList(parsed)) {
				finance.transactions = parsed;
			} else {
				console.error('Finora could not load saved transactions: unexpected data format.');
				return 'Saved transactions could not be read. Showing the demo data instead.';
			}
		}
		const storedBudgets = localStorage.getItem('finora-budgets');
		if (storedBudgets === null) {
			localStorage.setItem('finora-budgets', JSON.stringify(finance.budgets));
		} else {
			const parsed: unknown = JSON.parse(storedBudgets);
			if (isBudgetList(parsed)) {
				finance.budgets = parsed;
			} else {
				console.error('Finora could not load saved budgets: unexpected data format.');
				return 'Saved budgets could not be read. Showing the demo budgets instead.';
			}
		}
		const storedGoals = localStorage.getItem('finora-goals');
		if (storedGoals === null) {
			localStorage.setItem('finora-goals', JSON.stringify(finance.goals));
		} else {
			const parsed: unknown = JSON.parse(storedGoals);
			if (isSavingsGoalList(parsed)) {
				finance.goals = parsed;
			} else {
				console.error('Finora could not load saved goals: unexpected data format.');
				return 'Saved goals could not be read. Showing the demo goals instead.';
			}
		}
		const storedTheme = localStorage.getItem('finora-theme');
		if (storedTheme === 'dark' || storedTheme === 'light') finance.theme = storedTheme;
		return null;
	} catch (error) {
		console.error('Finora could not access saved browser data.', error);
		return 'Browser storage is unavailable. Changes may not persist after you leave.';
	}
}

export function persistTransactions(next: Transaction[]): string | null {
	finance.transactions = next;
	try {
		localStorage.setItem('finora-transactions', JSON.stringify(next));
		return null;
	} catch (error) {
		console.error('Finora could not save transactions.', error);
		return 'Could not save your changes to browser storage.';
	}
}

export function persistBudgets(next: Budget[]): string | null {
	finance.budgets = next;
	try {
		localStorage.setItem('finora-budgets', JSON.stringify(next));
		return null;
	} catch (error) {
		console.error('Finora could not save budgets.', error);
		return 'Could not save your budgets to browser storage.';
	}
}

export function persistGoals(next: SavingsGoal[]): string | null {
	finance.goals = next;
	try {
		localStorage.setItem('finora-goals', JSON.stringify(next));
		return null;
	} catch (error) {
		console.error('Finora could not save goals.', error);
		return 'Could not save your goals to browser storage.';
	}
}

export function toggleFinanceTheme(): string | null {
	finance.theme = finance.theme === 'light' ? 'dark' : 'light';
	try {
		localStorage.setItem('finora-theme', finance.theme);
		return null;
	} catch (error) {
		console.error('Finora could not save the selected theme.', error);
		return 'Could not save your theme preference.';
	}
}

function createId(prefix: string): string {
	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function saveTransaction(draft: Omit<Transaction, 'id'> & { id?: string }): void {
	const transaction: Transaction = {
		...draft,
		id: draft.id ?? createId('transaction')
	};
	const exists = finance.transactions.some((item) => item.id === transaction.id);
	const next = exists
		? finance.transactions.map((item) => (item.id === transaction.id ? transaction : item))
		: [transaction, ...finance.transactions];
	setNotice(persistTransactions(next) ?? (exists ? 'Transaction updated.' : 'Transaction added.'));
}

export function deleteTransaction(transaction: Transaction): void {
	if (!window.confirm(`Delete "${transaction.title}"? This can't be undone.`)) return;
	setNotice(
		persistTransactions(finance.transactions.filter((item) => item.id !== transaction.id)) ??
			'Transaction deleted.'
	);
}

export function saveBudget(draft: Omit<Budget, 'id'> & { id?: string }): void {
	const budget: Budget = {
		...draft,
		id: draft.id ?? createId('budget')
	};
	const exists = finance.budgets.some((item) => item.id === budget.id);
	const next = exists
		? finance.budgets.map((item) => (item.id === budget.id ? budget : item))
		: [...finance.budgets, budget];
	setNotice(persistBudgets(next) ?? (exists ? 'Budget updated.' : 'Budget added.'));
}

export function deleteBudget(budget: Budget): void {
	if (
		!window.confirm(
			`Delete the ${budget.category} budget for ${formatMonth(budget.month)}? This can't be undone.`
		)
	)
		return;
	setNotice(
		persistBudgets(finance.budgets.filter((item) => item.id !== budget.id)) ?? 'Budget deleted.'
	);
}

export function saveGoal(draft: Omit<SavingsGoal, 'id'> & { id?: string }): void {
	const goal: SavingsGoal = {
		...draft,
		id: draft.id ?? createId('goal')
	};
	const exists = finance.goals.some((item) => item.id === goal.id);
	const next = exists
		? finance.goals.map((item) => (item.id === goal.id ? goal : item))
		: [...finance.goals, goal];
	setNotice(persistGoals(next) ?? (exists ? 'Goal updated.' : 'Goal added.'));
}

export function contributeGoal(goal: SavingsGoal, amount: number): void {
	if (!Number.isFinite(amount) || amount <= 0) {
		setNotice('Enter an amount greater than zero.');
		return;
	}
	const next = finance.goals.map((item) =>
		item.id === goal.id ? { ...item, saved: item.saved + amount } : item
	);
	setNotice(
		persistGoals(next) ?? `Added ${formatMoney(amount)} to ${goal.title}. You're getting closer.`
	);
}

export function deleteGoal(goal: SavingsGoal): void {
	if (!window.confirm(`Delete the "${goal.title}" goal? This can't be undone.`)) return;
	setNotice(persistGoals(finance.goals.filter((item) => item.id !== goal.id)) ?? 'Goal deleted.');
}
