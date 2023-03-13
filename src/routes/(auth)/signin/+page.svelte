<script lang="ts">
	import { enhance } from '$app/forms'
	import Alert from '$lib/components/Alert.svelte'
	import type { ActionData } from './$types'
	import type { Snapshot } from './$types'

	export let form: ActionData
	let loading = false

	let formElement: HTMLFormElement

	// Set email to form.email if it exists. This is a workaround for the persisting email value when the username has an error.
	let email = ''
	$: if (form?.email) {
		email = form.email
	}

	export const snapshot: Snapshot = {
		capture: () => {
			const data = new FormData(formElement)
			data.set('password', '')
			return Object.fromEntries(data)
		},
		restore: (value) => {
			for (const control of formElement.elements) {
				const name = control.getAttribute('name')
				if (name) {
					const inputControl = control as HTMLFormElement
					inputControl.value = value[name] as string
				}
			}
		}
	}
</script>

<section class="max-w-sm mx-auto">
	<div class="prose">
		<h1>Sign In</h1>
	</div>
	<form method="POST" class="flex flex-col gap-1 my-6" bind:this={formElement} use:enhance>
		{#if form?.message !== undefined || form?.errors}
			<Alert class="alert-error mb-6">{'Email or Password is incorrect.'}</Alert>
		{/if}
		<div class="form-control">
			<input
				type="email"
				name="email"
				placeholder="Email..."
				bind:value={email}
				class="input input-bordered w-full {form?.message !== undefined || form?.errors
					? 'input-error'
					: 'input-bordered'}"
			/>
		</div>
		<div class="form-control mt-5">
			<input
				type="password"
				name="password"
				placeholder="Password..."
				class="input input-bordered w-full {form?.message !== undefined || form?.errors
					? 'input-error'
					: 'input-bordered'}"
			/>
		</div>
		<p class="flex items-center gap-6 mt-9">
			<button disabled={loading} class="btn btn-primary">Sign In</button>
			or
			<a href="/signup" class="link">Sign up</a>
		</p>
	</form>
</section>
