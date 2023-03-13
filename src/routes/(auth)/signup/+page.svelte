<script lang="ts">
	import { enhance } from '$app/forms'
	import Alert from '$lib/components/Alert.svelte'
	import InputErrorAlert from '$lib/components/InputErrorAlert.svelte'
	import type { Snapshot } from './$types'
	import type { ActionData } from './$types'

	export let form: ActionData
	let loading = false

	let formElement: HTMLFormElement

	// Set email to form.email if it exists. This is a workaround for the persisting email value when the username has an error
	let email = ''
	$: if (form?.email) {
		email = form.email
	}

	export const snapshot: Snapshot = {
		capture: () => {
			const data = new FormData(formElement)
			return Object.fromEntries(data)
		},
		restore: (value) => {
			for (const control of formElement.elements) {
				const name = control.getAttribute('name')
				if (name) {
					const inputControl = control as HTMLInputElement // Type assertion
					inputControl.value = value[name] as string
				}
			}
		}
	}
</script>

<section class="max-w-sm mx-auto">
	<div class="prose">
		<h1>Sign Up</h1>
	</div>
	<form
		action="?/register"
		method="POST"
		class="flex flex-col gap-1 my-6"
		bind:this={formElement}
		use:enhance
	>
		{#if form?.message !== undefined}
			<Alert class="{form?.success ? 'alert-info' : 'alert-error'} mb-6">{form?.message}</Alert>
		{/if}
		<div class="form-control">
			<input
				type="email"
				name="email"
				placeholder="Email..."
				bind:value={email}
				class="input input-bordered w-full {form?.errors?.email ? 'input-error' : 'input-bordered'}"
			/>
			<InputErrorAlert formErrorName="email" formErrorData={form?.errors?.email} />
		</div>
		<div class="form-control">
			<input
				type="password"
				name="password"
				placeholder="Password..."
				class="input input-bordered w-full {form?.errors?.password
					? 'input-error'
					: 'input-bordered'}"
			/>
			<InputErrorAlert formErrorName="password" formErrorData={form?.errors?.password} />
		</div>
		<div class="form-control">
			<input
				type="password"
				name="passwordConfirm"
				placeholder="Confirm password..."
				class="input input-bordered w-full {form?.errors?.passwordConfirm
					? 'input-error'
					: 'input-bordered'}"
			/>
			<InputErrorAlert
				formErrorName="passwordConfirm"
				formErrorData={form?.errors?.passwordConfirm}
			/>
		</div>
		<div class="form-control">
			<label for="terms" class="flex items-center gap-4">
				<input
					type="checkbox"
					name="terms"
					id="terms"
					class="checkbox checkbox-primary {form?.errors?.terms ? 'border-error' : ''}"
				/>
				<span
					>I accept the

					<a href="/signup/terms" class="link link-primary">Terms and Conditions</a></span
				>
			</label>
			<InputErrorAlert formErrorName="terms" formErrorData={form?.errors?.terms} />
		</div>
		<p class="flex items-center gap-6 mt-6">
			<button disabled={loading} class="btn btn-primary">Sign Up</button>
			or
			<a href="/signin" class="link">Sign In</a>
		</p>
	</form>
</section>
