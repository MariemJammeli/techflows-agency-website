-- Add a language column to blogs so the blogs page can filter FR / EN articles.
-- Existing articles are all written in English, so they default to 'en'.

alter table public.blogs
  add column if not exists language text not null default 'en';

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'blogs_language_check'
  ) then
    alter table public.blogs
      add constraint blogs_language_check check (language in ('en', 'fr'));
  end if;
end $$;

create index if not exists blogs_language_published_at_idx
  on public.blogs (language, published_at desc)
  where is_published;
