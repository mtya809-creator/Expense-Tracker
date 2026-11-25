<script lang="ts">
	import { SvelteMap } from 'svelte/reactivity';
	import { deleteBudget, finance } from '../../stores/finance.svelte.js';
	import { openAddBudget, openEditBudget } from '../../stores/ui.svelte.js';
	import {
		currentMonthKey,
		formatMoney,
		formatMonth,
		monthKey,
		shiftMonth
	} from '../../utils/finance';
	import BudgetUsageCard from '../BudgetUsageCard.svelte';
	import Icon from '../Icon.svelte';
	import StatCard from '../StatCard.svelte';

	let month = $state(currentMonthKey());

	const monthBudgets = $derived(
		finance.budgets
			.filter((budget) => budget.month === month)
			.sort((a, b) => a.category.localeCompare(b.category))
	);
	const spentByCategory = $derived.by(() => {
		const map = new SvelteMap<string, number>();
		for (const transaction of finance.transactions) {
			if (transaction.type !== 'expense') continue;
			if (monthKey(transaction.date) !== month) continue;
			map.set(transaction.category, (map.get(transaction.category) ?? 0) + transaction.amount);
		}
		return map;
	});
	const totalBudget = $derived(monthBudgets.reduce((sum, budget) => sum + budget.limit, 0));
	const totalSpent = $derived(
		monthBudgets.reduce((sum, budget) => sum + (spentByCategory.get(budget.category) ?? 0), 0)
	);
	const remaining = $derived(totalBudget - totalSpent);
	const usedPercent = $derived(totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0);
	const usedLabel = $derived(Math.round(usedPercent));
	const over = $derived(totalSpent > totalBudget);
	const tone = $derived(over ? 'over' : usedPercent >= 80 ? 'warning' : 'on-track');
</script>

<div class="budgets-toolbar">
	<div class="month-switcher">
		<button
			class="icon-button"
			aria-label="Previous month"
			onclick={() => (month = shiftMonth(month, -1))}
		>
			<Icon name="chevron-left" size={16} />
		</button>
		<strong>{formatMonth(month)}</strong>
		<button
			class="icon-button"
			aria-label="Next month"
			onclick={() => (month = shiftMonth(month, 1))}
		>
			<Icon name="chevron-right" size={16} />
		</button>
	</div>
	<div class="budgets-toolbar-side">
		<span class="usage-badge" class:warning={tone === 'warning'} class:over={tone === 'over'}>
			{over ? `${formatMoney(Math.abs(remaining))} over` : `${usedLabel}% used`}
		</span>
		<span class="month-hint">Usage is measured against your spending in the selected month.</span>
	</div>
</div>

<section class="stats-grid" aria-label="Budget summary">
	<StatCard
		label="Budgeted"
		value={formatMoney(totalBudget)}
		change="This month"
		caption="Your planned limits"
		icon="wallet"
		tone="violet"
	/>
	<StatCard
		label="Spent"
		value={formatMoney(totalSpent)}
		change="This month"
		caption="Across your budgeted categories"
		icon="arrow-up"
		tone="orange"
	/>
	<StatCard
		label={over ? 'Over' : 'Left'}
		value={formatMoney(Math.abs(remaining))}
		change="This month"
		caption={over ? 'Beyond your planned limits' : 'Still within your limits'}
		icon="arrow-down"
		tone={over ? 'orange' : 'green'}
	/>
</section>

<section class="budget-grid" aria-label="Monthly budget usage">
	{#each monthBudgets as budget (budget.id)}
		<BudgetUsageCard
			{budget}
			spent={spentByCategory.get(budget.category) ?? 0}
			onEdit={openEditBudget}
			onDelete={deleteBudget}
		/>
	{:else}
		<div class="panel category-empty">
			<div class="empty-state">
				<div class="empty-icon"><Icon name="target" size={24} /></div>
				<h3>No budgets for {formatMonth(month)}</h3>
				<p>Set a gentle limit for a category and Finora will quietly keep an eye on it.</p>
				<button class="button button-primary empty-add" onclick={openAddBudget}>
					<Icon name="plus" size={17} /> Add budget
				</button>
			</div>
		</div>
	{/each}
</section>

<div class="category-footnote">
	<Icon name="spark" size={16} /> One budget per category per month keeps things simple.
</div>
