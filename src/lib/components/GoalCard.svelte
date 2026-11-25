<script lang="ts">
	import type { SavingsGoal } from '../types/finance';
	import { formatDate, formatMoney, goalPercent } from '../utils/finance';
	import Icon from './Icon.svelte';

	let {
		goal,
		onEdit,
		onContribute,
		onDelete
	}: {
		goal: SavingsGoal;
		onEdit: (goal: SavingsGoal) => void;
		onContribute: (goal: SavingsGoal) => void;
		onDelete: (goal: SavingsGoal) => void;
	} = $props();

	const percent = $derived(goalPercent(goal));
	const width = $derived(Math.min(100, percent));
	const reached = $derived(goal.saved >= goal.target);
	const remaining = $derived(Math.max(0, goal.target - goal.saved));
	const behind = $derived(!reached && percent < 40);
	const statusText = $derived(reached ? 'Goal reached' : `${Math.round(percent)}% funded`);
	const amountText = $derived(
		reached ? 'You did it — enjoy it.' : `${formatMoney(remaining)} to go`
	);
</script>

<div class="budget-card-wrap goal-card-wrap">
	<button class="budget-card goal-card" type="button" onclick={() => onEdit(goal)}>
		<span class="budget-card-top">
			<span class="category-symbol goal-symbol"><Icon name="flag" size={19} /></span>
		</span>
		<span class="budget-card-name">{goal.title}</span>
		<strong>{formatMoney(goal.saved)}</strong>
		<span class="budget-card-limit">of {formatMoney(goal.target)} target</span>
		{#if goal.deadline}
			<span class="goal-deadline">
				<Icon name="calendar" size={11} />
				{formatDate(goal.deadline)}
			</span>
		{/if}
		<span
			class="progress"
			role="progressbar"
			aria-valuenow={Math.round(width)}
			aria-valuemin="0"
			aria-valuemax="100"
			aria-label={`${goal.title} progress`}
		>
			<i class="progress-bar" class:warning={behind} style={`width: ${width}%`}></i>
		</span>
		<span class="budget-card-meta">
			<span class="budget-card-status" class:warning={behind}>{statusText}</span>
			<span>{amountText}</span>
		</span>
	</button>

	<div class="budget-card-actions">
		<button
			class="icon-button"
			aria-label={`Add funds to ${goal.title}`}
			onclick={() => onContribute(goal)}
		>
			<Icon name="plus" size={14} />
		</button>
		<button class="icon-button" aria-label={`Edit ${goal.title}`} onclick={() => onEdit(goal)}>
			<Icon name="edit" size={14} />
		</button>
		<button
			class="icon-button delete-action"
			aria-label={`Delete ${goal.title}`}
			onclick={() => onDelete(goal)}
		>
			<Icon name="trash" size={14} />
		</button>
	</div>
</div>
