<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';
	import { deleteTransaction, finance } from '../../stores/finance.svelte.js';
	import { navigate, openAddTransaction, openEditTransaction, ui } from '../../stores/ui.svelte.js';
	import { STARTING_BALANCE, formatMoney } from '../../utils/finance';
	import ExpenseChart from '../ExpenseChart.svelte';
	import Icon from '../Icon.svelte';
	import StatCard from '../StatCard.svelte';
	import TransactionList from '../TransactionList.svelte';

	const transactions = $derived(finance.transactions);

	const currentMonthTransactions = $derived.by(() => {
		const now = new SvelteDate();
		return transactions.filter((transaction) => {
			const date = new Date(`${transaction.date}T00:00:00`);
			return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
		});
	});

	const monthIncome = $derived(
		currentMonthTransactions
			.filter((transaction) => transaction.type === 'income')
			.reduce((sum, transaction) => sum + transaction.amount, 0)
	);
	const monthExpenses = $derived(
		currentMonthTransactions
			.filter((transaction) => transaction.type === 'expense')
			.reduce((sum, transaction) => sum + transaction.amount, 0)
	);
	const allIncome = $derived(
		transactions
			.filter((transaction) => transaction.type === 'income')
			.reduce((sum, transaction) => sum + transaction.amount, 0)
	);
	const allExpenses = $derived(
		transactions
			.filter((transaction) => transaction.type === 'expense')
			.reduce((sum, transaction) => sum + transaction.amount, 0)
	);
	const balance = $derived(STARTING_BALANCE + allIncome - allExpenses);
	const recentTransactions = $derived(
		[...transactions].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)
	);
	const visibleRecent = $derived(
		recentTransactions.filter((transaction) => {
			const query = ui.search.trim().toLowerCase();
			return (
				!query ||
				`${transaction.title} ${transaction.category} ${transaction.note}`
					.toLowerCase()
					.includes(query)
			);
		})
	);
</script>

<section class="stats-grid" aria-label="Account summary">
	<StatCard
		label="Total balance"
		value={formatMoney(balance)}
		change="Available"
		caption="Including your starting balance"
		icon="wallet"
		tone="violet"
	/>
	<StatCard
		label="Income"
		value={formatMoney(monthIncome)}
		change="This month"
		caption="Money coming your way"
		icon="arrow-down"
		tone="green"
	/>
	<StatCard
		label="Expenses"
		value={formatMoney(monthExpenses)}
		change="This month"
		caption="Everyday spending, accounted for"
		icon="arrow-up"
		tone="orange"
	/>
</section>

<section class="dashboard-grid">
	<ExpenseChart {transactions} />
	<aside class="insight-card">
		<div class="insight-mark"><Icon name="spark" size={20} /></div>
		<span class="eyebrow">A MOMENT OF CLARITY</span>
		<h2>You're building good habits.</h2>
		<p>
			Keeping track is the first step to making your money work for you. Keep showing up for your
			future self.
		</p>
		<button class="insight-link" onclick={() => navigate('reports')}>
			Explore your reports <span>→</span>
		</button>
		<div class="insight-decoration" aria-hidden="true"></div>
	</aside>
</section>

<section class="panel transactions-panel">
	<div class="panel-heading transaction-panel-heading">
		<div>
			<h2>Recent transactions</h2>
			<p>Your latest money moves</p>
		</div>
		<button class="text-link" onclick={() => navigate('transactions')}>
			View all <span>→</span>
		</button>
	</div>
	<TransactionList
		transactions={visibleRecent}
		onEdit={openEditTransaction}
		onDelete={deleteTransaction}
		onAdd={openAddTransaction}
	/>
</section>
