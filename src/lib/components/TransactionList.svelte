<script lang="ts">
	import type { Transaction } from '../types/finance';
	import { formatDate, formatMoney } from '../utils/finance';
	import Icon from './Icon.svelte';

	let {
		transactions,
		onEdit,
		onDelete,
		onAdd
	}: {
		transactions: Transaction[];
		onEdit: (transaction: Transaction) => void;
		onDelete: (transaction: Transaction) => void;
		onAdd?: () => void;
	} = $props();

	const categoryStyles: Record<string, string> = {
		'Food & Drink': 'food',
		Transport: 'transport',
		Shopping: 'shopping',
		'Bills & Utilities': 'bills',
		Entertainment: 'entertainment',
		Health: 'health',
		Salary: 'income',
		Freelance: 'freelance',
		Other: 'other'
	};
</script>

<div class="transaction-list">
	{#if transactions.length === 0}
		<div class="empty-state">
			<div class="empty-icon"><Icon name="receipt" size={24} /></div>
			<h3>No transactions found</h3>
			<p>Try changing your filters, or add your first transaction.</p>
			{#if onAdd}
				<button class="button button-primary empty-add" onclick={onAdd}>
					<Icon name="plus" size={17} /> Add transaction
				</button>
			{/if}
		</div>
	{:else}
		<div class="transaction-head" aria-hidden="true">
			<span>Transaction</span><span>Category</span><span>Date</span><span>Amount</span><span></span>
		</div>
		{#each transactions as transaction (transaction.id)}
			<div class="transaction-row">
				<div class="transaction-main">
					<div
						class="category-icon"
						class:income={transaction.type === 'income'}
						class:expense={transaction.type === 'expense'}
					>
						<Icon name={transaction.type === 'income' ? 'arrow-down' : 'arrow-up'} size={17} />
					</div>
					<div class="transaction-title">
						<strong>{transaction.title}</strong>
						<span>{transaction.note || transaction.category}</span>
					</div>
				</div>
				<div class="transaction-category">
					<span class={`category-pill ${categoryStyles[transaction.category] ?? 'other'}`}>
						{transaction.category}
					</span>
				</div>
				<div class="transaction-date">{formatDate(transaction.date)}</div>
				<div
					class="transaction-amount"
					class:income={transaction.type === 'income'}
					class:expense={transaction.type === 'expense'}
				>
					{transaction.type === 'income' ? '+' : '−'}{formatMoney(transaction.amount)}
				</div>
				<div class="transaction-actions">
					<button
						class="icon-button"
						aria-label={`Edit ${transaction.title}`}
						onclick={() => onEdit(transaction)}
					>
						<Icon name="edit" size={16} />
					</button>
					<button
						class="icon-button delete-action"
						aria-label={`Delete ${transaction.title}`}
						onclick={() => onDelete(transaction)}
					>
						<Icon name="trash" size={16} />
					</button>
				</div>
			</div>
		{/each}
	{/if}
</div>
