create table public.community_profiles (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 2 and 48),
  country text check (country ~ '^[A-Z]{2}$'),
  certified_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.community_contributions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null default auth.uid() references public.community_profiles on delete cascade,
  kind text not null check (kind in ('proyecto', 'recomendacion', 'recurso')),
  country text check (country ~ '^[A-Z]{2}$'),
  title text not null check (char_length(btrim(title)) between 8 and 120),
  body text not null check (char_length(btrim(body)) between 20 and 8000),
  state text not null default 'borrador' check (state in ('borrador','revision','publicado','devuelto')),
  created_at timestamptz not null default now(),
  published_at timestamptz,
  review_note text check (char_length(review_note) <= 500)
);

create index community_contributions_feed on public.community_contributions (published_at desc)
  where state = 'publicado';
create index community_contributions_owner on public.community_contributions (author_id, created_at desc);

create table public.community_ratings (
  contribution_id uuid not null references public.community_contributions on delete cascade,
  reviewer_id uuid not null default auth.uid() references auth.users on delete cascade,
  score smallint not null check (score between 1 and 5),
  primary key (contribution_id, reviewer_id)
);

alter table public.community_profiles enable row level security;
alter table public.community_contributions enable row level security;
alter table public.community_ratings enable row level security;
revoke all on public.community_profiles, public.community_contributions, public.community_ratings from anon, authenticated;
grant select (user_id, display_name, country, certified_at) on public.community_profiles to authenticated;
grant insert (display_name, country), update (display_name, country) on public.community_profiles to authenticated;
grant select (id, kind, country, title, body, state, created_at, published_at, review_note)
  on public.community_contributions to authenticated;
grant insert (kind, country, title, body), update (kind, country, title, body)
  on public.community_contributions to authenticated;
grant select (contribution_id, score) on public.community_ratings to authenticated;
grant insert (contribution_id, score), update (score) on public.community_ratings to authenticated;

create function public.community_is_admin() returns boolean
  language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from auth.users
    where id = auth.uid() and email_confirmed_at is not null
      and lower(email) = 'eduardorovito@gmail.com'
  )
$$;

create function public.community_has_verified_email() returns boolean
  language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from auth.users where id = auth.uid() and email_confirmed_at is not null
  )
$$;

revoke execute on function public.community_is_admin(), public.community_has_verified_email() from public, anon;
grant execute on function public.community_is_admin(), public.community_has_verified_email() to authenticated;
create policy "Own profile" on public.community_profiles for select to authenticated using (user_id = (select auth.uid()));
create policy "Create verified profile" on public.community_profiles for insert to authenticated
  with check (user_id = (select auth.uid()) and (select public.community_has_verified_email()));
create policy "Edit own profile" on public.community_profiles for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "Own contributions" on public.community_contributions for select to authenticated
  using (author_id = (select auth.uid()));
create policy "Create own draft" on public.community_contributions for insert to authenticated
  with check (author_id = (select auth.uid()) and state = 'borrador');
create policy "Edit own draft or returned contribution" on public.community_contributions for update to authenticated
  using (author_id = (select auth.uid()) and state in ('borrador','devuelto'))
  with check (author_id = (select auth.uid()) and state in ('borrador','devuelto'));
create policy "Read own ratings" on public.community_ratings for select to authenticated using (reviewer_id = (select auth.uid()));

create function public.community_can_rate(p_id uuid) returns boolean
  language sql stable security definer set search_path = ''
as $$
  select (select public.community_has_verified_email()) and exists (
    select 1 from public.community_contributions
    where id = p_id and state = 'publicado' and author_id <> auth.uid()
  )
$$;
revoke execute on function public.community_can_rate(uuid) from public, anon;
grant execute on function public.community_can_rate(uuid) to authenticated;
create policy "Rate another published contribution" on public.community_ratings for insert to authenticated
  with check (reviewer_id = (select auth.uid()) and public.community_can_rate(contribution_id));
create policy "Revise own rating" on public.community_ratings for update to authenticated
  using (reviewer_id = (select auth.uid()))
  with check (reviewer_id = (select auth.uid()) and public.community_can_rate(contribution_id));

create function public.community_catalog(p_country text default null, p_kind text default null, p_offset integer default 0)
returns table (id uuid, kind text, country text, title text, body text, author text, certified boolean,
               published_at timestamptz, average numeric, votes bigint)
language sql stable security definer set search_path = ''
as $$
  select c.id, c.kind, c.country, c.title, c.body, p.display_name, p.certified_at is not null,
         c.published_at, r.average, r.votes
  from public.community_contributions c
  join public.community_profiles p on p.user_id = c.author_id
  cross join lateral (
    select round(avg(score),1) as average, count(*) as votes from public.community_ratings where contribution_id = c.id
  ) r
  where c.state = 'publicado'
    and (p_country is null or c.country = p_country or c.country is null)
    and (p_kind is null or c.kind = p_kind)
  order by (p_country is not null and c.country is not null) desc, c.published_at desc, c.id desc
  limit 12 offset greatest(coalesce(p_offset, 0), 0)
$$;

