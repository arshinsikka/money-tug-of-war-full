create extension if not exists pgcrypto;
create table if not exists pairs (
  id uuid primary key default gen_random_uuid(),
  invite_code text unique not null,
  created_at timestamptz default now()
);
create table if not exists pair_members (
  id uuid primary key default gen_random_uuid(),
  pair_id uuid references pairs(id) on delete cascade,
  user_id text not null,
  display_name text not null,
  emoji text not null,
  created_at timestamptz default now()
);
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  pair_id uuid references pairs(id) on delete cascade,
  title text not null,
  category text check (category in ('Work','Study','Fitness','Habit')) default 'Habit',
  deadline_hour int default 23,
  penalty_cents int default 100,
  created_by text,
  created_at timestamptz default now()
);
create table if not exists completions (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references tasks(id) on delete cascade,
  user_id text not null,
  date text not null,
  proof_url text,
  pomodoro_minutes int default 0,
  completed_at timestamptz default now(),
  unique (task_id, user_id, date)
);
create table if not exists settlements (
  id uuid primary key default gen_random_uuid(),
  pair_id uuid references pairs(id) on delete cascade,
  created_at timestamptz default now()
);
alter table pairs enable row level security;
alter table pair_members enable row level security;
alter table tasks enable row level security;
alter table completions enable row level security;
alter table settlements enable row level security;
drop policy if exists p_all_pairs on pairs;
create policy p_all_pairs on pairs for all using (true) with check (true);
drop policy if exists p_all_members on pair_members;
create policy p_all_members on pair_members for all using (true) with check (true);
drop policy if exists p_all_tasks on tasks;
create policy p_all_tasks on tasks for all using (true) with check (true);
drop policy if exists p_all_completions on completions;
create policy p_all_completions on completions for all using (true) with check (true);
drop policy if exists p_all_settlements on settlements;
create policy p_all_settlements on settlements for all using (true) with check (true);
