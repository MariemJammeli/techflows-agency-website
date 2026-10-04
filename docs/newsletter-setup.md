# Newsletter setup (new-post emails)

Visitors subscribe from the "Never Miss An Article" form on the blogs page.
Each time a blog post is published, every active subscriber gets an email
with the title, summary, a link to the article and an unsubscribe link.

## One-time setup

1. **Run the migrations** in `supabase/migrations/` in order (Supabase SQL
   editor or `supabase db push`). Besides the subscribers table, they add a
   `notify_subscribers_on_publish` trigger on `blogs` that calls the Edge
   Function. The trigger and the function share a secret kept in Supabase
   Vault, so there is no webhook to configure by hand. Every article already
   live is marked as "sent", so nobody gets emails for old posts.

2. **Create a Resend account** at https://resend.com, add and verify your
   domain (Domains → Add domain, then add the DNS records it shows), and
   create an API key (API Keys → Create).

3. **Deploy the Edge Function and set its secrets** (Edge Functions → Secrets
   in the dashboard, or the CLI):

   ```sh
   supabase secrets set \
     RESEND_API_KEY=re_xxx \
     FROM_EMAIL="TechFlows TN <blog@your-domain.com>" \
     SITE_URL=https://your-site-domain
   supabase functions deploy notify-subscribers --no-verify-jwt
   ```

## How it behaves

- An email goes out the first time a post has `is_published = true`
  (either inserted as published, or a draft switched to published).
- Editing a post afterwards never re-sends it (`blogs.notified_at` records
  when it was sent). To re-send a post, set its `notified_at` back to `null`,
  then switch `is_published` off and on again.
- French posts (`language = 'fr'`) get the email in French.
- See your subscribers in Table Editor → `newsletter_subscribers`;
  people who unsubscribed have `unsubscribed_at` set.
- Resend's free plan allows 3,000 emails per month and 100 per day.
