import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

// If Supabase env vars are not provided, create a safe stub so imports don't throw.
let client;
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
	// Minimal stub used by AuthContext: auth.getSession, auth.signInWithPassword, auth.signUp, auth.signOut, and from(...).upsert
	client = {
		auth: {
			getSession: async () => ({ data: { session: null }, error: null }),
			signInWithPassword: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
			signUp: async () => ({ data: { user: null }, error: new Error('Supabase not configured') }),
			signOut: async () => ({ error: new Error('Supabase not configured') })
		},
		from: () => ({
			upsert: async () => ({ data: null, error: new Error('Supabase not configured') })
		})
	};
} else {
	client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export default client;
