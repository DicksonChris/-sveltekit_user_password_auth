import { faultResponse, formatError } from '$lib/utils/formResponseHandler'
import { signInSchema } from '$lib/validation/validationSchema'
import { AuthApiError } from '@supabase/supabase-js'
import { fail, redirect } from '@sveltejs/kit'
import { ZodError } from 'zod'
import type { Actions } from './$types'

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const formData = await request.formData()
		const email = formData.get('email') as string
		const password = formData.get('password') as string

		try {
			signInSchema.parse({ email, password })
		} catch (err) {
			if (err instanceof ZodError) {
				const errors = formatError(err)
				return fail(400, { errors, email })
			}
		}

		// Attempt to sign up the user
		const credentials = {
			email,
			password
		}

		// Rename error to avoid conflict with the sveltekit's error
		const { error: err } = await locals.sb.auth.signInWithPassword(credentials)

		// If the error is a 400 error, return a 400 response with an error message.
		if (err) {
			if (err instanceof AuthApiError && err.status === 400) {
				return fail(400, faultResponse('Email or Password is incorrect.', { email }))
			}

			// If the error is not a 400 error, return a 500 response with an error message.
			return fail(500, faultResponse(err.message, { email }))
		}

		throw redirect(303, '/profile')
	}
}
