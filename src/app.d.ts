/// <reference types="@sveltejs/kit" />

import type { TypedSupabaseClient } from '@supabase/auth-helpers-sveltekit'

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types

declare global {
	declare namespace App {
		interface Supabase {
			Database: import('./schema').Database
			SchemaName: 'public'
		}
		interface Locals {
			sb: TypedSupabaseClient
			session: Session | null
		}
		interface PageData {
			session: import('@supabase/supabase-js').Session | null
		}
		// interface Error {}
		// interface Platform {}
	}
}
