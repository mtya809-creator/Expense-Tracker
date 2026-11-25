import type { Account } from '../types/finance';

export const auth = $state<{
	signedIn: boolean;
	account: Account;
}>({
	signedIn: false,
	account: {
		name: 'Mo Thura Aung',
		email: 'mo@finora.app',
		initials: 'M',
		memberSince: 'November 2026',
		currency: 'MMK',
		plan: 'Personal'
	}
});

export function signIn(): void {
	auth.signedIn = true;
}

export function signOut(): void {
	auth.signedIn = false;
}
