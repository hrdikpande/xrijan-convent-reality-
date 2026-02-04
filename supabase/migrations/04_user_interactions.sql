-- =====================================================
-- MIGRATION 04: USER INTERACTIONS
-- =====================================================
-- Description: User saved properties, bookings, and notifications
-- Dependencies: 02_properties.sql
-- =====================================================

-- =====================================================
-- TABLE: saved_properties (Favorites/Wishlist)
-- =====================================================
create table if not exists public.saved_properties (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  
  -- Notes
  user_notes text,
  
  -- Timestamps
  saved_at timestamptz default now() not null,
  
  -- Unique constraint
  unique(user_id, property_id)
);

-- Indexes
create index if not exists idx_saved_properties_user_id on public.saved_properties(user_id);
create index if not exists idx_saved_properties_property_id on public.saved_properties(property_id);

-- RLS
alter table public.saved_properties enable row level security;

create policy "Users can manage own saved properties"
  on public.saved_properties for all
  using (auth.uid() = user_id);

-- =====================================================
-- TABLE: bookings (Site Visit Requests)
-- =====================================================
create table if not exists public.bookings (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  property_id uuid references public.properties(id) on delete cascade not null,
  
  -- Booking details
  preferred_date date not null,
  preferred_time text not null,
  visitor_count int default 1,
  
  -- Status
  status text default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed', 'no_show')) not null,
  
  -- Notes
  user_notes text,
  owner_notes text,
  
  -- Contact info override (if different from profile)
  contact_name text,
  contact_phone text,
  contact_email text,
  
  -- Response
  confirmed_by uuid references public.profiles(id),
  confirmed_at timestamptz,
  cancellation_reason text,
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_bookings_user_id on public.bookings(user_id);
create index if not exists idx_bookings_property_id on public.bookings(property_id);
create index if not exists idx_bookings_status on public.bookings(status);
create index if not exists idx_bookings_preferred_date on public.bookings(preferred_date);

-- RLS
alter table public.bookings enable row level security;

-- Users can view their own bookings
create policy "Users can view own bookings"
  on public.bookings for select
  using (auth.uid() = user_id);

-- Users can create bookings
create policy "Users can create bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

-- Users can update their pending bookings
create policy "Users can update own pending bookings"
  on public.bookings for update
  using (auth.uid() = user_id and status = 'pending');

-- Property owners can view bookings for their properties
create policy "Property owners can view property bookings"
  on public.bookings for select
  using (
    exists (
      select 1 from public.properties 
      where id = bookings.property_id and owner_id = auth.uid()
    )
  );

-- Property owners can update bookings for their properties
create policy "Property owners can update property bookings"
  on public.bookings for update
  using (
    exists (
      select 1 from public.properties 
      where id = bookings.property_id and owner_id = auth.uid()
    )
  );

-- Trigger
create trigger set_updated_at before update on public.bookings
  for each row execute function public.handle_updated_at();

-- =====================================================
-- TABLE: notifications
-- =====================================================
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Notification content
  title text not null,
  message text not null,
  notification_type text check (notification_type in ('booking', 'message', 'property', 'system', 'payment')) not null,
  
  -- Related entities
  related_id uuid, -- Could be booking_id, property_id, etc.
  action_url text,
  
  -- Status
  is_read boolean default false,
  read_at timestamptz,
  
  -- Timestamps
  created_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_notifications_user_id on public.notifications(user_id);
create index if not exists idx_notifications_is_read on public.notifications(is_read);
create index if not exists idx_notifications_created_at on public.notifications(created_at desc);

-- RLS
alter table public.notifications enable row level security;

create policy "Users can view own notifications"
  on public.notifications for select
  using (auth.uid() = user_id);

create policy "Users can update own notifications"
  on public.notifications for update
  using (auth.uid() = user_id);

-- System can insert notifications
create policy "System can create notifications"
  on public.notifications for insert
  with check (true);

-- =====================================================
-- FUNCTION: Create notification
-- =====================================================
create or replace function public.create_notification(
  target_user_id uuid,
  notification_title text,
  notification_message text,
  notification_type text,
  related_entity_id uuid default null,
  action_link text default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  new_notification_id uuid;
begin
  insert into public.notifications (
    user_id,
    title,
    message,
    notification_type,
    related_id,
    action_url
  ) values (
    target_user_id,
    notification_title,
    notification_message,
    notification_type,
    related_entity_id,
    action_link
  )
  returning id into new_notification_id;
  
  return new_notification_id;
end;
$$;

-- =====================================================
-- FUNCTION: Notify property owner on booking
-- =====================================================
create or replace function public.notify_owner_on_booking()
returns trigger
language plpgsql
security definer
as $$
declare
  property_owner_id uuid;
  property_title text;
  user_name text;
begin
  -- Get property owner and details
  select owner_id, coalesce(title, property_type || ' in ' || (address_details->>'city'))
  into property_owner_id, property_title
  from public.properties
  where id = new.property_id;
  
  -- Get user name
  select coalesce(full_name, email)
  into user_name
  from public.profiles
  where id = new.user_id;
  
  -- Create notification
  perform public.create_notification(
    property_owner_id,
    'New Site Visit Request',
    user_name || ' has requested a site visit for ' || property_title || ' on ' || new.preferred_date::text,
    'booking',
    new.id,
    '/dashboard/bookings/' || new.id::text
  );
  
  return new;
end;
$$;

create trigger on_booking_created
  after insert on public.bookings
  for each row
  execute function public.notify_owner_on_booking();
