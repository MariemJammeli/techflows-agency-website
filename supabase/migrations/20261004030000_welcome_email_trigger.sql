-- Sends a welcome email when someone subscribes, or subscribes again after
-- unsubscribing. Re-submitting the form while already subscribed sends nothing.
-- Reuses public.notify_subscribers_on_publish(), which posts the changed row
-- and its table name to the notify-subscribers Edge Function.

drop trigger if exists send_welcome_email_on_insert on public.newsletter_subscribers;
create trigger send_welcome_email_on_insert
  after insert on public.newsletter_subscribers
  for each row
  when (new.unsubscribed_at is null)
  execute function public.notify_subscribers_on_publish();

drop trigger if exists send_welcome_email_on_resubscribe on public.newsletter_subscribers;
create trigger send_welcome_email_on_resubscribe
  after update of unsubscribed_at on public.newsletter_subscribers
  for each row
  when (old.unsubscribed_at is not null and new.unsubscribed_at is null)
  execute function public.notify_subscribers_on_publish();
