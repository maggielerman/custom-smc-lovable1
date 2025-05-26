
drop policy if exists "profile_owner_insert" on public.profiles;

create policy "profile_owner_insert"
  on public.profiles
  for insert
  with check ( id = auth.jwt() ->> 'sub' );