create function public.community_submit(p_id uuid) returns void
language plpgsql security definer set search_path = ''
as $$
begin
  update public.community_contributions
    set state = 'revision', review_note = null
    where id = p_id and author_id = auth.uid() and state in ('borrador','devuelto');
  if not found then raise exception 'El aporte no se puede enviar' using errcode = '42501'; end if;
end;
$$;

create function public.community_admin_users(p_offset integer default 0)
returns table (id uuid, email text, display_name text, country text, certified_at timestamptz, confirmed_at timestamptz)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.community_is_admin() then raise exception 'Acceso restringido' using errcode = '42501'; end if;
  return query select u.id, u.email::text, p.display_name, p.country, p.certified_at, u.email_confirmed_at
    from auth.users u left join public.community_profiles p on p.user_id = u.id
    order by u.created_at desc, u.id desc limit 30 offset greatest(coalesce(p_offset,0),0);
end;
$$;

create function public.community_admin_certify(p_id uuid, p_certified boolean) returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.community_is_admin() then raise exception 'Acceso restringido' using errcode = '42501'; end if;
  update public.community_profiles p set certified_at = case when p_certified then now() else null end
    where p.user_id = p_id and exists (select 1 from auth.users u where u.id=p_id and u.email_confirmed_at is not null);
  if not found then raise exception 'El usuario necesita un perfil y un correo confirmado'; end if;
end;
$$;

create function public.community_admin_queue(p_offset integer default 0)
returns table (id uuid, title text, body text, kind text, country text, author text)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.community_is_admin() then raise exception 'Acceso restringido' using errcode = '42501'; end if;
  return query select c.id, c.title, c.body, c.kind, c.country, p.display_name
    from public.community_contributions c join public.community_profiles p on p.user_id = c.author_id
    where c.state = 'revision' order by c.created_at, c.id limit 30 offset greatest(coalesce(p_offset,0),0);
end;
$$;

create function public.community_admin_review(p_id uuid, p_publish boolean, p_note text default null) returns void
language plpgsql security definer set search_path = ''
as $$
begin
  if not public.community_is_admin() then raise exception 'Acceso restringido' using errcode = '42501'; end if;
  if p_publish is false and coalesce(char_length(btrim(p_note)),0) not between 2 and 500 then
    raise exception 'Escribe un motivo de 2 a 500 caracteres';
  end if;
  update public.community_contributions set state = case when p_publish then 'publicado' else 'devuelto' end,
    published_at = case when p_publish then now() else null end,
    review_note = case when p_publish then null else btrim(p_note) end
    where id = p_id and state = 'revision';
  if not found then raise exception 'Este aporte ya fue revisado'; end if;
end;
$$;

revoke execute on function public.community_catalog(text,text,integer), public.community_submit(uuid),
  public.community_admin_users(integer), public.community_admin_certify(uuid,boolean),
  public.community_admin_queue(integer), public.community_admin_review(uuid,boolean,text) from public, anon;
grant execute on function public.community_catalog(text,text,integer) to anon, authenticated;
grant execute on function public.community_submit(uuid), public.community_admin_users(integer),
  public.community_admin_certify(uuid,boolean), public.community_admin_queue(integer),
  public.community_admin_review(uuid,boolean,text) to authenticated;

alter table public.community_reports add column resolved_at timestamptz;
create index community_reports_pending on public.community_reports (created_at)
  where resolved_at is null;

create function public.community_admin_reports(p_offset integer default 0)
returns table (id uuid, title text, body text, author text)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not public.community_is_admin() then raise exception 'Acceso restringido' using errcode = '42501'; end if;
  return query select rep.id, coalesce(t.title, 'Respuesta en el foro'), coalesce(t.body, r.body),
      coalesce(t.display_name, r.display_name)
    from public.community_reports rep
    left join public.community_topics t on t.id = rep.topic_id
    left join public.community_replies r on r.id = rep.reply_id
    where rep.resolved_at is null
    order by rep.created_at, rep.id limit 30 offset greatest(coalesce(p_offset,0),0);
end;
$$;

create function public.community_admin_resolve(p_id uuid, p_hide boolean) returns void
language plpgsql security definer set search_path = ''
as $$
declare
  topic uuid;
  reply uuid;
begin
  if not public.community_is_admin() then raise exception 'Acceso restringido' using errcode = '42501'; end if;
  update public.community_reports set resolved_at = now()
    where id = p_id and resolved_at is null returning topic_id, reply_id into topic, reply;
  if not found then raise exception 'El reporte ya fue resuelto'; end if;
  if p_hide then
    if topic is not null then
      update public.community_topics set visible = false where id = topic;
    else
      update public.community_replies set visible = false where id = reply;
    end if;
  end if;
end;
$$;

revoke execute on function public.community_admin_reports(integer), public.community_admin_resolve(uuid, boolean) from public, anon;
grant execute on function public.community_admin_reports(integer), public.community_admin_resolve(uuid, boolean) to authenticated;

-- Los usuarios nuevos confirman el correo antes de participar en el foro.
alter policy "Create own topic" on public.community_topics
  with check (author_id = (select auth.uid()) and visible and (select public.community_has_verified_email()));
alter policy "Reply to visible topic" on public.community_replies
  with check (
    author_id = (select auth.uid()) and visible and (select public.community_has_verified_email())
    and exists (select 1 from public.community_topics where id = topic_id)
  );
