-- Run this SQL in your Supabase SQL Editor to set up the users table.

create extension if not exists "pgcrypto";

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  username text not null unique,
  email text unique,
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Safe migration if the table already existed from an earlier run:
alter table public.users add column if not exists full_name text;

-- Enable Row Level Security so public/anon keys cannot read password hashes directly.
alter table public.users enable row level security;

-- Revoke direct access from anon and authenticated roles; only the backend service_role accesses this table.
revoke all on table public.users from anon, authenticated;
