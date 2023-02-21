<script lang="ts">
	import { fade } from 'svelte/transition'

	import type { LayoutData } from './$types'
	export let data: LayoutData

	let visible = false
</script>

<footer class="max-w-screen-sm mx-auto prose my-32 px-6">
	<p class="text-center">
		<button class="btn btn-sm btn-ghost" on:click={() => (visible = !visible)}>
			{#if visible}
				Hide
			{:else}
				Show page data
			{/if}
		</button>
	</p>
	{#if visible && Object.keys(data).length}
		<section transition:fade>
			<h3>Page data:</h3>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</section>
	{/if}
</footer>
