-- Allow unverified users to create draft property listings while keeping published listings restricted to verified users.

drop policy if exists "Verified users can create properties" on public.properties;

drop policy if exists "Users can create draft properties" on public.properties;
create policy "Users can create draft properties"
  on public.properties for insert
  with check (
    auth.uid() = owner_id
    and status = 'draft'
  );

create policy "Verified users can create properties"
  on public.properties for insert
  with check (
    auth.uid() = owner_id
    and exists (
      select 1 from public.profiles
      where id = auth.uid() and is_verified = true
    )
  );
