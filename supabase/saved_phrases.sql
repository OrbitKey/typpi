-- Phrases the person saved from a lesson, such as a culture tip.
-- Run once in the Supabase SQL editor.

create table if not exists public.saved_phrases (
  user_id uuid not null references auth.users (id) on delete cascade,
  phrase_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, phrase_id)
);

alter table public.saved_phrases enable row level security;

drop policy if exists "Read own saved phrases" on public.saved_phrases;
create policy "Read own saved phrases"
  on public.saved_phrases for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Insert own saved phrases" on public.saved_phrases;
create policy "Insert own saved phrases"
  on public.saved_phrases for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Delete own saved phrases" on public.saved_phrases;
create policy "Delete own saved phrases"
  on public.saved_phrases for delete
  to authenticated
  using (auth.uid() = user_id);
