<script lang="ts">
	import '../app.postcss'
	import type { LayoutData } from './$types'
	import { page } from '$app/stores'
	import Footer from './Footer.svelte'
	import Header from './Header.svelte'
	import { APP_NAME } from '$lib/strings/constants'

	import { supabaseClient } from '$lib/supabaseClient'
	import { invalidateAll } from '$app/navigation'
	import { onMount } from 'svelte'

	// This is the root layout which is loaded on every page
	// This monitors the state of our authentication
	// If something changes it will invalidate all
	onMount(() => {
		const {
			data: { subscription }
		} = supabaseClient.auth.onAuthStateChange(() => {
			invalidateAll()
		})

		return () => {
			subscription.unsubscribe()
		}
	})

	export let data: LayoutData

	$: title = $page.data?.title ? $page.data.title + ' | ' : ''
</script>

<svelte:head>
	<title>{title}{APP_NAME}</title>
</svelte:head>

<Header {data} />

<main class="max-w-screen-sm mx-auto my-20 px-6">
	<slot />
</main>

<Footer {data} />
