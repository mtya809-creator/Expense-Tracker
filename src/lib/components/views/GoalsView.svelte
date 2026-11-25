<script lang="ts">
	import { deleteGoal, finance } from '../../stores/finance.svelte.js';
	import { openAddGoal, openContributeGoal, openEditGoal } from '../../stores/ui.svelte.js';
	import { formatMoney, goalPercent } from '../../utils/finance';
	import GoalCard from '../GoalCard.svelte';
	import Icon from '../Icon.svelte';
	import StatCard from '../StatCard.svelte';

	const goals = $derived(
		[...finance.goals].sort((a, b) => {
			if (!a.deadline) return 1;
			if (!b.deadline) return -1;
			return a.deadline.localeCompare(b.deadline);
		})
	);
	const totalSaved = $derived(goals.reduce((sum, goal) => sum + goal.saved, 0));
	const totalTarget = $derived(goals.reduce((sum, goal) => sum + goal.target, 0));
	const overallPercent = $derived(
		totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0
	);
	const reachedCount = $derived(goals.filter((goal) => goalPercent(goal) >= 100).length);
	const behind = $derived(goals.length > 0 && overallPercent < 40);
</script>

<div class="budgets-toolbar">
	<div class="month-switcher">
		<span class="category-symbol goal-symbol"><Icon name="flag" size={17} /></span>
		<strong>{goals.length} {goals.length === 1 ? 'goal' : 'goals'}</strong>
	</div>
	<div class="budgets-toolbar-side">
		<span class="usage-badge" class:warning={behind}>
			{goals.length > 0 ? `${overallPercent}% funded` : 'No goals yet'}
		</span>
		<span class="month-hint">Progress is measured across all your goals.</span>
	</div>
</div>

<section class="stats-grid" aria-label="Savings summary">
	<StatCard
		label="Saved so far"
		value={formatMoney(totalSaved)}
		change="All goals"
		caption="Money set aside for your goals"
		icon="wallet"
		tone="green"
	/>
	<StatCard
		label="Goal targets"
		value={formatMoney(totalTarget)}
		change="All goals"
		caption="What you're working toward"
		icon="flag"
		tone="violet"
	/>
	<StatCard
		label="Overall progress"
		value={`${overallPercent}%`}
		change="All goals"
		caption={reachedCount > 0
			? `${reachedCount} ${reachedCount === 1 ? 'goal' : 'goals'} already reached`
			: 'Every contribution counts'}
		icon="trend"
		tone="orange"
	/>
</section>

<section class="goal-grid" aria-label="Savings goals">
	{#each goals as goal (goal.id)}
		<GoalCard
			{goal}
			onEdit={openEditGoal}
			onContribute={openContributeGoal}
			onDelete={deleteGoal}
		/>
	{:else}
		<div class="panel category-empty">
			<div class="empty-state">
				<div class="empty-icon"><Icon name="flag" size={24} /></div>
				<h3>No goals yet</h3>
				<p>
					Name something you're looking forward to — Finora will help you get there, little by
					little.
				</p>
				<button class="button button-primary empty-add" onclick={openAddGoal}>
					<Icon name="plus" size={17} /> Start a goal
				</button>
			</div>
		</div>
	{/each}
</section>

<div class="category-footnote">
	<Icon name="spark" size={16} /> Goals are saved in this browser, just like your transactions.
</div>
