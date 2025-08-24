let config: { SUPABASE_URL?: string; SUPABASE_ANON_KEY?: string } = {};
try { config = require('./config.json'); } catch {}
export const SUPABASE_URL = config.SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = config.SUPABASE_ANON_KEY || '';
export const IS_SUPABASE_ENABLED = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
