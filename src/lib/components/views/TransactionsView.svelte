<script lang="ts">
	import { SvelteDate } from 'svelte/reactivity';
	import { deleteTransaction, finance } from '../../stores/finance.svelte.js';
	import {
		openAddTransaction,
		openEditTransaction,
		resetTransactionFilters,
		ui
	} from '../../stores/ui.svelte.js';
	import { CATEGORIES } from '../../utils/finance';
	import type { DateFilter, TypeFilter } from '../../stores/ui.svelte.js';
	import Icon from '../Icon.svelte';
	import TransactionList from '../TransactionList.svelte';

	const transactions = $derived(finance.transactions);

	const filteredTransactions = $derived.by(() => {
		const now = new SvelteDate();
		const today = new SvelteDate(now.getFullYear(), now.getMonth(), now.getDate());
		const query = ui.search.trim().toLowerCase();
		return [...transactions]
			.filter((transaction) => {
				const date = new Date(`${transaction.date}T00:00:00`);
				if (ui.typeFilter !== 'all' && transaction.type !== ui.typeFilter) return false;
				if (ui.categoryFilter && transaction.category !== ui.categoryFilter) return false;
				if (query) {
					const searchable =
						`${transaction.title} ${transaction.category} ${transaction.note}`.toLowerCase();
					if (!searchable.includes(query)) return false;
				}
				if (
					ui.dateFilter === 'month' &&
					(date.getMonth() !== now.getMonth() || date.getFullYear() !== now.getFullYear())
				)
					return false;
				if (ui.dateFilter === 'year' && date.getFullYear() !== now.getFullYear()) return false;
				if (ui.dateFilter === '30days') {
					const firstDay = new SvelteDate(today.getTime());
					firstDay.setDate(firstDay.getDate() - 29);
					if (date < firstDay || date > today) return false;
				}
				return true;
			})
			.sort((a, b) => b.date.localeCompare(a.date));
	});

	const hasFilters = $derived(
		ui.typeFilter !== 'all' ||
			ui.categoryFilter !== '' ||
			ui.dateFilter !== 'all' ||
			ui.search.trim() !== ''
	);

	function setTypeFilter(value: string) {
		ui.typeFilter = value as TypeFilter;
	}

	function setDateFilter(value: string) {
		ui.dateFilter = value as DateFilter;
	}
</script>

<section class="panel transactions-panel full-transactions">
	<div class="panel-heading transaction-panel-heading">
		<div>
			<h2>
				All transactions <span class="result-count">{filteredTransactions.length}</span>
			</h2>
			<p>Search, filter, and manage your money moves.</p>
		</div>
	</div>
	<div class="filters" aria-label="Transaction filters">
		<label class="filter-select">
			<Icon name="arrow-down" size={16} /><select
				value={ui.typeFilter}
				onchange={(event) => setTypeFilter(event.currentTarget.value)}
				aria-label="Filter by transaction type"
			>
				<option value="all">All types</option>
				<option value="income">Income</option>
				<option value="expense">Expenses</option>
			</select><Icon name="chevron" size={14} />
		</label>
		<label class="filter-select">
			<Icon name="categories" size={16} /><select
				bind:value={ui.categoryFilter}
				aria-label="Filter by category"
			>
				<option value="">All categories</option>
				{#each CATEGORIES as category (category)}
					<option value={category}>{category}</option>
				{/each}
			</select><Icon name="chevron" size={14} />
		</label>
		<label class="filter-select">
			<Icon name="calendar" size={16} /><select
				value={ui.dateFilter}
				onchange={(event) => setDateFilter(event.currentTarget.value)}
				aria-label="Filter by date"
			>
				<option value="all">Any time</option>
				<option value="month">This month</option>
				<option value="30days">Last 30 days</option>
				<option value="year">This year</option>
			</select><Icon name="chevron" size={14} />
		</label>
		{#if hasFilters}
			<button class="clear-filters" onclick={resetTransactionFilters}>Clear filters</button>
		{/if}
	</div>
	<TransactionList
		transactions={filteredTransactions}
		onEdit={openEditTransaction}
		onDelete={deleteTransaction}
		onAdd={openAddTransaction}
	/>
</section>
