-- =====================================================
-- MIGRATION 06: LEADS & CRM
-- =====================================================
-- Description: Lead management and CRM for agents
-- Dependencies: 01_core_schema.sql, 02_properties.sql
-- =====================================================

-- =====================================================
-- TABLE: leads
-- =====================================================
create table if not exists public.leads (
  id uuid default uuid_generate_v4() primary key,
  agent_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Lead information
  name text not null,
  email text,
  phone text,
  
  -- Source and context
  source text check (source in ('website', 'call', 'whatsapp', 'referral', 'walk_in', 'social_media', 'advertisement', 'other')) not null,
  property_id uuid references public.properties(id) on delete set null,
  
  -- Lead status
  status text default 'new' check (status in ('new', 'contacted', 'qualified', 'site_visit_scheduled', 'site_visit_completed', 'negotiation', 'converted', 'lost', 'spam')) not null,
  priority text default 'medium' check (priority in ('low', 'medium', 'high', 'urgent')) not null,
  
  -- Preferences
  preferences jsonb default '{}'::jsonb,
  /* Expected structure:
  {
    "budget_min": number,
    "budget_max": number,
    "preferred_locations": ["string"],
    "property_type": "string",
    "bhk": "string",
    "purpose": "Sell/Rent"
  }
  */
  
  -- Notes and tracking
  notes text,
  last_contacted_at timestamptz,
  next_followup_at timestamptz,
  
  -- Assignment (for builder teams)
  assigned_to uuid references public.profiles(id),
  project_interest_id uuid,
  
  -- Conversion tracking
  converted_property_id uuid references public.properties(id),
  converted_at timestamptz,
  deal_value numeric,
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_leads_agent_id on public.leads(agent_id);
create index if not exists idx_leads_status on public.leads(status);
create index if not exists idx_leads_priority on public.leads(priority);
create index if not exists idx_leads_property_id on public.leads(property_id);
create index if not exists idx_leads_assigned_to on public.leads(assigned_to);
create index if not exists idx_leads_next_followup on public.leads(next_followup_at) where next_followup_at is not null;
create index if not exists idx_leads_created_at on public.leads(created_at desc);

-- RLS
alter table public.leads enable row level security;

-- Agents can view their own leads
create policy "Agents can view own leads"
  on public.leads for select
  using (auth.uid() = agent_id or auth.uid() = assigned_to);

-- Agents can create leads
create policy "Agents can create leads"
  on public.leads for insert
  with check (auth.uid() = agent_id);

-- Agents can update their leads
create policy "Agents can update own leads"
  on public.leads for update
  using (auth.uid() = agent_id or auth.uid() = assigned_to);

-- Agents can delete their leads
create policy "Agents can delete own leads"
  on public.leads for delete
  using (auth.uid() = agent_id);

-- Property owners can create leads (from contact forms)
create policy "Property owners can create leads for their properties"
  on public.leads for insert
  with check (
    exists (
      select 1 from public.properties 
      where id = property_id and owner_id = auth.uid()
    )
  );

-- Trigger
create trigger set_updated_at before update on public.leads
  for each row execute function public.handle_updated_at();

-- =====================================================
-- TABLE: lead_activities
-- =====================================================
create table if not exists public.lead_activities (
  id uuid default uuid_generate_v4() primary key,
  lead_id uuid references public.leads(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null not null,
  
  -- Activity details
  activity_type text check (activity_type in ('call', 'email', 'meeting', 'site_visit', 'note', 'status_change', 'whatsapp')) not null,
  title text not null,
  description text,
  
  -- Outcome
  outcome text check (outcome in ('positive', 'neutral', 'negative', 'no_response')),
  
  -- Scheduled vs completed
  is_completed boolean default false,
  scheduled_at timestamptz,
  completed_at timestamptz,
  
  -- Timestamps
  created_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_lead_activities_lead_id on public.lead_activities(lead_id);
create index if not exists idx_lead_activities_user_id on public.lead_activities(user_id);
create index if not exists idx_lead_activities_type on public.lead_activities(activity_type);
create index if not exists idx_lead_activities_scheduled on public.lead_activities(scheduled_at) where is_completed = false;

-- RLS
alter table public.lead_activities enable row level security;

create policy "Users can view activities for their leads"
  on public.lead_activities for select
  using (
    exists (
      select 1 from public.leads 
      where id = lead_activities.lead_id 
      and (agent_id = auth.uid() or assigned_to = auth.uid())
    )
  );

create policy "Users can create activities for their leads"
  on public.lead_activities for insert
  with check (
    auth.uid() = user_id and
    exists (
      select 1 from public.leads 
      where id = lead_id 
      and (agent_id = auth.uid() or assigned_to = auth.uid())
    )
  );

create policy "Users can update their own activities"
  on public.lead_activities for update
  using (auth.uid() = user_id);

-- =====================================================
-- TABLE: crm_tasks
-- =====================================================
create table if not exists public.crm_tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  lead_id uuid references public.leads(id) on delete cascade,
  
  -- Task details
  title text not null,
  description text,
  task_type text check (task_type in ('call', 'email', 'meeting', 'follow_up', 'site_visit', 'documentation', 'other')) not null,
  
  -- Priority and status
  priority text default 'medium' check (priority in ('low', 'medium', 'high')) not null,
  status text default 'pending' check (status in ('pending', 'in_progress', 'completed', 'cancelled')) not null,
  
  -- Scheduling
  due_date timestamptz not null,
  reminder_at timestamptz,
  
  -- Completion
  completed_at timestamptz,
  completion_notes text,
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_crm_tasks_user_id on public.crm_tasks(user_id);
create index if not exists idx_crm_tasks_lead_id on public.crm_tasks(lead_id);
create index if not exists idx_crm_tasks_status on public.crm_tasks(status);
create index if not exists idx_crm_tasks_due_date on public.crm_tasks(due_date);
create index if not exists idx_crm_tasks_priority on public.crm_tasks(priority);

-- RLS
alter table public.crm_tasks enable row level security;

create policy "Users can manage own tasks"
  on public.crm_tasks for all
  using (auth.uid() = user_id);

-- Trigger
create trigger set_updated_at before update on public.crm_tasks
  for each row execute function public.handle_updated_at();

-- =====================================================
-- FUNCTION: Auto-create task on lead status change
-- =====================================================
create or replace function public.auto_create_followup_task()
returns trigger
language plpgsql
as $$
begin
  -- When lead status changes to site_visit_scheduled, create a task
  if new.status = 'site_visit_scheduled' and old.status != 'site_visit_scheduled' then
    insert into public.crm_tasks (user_id, lead_id, title, task_type, due_date, priority)
    values (
      new.agent_id,
      new.id,
      'Follow up: Site visit for ' || new.name,
      'follow_up',
      now() + interval '1 day',
      'high'
    );
  end if;
  
  return new;
end;
$$;

create trigger on_lead_status_change
  after update on public.leads
  for each row
  when (old.status is distinct from new.status)
  execute function public.auto_create_followup_task();
