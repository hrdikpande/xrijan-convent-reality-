-- =====================================================
-- MIGRATION 07: BUILDER PROJECTS
-- =====================================================
-- Description: Builder-specific features for project management
-- Dependencies: 02_properties.sql, 06_leads_crm.sql
-- =====================================================

-- =====================================================
-- TABLE: projects
-- =====================================================
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  builder_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Project information
  name text not null,
  description text,
  tagline text,
  
  -- Location
  address jsonb not null default '{}'::jsonb,
  /* Expected structure:
  {
    "locality": "string",
    "city": "string",
    "state": "string",
    "pin": "string",
    "coordinates": { "lat": number, "lng": number }
  }
  */
  
  -- Legal and compliance
  rera_id text,
  rera_status text check (rera_status in ('registered', 'pending', 'expired')),
  legal_approvals jsonb default '[]'::jsonb,
  
  -- Project details
  project_type text check (project_type in ('Residential', 'Commercial', 'Mixed')) not null,
  status text default 'Pre-Launch' check (status in ('Pre-Launch', 'Under Construction', 'Ready to Move', 'Completed')) not null,
  
  -- Timeline
  launch_date date,
  possession_date date,
  completion_date date,
  
  -- Units
  total_units int,
  available_units int,
  sold_units int default 0,
  
  -- Pricing
  price_range_min numeric,
  price_range_max numeric,
  
  -- Configuration options
  configurations jsonb default '[]'::jsonb,
  /* Expected structure:
  [
    { "type": "1 BHK", "area_min": 450, "area_max": 550, "price_min": 2500000 },
    { "type": "2 BHK", "area_min": 850, "area_max": 1100, "price_min": 4500000 }
  ]
  */
  
  -- Media and assets
  media jsonb default '{}'::jsonb,
  /* Expected structure:
  {
    "cover_image": "url",
    "gallery": ["url1", "url2"],
    "brochure_url": "url",
    "video_url": "url",
    "virtual_tour_url": "url"
  }
  */
  
  -- Amenities
  amenities text[] default '{}',
  
  -- SEO
  slug text unique,
  meta_title text,
  meta_description text,
  
  -- Visibility
  is_published boolean default false,
  is_featured boolean default false,
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_projects_builder_id on public.projects(builder_id);
create index if not exists idx_projects_status on public.projects(status);
create index if not exists idx_projects_is_published on public.projects(is_published);
create index if not exists idx_projects_slug on public.projects(slug);
create index if not exists idx_projects_city on public.projects((address->>'city'));

-- RLS
alter table public.projects enable row level security;

-- Everyone can view published projects
create policy "Anyone can view published projects"
  on public.projects for select
  using (is_published = true);

-- Builders can view own projects
create policy "Builders can view own projects"
  on public.projects for select
  using (auth.uid() = builder_id);

-- Builders can create projects
create policy "Builders can create projects"
  on public.projects for insert
  with check (
    auth.uid() = builder_id and
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'builder' and is_verified = true
    )
  );

-- Builders can update own projects
create policy "Builders can update own projects"
  on public.projects for update
  using (auth.uid() = builder_id);

-- Builders can delete own projects
create policy "Builders can delete own projects"
  on public.projects for delete
  using (auth.uid() = builder_id);

-- Trigger
create trigger set_updated_at before update on public.projects
  for each row execute function public.handle_updated_at();

-- =====================================================
-- TABLE: project_updates
-- =====================================================
create table if not exists public.project_updates (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  
  -- Update details
  title text not null,
  description text not null,
  update_type text check (update_type in ('milestone', 'construction', 'announcement', 'offer', 'possession')) not null,
  
  -- Media
  images text[] default '{}',
  
  -- Timestamps
  created_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_project_updates_project_id on public.project_updates(project_id);
create index if not exists idx_project_updates_created_at on public.project_updates(created_at desc);

-- RLS
alter table public.project_updates enable row level security;

-- Anyone can view updates for published projects
create policy "Anyone can view updates for published projects"
  on public.project_updates for select
  using (
    exists (
      select 1 from public.projects 
      where id = project_updates.project_id and is_published = true
    )
  );

-- Builders can manage updates for their projects
create policy "Builders can manage project updates"
  on public.project_updates for all
  using (
    exists (
      select 1 from public.projects 
      where id = project_id and builder_id = auth.uid()
    )
  );

-- =====================================================
-- TABLE: team_members
-- =====================================================
create table if not exists public.team_members (
  id uuid default uuid_generate_v4() primary key,
  builder_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Team member details
  user_id uuid references public.profiles(id) on delete set null,
  name text not null,
  email text not null,
  phone text,
  
  -- Role and permissions
  role text default 'sales_rep' check (role in ('admin', 'manager', 'sales_rep', 'site_engineer')) not null,
  permissions jsonb default '{}'::jsonb,
  
  -- Assignment
  assigned_projects uuid[] default '{}',
  
  -- Status
  status text default 'active' check (status in ('active', 'inactive', 'pending_invite')) not null,
  invited_at timestamptz,
  joined_at timestamptz,
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_team_members_builder_id on public.team_members(builder_id);
create index if not exists idx_team_members_user_id on public.team_members(user_id);
create index if not exists idx_team_members_status on public.team_members(status);

-- RLS
alter table public.team_members enable row level security;

-- Builders can manage their team
create policy "Builders can manage own team"
  on public.team_members for all
  using (auth.uid() = builder_id);

-- Team members can view their own record
create policy "Team members can view own record"
  on public.team_members for select
  using (auth.uid() = user_id);

-- Trigger
create trigger set_updated_at before update on public.team_members
  for each row execute function public.handle_updated_at();

-- =====================================================
-- Link properties to projects
-- =====================================================
alter table public.properties 
  add column if not exists project_id uuid references public.projects(id) on delete set null;

create index if not exists idx_properties_project_id on public.properties(project_id);

-- =====================================================
-- Link leads to projects and team
-- =====================================================
alter table public.leads 
  add column if not exists project_interest_id uuid references public.projects(id) on delete set null;

alter table public.leads 
  add column if not exists assigned_to uuid references public.team_members(id) on delete set null;

create index if not exists idx_leads_project_interest on public.leads(project_interest_id);
create index if not exists idx_leads_assigned_to_team on public.leads(assigned_to);
