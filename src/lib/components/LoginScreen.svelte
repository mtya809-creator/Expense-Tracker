<script lang="ts">
	import { greeting } from '../utils/finance';
	import Icon from './Icon.svelte';
	import Logo from './Logo.svelte';

	let {
		onSignIn
	}: {
		onSignIn: () => void;
	} = $props();

	let email = $state('mo@finora.app');
	let password = $state('finora-demo');

	const features = [
		{ icon: 'target', text: 'Budgets that adapt to your month' },
		{ icon: 'flag', text: 'Savings goals that keep you moving' },
		{ icon: 'reports', text: 'Reports that make your money make sense' }
	];

	function submit(event: SubmitEvent) {
		event.preventDefault();
		onSignIn();
	}
</script>

<div class="login-shell">
	<section class="login-card">
		<div class="brand login-brand" aria-label="Finora">
			<Logo size={34} />
			<span>finora<span class="brand-period">.</span></span>
		</div>

		<span class="eyebrow">WELCOME BACK</span>
		<h1>{greeting()}. Ready for a little clarity?</h1>
		<p class="login-lead">
			Sign in to pick up where you left off — your money, your goals, all in one calm place.
		</p>

		<form class="login-form" onsubmit={submit}>
			<label class="login-field">
				<span><Icon name="mail" size={14} /> Email</span>
				<input bind:value={email} type="email" autocomplete="email" placeholder="you@example.com" />
			</label>
			<label class="login-field">
				<span><Icon name="lock" size={14} /> Password</span>
				<input
					bind:value={password}
					type="password"
					autocomplete="current-password"
					placeholder="Your password"
				/>
			</label>
			<button type="submit" class="button button-primary login-submit">
				Sign in <span>→</span>
			</button>
		</form>

		<p class="login-hint">
			Demo sign-in — any details work, and nothing is stored. Just a friendly way in.
		</p>
		<p class="login-foot">Finora <span class="brand-period">·</span> MMK</p>
	</section>

	<aside class="login-aside" aria-hidden="true">
		<div class="login-blob login-blob-one"></div>
		<div class="login-blob login-blob-two"></div>
		<span class="login-aside-eyebrow">A CALMER WAY TO TRACK YOUR MONEY</span>
		<h2>Money, minus the stress.</h2>
		<p>
			Finora helps you see where your money goes, set gentle limits, and move toward the things you
			actually care about.
		</p>
		<ul class="login-features">
			{#each features as feature (feature.icon)}
				<li>
					<span class="login-feature-mark"><Icon name="check" size={13} /></span>{feature.text}
				</li>
			{/each}
		</ul>
		<p class="login-quote">"Small steps add up. Keep showing up for your future self."</p>
	</aside>
</div>
