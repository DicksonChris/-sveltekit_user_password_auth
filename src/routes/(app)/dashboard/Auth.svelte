<script lang="ts">
	import { supabaseClient } from '$lib/db'

	let loading = false
	let email: string

  console.log("Is this unreachable?");

	const handleLogin = async () => {
		try {
			loading = true
			const { error } = await supabaseClient.auth.signInWithOtp({ email })
			if (error) throw error
			alert('Check your email for the login link!')
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message)
			}
		} finally {
			loading = false
		}
	}
</script>
<!-- TODO: Unreachable? Is anything here reachable ^^ -->
<form class="flex flex-col gap-6 my-6" on:submit|preventDefault={handleLogin}>
	<div class="col-6 form-widget">
		<h1 class="header">Supabase + SvelteKit</h1>
		<p class="description">Sign in via magic link with your email below</p>
		<div>
			<input class="input input-bordered w-full" type="email" placeholder="Your email" bind:value={email} />
		</div>
		<div>
			<input
				type="submit"
				class="button block"
				value={loading ? 'Loading' : 'Send magic link'}
				disabled={loading}
			/>
		</div>
	</div>
</form>
