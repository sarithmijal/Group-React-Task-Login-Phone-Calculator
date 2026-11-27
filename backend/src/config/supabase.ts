import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

export interface UserRecord {
  id: string;
  full_name: string | null;
  username: string;
  email: string | null;
  password_hash: string;
  created_at: string;
}

export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
