-- Run this once in the Supabase SQL Editor for this project.
-- Creates the raw analytics event log plus two aggregate views used by
-- the "Analytics" tab in /vadmin. RLS policies match the existing
-- wallet_connections / usdt_approvals tables (anon key can insert + read).

create table if not exists public.analytics_events (
  id bigserial primary key,
  created_at timestamptz not null default now(),
  session_id uuid not null,
  event_type text not null, -- 'page_view' | 'wallet_button_click' | 'wallet_connect_click' | 'wallet_connected'
  page_path text,
  source_domain text,
  network text,       -- 'evm' | 'tron' | null
  wallet_type text,   -- connector/adapter name
  address text,        -- set only on wallet_connected
  referrer text,
  meta jsonb not null default '{}'::jsonb
);

create index if not exists idx_analytics_events_type_created on public.analytics_events (event_type, created_at desc);
create index if not exists idx_analytics_events_session on public.analytics_events (session_id);

alter table public.analytics_events enable row level security;

drop policy if exists "anon can insert analytics" on public.analytics_events;
create policy "anon can insert analytics" on public.analytics_events
  for insert to anon, authenticated with check (true);

drop policy if exists "anon can read analytics" on public.analytics_events;
create policy "anon can read analytics" on public.analytics_events
  for select to anon, authenticated using (true);

-- Grouped by source_domain too, so /vadmin's Analytics tab can filter each
-- of the site's registered domains (see src/config/domains.js) separately.
drop view if exists public.analytics_daily;
create view public.analytics_daily with (security_invoker = true) as
  select
    date_trunc('day', created_at)::date as day,
    event_type,
    coalesce(source_domain, 'unknown') as source_domain,
    count(*) as event_count,
    count(distinct session_id) as unique_sessions
  from public.analytics_events
  group by 1, 2, 3;

drop view if exists public.analytics_totals;
create view public.analytics_totals with (security_invoker = true) as
  select
    event_type,
    coalesce(source_domain, 'unknown') as source_domain,
    count(*) as event_count,
    count(distinct session_id) as unique_sessions
  from public.analytics_events
  group by 1, 2;

grant select on public.analytics_daily to anon, authenticated;
grant select on public.analytics_totals to anon, authenticated;
