create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql stable security definer
as $$
  select exists (
    select 1
    from public.user_roles
    where user_id = _user_id
      and role    = _role
  );
$$;