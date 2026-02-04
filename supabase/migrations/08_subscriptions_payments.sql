-- =====================================================
-- MIGRATION 08: SUBSCRIPTIONS & PAYMENTS
-- =====================================================
-- Description: Subscription plans and payment tracking
-- Dependencies: 01_core_schema.sql
-- =====================================================

-- =====================================================
-- TABLE: subscription_plans
-- =====================================================
create table if not exists public.subscription_plans (
  id uuid default uuid_generate_v4() primary key,
  
  -- Plan details
  plan_id text unique not null,
  name text not null,
  description text,
  
  -- Pricing
  price numeric not null,
  currency text default 'INR' not null,
  billing_interval text check (billing_interval in ('monthly', 'quarterly', 'yearly')) not null,
  
  -- Features
  features jsonb default '[]'::jsonb,
  /* Expected structure:
  [
    { "name": "Property Listings", "value": "10" },
    { "name": "Featured Listings", "value": "3" },
    { "name": "Lead Credits", "value": "100" }
  ]
  */
  
  -- Limits
  max_properties int,
  max_featured_properties int,
  lead_credits_per_period int,
  
  -- Visibility
  is_active boolean default true,
  is_popular boolean default false,
  sort_order int default 0,
  
  -- Target audience
  target_roles text[] default '{}',
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_subscription_plans_plan_id on public.subscription_plans(plan_id);
create index if not exists idx_subscription_plans_is_active on public.subscription_plans(is_active);

-- RLS
alter table public.subscription_plans enable row level security;

-- Everyone can view active plans
create policy "Anyone can view active plans"
  on public.subscription_plans for select
  using (is_active = true);

-- Trigger
create trigger set_updated_at before update on public.subscription_plans
  for each row execute function public.handle_updated_at();

-- =====================================================
-- TABLE: subscriptions
-- =====================================================
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan_id text references public.subscription_plans(plan_id) not null,
  
  -- Subscription status
  status text default 'active' check (status in ('active', 'past_due', 'cancelled', 'paused', 'expired')) not null,
  
  -- Billing period
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  
  -- Payment gateway details
  payment_gateway text check (payment_gateway in ('razorpay', 'stripe', 'manual')),
  gateway_subscription_id text,
  gateway_customer_id text,
  
  -- Renewal
  auto_renew boolean default true,
  cancelled_at timestamptz,
  cancellation_reason text,
  
  -- Credits and limits
  credits_balance int default 0,
  credits_used int default 0,
  properties_posted int default 0,
  
  -- Trial
  is_trial boolean default false,
  trial_ends_at timestamptz,
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);
create index if not exists idx_subscriptions_plan_id on public.subscriptions(plan_id);
create index if not exists idx_subscriptions_status on public.subscriptions(status);
create index if not exists idx_subscriptions_period_end on public.subscriptions(current_period_end);

-- RLS
alter table public.subscriptions enable row level security;

-- Users can view their own subscription
create policy "Users can view own subscription"
  on public.subscriptions for select
  using (auth.uid() = user_id);

-- Admins can view all subscriptions
create policy "Admins can view all subscriptions"
  on public.subscriptions for select
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger
create trigger set_updated_at before update on public.subscriptions
  for each row execute function public.handle_updated_at();

-- =====================================================
-- TABLE: transactions
-- =====================================================
create table if not exists public.transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete set null not null,
  subscription_id uuid references public.subscriptions(id) on delete set null,
  
  -- Transaction details
  transaction_type text check (transaction_type in ('subscription', 'credit_purchase', 'boost', 'feature', 'refund')) not null,
  amount numeric not null,
  currency text default 'INR' not null,
  
  -- Status
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'failed', 'refunded')) not null,
  
  -- Payment gateway
  payment_gateway text,
  gateway_transaction_id text,
  gateway_order_id text,
  gateway_response jsonb default '{}'::jsonb,
  
  -- Description
  description text,
  
  -- Invoice
  invoice_url text,
  receipt_url text,
  
  -- Timeline
  initiated_at timestamptz default now() not null,
  completed_at timestamptz,
  failed_at timestamptz,
  failure_reason text,
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- Indexes
create index if not exists idx_transactions_user_id on public.transactions(user_id);
create index if not exists idx_transactions_subscription_id on public.transactions(subscription_id);
create index if not exists idx_transactions_status on public.transactions(status);
create index if not exists idx_transactions_gateway_order_id on public.transactions(gateway_order_id);
create index if not exists idx_transactions_created_at on public.transactions(created_at desc);

-- RLS
alter table public.transactions enable row level security;

-- Users can view their own transactions
create policy "Users can view own transactions"
  on public.transactions for select
  using (auth.uid() = user_id);

-- Admins can view all transactions
create policy "Admins can view all transactions"
  on public.transactions for select
  using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Trigger
create trigger set_updated_at before update on public.transactions
  for each row execute function public.handle_updated_at();

-- =====================================================
-- FUNCTION: Check subscription limits
-- =====================================================
create or replace function public.check_subscription_limit(
  user_uuid uuid,
  limit_type text -- 'properties', 'featured', 'leads'
)
returns boolean
language plpgsql
security definer
as $$
declare
  user_subscription record;
  plan record;
  current_usage int;
begin
  -- Get active subscription
  select * into user_subscription
  from public.subscriptions
  where user_id = user_uuid and status = 'active'
  order by created_at desc
  limit 1;
  
  if user_subscription is null then
    return false;
  end if;
  
  -- Get plan limits
  select * into plan
  from public.subscription_plans
  where plan_id = user_subscription.plan_id;
  
  -- Check based on limit type
  case limit_type
    when 'properties' then
      select count(*) into current_usage
      from public.properties
      where owner_id = user_uuid and status != 'archived';
      
      return current_usage < coalesce(plan.max_properties, 999999);
      
    when 'featured' then
      select count(*) into current_usage
      from public.properties
      where owner_id = user_uuid and is_boosted = true;
      
      return current_usage < coalesce(plan.max_featured_properties, 0);
      
    when 'leads' then
      return user_subscription.credits_balance > 0;
      
    else
      return false;
  end case;
end;
$$;
