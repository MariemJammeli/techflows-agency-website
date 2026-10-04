# Newsletter setup (new-post emails)

Visitors subscribe from the "Never Miss An Article" form on the blogs page.
Each time a blog post is published, every active subscriber gets an email
with the title, summary, a link to the article and an unsubscribe link.

## One-time setup

1. **Run the migrations** in the Supabase SQL editor, in order:
   - `supabase/migrations/20261004000000_add_language_to_blogs.sql`
   - `supabase/migrations/20261004010000_newsletter_subscriptions.sql`

   The second one creates the `newsletter_subscribers` table and marks every
   article that is already live as "sent", so nobody gets emails for old posts.

2. **Create a Resend account** at https://resend.com, add and verify your
   domain (Domains → Add domain, then add the DNS records it shows), and
   create an API key (API Keys → Create).

3. **Deploy the Edge Function** with the Supabase CLI:

   ```sh
   supabase login
   supabase link --project-ref llsixhavjyzsrtgmusjj
   supabase secrets set \
     RESEND_API_KEY=re_xxx \
     FROM_EMAIL="TechFlows TN <blog@your-domain.com>" \
     SITE_URL=https://your-site-domain \
     WEBHOOK_SECRET=<any long random string>
   supabase functions deploy notify-subscribers --no-verify-jwt
   ```

4. **Create the Database Webhook** in the Supabase dashboard
   (Database → Webhooks → Create a new hook):
   - Table: `blogs`, events: **Insert** and **Update**
   - Type: Supabase Edge Functions → `notify-subscribers`, method POST
   - HTTP header: `x-webhook-secret` = the same `WEBHOOK_SECRET` as above

## How it behaves

- An email goes out the first time a post has `is_published = true`
  (either inserted as published, or a draft switched to published).
- Editing a post afterwards never re-sends it (`blogs.notified_at` records
  when it was sent). To re-send a post, set its `notified_at` back to `null`
  and save it again.
- French posts (`language = 'fr'`) get the email in French.
- See your subscribers in Table Editor → `newsletter_subscribers`;
  people who unsubscribed have `unsubscribed_at` set.
- Resend's free plan allows 3,000 emails per month and 100 per day.
