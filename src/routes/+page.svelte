<script lang="ts">
	import { onMount } from 'svelte';
	import BudgetForm from '#lib/components/BudgetForm.svelte';
	import GoalForm from '#lib/components/GoalForm.svelte';
	import Icon from '#lib/components/Icon.svelte';
	import LoginScreen from '#lib/components/LoginScreen.svelte';
	import Notice from '#lib/components/Notice.svelte';
	import Sidebar from '#lib/components/Sidebar.svelte';
	import Topbar from '#lib/components/Topbar.svelte';
	import TransactionForm from '#lib/components/TransactionForm.svelte';
	import BudgetsView from '#lib/components/views/BudgetsView.svelte';
	import CategoriesView from '#lib/components/views/CategoriesView.svelte';
	import GoalsView from '#lib/components/views/GoalsView.svelte';
	import OverviewView from '#lib/components/views/OverviewView.svelte';
	import ProfileView from '#lib/components/views/ProfileView.svelte';
	import ReportsView from '#lib/components/views/ReportsView.svelte';
	import TransactionsView from '#lib/components/views/TransactionsView.svelte';
	import { auth, signIn, signOut } from '../lib/stores/auth.svelte.js';
	import {
		contributeGoal,
		finance,
		initializeFinance,
		saveBudget,
		saveGoal,
		saveTransaction
	} from '../lib/stores/finance.svelte.js';
	import {
		closeBudgetForm,
		closeGoalForm,
		closeTransactionForm,
		dismissNotice,
		navigate,
		openAddBudget,
		openAddGoal,
		openAddTransaction,
		setNotice,
		ui,
		type View
	} from '../lib/stores/ui.svelte.js';
	import { greeting } from '../lib/utils/finance';
	import type { Budget, SavingsGoal, Transaction } from '../lib/types/finance';

	const theme = $derived(finance.theme);
	const activeView = $derived(ui.activeView);
	const firstName = $derived(auth.account.name.split(' ')[0]);

	const viewCopy: Record<View, { title: string; subtitle: string }> = {
		overview: { title: 'Your money, in focus.', subtitle: 'A little clarity goes a long way.' },
		transactions: {
			title: 'Your transactions',
			subtitle: 'Every little detail, all in one place.'
		},
		categories: {
			title: 'Spending by category',
			subtitle: 'See what your spending is really made of.'
		},
		budgets: {
			title: 'Monthly budget usage',
			subtitle: 'See exactly how much of this month’s plan you’ve used.'
		},
		goals: {
			title: 'Savings goals',
			subtitle: 'Little by little, you are getting there.'
		},
		reports: { title: 'Your money story', subtitle: 'A clearer picture of your spending habits.' },
		profile: {
			title: 'Personal details',
			subtitle: 'Everything about your Finora account, in one place.'
		}
	};

	onMount(() => {
		const message = initializeFinance();
		if (message) setNotice(message);
	});

	function handleSaveTransaction(draft: Omit<Transaction, 'id'> & { id?: string }) {
		saveTransaction(draft);
		closeTransactionForm();
	}

	function handleSaveBudget(draft: Omit<Budget, 'id'> & { id?: string }) {
		saveBudget(draft);
		closeBudgetForm();
	}

	function handleSaveGoal(draft: Omit<SavingsGoal, 'id'> & { id?: string }) {
		saveGoal(draft);
		closeGoalForm();
	}

	function handleContribute(amount: number) {
		if (ui.editingGoal) contributeGoal(ui.editingGoal, amount);
		closeGoalForm();
	}
</script>

<svelte:head>
	<title>Finora — Your money, in focus</title>
	<meta
		name="description"
		content="A calmer way to understand your money. Track your spending, income, and everyday finances with Finora."
	/>
</svelte:head>

{#if auth.signedIn}
	<div class="app-shell" class:dark={theme === 'dark'}>
		<Sidebar {activeView} onNavigate={navigate} />

		<main class="main-content" id="overview">
			<Topbar />

			<div class="page-content">
				<section class="page-heading">
					<div>
						<div class="eyebrow">
							{new Intl.DateTimeFormat('en', {
								weekday: 'long',
								month: 'long',
								day: 'numeric'
							}).format(new Date())}
						</div>
						<h1>
							{activeView === 'overview'
								? `${greeting()}, ${firstName}.`
								: viewCopy[activeView].title}
						</h1>
						<p>
							{activeView === 'overview'
								? "Here's how your money is looking today."
								: viewCopy[activeView].subtitle}
						</p>
					</div>
					{#if activeView === 'budgets'}
						<button
							class="button button-primary add-main"
							aria-label="Add budget"
							onclick={openAddBudget}
						>
							<Icon name="plus" size={18} />
							<span>Add budget</span>
						</button>
					{:else if activeView === 'goals'}
						<button
							class="button button-primary add-main"
							aria-label="Add goal"
							onclick={openAddGoal}
						>
							<Icon name="plus" size={18} />
							<span>Add goal</span>
						</button>
					{:else if activeView === 'profile'}
						<button class="button button-danger add-main" aria-label="Log out" onclick={signOut}>
							<Icon name="logout" size={18} />
							<span>Log out</span>
						</button>
					{:else}
						<button
							class="button button-primary add-main"
							aria-label="Add transaction"
							onclick={openAddTransaction}
						>
							<Icon name="plus" size={18} />
							<span>Add transaction</span>
						</button>
					{/if}
				</section>

				{#if ui.notice}
					<Notice message={ui.notice} onDismiss={dismissNotice} />
				{/if}

				{#if activeView === 'overview'}
					<OverviewView />
				{:else if activeView === 'transactions'}
					<TransactionsView />
				{:else if activeView === 'categories'}
					<CategoriesView />
				{:else if activeView === 'budgets'}
					<BudgetsView />
				{:else if activeView === 'goals'}
					<GoalsView />
				{:else if activeView === 'profile'}
					<ProfileView />
				{:else}
					<ReportsView />
				{/if}

				<footer class="page-footer">
					<span>Made for a little more peace of mind.</span><span>
						Finora <span class="brand-period">·</span> MMK
					</span>
				</footer>
			</div>
		</main>

		{#if ui.showTransactionForm}
			{#key ui.editingTransaction?.id ?? 'new'}
				<TransactionForm
					transaction={ui.editingTransaction}
					onClose={closeTransactionForm}
					onSave={handleSaveTransaction}
				/>
			{/key}
		{/if}

		{#if ui.showBudgetForm}
			{#key ui.editingBudget?.id ?? 'new'}
				<BudgetForm
					budget={ui.editingBudget}
					budgets={finance.budgets}
					onClose={closeBudgetForm}
					onSave={handleSaveBudget}
				/>
			{/key}
		{/if}

		{#if ui.showGoalForm}
			{#key `${ui.editingGoal?.id ?? 'new'}-${ui.goalMode}`}
				<GoalForm
					goal={ui.editingGoal}
					mode={ui.goalMode}
					onClose={closeGoalForm}
					onSave={handleSaveGoal}
					onContribute={handleContribute}
				/>
			{/key}
		{/if}
	</div>
{:else}
	<LoginScreen onSignIn={signIn} />
{/if}
