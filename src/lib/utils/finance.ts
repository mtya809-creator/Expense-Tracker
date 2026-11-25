import type { Budget, SavingsGoal, Transaction } from '../types/finance';

export const STARTING_BALANCE = 2500000;

export const CATEGORIES = [
	'Food & Drink',
	'Transport',
	'Shopping',
	'Bills & Utilities',
	'Entertainment',
	'Health',
	'Salary',
	'Freelance',
	'Other'
] as const;

function monthDate(offset: number, day: number): string {
	const date = new Date();
	date.setDate(1);
	date.setMonth(date.getMonth() + offset);
	date.setDate(Math.min(day, 28));
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const dateOfMonth = String(date.getDate()).padStart(2, '0');
	return `${year}-${month}-${dateOfMonth}`;
}

export function getDemoTransactions(): Transaction[] {
	return [
		{
			id: 'demo-salary',
			title: 'Monthly salary',
			amount: 1850000,
			type: 'income',
			category: 'Salary',
			date: monthDate(0, 1),
			note: 'Monthly pay'
		},
		{
			id: 'demo-groceries',
			title: 'City Mart groceries',
			amount: 68400,
			type: 'expense',
			category: 'Food & Drink',
			date: monthDate(0, 3),
			note: 'Weekly groceries'
		},
		{
			id: 'demo-transport',
			title: 'Grab to the office',
			amount: 12500,
			type: 'expense',
			category: 'Transport',
			date: monthDate(0, 5),
			note: ''
		},
		{
			id: 'demo-freelance',
			title: 'Brand design project',
			amount: 420000,
			type: 'income',
			category: 'Freelance',
			date: monthDate(0, 7),
			note: 'Project milestone'
		},
		{
			id: 'demo-coffee',
			title: 'Coffee with May',
			amount: 18000,
			type: 'expense',
			category: 'Food & Drink',
			date: monthDate(0, 9),
			note: ''
		},
		{
			id: 'demo-internet',
			title: 'Home internet',
			amount: 38900,
			type: 'expense',
			category: 'Bills & Utilities',
			date: monthDate(0, 11),
			note: 'Monthly subscription'
		},
		{
			id: 'demo-dinner',
			title: 'Dinner at Shan Yoe Yar',
			amount: 47500,
			type: 'expense',
			category: 'Food & Drink',
			date: monthDate(0, 13),
			note: 'Dinner with friends'
		},
		{
			id: 'demo-book',
			title: 'Design books',
			amount: 32000,
			type: 'expense',
			category: 'Shopping',
			date: monthDate(0, 15),
			note: ''
		},
		{
			id: 'demo-movie',
			title: 'Weekend cinema',
			amount: 22000,
			type: 'expense',
			category: 'Entertainment',
			date: monthDate(-1, 21),
			note: ''
		},
		{
			id: 'demo-electricity',
			title: 'Electricity bill',
			amount: 57200,
			type: 'expense',
			category: 'Bills & Utilities',
			date: monthDate(-1, 18),
			note: ''
		},
		{
			id: 'demo-clinic',
			title: 'Clinic visit',
			amount: 45000,
			type: 'expense',
			category: 'Health',
			date: monthDate(-2, 12),
			note: ''
		},
		{
			id: 'demo-shoes',
			title: 'Running shoes',
			amount: 128000,
			type: 'expense',
			category: 'Shopping',
			date: monthDate(-3, 8),
			note: ''
		},
		{
			id: 'demo-side-project',
			title: 'Website consultation',
			amount: 260000,
			type: 'income',
			category: 'Freelance',
			date: monthDate(-4, 17),
			note: ''
		},
		{
			id: 'demo-trip',
			title: 'Bagan weekend trip',
			amount: 315000,
			type: 'expense',
			category: 'Entertainment',
			date: monthDate(-5, 10),
			note: 'Travel and accommodation'
		}
	];
}

export function isTransactionList(value: unknown): value is Transaction[] {
	return (
		Array.isArray(value) &&
		value.every(
			(item) =>
				typeof item === 'object' &&
				item !== null &&
				typeof item.id === 'string' &&
				typeof item.title === 'string' &&
				typeof item.amount === 'number' &&
				Number.isFinite(item.amount) &&
				item.amount > 0 &&
				(item.type === 'income' || item.type === 'expense') &&
				typeof item.category === 'string' &&
				typeof item.date === 'string' &&
				typeof item.note === 'string'
		)
	);
}

export function formatMoney(amount: number): string {
	return `Ks ${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amount)}`;
}

export function formatDate(date: string): string {
	if (!date) return 'No deadline';
	const parsed = new Date(`${date}T00:00:00`);
	if (Number.isNaN(parsed.getTime())) return 'No deadline';
	return new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric', year: 'numeric' }).format(
		parsed
	);
}

