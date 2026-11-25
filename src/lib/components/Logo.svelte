<script lang="ts">
	let { size = 34 }: { size?: number } = $props();
</script>

<svg
	class="logo-mark"
	width={size}
	height={size}
	viewBox="0 0 64 64"
	aria-hidden="true"
	focusable="false"
>
	<defs>
		<linearGradient id="finora-grad" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="#9b8af6" />
			<stop offset="0.55" stop-color="#7d68e6" />
			<stop offset="1" stop-color="#6149c9" />
		</linearGradient>
		<linearGradient id="finora-sheen" x1="0" y1="0" x2="0" y2="1">
			<stop offset="0" stop-color="#ffffff" stop-opacity="0.34" />
			<stop offset="1" stop-color="#ffffff" stop-opacity="0" />
		</linearGradient>
		<clipPath id="finora-clip"><rect width="64" height="64" rx="15" /></clipPath>
	</defs>
	<rect width="64" height="64" rx="15" fill="url(#finora-grad)" />
	<g clip-path="url(#finora-clip)">
		<path
			d="M0 15A15 15 0 0 1 15 0H49A15 15 0 0 1 64 15V19C56 25 44 12 32 12C20 12 8 25 0 19Z"
			fill="url(#finora-sheen)"
		/>
	</g>
	<g stroke="#fff" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">
		<polyline points="16,44 27,33 36,39 46,25" />
		<polyline points="38.5,25 46,25 46,32.5" />
	</g>
	<circle cx="16" cy="44" r="4.2" fill="#fff" />
	<path d="M20 14Q21.3 18.7 26 20Q21.3 21.3 20 26Q18.7 21.3 14 20Q18.7 18.7 20 14Z" fill="#fff" />
</svg>
