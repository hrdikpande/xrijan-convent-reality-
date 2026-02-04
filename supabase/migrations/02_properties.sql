-- =====================================================
-- MIGRATION 02: PROPERTIES
-- =====================================================
-- Description: Property listings and related functionality
-- Dependencies: 01_core_schema.sql
-- =====================================================

-- =====================================================
-- TABLE: properties
-- =====================================================
create table if not exists public.properties (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Basic Information
  poster_role text check (poster_role in ('Owner', 'Agent', 'Builder')) not null,
  listing_type text check (listing_type in ('Sell', 'Rent')) not null,
  property_category text check (property_category in ('Residential', 'Commercial')) not null,
  property_type text not null, -- Apartment, Villa, Office, Shop, etc.
  
  -- Property Details
  bhk text, -- 1 BHK, 2 BHK, Studio, etc.
  area_sqft numeric not null,
  price numeric not null,
  
  -- Location (JSONB for flexibility)
  address_details jsonb not null default '{}'::jsonb,
  /* Expected structure:
  {
    "locality": "string",
    "landmark": "string",
    "city": "string",
    "state": "string",
    "pin": "string",
    "floor": "number",
    "total_floors": "number",
    "facing": "string",
    "coordinates": { "lat": number, "lng": number }
  }
  */
  
  -- Specifications (JSONB)
  specs jsonb default '{}'::jsonb,
  /* Expected structure:
  {
    "furnishing": "string", // Furnished, Semi-Furnished, Unfurnished
    "age": "string", // 0-1 years, 1-5 years, etc.
    "possession_status": "string", // Ready to Move, Under Construction
    "bathrooms": "number",
    "balconies": "number",
    "parking": "string"
  }
  */
  
  -- Media (JSONB)
  media jsonb default '{}'::jsonb,
  /* Expected structure:
  {
    "photos": ["url1", "url2"],
    "videos": ["url1"],
    "floor_plans": ["url1"],
    "documents": ["url1"]
  }
  */
  
  -- Amenities
  amenities text[] default '{}',
  
  -- Contact Preferences
  contact_prefs jsonb default '{"call": true, "whatsapp": true, "chat": true}'::jsonb,
  
  -- Builder Project Link (optional)
  project_id uuid,
  tower_name text,
  unit_number text,
  
  -- Status and Visibility
  status text default 'draft' check (status in ('draft', 'published', 'archived', 'sold', 'rented')) not null,
  is_boosted boolean default false,
  boost_expires_at timestamptz,
  
  -- SEO and Description
  title text,
  description text,
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  published_at timestamptz
);

-- =====================================================
-- INDEXES for properties
-- =====================================================
create index if not exists idx_properties_owner_id on public.properties(owner_id);
create index if not exists idx_properties_status on public.properties(status);
create index if not exists idx_properties_listing_type on public.properties(listing_type);
create index if not exists idx_properties_property_category on public.properties(property_category);
create index if not exists idx_properties_property_type on public.properties(property_type);
create index if not exists idx_properties_bhk on public.properties(bhk);
create index if not exists idx_properties_price on public.properties(price);
create index if not exists idx_properties_area_sqft on public.properties(area_sqft);
create index if not exists idx_properties_project_id on public.properties(project_id);
create index if not exists idx_properties_is_boosted on public.properties(is_boosted);
create index if not exists idx_properties_created_at on public.properties(created_at desc);

-- GIN index for JSONB address searching
create index if not exists idx_properties_address_details on public.properties using gin(address_details);

-- GIN index for amenities array
create index if not exists idx_properties_amenities on public.properties using gin(amenities);

-- =====================================================
-- ROW LEVEL SECURITY: properties
-- =====================================================
alter table public.properties enable row level security;

-- Everyone can view published properties
create policy "Anyone can view published properties"
  on public.properties for select
  using (status = 'published');

-- Owners can view all their own properties
create policy "Owners can view own properties"
  on public.properties for select
  using (auth.uid() = owner_id);

-- Verified users can insert properties
create policy "Verified users can create properties"
  on public.properties for insert
  with check (
    auth.uid() = owner_id and
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and is_verified = true
    )
  );

-- Owners can update their own properties
create policy "Owners can update own properties"
  on public.properties for update
  using (auth.uid() = owner_id);

-- Owners can delete their own properties
create policy "Owners can delete own properties"
  on public.properties for delete
  using (auth.uid() = owner_id);

-- Admins can view all properties
create policy "Admins can view all properties"
  on public.properties for select
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update any property
create policy "Admins can update any property"
  on public.properties for update
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- =====================================================
-- TABLE: property_views (Analytics)
-- =====================================================
create table if not exists public.property_views (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade not null,
  viewer_id uuid references public.profiles(id) on delete set null,
  
  -- Analytics data
  ip_address inet,
  user_agent text,
  referrer text,
  
  -- Timestamp
  viewed_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_property_views_property_id on public.property_views(property_id);
create index if not exists idx_property_views_viewer_id on public.property_views(viewer_id);
create index if not exists idx_property_views_viewed_at on public.property_views(viewed_at desc);

-- RLS
alter table public.property_views enable row level security;

-- Property owners can view their property analytics
create policy "Owners can view property analytics"
  on public.property_views for select
  using (
    exists (
      select 1 from public.properties 
      where id = property_views.property_id and owner_id = auth.uid()
    )
  );

-- Anyone can insert views (for tracking)
create policy "Anyone can record property views"
  on public.property_views for insert
  with check (true);

-- =====================================================
-- TRIGGERS
-- =====================================================
create trigger set_updated_at before update on public.properties
  for each row execute function public.handle_updated_at();

-- =====================================================
-- FUNCTION: Update published_at on status change
-- =====================================================
create or replace function public.handle_property_publish()
returns trigger as $$
begin
  if new.status = 'published' and old.status != 'published' then
    new.published_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger on_property_publish before update on public.properties
  for each row execute function public.handle_property_publish();
