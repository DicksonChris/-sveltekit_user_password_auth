import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

// Child components of this layout must use PageServerLoad to check the parent LayoutServerLoad for authentication
// Or implement their own authentication
// Failing to do this will allow users with expired sessions to access the page
export const load = (({ locals }) => {
  if (!locals.session) {
    throw redirect(307, '/signin')
  }
}) satisfies LayoutServerLoad
