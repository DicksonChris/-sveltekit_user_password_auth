import { AuthApiError } from '@supabase/supabase-js'
import { fail, type ActionFailure } from '@sveltejs/kit'
import type { Actions } from './$types'

// Define the available actions for this endpoint
export const actions: Actions = {
	register: async ({
		request,
		locals,
		url
	}): Promise<
		ActionFailure<{ error: string; values?: { email: string } }> | { message: string }
	> => {
		const formData = await request.formData()
		const email = formData.get('email') as string
		const password = formData.get('password') as string
		const password_confirm = formData.get('password_confim') as string

		// Check for any form validation errors
		if (!email) {
			return fail(422, { email, error: 'An email address is required.' })
		}
		if (!password) {
			return fail(422, { email, error: 'A password is required.' })
		}
		if (password.length < 8)
			return fail(422, {
				email,
				error: 'Password must be at least 8 characters long.'
			})
		if (password.length > 32)
			return fail(422, {
				email,
				error: 'Password cannot be more than 32 characters long.'
			})
		if (password !== password_confirm)
			return fail(422, {
				email,
				error: 'Your passwords must match.'
			})

		// Attempt to sign up the user
		const credentials = {
			email,
			password,
			options: { emailRedirectTo: url.origin }
		}

		// Rename error to avoid conflict with the sveltekit's error
		const { error: err } = await locals.sb.auth.signUp(credentials)

		// If the error is a 400 error, return a 400 response with an error message.
		if (err) {
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, {
					error: 'Invalid credentials.',
					values: {
						email
					}
				})
			}

			// If the error is not a 400 error, return a 500 response with an error message.
			return fail(500, {
				error: 'Server error. Try again later.',
				values: {
					email
				}
			})
		}

		return {
			message: 'Success! Check your email for a confirmation link.'
		}
	}
}
