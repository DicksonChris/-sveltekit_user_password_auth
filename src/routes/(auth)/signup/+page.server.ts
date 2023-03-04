import { faultResponse, formatError, successResponse } from '$lib/utils/formResponseHandler'
import { signUpSchema } from '$lib/validation/validationSchema'
import { AuthApiError } from '@supabase/supabase-js'
import { fail } from '@sveltejs/kit'
import { ZodError } from 'zod'
import type { Actions } from './$types'

// Define the available actions for this endpoint
export const actions: Actions = {
  register: async ({ request, locals, url }) => {
    const formData = await request.formData()
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const passwordConfirm = formData.get('passwordConfirm') as string
    const terms = formData.get('terms') as string

    // Use zod to validate the form data
    try {
      signUpSchema.parse({ email, password, passwordConfirm, terms })
    } catch (err) {
      if (err instanceof ZodError) {
        const errors = formatError(err)
        return fail(400, { errors, email })
      }
    }

    // Attempt to sign up the user
    const credentials = {
      email,
      password,
      options: { emailRedirectTo: url.origin },
    }

    // Rename error to avoid conflict with the sveltekit's error
    const { error: err } = await locals.sb.auth.signUp(credentials)

    // If the error is a 400 error, return a 400 response with an error message.
    if (err) {
      if (err instanceof AuthApiError && err.status === 400) {
        return fail(400, faultResponse('Invalid credentials.', { email }))
      }

      // If the error is not a 400 error, return a 500 response with an error message.
      return fail(500, faultResponse(err.message, { email }))
    }

    return successResponse('Success! Check your email for a confirmation link.')
  },
}
