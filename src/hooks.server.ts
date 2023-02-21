// Ensures the supabase client is initialized on the server and client -> hooks.client.ts
import '$lib/supabaseClient'

import { getSupabase } from '@supabase/auth-helpers-sveltekit'
import type { Handle } from '@sveltejs/kit'

// Gives access to the supabaseClient and session on every single server load function
export const handle: Handle = async ({ event, resolve }) => {
  const { session, supabaseClient } = await getSupabase(event)

  event.locals.sb = supabaseClient
  event.locals.session = session

  return resolve(event)
}