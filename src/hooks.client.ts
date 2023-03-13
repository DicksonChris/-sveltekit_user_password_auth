// Ensures the supabase client is initialized on the server and client -> hooks.server.ts
import '$lib/supabaseClient'

export const handleError = (error: Error) => {
  console.error('client error:', error)
  return {
    status: 500,
    body: error.message
  }
}