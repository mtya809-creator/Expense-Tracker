export type TransactionType = 'income' | 'expense';

export interface Transaction {
	id: string;
	title: string;
	amount: number;
	type: TransactionType;
	category: string;
	date: string;
	note: string;
}

export interface Budget {
	id: string;
	category: string;
	limit: number;
	month: string;
}

export interface SavingsGoal {
	id: string;
	title: string;
	target: number;
	saved: number;
	deadline: string;
}

export interface Account {
	name: string;
	email: string;
	initials: string;
	memberSince: string;
	currency: string;
	plan: string;
}
