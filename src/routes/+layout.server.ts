import { getServerSession } from '@supabase/auth-helpers-sveltekit'
import type { LayoutServerLoad } from './$types'

// Allows us to pass the session to the client from the server
export const load: LayoutServerLoad = async (event) => {
	return {
		session: await getServerSession(event)
	}
}
