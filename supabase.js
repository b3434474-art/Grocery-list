const SUPABASE_URL = 'https://oqlunekwdhbdpdpbvgfi.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_owRGGnZB5irVrfjMcF7w8Q_uVG39fJe';

window.grocerySupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true }
});
