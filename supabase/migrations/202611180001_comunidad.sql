create table public.community_topics (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references auth.users on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 48),
  category text not null check (category in ('recursos', 'aula', 'preguntas', 'presentaciones')),
  title text not null check (char_length(btrim(title)) between 8 and 120),
  body text not null check (char_length(btrim(body)) between 20 and 3000),
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.community_replies (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid not null references public.community_topics on delete cascade,
  author_id uuid not null default auth.uid() references auth.users on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 48),
  body text not null check (char_length(btrim(body)) between 5 and 3000),
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.community_reports (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references public.community_topics on delete cascade,
  reply_id uuid references public.community_replies on delete cascade,
  reporter_id uuid not null default auth.uid() references auth.users on delete cascade,
  created_at timestamptz not null default now(),
  check (num_nonnulls(topic_id, reply_id) = 1)
);

create index community_topics_recent on public.community_topics (created_at desc, id desc) where visible;
create index community_topics_category on public.community_topics (category, created_at desc, id desc) where visible;
create index community_replies_thread on public.community_replies (topic_id, created_at, id) where visible;
create unique index community_report_topic_once on public.community_reports (reporter_id, topic_id) where topic_id is not null;
create unique index community_report_reply_once on public.community_reports (reporter_id, reply_id) where reply_id is not null;

alter table public.community_topics enable row level security;
alter table public.community_replies enable row level security;
alter table public.community_reports enable row level security;

-- Access only the fields the forum actually publishes. Keep account identifiers private
-- and reserve moderation and timestamps for the server/database administrators.
revoke all on public.community_topics, public.community_replies, public.community_reports from anon, authenticated;
grant select (id, display_name, category, title, body, created_at)
  on public.community_topics to anon, authenticated;
grant select (id, topic_id, display_name, body, created_at)
  on public.community_replies to anon, authenticated;
grant insert (display_name, category, title, body) on public.community_topics to authenticated;
grant insert (topic_id, display_name, body) on public.community_replies to authenticated;
grant insert (topic_id, reply_id) on public.community_reports to authenticated;

create policy "Read visible topics" on public.community_topics
  for select to anon, authenticated using (visible);
create policy "Create own topic" on public.community_topics
  for insert to authenticated with check (author_id = (select auth.uid()) and visible);

create policy "Read visible replies" on public.community_replies
  for select to anon, authenticated using (
    visible and exists (select 1 from public.community_topics where id = topic_id)
  );
create policy "Reply to visible topic" on public.community_replies
  for insert to authenticated with check (
    author_id = (select auth.uid()) and visible
    and exists (select 1 from public.community_topics where id = topic_id)
  );

create policy "Report visible content" on public.community_reports
  for insert to authenticated with check (
    reporter_id = (select auth.uid())
    and (
      (topic_id is not null and exists (select 1 from public.community_topics where id = topic_id))
      or (reply_id is not null and exists (select 1 from public.community_replies where id = reply_id))
    )
  );
