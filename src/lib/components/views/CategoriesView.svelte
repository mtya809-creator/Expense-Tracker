<script lang="ts">
	import { finance } from '../../stores/finance.svelte.js';
	import { openAddTransaction, showCategory } from '../../stores/ui.svelte.js';
	import { formatMoney, summarizeCategories } from '../../utils/finance';
	import Icon from '../Icon.svelte';

	const categorySummary = $derived(summarizeCategories(finance.transactions));
</script>

<section class="category-grid" aria-label="Expense categories">
	{#each categorySummary as category (category.name)}
		<button class="category-card" onclick={() => showCategory(category.name)}>
			<div class="category-card-top">
				<span class="category-symbol"><Icon name="categories" size={19} /></span>
				<span class="category-count">
					{category.count}
					{category.count === 1 ? 'transaction' : 'transactions'}
				</span>
			</div>
			<span class="category-card-name">{category.name}</span>
			<strong>{formatMoney(category.total)}</strong>
			<span class="category-card-link">View transactions <span>→</span></span>
		</button>
	{:else}
		<div class="panel category-empty">
			<div class="empty-state">
				<div class="empty-icon"><Icon name="categories" size={24} /></div>
				<h3>Your categories are ready</h3>
				<p>Add an expense to start seeing where your money goes.</p>
				<button class="button button-primary empty-add" onclick={openAddTransaction}>
					<Icon name="plus" size={17} /> Add expense
				</button>
			</div>
		</div>
	{/each}
</section>
<div class="category-footnote">
	<Icon name="spark" size={16} /> Category totals include all recorded expenses.
</div>
