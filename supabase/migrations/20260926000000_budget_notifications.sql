-- Budget push notification subscriptions and alert states
create table if not exists public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  identity_hash text not null references public.user_registry(identity_hash) on delete cascade,
  endpoint text not null unique,
  p256dh text not null,
  auth text not null,
  timezone text not null default 'Asia/Jakarta',
  cutoff_day integer not null default 25,
  lang text not null default 'id',
  consent_version text not null default '2026-09-06',
  created_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now()
);

alter table public.push_subscriptions enable row level security;
alter table public.push_subscriptions force row level security;
revoke all on public.push_subscriptions from anon, authenticated;

create index if not exists push_subs_identity_idx on public.push_subscriptions(identity_hash);

create table if not exists public.budget_alert_states (
  id uuid primary key default gen_random_uuid(),
  identity_hash text not null references public.user_registry(identity_hash) on delete cascade,
  cycle_key text not null,
  budget_id text not null,
  budget_name text not null default '',
  status text not null, -- 'safe', 'near', 'reached', 'exceeded'
  last_notified_at timestamptz,
  next_reminder_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint uq_identity_budget_cycle unique (identity_hash, cycle_key, budget_id)
);

alter table public.budget_alert_states enable row level security;
alter table public.budget_alert_states force row level security;
revoke all on public.budget_alert_states from anon, authenticated;

create index if not exists budget_alerts_due_idx
  on public.budget_alert_states(status, next_reminder_at)
  where status in ('near', 'reached', 'exceeded');
