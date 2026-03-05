-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create Tenants table
create table public.tenants (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  logo_url text,
  created_at timestamptz default now()
);

-- Enable RLS on Tenants
alter table public.tenants enable row level security;

-- Create Profiles table (The people who HAVE login access - Dashboard Operators)
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  tenant_id uuid references public.tenants(id),
  full_name text,
  avatar_url text,
  role text default 'admin', -- Solo admins del tenant loguean
  updated_at timestamptz default now()
);

-- Enable RLS on Profiles
alter table public.profiles enable row level security;

-- Create Customers table (End-users who DON'T have login access)
create table public.customers (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  external_id text not null, -- ID de WhatsApp, Web session, etc.
  name text,
  email text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  unique(tenant_id, external_id)
);

-- Enable RLS on Customers
alter table public.customers enable row level security;

-- Create Conversations table
create table public.conversations (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  customer_id uuid references public.customers(id) on delete cascade,
  messages jsonb not null default '[]'::jsonb,
  summary text,
  sentiment text,
  created_at timestamptz default now()
);

-- Enable RLS on Conversations
alter table public.conversations enable row level security;

-- Create Knowledge items table
create table public.knowledge_items (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references public.tenants(id) on delete cascade,
  filename text not null,
  file_url text,
  status text default 'processing', -- processing, completed, error
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- Enable RLS on Knowledge items
alter table public.knowledge_items enable row level security;

-- Create RLS Policies
-- Profiles: Users can only read/write their own profile
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id);

-- Trigger to create a profile after signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Other tables: Users can only see data from their tenant
create policy "Users can view their tenant's data" on public.conversations 
  for select using (tenant_id in (select tenant_id from public.profiles where id = auth.uid()));

create policy "Users can view their tenant's customers" on public.customers 
  for select using (tenant_id in (select tenant_id from public.profiles where id = auth.uid()));

create policy "Users can view their tenant's knowledge items" on public.knowledge_items 
  for select using (tenant_id in (select tenant_id from public.profiles where id = auth.uid()));

-- Insert initial data (optional for testing)
-- insert into public.tenants (name, slug) values ('Test Company', 'test-company');
