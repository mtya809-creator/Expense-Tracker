<script lang="ts">
	import type { Transaction } from '../types/finance';
	import { formatMoney } from '../utils/finance';

	let { transactions }: { transactions: Transaction[] } = $props();

	const months = $derived.by(() => {
		const now = new Date();
		return Array.from({ length: 6 }, (_, index) => {
			const date = new Date(now.getFullYear(), now.getMonth() - 5 + index, 1);
			const total = transactions
				.filter((transaction) => {
					const transactionDate = new Date(`${transaction.date}T00:00:00`);
					return (
						transaction.type === 'expense' &&
						transactionDate.getMonth() === date.getMonth() &&
						transactionDate.getFullYear() === date.getFullYear()
					);
				})
				.reduce((sum, transaction) => sum + transaction.amount, 0);
			return {
				label: new Intl.DateTimeFormat('en', { month: 'short' }).format(date),
				total,
				isCurrent: index === 5
			};
		});
	});

	const maxExpense = $derived(Math.max(1, ...months.map((month) => month.total)));
	const currentTotal = $derived(months[months.length - 1]?.total ?? 0);
</script>

<div class="chart-card">
	<div class="panel-heading">
		<div>
			<h2>Expense overview</h2>
			<p>Your spending over the last six months</p>
		</div>
		<div class="chart-total">
			<span>This month</span>
			<strong>{formatMoney(currentTotal)}</strong>
		</div>
	</div>

	<div
		class="expense-chart"
		role="img"
		aria-label={`Monthly expenses over six months. This month: ${formatMoney(currentTotal)}.`}
	>
		<div class="chart-y-labels" aria-hidden="true">
			<span>{formatMoney(maxExpense)}</span>
			<span>{formatMoney(maxExpense / 2)}</span>
			<span>Ks 0</span>
		</div>
		<div class="chart-area">
			<div class="chart-grid" aria-hidden="true"><i></i><i></i><i></i></div>
			<div class="chart-bars">
				{#each months as month (month.label)}
					<div class="chart-column">
						<div class="bar-wrap">
							{#if month.total > 0}
								<div
									class="chart-bar"
									class:current={month.isCurrent}
									style={`height: ${Math.max(4, (month.total / maxExpense) * 100)}%`}
									title={`${month.label}: ${formatMoney(month.total)}`}
								></div>
							{:else}
								<div class="chart-bar empty" title={`${month.label}: no expenses`}></div>
							{/if}
						</div>
						<span class="chart-month" class:current-label={month.isCurrent}>{month.label}</span>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