export function monthKey(date: string): string {
	return date.slice(0, 7);
}

export function currentMonthKey(): string {
	const now = new Date();
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function shiftMonth(key: string, delta: number): string {
	const [year, month] = key.split('-').map(Number);
	const date = new Date(year, month - 1 + delta, 1);
	return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function formatMonth(key: string): string {
	const parsed = new Date(`${key}-01T00:00:00`);
	if (Number.isNaN(parsed.getTime())) return key;
	return new Intl.DateTimeFormat('en', { month: 'long', year: 'numeric' }).format(parsed);
}

export function greeting(date: Date = new Date()): string {
	const hour = date.getHours();
	if (hour < 12) return 'Good morning';
	if (hour < 18) return 'Good afternoon';
	return 'Good evening';
}

export function spentInCategory(
	transactions: Transaction[],
	category: string,
	month: string
): number {
	return transactions.reduce(
		(sum, transaction) =>
			sum +
			(transaction.type === 'expense' &&
			transaction.category === category &&
			monthKey(transaction.date) === month
				? transaction.amount
				: 0),
		0
	);
}

export interface CategorySummary {
	name: string;
	total: number;
	count: number;
}

export function summarizeCategories(transactions: Transaction[]): CategorySummary[] {
	const expenses = transactions.filter((transaction) => transaction.type === 'expense');
	return CATEGORIES.map((category) => {
		const matching = expenses.filter((transaction) => transaction.category === category);
		return {
			name: category,
			total: matching.reduce((sum, transaction) => sum + transaction.amount, 0),
			count: matching.length
		};
	})
		.filter((category) => category.count > 0)
		.sort((a, b) => b.total - a.total);
}

export function goalPercent(goal: SavingsGoal): number {
	if (goal.target <= 0) return 0;
	return (goal.saved / goal.target) * 100;
}

export function getDemoBudgets(): Budget[] {
	const month = currentMonthKey();
	return [
		{ id: 'demo-budget-food', category: 'Food & Drink', limit: 400000, month },
		{ id: 'demo-budget-transport', category: 'Transport', limit: 120000, month },
		{ id: 'demo-budget-bills', category: 'Bills & Utilities', limit: 220000, month },
		{ id: 'demo-budget-fun', category: 'Entertainment', limit: 90000, month }
	];
}

export function getDemoGoals(): SavingsGoal[] {
	return [
		{
			id: 'demo-goal-emergency',
			title: 'Emergency fund',
			target: 1500000,
			saved: 640000,
			deadline: monthDate(4, 28)
		},
		{
			id: 'demo-goal-laptop',
			title: 'New laptop',
			target: 2200000,
			saved: 1150000,
			deadline: monthDate(2, 15)
		},
		{
			id: 'demo-goal-getaway',
			title: 'Weekend getaway',
			target: 450000,
			saved: 180000,
			deadline: monthDate(1, 20)
		}
	];
}

export function isBudgetList(value: unknown): value is Budget[] {
	return (
		Array.isArray(value) &&
		value.every(
			(item) =>
				typeof item === 'object' &&
				item !== null &&
				typeof item.id === 'string' &&
				typeof item.category === 'string' &&
				typeof item.limit === 'number' &&
				Number.isFinite(item.limit) &&
				item.limit > 0 &&
				typeof item.month === 'string' &&
				/^\d{4}-\d{2}$/.test(item.month)
		)
	);
}

export function isSavingsGoalList(value: unknown): value is SavingsGoal[] {
	return (
		Array.isArray(value) &&
		value.every(
			(item) =>
				typeof item === 'object' &&
				item !== null &&
				typeof item.id === 'string' &&
				typeof item.title === 'string' &&
				typeof item.target === 'number' &&
				Number.isFinite(item.target) &&
				item.target > 0 &&
				typeof item.saved === 'number' &&
				Number.isFinite(item.saved) &&
				item.saved >= 0 &&
				typeof item.deadline === 'string'
		)
	);
}

function escapeCsvValue(value: string | number): string {
	const text = String(value);
	return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function transactionsToCsv(transactions: Transaction[]): string {
	const header = ['Date', 'Description', 'Type', 'Category', 'Amount', 'Note'];
	const rows = [...transactions]
		.sort((a, b) => b.date.localeCompare(a.date))
		.map((transaction) =>
			[
				transaction.date,
				transaction.title,
				transaction.type,
				transaction.category,
				transaction.amount,
				transaction.note
			]
				.map(escapeCsvValue)
				.join(',')
		);
	return [header.join(','), ...rows].join('\n');
}

export function downloadCsv(filename: string, csv: string): void {
	const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = filename;
	link.click();
	URL.revokeObjectURL(url);
}
