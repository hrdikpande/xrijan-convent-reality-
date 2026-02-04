-- =====================================================
-- MIGRATION 05: MESSAGING SYSTEM
-- =====================================================
-- Description: Real-time chat between users
-- Dependencies: 01_core_schema.sql
-- =====================================================

-- =====================================================
-- TABLE: conversations
-- =====================================================
create table if not exists public.conversations (
  id uuid default uuid_generate_v4() primary key,
  
  -- Participants
  participant1_id uuid references public.profiles(id) on delete cascade not null,
  participant2_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Context (optional - what property they're discussing)
  property_id uuid references public.properties(id) on delete set null,
  
  -- Metadata
  last_message_at timestamptz default now(),
  
  -- Timestamps
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  
  -- Ensure unique conversation per pair
  constraint unique_conversation check (participant1_id < participant2_id)
);

-- Indexes
create index if not exists idx_conversations_participant1 on public.conversations(participant1_id);
create index if not exists idx_conversations_participant2 on public.conversations(participant2_id);
create index if not exists idx_conversations_property on public.conversations(property_id);
create index if not exists idx_conversations_last_message on public.conversations(last_message_at desc);

-- RLS
alter table public.conversations enable row level security;

create policy "Users can view their conversations"
  on public.conversations for select
  using (
    auth.uid() = participant1_id or 
    auth.uid() = participant2_id
  );

create policy "Users can create conversations"
  on public.conversations for insert
  with check (
    auth.uid() = participant1_id or 
    auth.uid() = participant2_id
  );

-- Trigger
create trigger set_updated_at before update on public.conversations
  for each row execute function public.handle_updated_at();

-- =====================================================
-- TABLE: messages
-- =====================================================
create table if not exists public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  
  -- Message content
  content text not null,
  message_type text default 'text' check (message_type in ('text', 'image', 'file', 'property_share')) not null,
  
  -- Attachments
  attachments jsonb default '[]'::jsonb,
  
  -- Read status
  is_read boolean default false,
  read_at timestamptz,
  
  -- Timestamps
  created_at timestamptz default now() not null,
  
  -- Soft delete
  is_deleted boolean default false,
  deleted_at timestamptz
);

-- Indexes
create index if not exists idx_messages_conversation on public.messages(conversation_id);
create index if not exists idx_messages_sender on public.messages(sender_id);
create index if not exists idx_messages_created_at on public.messages(created_at desc);
create index if not exists idx_messages_is_read on public.messages(is_read) where is_read = false;

-- RLS
alter table public.messages enable row level security;

create policy "Users can view messages in their conversations"
  on public.messages for select
  using (
    exists (
      select 1 from public.conversations
      where id = messages.conversation_id
      and (participant1_id = auth.uid() or participant2_id = auth.uid())
    )
  );

create policy "Users can send messages in their conversations"
  on public.messages for insert
  with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversations
      where id = conversation_id
      and (participant1_id = auth.uid() or participant2_id = auth.uid())
    )
  );

create policy "Users can update their own messages"
  on public.messages for update
  using (auth.uid() = sender_id);

-- =====================================================
-- FUNCTION: Update conversation timestamp on new message
-- =====================================================
create or replace function public.update_conversation_timestamp()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.conversations
  set last_message_at = now()
  where id = new.conversation_id;
  
  return new;
end;
$$;

create trigger on_message_created
  after insert on public.messages
  for each row
  execute function public.update_conversation_timestamp();

-- =====================================================
-- FUNCTION: Notify recipient on new message
-- =====================================================
create or replace function public.notify_on_new_message()
returns trigger
language plpgsql
security definer
as $$
declare
  recipient_id uuid;
  sender_name text;
begin
  -- Get recipient (the other participant)
  select 
    case 
      when participant1_id = new.sender_id then participant2_id
      else participant1_id
    end into recipient_id
  from public.conversations
  where id = new.conversation_id;
  
  -- Get sender name
  select coalesce(full_name, email)
  into sender_name
  from public.profiles
  where id = new.sender_id;
  
  -- Create notification
  perform public.create_notification(
    recipient_id,
    'New Message from ' || sender_name,
    left(new.content, 100),
    'message',
    new.conversation_id,
    '/dashboard/messages/' || new.conversation_id::text
  );
  
  return new;
end;
$$;

create trigger on_message_notify
  after insert on public.messages
  for each row
  execute function public.notify_on_new_message();

-- =====================================================
-- FUNCTION: Get or create conversation
-- =====================================================
create or replace function public.get_or_create_conversation(
  user1_id uuid,
  user2_id uuid,
  property_context_id uuid default null
)
returns uuid
language plpgsql
security definer
as $$
declare
  conversation_id uuid;
  p1_id uuid;
  p2_id uuid;
begin
  -- Ensure participant1_id < participant2_id for consistency
  if user1_id < user2_id then
    p1_id := user1_id;
    p2_id := user2_id;
  else
    p1_id := user2_id;
    p2_id := user1_id;
  end if;
  
  -- Try to find existing conversation
  select id into conversation_id
  from public.conversations
  where participant1_id = p1_id and participant2_id = p2_id
  limit 1;
  
  -- If not found, create new
  if conversation_id is null then
    insert into public.conversations (participant1_id, participant2_id, property_id)
    values (p1_id, p2_id, property_context_id)
    returning id into conversation_id;
  end if;
  
  return conversation_id;
end;
$$;
