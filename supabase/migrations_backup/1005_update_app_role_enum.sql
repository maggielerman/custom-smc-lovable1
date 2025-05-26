-- Step 1: Add new values to the existing enum
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'author';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'user';

-- Step 2: Create a new enum type with only the desired values
CREATE TYPE public.app_role_new AS ENUM ('admin', 'author', 'user');

-- Step 3: Alter the user_roles table to use the new enum
ALTER TABLE public.user_roles
  ALTER COLUMN role TYPE public.app_role_new
  USING role::text::public.app_role_new;

-- Step 4: Drop the old enum and rename the new one
DROP TYPE public.app_role;
ALTER TYPE public.app_role_new RENAME TO app_role; 