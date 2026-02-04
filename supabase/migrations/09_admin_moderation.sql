-- =====================================================
-- MIGRATION 09: ADMIN & MODERATION
-- =====================================================
-- Description: Admin tools for platform management
-- Dependencies: 01_core_schema.sql, 02_properties.sql
-- =====================================================

-- =====================================================
-- TABLE: admin_logs
-- =====================================================
create table if not exists public.admin_logs (
  id uuid default uuid_generate_v4() primary key,
  admin_id uuid references public.profiles(id) on delete set null not null,
  
  -- Action details
  action text not null,
  action_category text check (action_category in ('user_management', 'property_moderation', 'kyc_verification', 'subscription', 'payment', 'system', 'content')) not null,
  
  -- Target
  target_type text check (target_type in ('user', 'property', 'kyc', 'subscription', 'transaction', 'project', 'lead')),
  target_id uuid,
  
  -- Details
  details jsonb default '{}'::jsonb,
  reason text,
  
  -- Metadata
  ip_address inet,
  user_agent text,
  
  -- Timestamp
  created_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_admin_logs_admin_id on public.admin_logs(admin_id);
create index if not exists idx_admin_logs_action_category on public.admin_logs(action_category);
create index if not exists idx_admin_logs_target on public.admin_logs(target_type, target_id);
create index if not exists idx_admin_logs_created_at on public.admin_logs(created_at desc);

-- RLS
alter table public.admin_logs enable row level security;

-- Only admins can view logs
create policy "Admins can view all logs"
  on public.admin_logs for select
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Only admins can insert logs
create policy "Admins can create logs"
  on public.admin_logs for insert
  with check (
    auth.uid() = admin_id and
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- =====================================================
-- TABLE: reported_content
-- =====================================================
create table if not exists public.reported_content (
  id uuid default uuid_generate_v4() primary key,
  reporter_id uuid references public.profiles(id) on delete set null not null,
  
  -- Reported item
  content_type text check (content_type in ('property', 'user', 'message', 'project', 'review')) not null,
  content_id uuid not null,
  
  -- Report details
  reason text check (reason in ('spam', 'inappropriate', 'fake', 'duplicate', 'misleading', 'other')) not null,
  description text,
  
  -- Status
  status text default 'pending' check (status in ('pending', 'reviewing', 'resolved', 'dismissed')) not null,
  
  -- Resolution
  resolved_by uuid references public.profiles(id),
  resolved_at timestamptz,
  resolution_notes text,
  action_taken text check (action_taken in ('none', 'warning', 'content_removed', 'user_suspended', 'user_banned')),
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_reported_content_reporter on public.reported_content(reporter_id);
create index if not exists idx_reported_content_status on public.reported_content(status);
create index if not exists idx_reported_content_type_id on public.reported_content(content_type, content_id);
create index if not exists idx_reported_content_created_at on public.reported_content(created_at desc);

-- RLS
alter table public.reported_content enable row level security;

-- Users can create reports
create policy "Users can create reports"
  on public.reported_content for insert
  with check (auth.uid() = reporter_id);

-- Users can view their own reports
create policy "Users can view own reports"
  on public.reported_content for select
  using (auth.uid() = reporter_id);

-- Admins can view and manage all reports
create policy "Admins can view all reports"
  on public.reported_content for select
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

create policy "Admins can update reports"
  on public.reported_content for update
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger
create trigger set_updated_at before update on public.reported_content
  for each row execute function public.handle_updated_at();

-- =====================================================
-- TABLE: platform_settings
-- =====================================================
create table if not exists public.platform_settings (
  id uuid default uuid_generate_v4() primary key,
  
  -- Setting key and value
  setting_key text unique not null,
  setting_value jsonb not null,
  
  -- Metadata
  category text not null,
  description text,
  is_public boolean default false,
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_platform_settings_key on public.platform_settings(setting_key);
create index if not exists idx_platform_settings_category on public.platform_settings(category);

-- RLS
alter table public.platform_settings enable row level security;

-- Anyone can view public settings
create policy "Anyone can view public settings"
  on public.platform_settings for select
  using (is_public = true);

-- Admins can manage all settings
create policy "Admins can manage settings"
  on public.platform_settings for all
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger
create trigger set_updated_at before update on public.platform_settings
  for each row execute function public.handle_updated_at();

-- =====================================================
-- FUNCTION: Get platform statistics
-- =====================================================
create or replace function public.get_platform_stats(
  date_from timestamptz default now() - interval '30 days',
  date_to timestamptz default now()
)
returns jsonb
language plpgsql
security definer
as $$
declare
  stats jsonb;
begin
  -- Check if user is admin
  if not exists (
    select 1 from public.profiles 
    where id = auth.uid() and role = 'admin'
  ) then
    raise exception 'Unauthorized';
  end if;
  
  select jsonb_build_object(
    'total_users', (select count(*) from public.profiles),
    'new_users', (select count(*) from public.profiles where created_at between date_from and date_to),
    'verified_users', (select count(*) from public.profiles where is_verified = true),
    'total_properties', (select count(*) from public.properties),
    'published_properties', (select count(*) from public.properties where status = 'published'),
    'new_properties', (select count(*) from public.properties where created_at between date_from and date_to),
    'total_leads', (select count(*) from public.leads),
    'new_leads', (select count(*) from public.leads where created_at between date_from and date_to),
    'active_subscriptions', (select count(*) from public.subscriptions where status = 'active'),
    'total_revenue', (select coalesce(sum(amount), 0) from public.transactions where status = 'completed'),
    'period_revenue', (select coalesce(sum(amount), 0) from public.transactions where status = 'completed' and created_at between date_from and date_to),
    'pending_kyc', (select count(*) from public.kyc_records where status = 'pending'),
    'pending_reports', (select count(*) from public.reported_content where status = 'pending'),
    'property_views', (select count(*) from public.property_views where viewed_at between date_from and date_to),
    'active_conversations', (select count(*) from public.conversations where last_message_at between date_from and date_to),
    'users_by_role', (
      select jsonb_object_agg(role, count)
      from (
        select role, count(*) as count 
        from public.profiles 
        group by role
      ) role_counts
    )
  ) into stats;
  
  return stats;
end;
$$;

-- =====================================================
-- FUNCTION: Moderate property
-- =====================================================
create or replace function public.moderate_property(
  property_uuid uuid,
  new_status text,
  admin_notes text default null
)
returns void
language plpgsql
security definer
as $$
declare
  admin_user_id uuid;
  property_owner_id uuid;
begin
  admin_user_id := auth.uid();
  
  -- Check if user is admin
  if not exists (
    select 1 from public.profiles 
    where id = admin_user_id and role = 'admin'
  ) then
    raise exception 'Unauthorized';
  end if;
  
  -- Get property owner
  select owner_id into property_owner_id
  from public.properties
  where id = property_uuid;
  
  -- Update property status
  update public.properties
  set status = new_status
  where id = property_uuid;
  
  -- Log the action
  insert into public.admin_logs (admin_id, action, action_category, target_type, target_id, reason)
  values (admin_user_id, 'moderate_property', 'property_moderation', 'property', property_uuid, admin_notes);
  
  -- Notify property owner
  perform public.create_notification(
    property_owner_id,
    'Property Status Updated',
    'Your property status has been updated to: ' || new_status,
    'property',
    property_uuid,
    '/dashboard/properties/' || property_uuid::text
  );
end;
$$;
