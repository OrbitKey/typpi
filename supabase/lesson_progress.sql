-- One row per finished lesson. Run once in the Supabase SQL editor.

create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id text not null,
  stars integer not null default 0,
  xp integer not null default 0,
  completed_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

alter table public.lesson_progress enable row level security;

drop policy if exists "Read own progress" on public.lesson_progress;
create policy "Read own progress"
  on public.lesson_progress for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Insert own progress" on public.lesson_progress;
create policy "Insert own progress"
  on public.lesson_progress for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Update own progress" on public.lesson_progress;
create policy "Update own progress"
  on public.lesson_progress for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
