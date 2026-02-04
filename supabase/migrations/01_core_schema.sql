-- =====================================================
-- MIGRATION 01: CORE SCHEMA
-- =====================================================
-- Description: Creates core user profiles and authentication schema
-- Dependencies: None (Execute FIRST)
-- =====================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =====================================================
-- TABLE: profiles
-- =====================================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  email text unique not null,
  full_name text,
  phone text,
  avatar_url text,
  
  -- Role-based access
  role text not null check (role in ('buyer', 'tenant', 'owner', 'agent', 'builder', 'admin')) default 'buyer',
  is_verified boolean default false,
  
  -- Address information
  address text,
  city text,
  state text,
  country text default 'India',
  pin_code text,
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes for profiles
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_is_verified on public.profiles(is_verified);

-- =====================================================
-- TABLE: kyc_records
-- =====================================================
create table if not exists public.kyc_records (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Document details
  document_type text not null check (document_type in ('aadhaar', 'pan', 'driving_license', 'passport', 'gst', 'rera_license', 'company_registration')),
  document_urls text[] not null,
  
  -- Verification status
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')) not null,
  metadata jsonb default '{}'::jsonb,
  
  -- Review information
  reviewed_by uuid references public.profiles(id),
  reviewer_notes text,
  reviewed_at timestamptz,
  
  -- Timestamps
  submitted_at timestamptz default now() not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes for KYC
create index if not exists idx_kyc_user_id on public.kyc_records(user_id);
create index if not exists idx_kyc_status on public.kyc_records(status);

-- =====================================================
-- ROW LEVEL SECURITY: profiles
-- =====================================================
alter table public.profiles enable row level security;

-- Everyone can view verified profiles
create policy "Anyone can view verified profiles"
  on public.profiles for select
  using (is_verified = true);

-- Users can view their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Users can update their own profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Admins can view all profiles
create policy "Admins can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update any profile
create policy "Admins can update any profile"
  on public.profiles for update
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- =====================================================
-- ROW LEVEL SECURITY: kyc_records
-- =====================================================
alter table public.kyc_records enable row level security;

-- Users can view their own KYC records
create policy "Users can view own KYC"
  on public.kyc_records for select
  using (auth.uid() = user_id);

-- Users can insert their own KYC records
create policy "Users can insert own KYC"
  on public.kyc_records for insert
  with check (auth.uid() = user_id);

-- Users can update their own pending KYC records
create policy "Users can update own pending KYC"
  on public.kyc_records for update
  using (auth.uid() = user_id and status = 'pending');

-- Admins can view all KYC records
create policy "Admins can view all KYC"
  on public.kyc_records for select
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Admins can update any KYC record
create policy "Admins can update any KYC"
  on public.kyc_records for update
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- =====================================================
-- FUNCTION: Update updated_at timestamp
-- =====================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers for updated_at
create trigger set_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();

create trigger set_updated_at before update on public.kyc_records
  for each row execute function public.handle_updated_at();

-- =====================================================
-- FUNCTION: Create profile on signup
-- =====================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'buyer')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
