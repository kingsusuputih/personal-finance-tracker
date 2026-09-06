create table if not exists public.user_registry (
  identity_hash text primary key check (identity_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  publish_name boolean not null default false,
  masked_name text,
  consented_at timestamptz,
  consent_version text,
  constraint publication_consistency check (
    (publish_name and masked_name is not null and consented_at is not null and consent_version is not null)
    or
    (not publish_name and masked_name is null and consented_at is null and consent_version is null)
  )
);

alter table public.user_registry enable row level security;
alter table public.user_registry force row level security;

revoke all on public.user_registry from anon, authenticated;

create index if not exists user_registry_public_recent_idx
  on public.user_registry (created_at desc)
  where publish_name;
