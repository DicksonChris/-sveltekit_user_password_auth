import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
 
export const load = (({ locals }) => {
  if (!locals.session) {
    throw redirect(307, '/login');
  }
  // TODO: change redirect to user role equivalent
  if (locals.session.user.role !== 'admin') {
    throw redirect(307, '/login');
  }
}) satisfies LayoutServerLoad;