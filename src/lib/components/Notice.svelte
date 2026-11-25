<script lang="ts">
	import Icon from './Icon.svelte';

	let {
		message,
		onDismiss
	}: {
		message: string;
		onDismiss: () => void;
	} = $props();
</script>

<div class="notice" role="status">
	<span>{message}</span>
	<button class="notice-close" aria-label="Dismiss message" onclick={onDismiss}>
		<Icon name="close" size={15} />
	</button>
</div>
