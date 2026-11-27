import type { AuthPayload } from '../middleware/auth.js';
import type { UserRecord } from '../models/UserModel.js';

export interface PublicUserDTO {
  id: string;
  username: string;
  fullName: string | null;
  email: string | null;
}

export const AuthView = {
  userFromRecord(user: Pick<UserRecord, 'id' | 'username' | 'full_name' | 'email'>): { user: PublicUserDTO } {
    return {
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
      },
    };
  },

  userFromSession(session: AuthPayload): { user: PublicUserDTO } {
    return {
      user: {
        id: session.sub,
        username: session.username,
        fullName: session.fullName ?? null,
        email: session.email ?? null,
      },
    };
  },

  logout(): { ok: boolean } {
    return { ok: true };
  },

  error(message: string): { error: string } {
    return { error: message };
  },
};
