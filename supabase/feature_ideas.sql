-- Shared feature board. Run once in the Supabase SQL editor.
-- People can add ideas and vote. They cannot set Planned / Under review / In progress / Done.

create table if not exists public.feature_ideas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  status text check (status in ('Planned', 'Under review', 'In progress', 'Done')),
  base_votes integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.feature_votes (
  user_id uuid not null references auth.users (id) on delete cascade,
  idea_id uuid not null references public.feature_ideas (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, idea_id)
);

alter table public.feature_ideas enable row level security;
alter table public.feature_votes enable row level security;

drop policy if exists "Read feature ideas" on public.feature_ideas;
create policy "Read feature ideas"
  on public.feature_ideas for select
  to authenticated
  using (true);

drop policy if exists "Suggest a feature" on public.feature_ideas;
create policy "Suggest a feature"
  on public.feature_ideas for insert
  to authenticated
  with check (status is null and base_votes = 0);

drop policy if exists "Read feature votes" on public.feature_votes;
create policy "Read feature votes"
  on public.feature_votes for select
  to authenticated
  using (true);

drop policy if exists "Add own feature vote" on public.feature_votes;
create policy "Add own feature vote"
  on public.feature_votes for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Remove own feature vote" on public.feature_votes;
create policy "Remove own feature vote"
  on public.feature_votes for delete
  to authenticated
  using (auth.uid() = user_id);

insert into public.feature_ideas (id, title, body, status, base_votes, created_at)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Practice with my phone''s real keyboard',
    'Allow connecting mobile Bluetooth keyboard or testing typing accuracy directly using native keyboards.',
    'Planned',
    48,
    now() - interval '5 days'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Hospital & pharmacy conversations',
    'Scenarios focusing on symptoms, medical triage, asking about side effects, and communicating with pharmacists.',
    'Under review',
    35,
    now() - interval '4 days'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Dark mode',
    'A full high-contrast dark theme option for evening study sessions to reduce eye strain.',
    'In progress',
    22,
    now() - interval '3 days'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    'Nepali interface language',
    'Support UI translations and explanations in Nepali for the rapidly growing community of learners.',
    'Under review',
    19,
    now() - interval '2 days'
  ),
  (
    '55555555-5555-4555-8555-555555555555',
    'Offline mode for the train',
    'Download upcoming lessons in advance so practice can continue smoothly during subway commutes.',
    'Done',
    11,
    now() - interval '1 day'
  )
on conflict (id) do nothing;
