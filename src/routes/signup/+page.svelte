<script lang="ts">
	import { faWarning } from '@fortawesome/free-solid-svg-icons'
	import Fa from 'svelte-fa'
	import type { ActionData } from './$types'

	export let form: ActionData
	let loading = false
</script>

<section class="max-w-sm mx-auto">
	<div class="prose">
		<h1>Sign Up</h1>
	</div>
	<form action="?/register" method="POST" class="flex flex-col gap-6 my-6">
		{#if form?.error}
			<div class="alert alert-error">
				<div>
					<Fa icon={faWarning} />
					{form.error}
				</div>
			</div>
		{/if}
		{#if form?.message}
			<div class="block notification is-primary">{form.message}</div>
		{/if}
		<!-- TODO: Use form validation library -->
		<p>
			<input
				type="email"
				name="email"
				placeholder="Email..."
				class="input input-bordered w-full"
				required
				value={form?.values?.email ?? ''}
			/>
		</p>
		<p>
			<input
				type="password"
				name="password"
				placeholder="Password..."
				class="input input-bordered w-full"
				required
			/>
		</p>
		<p>
			<input
				type="password"
				name="password_confirm"
				placeholder="Confirm password..."
				class="input input-bordered w-full"
				required
			/>
		</p>
		<p class="flex items-center gap-6 mt-6">
			<button disabled={loading} class="btn btn-primary">Sign Up</button>
			or
			<a href="/login" class="link">Sign In</a>
		</p>
	</form>

	{#if form}
		<section class="my-8">
			<h3>Form data:</h3>
			<pre>{JSON.stringify(form, null, 2)}</pre>
		</section>
	{/if}
</section>
