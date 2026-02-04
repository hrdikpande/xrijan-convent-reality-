-- =====================================================
-- MIGRATION 03: SEARCH ENGINE
-- =====================================================
-- Description: Advanced search functionality with fuzzy matching
-- Dependencies: 02_properties.sql
-- =====================================================

-- =====================================================
-- EXTENSIONS
-- =====================================================
create extension if not exists pg_trgm;

-- =====================================================
-- FUNCTION: Auto-complete locations
-- =====================================================
create or replace function public.get_location_suggestions(
  search_term text,
  limit_count int default 10
)
returns table(
  locality text,
  city text,
  state text,
  property_count bigint
) 
language plpgsql
as $$
begin
  return query
  select 
    p.address_details->>'locality' as locality,
    p.address_details->>'city' as city,
    p.address_details->>'state' as state,
    count(*) as property_count
  from public.properties p
  where 
    p.status = 'published'
    and (
      (p.address_details->>'locality') ilike ('%' || search_term || '%')
      or (p.address_details->>'city') ilike ('%' || search_term || '%')
      or (p.address_details->>'state') ilike ('%' || search_term || '%')
    )
  group by 1, 2, 3
  order by property_count desc
  limit limit_count;
end;
$$;

-- =====================================================
-- FUNCTION: Advanced property search
-- =====================================================
create or replace function public.search_properties(
  -- Location filters
  search_location text default null,
  search_city text default null,
  search_state text default null,
  
  -- Price filters
  min_price numeric default null,
  max_price numeric default null,
  
  -- Area filters
  min_area numeric default null,
  max_area numeric default null,
  
  -- Property filters
  listing_types text[] default null, -- ['Sell', 'Rent']
  property_categories text[] default null, -- ['Residential', 'Commercial']
  property_types text[] default null, -- ['Apartment', 'Villa']
  bhk_types text[] default null, -- ['1 BHK', '2 BHK']
  
  -- Amenities filter (ALL must match)
  required_amenities text[] default null,
  
  -- Furnishing filter
  furnishing_types text[] default null, -- ['Furnished', 'Semi-Furnished', 'Unfurnished']
  
  -- Possession filter
  possession_statuses text[] default null,
  
  -- Special filters
  is_boosted_only boolean default false,
  posted_by_roles text[] default null, -- ['Owner', 'Agent', 'Builder']
  
  -- Pagination
  page_limit int default 20,
  page_offset int default 0,
  
  -- Sorting
  sort_by text default 'created_at', -- created_at, price_low, price_high, area_low, area_high
  
  -- Return only IDs for performance
  ids_only boolean default false
)
returns table(
  id uuid,
  owner_id uuid,
  poster_role text,
  listing_type text,
  property_category text,
  property_type text,
  bhk text,
  area_sqft numeric,
  price numeric,
  address_details jsonb,
  specs jsonb,
  media jsonb,
  amenities text[],
  status text,
  is_boosted boolean,
  title text,
  created_at timestamptz,
  published_at timestamptz
)
language plpgsql
as $$
begin
  return query
  select 
    p.id,
    p.owner_id,
    p.poster_role,
    p.listing_type,
    p.property_category,
    p.property_type,
    p.bhk,
    p.area_sqft,
    p.price,
    p.address_details,
    p.specs,
    p.media,
    p.amenities,
    p.status,
    p.is_boosted,
    p.title,
    p.created_at,
    p.published_at
  from public.properties p
  where 
    -- Must be published
    p.status = 'published'
    
    -- Location filters
    and (
      search_location is null 
      or (p.address_details->>'locality') ilike ('%' || search_location || '%')
      or (p.address_details->>'city') ilike ('%' || search_location || '%')
      or (p.address_details->>'landmark') ilike ('%' || search_location || '%')
    )
    and (search_city is null or (p.address_details->>'city')::text = search_city)
    and (search_state is null or (p.address_details->>'state')::text = search_state)
    
    -- Price range
    and (min_price is null or p.price >= min_price)
    and (max_price is null or p.price <= max_price)
    
    -- Area range
    and (min_area is null or p.area_sqft >= min_area)
    and (max_area is null or p.area_sqft <= max_area)
    
    -- Listing type (Sell/Rent)
    and (listing_types is null or p.listing_type = any(listing_types))
    
    -- Property category
    and (property_categories is null or p.property_category = any(property_categories))
    
    -- Property type
    and (property_types is null or p.property_type = any(property_types))
    
    -- BHK
    and (bhk_types is null or p.bhk = any(bhk_types))
    
    -- Amenities (must have ALL)
    and (required_amenities is null or p.amenities @> required_amenities)
    
    -- Furnishing
    and (furnishing_types is null or (p.specs->>'furnishing')::text = any(furnishing_types))
    
    -- Possession status
    and (possession_statuses is null or (p.specs->>'possession_status')::text = any(possession_statuses))
    
    -- Boosted only
    and (is_boosted_only = false or p.is_boosted = true)
    
    -- Posted by role
    and (posted_by_roles is null or p.poster_role = any(posted_by_roles))
  
  order by
    case when sort_by = 'price_low' then p.price end asc,
    case when sort_by = 'price_high' then p.price end desc,
    case when sort_by = 'area_low' then p.area_sqft end asc,
    case when sort_by = 'area_high' then p.area_sqft end desc,
    case when sort_by = 'created_at' then p.created_at end desc
  
  limit page_limit
  offset page_offset;
end;
$$;

-- =====================================================
-- TABLE: saved_searches
-- =====================================================
create table if not exists public.saved_searches (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  
  search_name text not null,
  search_criteria jsonb not null default '{}'::jsonb,
  
  -- Notifications
  notify_on_new_matches boolean default true,
  last_notification_at timestamptz,
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_saved_searches_user_id on public.saved_searches(user_id);

-- RLS
alter table public.saved_searches enable row level security;

create policy "Users can manage own saved searches"
  on public.saved_searches for all
  using (auth.uid() = user_id);

-- Trigger
create trigger set_updated_at before update on public.saved_searches
  for each row execute function public.handle_updated_at();

-- =====================================================
-- FUNCTION: Get trending localities
-- =====================================================
create or replace function public.get_trending_localities(
  city_filter text default null,
  days_back int default 30,
  limit_count int default 10
)
returns table(
  locality text,
  city text,
  property_count bigint,
  avg_price numeric,
  view_count bigint
)
language plpgsql
as $$
begin
  return query
  select 
    p.address_details->>'locality' as locality,
    p.address_details->>'city' as city,
    count(distinct p.id) as property_count,
    round(avg(p.price)::numeric, 2) as avg_price,
    count(pv.id) as view_count
  from public.properties p
  left join public.property_views pv on p.id = pv.property_id 
    and pv.viewed_at > now() - interval '1 day' * days_back
  where 
    p.status = 'published'
    and (city_filter is null or (p.address_details->>'city')::text = city_filter)
    and p.created_at > now() - interval '1 day' * days_back
  group by 1, 2
  having count(pv.id) > 0
  order by view_count desc, property_count desc
  limit limit_count;
end;
$$;
