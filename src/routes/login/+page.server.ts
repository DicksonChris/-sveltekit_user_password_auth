import { AuthApiError } from '@supabase/supabase-js'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions } from './$types'

// Define the available actions for this endpoint
export const actions: Actions = {
  // Handle the default action for this endpoint
  login: async ({ request, locals }) => { 
    const body = Object.fromEntries(await request.formData())

    const email = body.email as string
    const password = body.password as string

    // TODO: Use a proper validation library
    // Check for any form validation errors
    if (!email) {
      return fail(422, { email, error: 'Please enter your email.' })
    }
    if (!password) {
      return fail(422, { email, error: 'Please enter your password' })
    }

    // Attempt to sign up the user
    const credentials = {
      email,
      password
    }

    // Rename error to avoid conflict with sveltekit's error
    const { error: err } = await locals.sb.auth.signInWithPassword(credentials)

    // If the error is a 400 error, return a 400 response with an error message.
    if (err) {
      if (err instanceof AuthApiError && err.status === 400) {
        return fail(400, {
          error: 'Invalid credentials.',
          values: {
            email,
          },
        })
      }

      // If the error is not a 400 error, return a 500 response with an error message.
      return fail(500, {
        error: 'Server error. Try again later.',
        values: {
          email,
        },
      })
    }

		throw redirect(303, '/profile');
  },
}
