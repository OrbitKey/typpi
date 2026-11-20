-- Travel waitlist flag. Run once in the Supabase SQL editor.
-- Records that the person asked to be told when Travel opens. No email is sent.

alter table public.profiles
  add column if not exists travel_notify boolean not null default false;
