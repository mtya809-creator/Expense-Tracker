<script lang="ts">
	import type { SavingsGoal } from '../types/finance';
	import { onShortcut } from '../utils/keyboard';
	import Icon from './Icon.svelte';

	let {
		goal,
		mode,
		onClose,
		onSave,
		onContribute
	}: {
		goal: SavingsGoal | null;
		mode: 'manage' | 'contribute';
		onClose: () => void;
		onSave: (draft: Omit<SavingsGoal, 'id'> & { id?: string }) => void;
		onContribute: (amount: number) => void;
	} = $props();

	let title = $state('');
	let target = $state('');
	let saved = $state('');
	let deadline = $state('');
	let amount = $state('');
	let error = $state('');

	$effect(() => {
		title = goal?.title ?? '';
		target = goal ? String(goal.target) : '';
		saved = goal ? String(goal.saved) : '';
		deadline = goal?.deadline ?? '';
		amount = '';
		error = '';
	});

	$effect(() => onShortcut('Escape', onClose));

	function submit(event: SubmitEvent) {
		event.preventDefault();
		if (mode === 'contribute') {
			const parsedAmount = Number(amount);
			if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
				error = 'Enter an amount greater than zero.';
				return;
			}
			error = '';
			onContribute(parsedAmount);
			return;
		}
		const parsedTarget = Number(target);
		const parsedSaved = Number(saved);
		if (!title.trim()) {
			error = 'Give your goal a name.';
			return;
		}
		if (!Number.isFinite(parsedTarget) || parsedTarget <= 0) {
			error = 'Enter a target greater than zero.';
			return;
		}
		if (!Number.isFinite(parsedSaved) || parsedSaved < 0) {
			error = 'The saved amount cannot be negative.';
			return;
		}
		error = '';
		onSave({
			id: goal?.id,
			title: title.trim(),
			target: parsedTarget,
			saved: parsedSaved,
			deadline
		});
	}
</script>

<div class="modal-backdrop">
	<div
		class="transaction-modal"
		role="dialog"
		aria-modal="true"
		aria-labelledby="goal-modal-title"
		tabindex="-1"
	>
		<div class="modal-heading">
			<div>
				<span class="eyebrow">
					{mode === 'contribute'
						? 'A LITTLE CLOSER'
						: goal
							? 'KEEP THE DREAM ALIVE'
							: 'DREAM A LITTLE'}
				</span>
				<h2 id="goal-modal-title">
					{mode === 'contribute'
						? `Add funds to ${goal?.title ?? 'your goal'}`
						: goal
							? 'Edit goal'
							: 'Start a savings goal'}
				</h2>
			</div>
			<button class="icon-button modal-close" aria-label="Close dialog" onclick={onClose}>
				<Icon name="close" size={19} />
			</button>
		</div>

		<form onsubmit={submit}>
			{#if mode === 'contribute'}
				<label class="form-field">
					<span>How much are you adding? <small>(MMK)</small></span>
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
					<small>Every little bit counts. Future you says thanks.</small>
				</label>
			{:else}
				<label class="form-field">
					<span>Goal name</span>
					<input bind:value={title} maxlength="60" placeholder="e.g. Emergency fund" required />
				</label>

				<div class="form-grid">
					<label class="form-field">
						<span>Target <small>(MMK)</small></span>
						<div class="amount-input">
							<span>Ks</span><input
								bind:value={target}
								type="number"
								min="1"
								step="1"
								placeholder="0"
								required
							/>
						</div>
					</label>
					<label class="form-field">
						<span>Saved so far <small>(MMK)</small></span>
						<div class="amount-input">
							<span>Ks</span><input
								bind:value={saved}
								type="number"
								min="0"
								step="1"
								placeholder="0"
							/>
						</div>
					</label>
				</div>

				<label class="form-field">
					<span>Deadline <small>(optional)</small></span>
					<input bind:value={deadline} type="date" />
					<small>A soft date to keep you honest — no pressure.</small>
				</label>
			{/if}

			{#if error}
				<p class="form-error" role="alert">{error}</p>
			{/if}
			<div class="modal-footer">
				<button type="button" class="button button-quiet" onclick={onClose}>Cancel</button>
				<button type="submit" class="button button-primary">
					<Icon name={mode === 'contribute' ? 'plus' : 'flag'} size={16} />
					{mode === 'contribute' ? 'Add funds' : goal ? 'Save changes' : 'Create goal'}
				</button>
			</div>
		</form>
	</div>
</div>
