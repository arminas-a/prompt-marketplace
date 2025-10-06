import { createClient } from '@supabase/supabase-js'

// Admin client with service role (bypasses RLS)
// Only use this for admin operations!
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)