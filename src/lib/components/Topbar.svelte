<script lang="ts">
	import { auth } from '../stores/auth.svelte.js';
	import { finance, toggleFinanceTheme } from '../stores/finance.svelte.js';
	import { navigate, setNotice, ui, type View } from '../stores/ui.svelte.js';
	import { isTypingTarget, onShortcut } from '../utils/keyboard';
	import Icon from './Icon.svelte';

	let searchInput = $state<HTMLInputElement | null>(null);

	const theme = $derived(finance.theme);
	const initials = $derived(auth.account.initials);

	const breadcrumbLabels: Record<View, string> = {
		overview: 'My finances',
		transactions: 'Transactions',
		categories: 'Categories',
		budgets: 'Budgets',
		goals: 'Goals',
		reports: 'Reports',
		profile: 'Account details'
	};

	function toggleTheme() {
		setNotice(toggleFinanceTheme() ?? '');
	}

	$effect(() => {
		const off = onShortcut('/', (event) => {
			if (
				ui.showTransactionForm ||
				ui.showBudgetForm ||
				ui.showGoalForm ||
				isTypingTarget(event.target)
			)
				return;
			event.preventDefault();
			searchInput?.focus();
			searchInput?.select();
		});
		return off;
	});
</script>

<header class="topbar">
	<div class="breadcrumb">
		<span>Personal</span><span class="breadcrumb-slash">/</span><strong>
			{breadcrumbLabels[ui.activeView]}
		</strong>
	</div>
	<div class="topbar-actions">
		<label class="global-search">
			<Icon name="search" size={17} />
			<input
				bind:this={searchInput}
				bind:value={ui.search}
				placeholder="Search anything..."
				aria-label="Search transactions"
			/>
			<kbd>/</kbd>
		</label>
		<button
			class="theme-toggle"
			aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
			title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
			onclick={toggleTheme}
		>
			<Icon name={theme === 'light' ? 'moon' : 'sun'} size={18} />
		</button>
		<button
			class="top-avatar"
			aria-label="Open account details"
			title="Account details"
			onclick={() => navigate('profile')}
		>
			{initials}
		</button>
	</div>
</header>
