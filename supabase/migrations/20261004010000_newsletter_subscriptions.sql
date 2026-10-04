-- Newsletter subscriptions: visitors subscribe from the blogs page and get an
-- email each time a new article is published (sent by the notify-subscribers
-- Edge Function, see supabase/functions/notify-subscribers).

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique check (email = lower(email)),
  unsubscribe_token uuid not null unique default gen_random_uuid(),
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz
);

-- Subscribers are private: no direct table access from the browser.
-- The site only goes through the two functions below.
alter table public.newsletter_subscribers enable row level security;
revoke all on public.newsletter_subscribers from anon, authenticated;

create or replace function public.subscribe_to_newsletter(p_email text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text := lower(trim(p_email));
begin
  if v_email is null
     or length(v_email) > 254
     or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Invalid email address' using errcode = '22023';
  end if;

  insert into public.newsletter_subscribers (email)
  values (v_email)
  on conflict (email) do update
    set unsubscribed_at = null,
        subscribed_at = case
          when newsletter_subscribers.unsubscribed_at is null then newsletter_subscribers.subscribed_at
          else now()
        end;
end;
$$;

create or replace function public.unsubscribe_from_newsletter(p_token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.newsletter_subscribers
     set unsubscribed_at = coalesce(unsubscribed_at, now())
   where unsubscribe_token = p_token;
  return found;
end;
$$;

revoke all on function public.subscribe_to_newsletter(text) from public;
revoke all on function public.unsubscribe_from_newsletter(uuid) from public;
grant execute on function public.subscribe_to_newsletter(text) to anon, authenticated;
grant execute on function public.unsubscribe_from_newsletter(uuid) to anon, authenticated;

-- Tracks which articles have already been emailed, so editing a post never
-- re-sends it. Articles already live are marked as sent.
alter table public.blogs
  add column if not exists notified_at timestamptz;

update public.blogs
   set notified_at = coalesce(published_at, now())
 where is_published and notified_at is null;
