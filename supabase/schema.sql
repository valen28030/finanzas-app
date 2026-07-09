create table if not exists public.finance_states (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.finance_states enable row level security;

drop policy if exists "read own finance state" on public.finance_states;
drop policy if exists "insert own finance state" on public.finance_states;
drop policy if exists "update own finance state" on public.finance_states;

create policy "read own finance state"
on public.finance_states
for select
using (auth.uid() = user_id);

create policy "insert own finance state"
on public.finance_states
for insert
with check (auth.uid() = user_id);

create policy "update own finance state"
on public.finance_states
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
