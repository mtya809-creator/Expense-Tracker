<script lang="ts">
	import Icon from './Icon.svelte';

	let {
		label,
		value,
		change,
		caption,
		icon,
		tone
	}: {
		label: string;
		value: string;
		change: string;
		caption: string;
		icon: string;
		tone: 'violet' | 'green' | 'orange';
	} = $props();
</script>

<article class="stat-card">
	<div class="stat-top">
		<div
			class="stat-icon"
			class:violet={tone === 'violet'}
			class:green={tone === 'green'}
			class:orange={tone === 'orange'}
		>
			<Icon name={icon} size={19} />
		</div>
		<span class="stat-change" class:positive={tone === 'green'} class:negative={tone === 'orange'}>
			{change}
		</span>
	</div>
	<p class="stat-label">{label}</p>
	<p class="stat-value">{value}</p>
	<p class="stat-caption">{caption}</p>
</article>
