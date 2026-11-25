import type { Budget, SavingsGoal, Transaction, TransactionType } from '../types/finance';

export type View =
	'overview' | 'transactions' | 'categories' | 'budgets' | 'goals' | 'reports' | 'profile';

export type DateFilter = 'all' | 'month' | '30days' | 'year';
export type TypeFilter = 'all' | TransactionType;

export const ui = $state<{
	activeView: View;
	search: string;
	typeFilter: TypeFilter;
	dateFilter: DateFilter;
	categoryFilter: string;
	notice: string;
	showTransactionForm: boolean;
	editingTransaction: Transaction | null;
	showBudgetForm: boolean;
	editingBudget: Budget | null;
	showGoalForm: boolean;
	editingGoal: SavingsGoal | null;
	goalMode: 'manage' | 'contribute';
}>({
	activeView: 'overview',
	search: '',
	typeFilter: 'all',
	dateFilter: 'all',
	categoryFilter: '',
	notice: '',
	showTransactionForm: false,
	editingTransaction: null,
	showBudgetForm: false,
	editingBudget: null,
	showGoalForm: false,
	editingGoal: null,
	goalMode: 'manage'
});

export function navigate(view: View): void {
	ui.activeView = view;
	if (view !== 'transactions') ui.categoryFilter = '';
}

export function showCategory(category: string): void {
	ui.categoryFilter = category;
	ui.activeView = 'transactions';
}

export function setNotice(message: string): void {
	ui.notice = message;
}

export function dismissNotice(): void {
	ui.notice = '';
}

export function openAddTransaction(): void {
	ui.editingTransaction = null;
	ui.showTransactionForm = true;
}

export function openEditTransaction(transaction: Transaction): void {
	ui.editingTransaction = transaction;
	ui.showTransactionForm = true;
}

export function closeTransactionForm(): void {
	ui.showTransactionForm = false;
	ui.editingTransaction = null;
}

export function openAddBudget(): void {
	ui.editingBudget = null;
	ui.showBudgetForm = true;
}

export function openEditBudget(budget: Budget): void {
	ui.editingBudget = budget;
	ui.showBudgetForm = true;
}

export function closeBudgetForm(): void {
	ui.showBudgetForm = false;
	ui.editingBudget = null;
}

export function openAddGoal(): void {
	ui.editingGoal = null;
	ui.goalMode = 'manage';
	ui.showGoalForm = true;
}

export function openEditGoal(goal: SavingsGoal): void {
	ui.editingGoal = goal;
	ui.goalMode = 'manage';
	ui.showGoalForm = true;
}

export function openContributeGoal(goal: SavingsGoal): void {
	ui.editingGoal = goal;
	ui.goalMode = 'contribute';
	ui.showGoalForm = true;
}

export function closeGoalForm(): void {
	ui.showGoalForm = false;
	ui.editingGoal = null;
	ui.goalMode = 'manage';
}

export function resetTransactionFilters(): void {
	ui.typeFilter = 'all';
	ui.dateFilter = 'all';
	ui.categoryFilter = '';
	ui.search = '';
}
