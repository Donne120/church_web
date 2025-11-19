-- CYSMF Database Schema Migration
-- This file should be run in your Supabase SQL Editor

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
create table if not exists profiles (
  id uuid primary key default auth.uid(),
  email text unique,
  full_name text,
  role text check (role in ('ADMIN','SECRETARIAT','REGIONAL_LEADER','CAMPUS_LEADER','EDITOR')) default 'CAMPUS_LEADER',
  region text,
  university_id uuid,
  phone text,
  created_at timestamptz default now()
);

alter table profiles enable row level security;

-- ============================================================================
-- UNIVERSITIES TABLE
-- ============================================================================
create table if not exists universities (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city text,
  region text not null,
  lat double precision,
  lng double precision,
  created_at timestamptz default now()
);

alter table universities enable row level security;

-- ============================================================================
-- EVENTS TABLE
-- ============================================================================
create table if not exists events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  start_at timestamptz not null,
  end_at timestamptz,
  location text,
  category text,
  capacity int,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

alter table events enable row level security;

-- ============================================================================
-- MEDIA TABLE
-- ============================================================================
create table if not exists media (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  type text check (type in ('video','audio','document')),
  url text not null,
  tags text[],
  speaker text,
  date date,
  consent_ok boolean default false,
  created_at timestamptz default now()
);

alter table media enable row level security;

-- ============================================================================
-- SUBMISSIONS TABLE (join/serve/mentorship/prayer/contact)
-- ============================================================================
create table if not exists submissions (
  id uuid primary key default uuid_generate_v4(),
  type text check (type in ('join','serve','mentorship','prayer','contact')),
  payload jsonb not null,
  status text check (status in ('pending','approved','rejected')) default 'pending',
  created_by uuid,
  created_at timestamptz default now()
);

alter table submissions enable row level security;

-- ============================================================================
-- MONTHLY REPORTS TABLE
-- ============================================================================
create table if not exists monthly_reports (
  id uuid primary key default uuid_generate_v4(),
  month text not null, -- 'YYYY-MM'
  reporter_id uuid references profiles(id) on delete set null,
  region text not null,
  university_id uuid references universities(id) on delete set null,

  meetings_count int not null default 0,
  hours_invested numeric(10,2) not null default 0,

  uploads_by_platform jsonb not null default '{}'::jsonb, -- {youtube:int, instagram:int, tiktok:int, facebook:int, other:int}

  universities_reached int not null default 0,
  tracts_given int not null default 0,
  souls_saved int not null default 0,
  integrations_count int not null default 0,

  literature_money numeric(12,2) not null default 0,
  literature_count int not null default 0,

  remarks text,
  attachments jsonb not null default '[]'::jsonb,

  status text check (status in ('draft','submitted','approved','rejected')) default 'draft',
  reviewer_comment text,
  reviewed_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table monthly_reports enable row level security;

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================
create table if not exists audit_logs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid,
  action text,
  entity text,
  entity_id uuid,
  diff jsonb,
  created_at timestamptz default now()
);

alter table audit_logs enable row level security;

-- ============================================================================
-- CONSENTS TABLE
-- ============================================================================
create table if not exists consents (
  id uuid primary key default uuid_generate_v4(),
  person_name text,
  guardian_contact text,
  scope text[] default array[]::text[], -- ['photo','video','name']
  media_id uuid references media(id) on delete set null,
  granted_at timestamptz default now(),
  revoked_at timestamptz
);

alter table consents enable row level security;

-- ============================================================================
-- PUBLIC KPIs VIEW (aggregated from approved reports)
-- ============================================================================
create or replace view public_kpis as
select
  month,
  sum(universities_reached) as universities_reached,
  sum(tracts_given) as tracts_given,
  sum(souls_saved) as souls_saved,
  sum(integrations_count) as integrations,
  sum(meetings_count) as meetings,
  sum(hours_invested) as hours_invested,
  sum(literature_money) as literature_money,
  sum(literature_count) as literature_count
from monthly_reports
where status = 'approved'
group by month;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- PROFILES POLICIES
create policy "profiles_read_self" on profiles
for select using (
  id = auth.uid() 
  or exists (
    select 1 from profiles p 
    where p.id = auth.uid() 
    and p.role in ('ADMIN','SECRETARIAT')
  )
);

