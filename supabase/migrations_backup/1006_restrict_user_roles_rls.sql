-- Drop the old permissive policy
drop policy "Users can manage their roles" on public.user_roles;

-- Add a new policy that only allows users to read their own roles
-- Write operations (INSERT, UPDATE, DELETE) will be denied by default
-- unless a more specific policy or the service_role overrides this.
create policy "Users can read their own roles" on public.user_roles
  for select using (user_id = auth.uid());

-- Optionally, add a policy to allow the service_role full access (useful for backend scripts/webhooks)
create policy "Service role full access to user roles" on public.user_roles
  as permissive for all
  to service_role
  using (true); 