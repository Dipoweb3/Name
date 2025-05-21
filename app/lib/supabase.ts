import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fmdgtjhabndraqhztdyn.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error('Missing Supabase anon key');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export { supabase }; 