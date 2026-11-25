<script lang="ts">
	import { auth } from '../../stores/auth.svelte.js';
	import { finance } from '../../stores/finance.svelte.js';
	import Icon from '../Icon.svelte';
	import StatCard from '../StatCard.svelte';

	const account = $derived(auth.account);
	const transactionCount = $derived(finance.transactions.length);
	const budgetCount = $derived(finance.budgets.length);
	const goalCount = $derived(finance.goals.length);
</script>

<div class="budgets-toolbar">
	<div class="month-switcher">
		<span class="avatar" aria-hidden="true">{account.initials}</span>
		<strong>{account.name}</strong>
	</div>
	<div class="budgets-toolbar-side">
		<span class="usage-badge">{account.plan} plan</span>
		<span class="month-hint">Signed in as {account.email}.</span>
	</div>
</div>

<section class="stats-grid" aria-label="Account summary">
	<StatCard
		label="Transactions"
		value={String(transactionCount)}
		change="All time"
		caption="Records in your ledger"
		icon="transactions"
		tone="violet"
	/>
	<StatCard
		label="Budgets"
		value={String(budgetCount)}
		change="This month"
		caption="Limits you've set"
		icon="target"
		tone="orange"
	/>
	<StatCard
		label="Goals"
		value={String(goalCount)}
		change="All goals"
		caption="What you're saving toward"
		icon="flag"
		tone="green"
	/>
</section>

<section class="budget-grid profile-grid" aria-label="Personal information">
	<div class="budget-card profile-card">
		<span class="budget-card-top">
			<span class="category-symbol"><Icon name="mail" size={19} /></span>
		</span>
		<span class="budget-card-name">Email</span>
		<strong>{account.email}</strong>
		<span class="budget-card-limit">Where Finora signs you in</span>
	</div>
	<div class="budget-card profile-card">
		<span class="budget-card-top">
			<span class="category-symbol"><Icon name="check" size={19} /></span>
		</span>
		<span class="budget-card-name">Plan</span>
		<strong>{account.plan} · Free</strong>
		<span class="budget-card-limit">Your current Finora plan</span>
	</div>
	<div class="budget-card profile-card">
		<span class="budget-card-top">
			<span class="category-symbol"><Icon name="wallet" size={19} /></span>
		</span>
		<span class="budget-card-name">Currency</span>
		<strong>{account.currency}</strong>
		<span class="budget-card-limit">Used across Finora</span>
	</div>
	<div class="budget-card profile-card">
		<span class="budget-card-top">
			<span class="category-symbol"><Icon name="calendar" size={19} /></span>
		</span>
		<span class="budget-card-name">Member since</span>
		<strong>{account.memberSince}</strong>
		<span class="budget-card-limit">Part of Finora since then</span>
	</div>
</section>

<div class="category-footnote">
	<Icon name="lock" size={16} /> Your data lives in this browser only — sign out any time.
</div>