create policy "profiles_update_self" on profiles
for update using (id = auth.uid());

-- UNIVERSITIES POLICIES (public read)
create policy "universities_read" on universities 
for select using (true);

-- EVENTS POLICIES
create policy "events_read" on events 
for select using (true);

create policy "events_insert_leader" on events 
for insert with check (
  exists (
    select 1 from profiles p 
    where p.id = auth.uid() 
    and p.role in ('ADMIN','SECRETARIAT','REGIONAL_LEADER','CAMPUS_LEADER')
  )
);

create policy "events_update_owner_or_admin" on events 
for update using (
  created_by = auth.uid() 
  or exists (
    select 1 from profiles p 
    where p.id = auth.uid() 
    and p.role in ('ADMIN','SECRETARIAT')
  )
);

-- MEDIA POLICIES
create policy "media_read" on media 
for select using (true);

create policy "media_cud_editors" on media 
for all using (
  exists (
    select 1 from profiles p 
    where p.id = auth.uid() 
    and p.role in ('ADMIN','EDITOR')
  )
) with check (
  exists (
    select 1 from profiles p 
    where p.id = auth.uid() 
    and p.role in ('ADMIN','EDITOR')
  )
);

-- SUBMISSIONS POLICIES
create policy "submissions_insert_any" on submissions 
for insert with check (true);

create policy "submissions_read_staff" on submissions 
for select using (
  exists (
    select 1 from profiles p 
    where p.id = auth.uid() 
    and p.role in ('ADMIN','SECRETARIAT','REGIONAL_LEADER','EDITOR','CAMPUS_LEADER')
  )
);

-- MONTHLY REPORTS POLICIES
create policy "reports_read_role_scoped" on monthly_reports 
for select using (
  reporter_id = auth.uid()
  or exists (
    select 1 from profiles p 
    where p.id = auth.uid() 
    and p.role in ('ADMIN','SECRETARIAT')
  )
  or exists (
    select 1 from profiles p
    where p.id = auth.uid() 
    and p.role = 'REGIONAL_LEADER' 
    and p.region = monthly_reports.region
  )
);

create policy "reports_insert_self" on monthly_reports 
for insert with check (reporter_id = auth.uid());

create policy "reports_update_self_draft" on monthly_reports 
for update using (
  reporter_id = auth.uid() 
  and status in ('draft','rejected')
);

create policy "reports_approve" on monthly_reports 
for update using (
  exists (
    select 1 from profiles p 
    where p.id = auth.uid() 
    and p.role in ('ADMIN','SECRETARIAT')
  )
  or exists (
    select 1 from profiles p 
    where p.id = auth.uid() 
    and p.role = 'REGIONAL_LEADER' 
    and p.region = monthly_reports.region
  )
);

-- AUDIT LOGS POLICIES
create policy "audit_read_staff" on audit_logs 
for select using (
  exists (
    select 1 from profiles p 
    where p.id = auth.uid()
  )
);

create policy "audit_insert_app" on audit_logs 
for insert with check (true);

-- CONSENTS POLICIES
create policy "consents_read_staff" on consents 
for select using (
  exists (
    select 1 from profiles p 
    where p.id = auth.uid()
  )
);

create policy "consents_insert_staff" on consents 
for insert with check (
  exists (
    select 1 from profiles p 
    where p.id = auth.uid()
  )
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
create index if not exists idx_monthly_reports_month on monthly_reports(month);
create index if not exists idx_monthly_reports_status on monthly_reports(status);
create index if not exists idx_monthly_reports_region on monthly_reports(region);
create index if not exists idx_monthly_reports_reporter on monthly_reports(reporter_id);
create index if not exists idx_events_start_at on events(start_at);
create index if not exists idx_profiles_role on profiles(role);
create index if not exists idx_profiles_region on profiles(region);

-- ============================================================================
-- STORAGE BUCKETS (Run these commands in Supabase Dashboard > Storage)
-- ============================================================================
-- Create these buckets manually in Supabase Dashboard:
-- 1. "report-attachments" (private)
-- 2. "media" (public)
-- 
-- Or use the Supabase API/CLI to create them programmatically







