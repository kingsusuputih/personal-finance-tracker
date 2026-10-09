-- Transaction push notification 3-hour recurring reminder
alter table public.push_subscriptions
  add column if not exists next_tx_reminder_at timestamptz default (now() + interval '3 hours');

create index if not exists push_subs_tx_reminder_idx
  on public.push_subscriptions (next_tx_reminder_at)
  where next_tx_reminder_at is not null;
