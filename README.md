# Workspace Portal (React + Chakra UI + Express + Supabase)

A full-stack web application in English with secure authentication (`bcrypt` + Supabase + HttpOnly JWT cookies + optional Google OAuth), a **Sum** module placeholder, and a mobile-style **Calculator**.

## Project Structure

- `backend/` — Express + TypeScript API (`helmet`, `cors`, `express-rate-limit`, `zod`, `bcryptjs`, `jsonwebtoken`, `@supabase/supabase-js`)
- `frontend/` — React + Vite + TypeScript + Chakra UI
- `supabase/schema.sql` — PostgreSQL schema & Row Level Security setup for Supabase

## Setup

### 1. Supabase Database
1. Open your Supabase project's **SQL Editor** and run [`supabase/schema.sql`](./supabase/schema.sql).
2. *(Optional for "Sign in with Google")*: In Supabase **Authentication → Providers → Google**, enable Google OAuth and add `http://localhost:5173` to your Redirect URLs.

### 2. Backend
```bash
cd backend
cp .env.example .env
# Fill in SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, and a 32+ char JWT_SECRET
npm run dev
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env
# Optionally fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for Google Sign-In
npm run dev
```

Then open `http://localhost:5173`, create an account (or sign in), and choose **Sum** or **Calculator**.
