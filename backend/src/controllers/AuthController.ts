import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { z } from 'zod';
import {
  clearSessionCookie,
  setSessionCookie,
  signSessionToken,
  type AuthenticatedRequest,
} from '../middleware/auth.js';
import { UserModel } from '../models/UserModel.js';
import { AuthView } from '../views/authView.js';

const BCRYPT_ROUNDS = 12;

// Pre-computed dummy hash so non-existent users still incur bcrypt work (timing-attack mitigation).
const DUMMY_BCRYPT_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEeO7eL5P4Q6z6xW9aJ7M0dX4r2u8K1q6yS';

const loginSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(64),
  password: z.string().min(6, 'Password must be at least 6 characters').max(128),
});

const registerSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name must be at least 2 characters').max(80),
  email: z.string().trim().email('Please enter a valid email address').max(120),
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(32)
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Username can only contain letters, numbers, underscores, dots, and hyphens'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
});

export const AuthController = {
  async register(req: Request, res: Response): Promise<void> {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(AuthView.error(parsed.error.issues[0]?.message ?? 'Invalid input'));
      return;
    }

    const fullName = parsed.data.fullName;
    const email = parsed.data.email.toLowerCase();
    const username = parsed.data.username.toLowerCase();
    const { password } = parsed.data;

    try {
      const existingUsername = await UserModel.findByUsername(username);
      if (existingUsername) {
        res.status(409).json(AuthView.error('Username is already taken'));
        return;
      }

      const existingEmail = await UserModel.findByEmail(email);
      if (existingEmail) {
        res.status(409).json(AuthView.error('An account with this email already exists'));
        return;
      }

      const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
      const created = await UserModel.create({
        fullName,
        email,
        username,
        passwordHash,
      });

      const token = signSessionToken({
        sub: created.id,
        username: created.username,
        fullName: created.full_name,
        email: created.email,
      });
      setSessionCookie(res, token);

      res.status(201).json(AuthView.userFromRecord(created));
    } catch (err) {
      console.error('Register error:', err);
      res.status(500).json(AuthView.error('Failed to create account'));
    }
  },

  async login(req: Request, res: Response): Promise<void> {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json(AuthView.error(parsed.error.issues[0]?.message ?? 'Invalid credentials format'));
      return;
    }

    const username = parsed.data.username.toLowerCase();
    const { password } = parsed.data;

    try {
      const user = await UserModel.findByUsername(username);
      const hashToCompare = user?.password_hash ?? DUMMY_BCRYPT_HASH;
      const passwordMatches = await bcrypt.compare(password, hashToCompare);

      if (!user || !user.password_hash || !passwordMatches) {
        res.status(401).json(AuthView.error('Invalid username or password'));
        return;
      }

      const token = signSessionToken({
        sub: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
      });
      setSessionCookie(res, token);

      res.json(AuthView.userFromRecord(user));
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json(AuthView.error('Authentication service unavailable'));
    }
  },

  me(req: AuthenticatedRequest, res: Response): void {
    res.json(AuthView.userFromSession(req.user!));
  },

  logout(_req: Request, res: Response): void {
    clearSessionCookie(res);
    res.json(AuthView.logout());
  },
};
