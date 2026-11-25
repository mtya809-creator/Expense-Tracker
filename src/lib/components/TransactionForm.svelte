<script lang="ts">
	import { type Transaction, type TransactionType } from '../types/finance';
	import { CATEGORIES } from '../utils/finance';
	import { onShortcut } from '../utils/keyboard';
	import Icon from './Icon.svelte';

	let {
		transaction,
		onClose,
		onSave
	}: {
		transaction: Transaction | null;
		onClose: () => void;
		onSave: (transaction: Omit<Transaction, 'id'> & { id?: string }) => void;
	} = $props();

	let title = $state('');
	let amount = $state('');
	let type = $state<TransactionType>('expense');
	let category = $state('Food & Drink');
	let date = $state('');
	let note = $state('');
	let error = $state('');

	$effect(() => {
		title = transaction?.title ?? '';
		amount = transaction ? String(transaction.amount) : '';
		type = transaction?.type ?? 'expense';
		category = transaction?.category ?? 'Food & Drink';
		date = transaction?.date ?? localDate();
		note = transaction?.note ?? '';
	});

	$effect(() => onShortcut('Escape', onClose));

	function localDate(): string {
		const today = new Date();
		const month = String(today.getMonth() + 1).padStart(2, '0');
		const day = String(today.getDate()).padStart(2, '0');
		return `${today.getFullYear()}-${month}-${day}`;
	}

	function submit(event: SubmitEvent) {
		event.preventDefault();
		const parsedAmount = Number(amount);
		if (!title.trim()) {
			error = 'Add a description for this transaction.';
			return;
		}
		if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
			error = 'Enter an amount greater than zero.';
			return;
		}
		if (!date || Number.isNaN(new Date(`${date}T00:00:00`).getTime())) {
			error = 'Choose a valid transaction date.';
			return;
		}
		error = '';
		onSave({
			id: transaction?.id,
			title: title.trim(),
			amount: parsedAmount,
			type,
			category,
			date,
			note: note.trim()
		});
		onClose();
	}
</script>

<div class="modal-backdrop">
	<div
		class="transaction-modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
	>
		<div class="modal-heading">
			<div>
				<span class="eyebrow">{transaction ? 'KEEP IT UP TO DATE' : 'A LITTLE MORE CLARITY'}</span>
				<h2 id="modal-title">{transaction ? 'Edit transaction' : 'Add a transaction'}</h2>
			</div>
			<button class="icon-button modal-close" aria-label="Close dialog" onclick={onClose}>
				<Icon name="close" size={19} />
			</button>
		</div>

		<form onsubmit={submit}>
			<fieldset class="type-choice">
				<legend>Transaction type</legend>
				<button
					type="button"
					aria-pressed={type === 'income'}
					class:chosen-income={type === 'income'}
					onclick={() => (type = 'income')}
				>
					<Icon name="arrow-down" size={16} /> Income
				</button>
				<button
					type="button"
					aria-pressed={type === 'expense'}
					class:chosen-expense={type === 'expense'}
					onclick={() => (type = 'expense')}
				>
					<Icon name="arrow-up" size={16} /> Expense
				</button>
			</fieldset>

			<label class="form-field">
				<span>Description</span>
				<input bind:value={title} maxlength="80" placeholder="e.g. Lunch with friends" required />
			</label>

			<div class="form-grid">
				<label class="form-field">
					<span>Amount <small>(MMK)</small></span>
					<div class="amount-input">
						<span>Ks</span><input
							bind:value={amount}
							type="number"
							min="1"
							step="1"
							placeholder="0"
							required
						/>
					</div>
				</label>
				<label class="form-field">
					<span>Date</span>
					<input bind:value={date} type="date" required />
				</label>
			</div>

			<label class="form-field">
				<span>Category</span>
				<select bind:value={category}>
					{#each CATEGORIES as item (item)}
						<option value={item}>{item}</option>
					{/each}
				</select>
			</label>

			<label class="form-field">
				<span>Note <small>(optional)</small></span>
				<textarea bind:value={note} maxlength="180" rows="2" placeholder="Add a little context"
				></textarea>
			</label>

			{#if error}
				<p class="form-error" role="alert">{error}</p>
			{/if}
			<div class="modal-footer">
				<button type="button" class="button button-quiet" onclick={onClose}>Cancel</button>
				<button type="submit" class="button button-primary">
					<Icon name="plus" size={17} />
					{transaction ? 'Save changes' : 'Add transaction'}
				</button>
			</div>
		</form>
	</div>
</div>
