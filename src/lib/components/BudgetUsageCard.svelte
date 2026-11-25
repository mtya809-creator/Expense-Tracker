<script lang="ts">
	import type { Budget } from '../types/finance';
	import { formatMoney } from '../utils/finance';
	import Icon from './Icon.svelte';

	let {
		budget,
		spent,
		onEdit,
		onDelete
	}: {
		budget: Budget;
		spent: number;
		onEdit: (budget: Budget) => void;
		onDelete: (budget: Budget) => void;
	} = $props();

	const percent = $derived(budget.limit > 0 ? (spent / budget.limit) * 100 : 0);
	const width = $derived(Math.min(100, percent));
	const over = $derived(spent > budget.limit);
	const remaining = $derived(budget.limit - spent);
	const tone = $derived(over ? 'over' : percent >= 80 ? 'warning' : 'on-track');
	const statusText = $derived(over ? 'Over budget' : `${Math.round(percent)}% used`);
</script>

<div class="budget-card-wrap">
	<button class="budget-card" type="button" onclick={() => onEdit(budget)}>
		<span class="budget-card-top">
			<span class="category-symbol"><Icon name="target" size={19} /></span>
		</span>
		<span class="budget-card-name">{budget.category}</span>
		<strong>{formatMoney(spent)}</strong>
		<span class="budget-card-limit">of {formatMoney(budget.limit)} limit</span>
		<span
			class="progress"
			role="progressbar"
			aria-valuenow={Math.round(width)}
			aria-valuemin="0"
			aria-valuemax="100"
			aria-label={`${budget.category} budget usage`}
		>
			<i
				class="progress-bar"
				class:warning={tone === 'warning'}
				class:danger={tone === 'over'}
				style={`width: ${width}%`}
			></i>
		</span>
		<span class="budget-card-meta">
			<span
				class="budget-card-status"
				class:warning={tone === 'warning'}
				class:over={tone === 'over'}
			>
				{statusText}
			</span>
			<span class:is-over={over}>
				{over ? `${formatMoney(Math.abs(remaining))} over` : `${formatMoney(remaining)} left`}
			</span>
		</span>
	</button>

	<div class="budget-card-actions">
		<button
			class="icon-button"
			aria-label={`Edit ${budget.category} budget`}
			onclick={() => onEdit(budget)}
		>
			<Icon name="edit" size={14} />
		</button>
		<button
			class="icon-button delete-action"
			aria-label={`Delete ${budget.category} budget`}
			onclick={() => onDelete(budget)}
		>
			<Icon name="trash" size={14} />
		</button>
	</div>
</div>
