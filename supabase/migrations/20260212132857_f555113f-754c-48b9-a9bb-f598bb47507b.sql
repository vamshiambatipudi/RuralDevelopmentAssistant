
-- Add is_active column to profiles for account deactivation
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;
