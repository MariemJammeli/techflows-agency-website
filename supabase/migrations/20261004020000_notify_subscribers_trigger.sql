-- Calls the notify-subscribers Edge Function when a blog post is published.
-- The shared secret is generated here and kept in Supabase Vault: the trigger
-- sends it, and the function checks it through get_notify_webhook_secret(),
-- so nobody has to copy it around.

create extension if not exists pg_net with schema extensions;

do $$
begin
  if not exists (
    select 1 from vault.secrets where name = 'notify_subscribers_webhook_secret'
  ) then
    perform vault.create_secret(
      replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
      'notify_subscribers_webhook_secret',
      'Shared secret between the blogs publish trigger and the notify-subscribers Edge Function'
    );
  end if;
end $$;

create or replace function public.get_notify_webhook_secret()
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select decrypted_secret
    from vault.decrypted_secrets
   where name = 'notify_subscribers_webhook_secret'
   limit 1;
$$;

revoke all on function public.get_notify_webhook_secret() from public, anon, authenticated;
grant execute on function public.get_notify_webhook_secret() to service_role;

create or replace function public.notify_subscribers_on_publish()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  perform net.http_post(
    url := 'https://llsixhavjyzsrtgmusjj.supabase.co/functions/v1/notify-subscribers',
    body := jsonb_build_object(
      'type', tg_op,
      'table', tg_table_name,
      'record', to_jsonb(new)
    ),
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'x-webhook-secret', public.get_notify_webhook_secret()
    ),
    timeout_milliseconds := 30000
  );
  return new;
end;
$$;

revoke all on function public.notify_subscribers_on_publish() from public, anon, authenticated;

-- Fires when a post is created as published, or when is_published is set on a
-- draft. The Edge Function only updates notified_at, which never re-fires this.
drop trigger if exists notify_subscribers_on_publish on public.blogs;
create trigger notify_subscribers_on_publish
  after insert or update of is_published on public.blogs
  for each row
  when (new.is_published and new.notified_at is null)
  execute function public.notify_subscribers_on_publish();
