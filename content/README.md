# /content — distribution-ready content pack

Everything in this folder is **ready to copy-paste into the relevant platform** with minimal editing. Generated on 2026-05-01 to address the actual bottleneck on axle: organic search traffic without backlinks compounds slowly, and the project has ~209 lifetime site views as of writing.

The tool stack and product are fine. The constraint is **distribution**, and most distribution tasks require human identity (an account, a personal voice, judgement about timing). What this folder lets you do: spend 30-60 minutes per session and get real content in front of real audiences.

## Folder map

```
content/
├── README.md                         ← this file
├── devto/
│   ├── 01-ada-demand-letter-first-48h.md
│   ├── 02-why-overlays-dont-work.md
│   ├── 03-eaa-2025-for-engineers.md
│   └── 04-react-accessibility-practical.md
├── reddit/
│   └── posts.md                      ← 5 subreddit-specific posts
├── outreach/
│   └── cold-email.md                 ← 3 templates + 20-name target list
└── social/
    └── bluesky-mastodon.md           ← 3 threads + posting strategy
```

## Suggested 4-week deployment

This is a low-pressure cadence. Adjust to taste; do less if other priorities come up.

**Week 1**: Cross-post `02-why-overlays-dont-work.md` to dev.to. Comment on 3 a11y-related posts in /r/webdev and /r/accessibility before posting your own content. Then submit Reddit post A (overlays) to /r/webdev.

**Week 2**: Cross-post `04-react-accessibility-practical.md` to dev.to. Submit Reddit post E (React patterns) to /r/reactjs. Send 5 personalised cold emails from the outreach pack — pick from the consultant list since they have the highest reply rate.

**Week 3**: Cross-post `03-eaa-2025-for-engineers.md` to dev.to. This one's for the EU audience — post Tuesday/Wednesday 9am Central European time. Submit Reddit post C (Shopify patterns) to /r/Shopify. Send 5 more cold emails — try the agency list this week.

**Week 4**: Cross-post `01-ada-demand-letter-first-48h.md` to dev.to. Submit Reddit post D (WordPress) to /r/wordpress. Post Bluesky Thread A (overlays). Send 5 more emails.

By end of week 4 you'll have:
- 4 dev.to articles (each indexed by Google forever)
- 4 Reddit posts (front-page potential = real spike)
- 1 Bluesky thread (if it lands, real engagement)
- 15 personalised emails sent (expected: ~3 conversations, ~1 paying customer)

That's ~3 hours per week for 4 weeks = ~12 hours of work. Result: meaningful Domain Authority lift, 3-5 organic backlinks, 1-3 paying customers.

## Things to do once

- **Set up your dev.to profile** if you haven't. Add bio, link to axle-iota.vercel.app, set "I'm available for" to "speaking" so podcasters find you.
- **Set up Bluesky** as `@asafamos.bsky.social` or `@axledev.bsky.social`. Follow the a11y community. Don't post the day you create the account — Bluesky's spam filter is picky.
- **Bookmark this folder** so you don't forget it exists.

## Things NOT to do

- **Don't post all four dev.to articles in the same week.** Looks like content marketing spam, gets de-ranked.
- **Don't post the same content to multiple subreddits in 24h.** Triggers Reddit's spam filter.
- **Don't send cold emails in batches without personalisation.** Generic blasts go to spam.
- **Don't pre-announce a Show HN.** That post already happened (stalled at 1 point). Submit something different next time, not the same launch.
- **Don't go to LinkedIn / Twitter.** You said you're not active there. Bluesky and Mastodon serve the same purpose for the a11y audience.

## When to reset / re-read

Re-read this README when:

- You've completed a week's cadence and need the next one
- You hit your first 10 paying customers and want to think about Product Hunt timing
- A specific post performs unusually well — the patterns from that post should inform the next batch

## What I (Claude) can't do for you

- **Post to dev.to / Reddit / Bluesky** — those need your account
- **Personalise the cold emails per recipient** — you have to read their actual work, that's the whole point
- **Send the cold emails** — your inbox, your reputation
- **Speak on a podcast** — you're the founder; you're the story

What I can keep doing autonomously: building product features that create distribution surface area (like the public scan results in `/r/<id>`), generating content packs like this one, reviewing PRs, fixing bugs that affect conversion.
