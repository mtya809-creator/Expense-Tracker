<script lang="ts">
	import type { Budget } from '../types/finance';
	import { CATEGORIES, currentMonthKey, formatMonth } from '../utils/finance';
	import { onShortcut } from '../utils/keyboard';
	import Icon from './Icon.svelte';

	let {
		budget,
		budgets,
		onClose,
		onSave
	}: {
		budget: Budget | null;
		budgets: Budget[];
		onClose: () => void;
		onSave: (draft: Omit<Budget, 'id'> & { id?: string }) => void;
	} = $props();

	let category = $state('Food & Drink');
	let limit = $state('');
	let month = $state('');
	let error = $state('');

	$effect(() => {
		category = budget?.category ?? 'Food & Drink';
		limit = budget ? String(budget.limit) : '';
		month = budget?.month ?? currentMonthKey();
		error = '';
	});

	$effect(() => onShortcut('Escape', onClose));

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const parsedLimit = Number(limit);
		if (!Number.isFinite(parsedLimit) || parsedLimit <= 0) {
			error = 'Enter a limit greater than zero.';
			return;
		}
		if (!/^\d{4}-\d{2}$/.test(month)) {
			error = 'Choose a valid month for this budget.';
			return;
		}
		const clash = budgets.some(
			(item) => item.id !== budget?.id && item.category === category && item.month === month
		);
		if (clash) {
			error = `You already have a ${category} budget for ${formatMonth(month)}.`;
			return;
		}
		error = '';
		onSave({
			id: budget?.id,
			category,
			limit: parsedLimit,
			month
		});
	}
</script>

<div class="modal-backdrop">
	<div
		class="transaction-modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="budget-modal-title"
		tabindex="-1"
	>
		<div class="modal-heading">
			<div>
				<span class="eyebrow">{budget ? 'KEEP IT FRESH' : 'GENTLE LIMITS'}</span>
				<h2 id="budget-modal-title">{budget ? 'Edit budget' : 'Set a budget'}</h2>
			</div>
			<button class="icon-button modal-close" aria-label="Close dialog" onclick={onClose}>
				<Icon name="close" size={19} />
			</button>
		</div>

		<form onsubmit={submit}>
			<label class="form-field">
				<span>Category</span>
				<select bind:value={category}>
					{#each CATEGORIES as item (item)}
						<option value={item}>{item}</option>
					{/each}
				</select>
			</label>

			<div class="form-grid">
				<label class="form-field">
					<span>Monthly limit <small>(MMK)</small></span>
					<div class="amount-input">
						<span>Ks</span><input
							bind:value={limit}
							type="number"
							min="1"
							step="1"
							placeholder="0"
							required
						/>
					</div>
				</label>
				<label class="form-field">
					<span>Month</span>
					<input bind:value={month} type="month" required />
				</label>
			</div>

			<p class="form-hint">
				Finora will compare this limit against your spending in that month — no guilt, just clarity.
			</p>

			{#if error}
				<p class="form-error" role="alert">{error}</p>
			{/if}
			<div class="modal-footer">
				<button type="button" class="button button-quiet" onclick={onClose}>Cancel</button>
				<button type="submit" class="button button-primary">
					<Icon name="plus" size={17} />
					{budget ? 'Save changes' : 'Set budget'}
				</button>
			</div>
		</form>
	</div>
</div>
