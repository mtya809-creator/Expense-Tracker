<script lang="ts">
	import { finance } from '../../stores/finance.svelte.js';
	import { navigate, setNotice, showCategory } from '../../stores/ui.svelte.js';
	import {
		downloadCsv,
		formatMoney,
		summarizeCategories,
		transactionsToCsv
	} from '../../utils/finance';
	import ExpenseChart from '../ExpenseChart.svelte';
	import Icon from '../Icon.svelte';

	const transactions = $derived(finance.transactions);

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
	const categorySummary = $derived(summarizeCategories(transactions));

	function exportCsv() {
		downloadCsv('finora-transactions.csv', transactionsToCsv(transactions));
		setNotice('Your transactions were exported as a CSV file. Nice and tidy.');
	}
</script>

<div class="report-actions">
	<button class="button button-quiet" onclick={exportCsv}>
		<Icon name="download" size={16} /> Export CSV
	</button>
</div>

<section class="report-layout">
	<ExpenseChart {transactions} />
	<aside class="report-summary panel">
		<span class="eyebrow">AT A GLANCE</span>
		<h2>Your finances so far</h2>
		<div class="report-metric">
			<span>Total income</span><strong class="income">{formatMoney(allIncome)}</strong>
		</div>
		<div class="report-metric">
			<span>Total expenses</span><strong class="expense">{formatMoney(allExpenses)}</strong>
		</div>
		<div class="report-metric report-balance">
			<span>Net cash flow</span><strong>{formatMoney(allIncome - allExpenses)}</strong>
		</div>
		<p class="report-note">
			Your net cash flow is the difference between all recorded income and expenses.
		</p>
	</aside>
</section>

<section class="panel category-report">
	<div class="panel-heading">
		<div>
			<h2>Where it goes</h2>
			<p>Your highest-spend categories</p>
		</div>
		<button class="text-link" onclick={() => navigate('categories')}>
			All categories <span>→</span>
		</button>
	</div>
	{#if categorySummary.length}
		<div class="report-categories">
			{#each categorySummary.slice(0, 4) as category (category.name)}
				<button class="report-category-row" onclick={() => showCategory(category.name)}>
					<span>{category.name}</span>
					<span class="report-category-track">
						<i
							style={`width: ${Math.max(3, (category.total / (categorySummary[0]?.total ?? 1)) * 100)}%`}
						></i>
					</span>
					<strong>{formatMoney(category.total)}</strong>
				</button>
			{/each}
		</div>
	{:else}
		<p class="report-empty">Add an expense to see your category breakdown.</p>
	{/if}
</section>
