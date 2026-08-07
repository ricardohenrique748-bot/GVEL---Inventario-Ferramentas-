import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://aothcpkuyqlzghcufkim.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JatUvJu-ArHsuLa51Jy4vg_fI3J59Lg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
