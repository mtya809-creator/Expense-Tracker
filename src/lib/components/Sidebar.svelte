<script lang="ts">
	import { auth } from '../stores/auth.svelte.js';
	import type { View } from '../stores/ui.svelte.js';
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';

	let {
		activeView,
		onNavigate
	}: {
		activeView: View;
		onNavigate: (view: View) => void;
	} = $props();

	const links: { id: View; label: string; icon: string }[] = [
		{ id: 'overview', label: 'Overview', icon: 'overview' },
		{ id: 'transactions', label: 'Transactions', icon: 'transactions' },
		{ id: 'categories', label: 'Categories', icon: 'categories' },
		{ id: 'budgets', label: 'Budgets', icon: 'target' },
		{ id: 'goals', label: 'Goals', icon: 'flag' },
		{ id: 'reports', label: 'Reports', icon: 'reports' }
	];
</script>

<aside class="sidebar">
	<a class="brand" href="#overview" onclick={() => onNavigate('overview')} aria-label="Finora home">
		<Logo size={34} />
		<span>finora<span class="brand-period">.</span></span>
	</a>

	<div class="sidebar-label">Workspace</div>
	<nav class="side-nav" aria-label="Main navigation">
		{#each links as link (link.id)}
			<button
				class:active={activeView === link.id}
				class="nav-link"
				aria-current={activeView === link.id ? 'page' : undefined}
				onclick={() => onNavigate(link.id)}
			>
				<Icon name={link.icon} size={19} />
				<span>{link.label}</span>
				{#if link.id === 'transactions'}
					<span class="nav-count">All</span>
				{/if}
			</button>
		{/each}
	</nav>

	<div class="sidebar-spacer"></div>
	<div class="side-tip">
		<div class="tip-icon"><Icon name="trend" size={19} /></div>
		<p class="tip-title">Small steps add up.</p>
		<p class="tip-copy">A little clarity today goes a long way tomorrow.</p>
		<button class="tip-link" onclick={() => onNavigate('reports')}>
			View your insights <span>→</span>
		</button>
	</div>
	<button
		class="profile"
		class:active={activeView === 'profile'}
		aria-current={activeView === 'profile' ? 'page' : undefined}
		aria-label="Open personal details"
		onclick={() => onNavigate('profile')}
	>
		<span class="avatar" aria-hidden="true">{auth.account.initials}</span>
		<span class="profile-copy">
			<strong>{auth.account.name}</strong>
			<span>Personal account</span>
		</span>
		<span class="online-dot" aria-label="Local account"></span>
		<span class="profile-chevron"><Icon name="chevron-right" size={14} /></span>
	</button>
</aside>
