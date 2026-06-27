# SEO Implementation — Configuration & Submission Guide

## What Was Implemented

### 1. Dynamic `sitemap.xml`
- **Route**: `https://bialoczerwoni.live/sitemap.xml`
- **File**: `src/app/sitemap.ts`
- Covers all `[locale]` static routes (pl + en) with `priority`, `changeFrequency`, and `hreflang` alternates
- Dynamically fetches up to 200 article slugs from the CMS and generates `/[locale]/wiadomosc/[slug]` entries
- Revalidates with ISR (sitemap regenerates on demand)

### 2. `robots.txt`
- **Route**: `https://bialoczerwoni.live/robots.txt`
- **File**: `src/app/robots.ts`
- Allows all bots on all routes except `/api/`, `/_next/`, `/admin/`
- Blocks AI training crawlers: `GPTBot`, `CCBot`, `anthropic-ai`
- Points to sitemap URL

### 3. Canonical URLs + hreflang alternates
- **File**: `src/lib/metadata.ts` — `getPageMetadata()` now returns full `alternates` block
- Every `page.tsx` now exports `generateMetadata()` pulling locale-aware canonical + OG
- `wiadomosc/[slug]/page.tsx` — canonical + `pl`/`en` alternates on every article

### 4. Layout-level verification meta
- **File**: `src/app/[locale]/layout.tsx` — exports `metadata` object with:
  - `metadataBase` (used by Next.js to resolve relative URLs)
  - `robots: { index: true, follow: true, googleBot: ... }`
  - `verification.google` — reads `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` from env
  - `verification.other["msvalidate.01"]` — reads `NEXT_PUBLIC_BING_SITE_VERIFICATION` from env

### 5. JSON-LD Structured Data
- **File**: `src/components/seo/JsonLd.tsx`
- `HomeJsonLd` — `WebSite` + `SportsEvent` (FIFA WC 2026) + `BreadcrumbList` on the home page
- `ArticleJsonLd` — `NewsArticle` schema on every `wiadomosc/[slug]` article page

---

## Environment Variables to Set

Add these to `.env.local` (and your production env):

```env
NEXT_PUBLIC_SITE_URL=https://bialoczerwoni.live
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<your-google-token-here>
NEXT_PUBLIC_BING_SITE_VERIFICATION=<your-bing-token-here>
```

---

## Google Search Console — Submission Steps

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add property → **URL Prefix** → enter `https://bialoczerwoni.live`
3. Choose **HTML tag** verification method → copy the `content` value (looks like `abc123xyz`)
4. Paste it as `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=abc123xyz` in your env
5. Redeploy → click **Verify** in GSC
6. Go to **Sitemaps** → submit `https://bialoczerwoni.live/sitemap.xml`
7. Check **Coverage** report after 24–48 hours

---

## Bing Webmaster Tools — Submission Steps

1. Go to [bing.com/webmasters](https://www.bing.com/webmasters)
2. Add site → enter `https://bialoczerwoni.live`
3. Choose **Meta tag** verification → copy the `content` value
4. Paste it as `NEXT_PUBLIC_BING_SITE_VERIFICATION=<value>` in your env
5. Redeploy → click **Verify** in Bing Webmaster
6. Go to **Sitemaps** → submit `https://bialoczerwoni.live/sitemap.xml`
7. Optionally use **URL Inspection** to force-crawl key pages

---

## Post-Deployment Verification Checklist

### Sitemap & Robots
- [ ] `curl https://bialoczerwoni.live/sitemap.xml` — returns valid XML with entries
- [ ] `curl https://bialoczerwoni.live/robots.txt` — shows `Sitemap:` line and correct disallow rules
- [ ] Paste sitemap URL into [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)

### Metadata
- [ ] View source of `https://bialoczerwoni.live/pl` — check `<title>`, `<meta name="description">`, `<link rel="canonical">`
- [ ] Paste any page into [Open Graph Debugger](https://developers.facebook.com/tools/debug/) — check OG tags
- [ ] Paste any page into [Twitter Card Validator](https://cards-dev.twitter.com/validator)
- [ ] Check `hreflang` alternates: `<link rel="alternate" hreflang="pl">` and `hreflang="en"` present on every page

### JSON-LD
- [ ] Paste home page URL into [Google Rich Results Test](https://search.google.com/test/rich-results) — should show `WebSite` + `SportsEvent`
- [ ] Paste an article URL into Rich Results Test — should show `NewsArticle`
- [ ] Validate any page at [Schema.org Validator](https://validator.schema.org/)

### Google Search Console
- [ ] Verify ownership confirmed
- [ ] Sitemap submitted and status = "Success"
- [ ] Coverage report shows 0 errors (check after 48h)
- [ ] Use **URL Inspection** → request indexing for:
  - `https://bialoczerwoni.live/pl`
  - `https://bialoczerwoni.live/pl/ms-2026`
  - `https://bialoczerwoni.live/pl/news`

### Bing Webmaster
- [ ] Verify ownership confirmed
- [ ] Sitemap submitted
- [ ] Run **Site Scan** — fix any issues reported

### Technical SEO (Core Web Vitals)
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev/) on `https://bialoczerwoni.live/pl`
  - Target: LCP < 2.5s, CLS < 0.1, INP < 200ms
- [ ] Check no `noindex` meta on live pages
- [ ] Check no `X-Robots-Tag: noindex` in response headers
- [ ] Confirm `<html lang="pl">` / `<html lang="en">` is correct per locale

### Crawl / Coverage Issue Resolution
If GSC reports "Excluded" or "Crawled - currently not indexed":
1. Check the specific URL with **URL Inspection** → if valid, click **Request Indexing**
2. If "Alternate page with proper canonical tag" — canonical is pointing elsewhere (check `alternates.canonical` in metadata)
3. If "Blocked by robots.txt" — re-check `robots.ts` disallow patterns
4. If "Redirect error" — check that `src/app/page.tsx` redirect to `/pl` is a 307/308, not a soft redirect

---

## Ongoing SEO Maintenance

| Frequency | Task |
|-----------|------|
| Daily | Check GSC Coverage for new errors |
| Weekly | Submit new article slugs to GSC via URL Inspection (or rely on sitemap crawl) |
| Monthly | Review Core Web Vitals in GSC → Performance report |
| Per deploy | Run Rich Results Test on home + 1 article to catch regressions |
