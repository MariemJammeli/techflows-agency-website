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

2. **Pick how emails are sent** and add the secrets in Supabase
   (Edge Functions → Secrets). `SITE_URL` (e.g. `https://your-site-domain`,
   no trailing slash) is always required.

   - **Gmail (no domain needed):** turn on 2-Step Verification for the Google
     account, create an app password at https://myaccount.google.com/apppasswords,
     then add `GMAIL_USER` (the Gmail address) and `GMAIL_APP_PASSWORD`.
     Gmail allows about 500 emails a day and some may land in spam.
   - **Resend (needs your own domain):** verify the domain at
     https://resend.com/domains, then add `RESEND_API_KEY` and `FROM_EMAIL`
     (e.g. `TechFlows TN <blog@your-domain.com>`).

   When both Gmail secrets are set, Gmail is used; otherwise Resend.

3. **Deploy the Edge Function:**
   `supabase functions deploy notify-subscribers --no-verify-jwt`

## How it behaves

- New subscribers get a bilingual (EN/FR) welcome email. People who
  unsubscribed and subscribe again get it too; submitting the form again
  while already subscribed sends nothing.

- An email goes out the first time a post has `is_published = true`
  (either inserted as published, or a draft switched to published).
- Editing a post afterwards never re-sends it (`blogs.notified_at` records
  when it was sent). To re-send a post, set its `notified_at` back to `null`,
  then switch `is_published` off and on again.
- French posts (`language = 'fr'`) get the email in French.
- See your subscribers in Table Editor → `newsletter_subscribers`;
  people who unsubscribed have `unsubscribed_at` set.
- Resend's free plan allows 3,000 emails per month and 100 per day; Gmail
  allows about 500 per day.
