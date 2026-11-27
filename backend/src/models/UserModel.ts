import { supabaseAdmin } from '../config/supabase.js';

export interface UserRecord {
  id: string;
  full_name: string | null;
  username: string;
  email: string | null;
  password_hash: string;
  created_at: string;
}

export interface CreateUserInput {
  fullName: string;
  email: string;
  username: string;
  passwordHash: string;
}

export const UserModel = {
  async findByUsername(username: string): Promise<UserRecord | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, full_name, email, username, password_hash, created_at')
      .eq('username', username)
      .maybeSingle<UserRecord>();

    if (error) {
      throw new Error(`Database error while looking up username: ${error.message}`);
    }

    return data;
  },

  async findByEmail(email: string): Promise<Pick<UserRecord, 'id'> | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('email', email)
      .maybeSingle<Pick<UserRecord, 'id'>>();

    if (error) {
      throw new Error(`Database error while looking up email: ${error.message}`);
    }

    return data;
  },

  async create(input: CreateUserInput): Promise<UserRecord> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        full_name: input.fullName,
        email: input.email,
        username: input.username,
        password_hash: input.passwordHash,
      })
      .select('id, full_name, email, username, password_hash, created_at')
      .single<UserRecord>();

    if (error || !data) {
      throw new Error(error?.message ?? 'Failed to create user');
    }

    return data;
  },
};
