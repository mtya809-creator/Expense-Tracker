<script lang="ts">
	let { name, size = 20 }: { name: string; size?: number } = $props();
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width="1.8"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if name === 'overview'}
		<rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
		<rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
		<rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
		<rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
	{:else if name === 'transactions'}
		<rect x="4" y="3" width="16" height="18" rx="2.5" />
		<path d="M8 8h8M8 12h8M8 16h4" />
	{:else if name === 'categories'}
		<path d="m12 3 9 5-9 5-9-5 9-5Z" />
		<path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
	{:else if name === 'reports'}
		<path d="M4 19.5h16M6.5 16V10M12 16V5M17.5 16v-4" />
	{:else if name === 'moon'}
		<path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5 8.5 8.5 0 1 0 20.5 14.2Z" />
	{:else if name === 'sun'}
		<circle cx="12" cy="12" r="4" />
		<path
			d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"
		/>
	{:else if name === 'plus'}
		<path d="M12 5v14M5 12h14" />
	{:else if name === 'search'}
		<circle cx="10.8" cy="10.8" r="6.8" />
		<path d="m16 16 4.5 4.5" />
	{:else if name === 'calendar'}
		<rect x="3.5" y="5" width="17" height="16" rx="2" />
		<path d="M7.5 3v4M16.5 3v4M3.5 10h17" />
	{:else if name === 'chevron'}
		<path d="m7 10 5 5 5-5" />
	{:else if name === 'edit'}
		<path d="m14 5 5 5M4 20l4.2-.8L19 8.4a2.1 2.1 0 0 0-3-3L5.2 16.2 4 20Z" />
	{:else if name === 'trash'}
		<path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" />
	{:else if name === 'close'}
		<path d="m6 6 12 12M18 6 6 18" />
	{:else if name === 'arrow-up'}
		<path d="M12 19V5m-6 6 6-6 6 6" />
	{:else if name === 'arrow-down'}
		<path d="M12 5v14m6-6-6 6-6-6" />
	{:else if name === 'wallet'}
		<rect x="3" y="5" width="18" height="15" rx="2.5" />
		<path d="M3 9h18m-5 5h.01" />
	{:else if name === 'trend'}
		<path d="m3 17 6-6 4 4 8-9M15 6h6v6" />
	{:else if name === 'receipt'}
		<path d="M5 3.5h14v17l-3.5-2-3.5 2-3.5-2L5 20.5v-17Z" />
		<path d="M9 8h6m-6 4h6" />
	{:else if name === 'spark'}
		<path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
		<path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z" />
	{:else if name === 'target'}
		<circle cx="12" cy="12" r="8.5" />
		<circle cx="12" cy="12" r="4.5" />
		<circle cx="12" cy="12" r="1.2" />
	{:else if name === 'flag'}
		<path d="M5 21V4" />
		<path d="M5 4h11l-2.2 3.5L16 11H5" />
	{:else if name === 'download'}
		<path d="M12 4v11" />
		<path d="m12 15 4-4m-4 4-4-4" />
		<path d="M5 19.5h14" />
	{:else if name === 'chevron-left'}
		<path d="m14 6-6 6 6 6" />
	{:else if name === 'chevron-right'}
		<path d="m10 6 6 6-6 6" />
	{:else if name === 'user'}
		<circle cx="12" cy="8" r="3.5" />
		<path d="M5 20c1.2-3.2 3.7-4.8 7-4.8s5.8 1.6 7 4.8" />
	{:else if name === 'logout'}
		<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
		<path d="m10 8-4 4 4 4" />
		<path d="M6 12h10" />
	{:else if name === 'mail'}
		<rect x="3.5" y="5.5" width="17" height="13" rx="2" />
		<path d="m4 7 8 6 8-6" />
	{:else if name === 'lock'}
		<rect x="5" y="10.5" width="14" height="9.5" rx="2" />
		<path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
	{:else if name === 'check'}
		<path d="m5 12.5 4.5 4.5L19 7.5" />
	{/if}
</svg>
