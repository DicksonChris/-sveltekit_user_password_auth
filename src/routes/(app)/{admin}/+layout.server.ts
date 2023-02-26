import { redirect } from '@sveltejs/kit'
import type { LayoutServerLoad } from './$types'

// Child components of this layout must use PageServerLoad to check the parent LayoutServerLoad for authentication
export const load = (({ locals }) => {
  if (!locals.session) {
    throw redirect(307, '/signin')
  }
  // TODO: Implement user roles
  // if (locals.session.user.role !== 'admin') {
  //   throw redirect(307, '/signin')
  // }
}) satisfies LayoutServerLoad
