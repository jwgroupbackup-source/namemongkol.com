# Weekly GSC Report Template (Wallpapers SEO)

## Auto-fill Helper (CSV -> Markdown)

Use this command to generate a weekly markdown summary from a GSC CSV export:

```bash
npm run gsc:weekly -- --input path/to/gsc-export.csv --output docs/reports/gsc-weekly-2026-05-10.md --period "2026-05-04 to 2026-05-10"
```

Notes:
- Required columns in CSV: `query`, `page`, `clicks`, `impressions`, `position` (header names can vary; script supports common aliases)
- If `--output` is omitted, the markdown report is printed to terminal

## Week Summary

- Report period:
- Compare window: last 7 days vs previous 7 days
- Analyst:
- Release changes included this week:

## Post-Deploy Checklist (Run within 24-48h)

- [ ] URL Inspection: `/wallpapers/custom` is indexed and canonical points to itself
- [ ] Rich Results Test: `FAQPage`, `HowTo`, `SoftwareApplication`, `BreadcrumbList` parse without critical errors
- [ ] Crawl sanity: no sudden rise in excluded or soft-404 for wallpaper routes
- [ ] SERP snippet check: title/description of `/wallpapers/custom` shown as intended
- [ ] Internal links check: day pages include crawlable link to `/wallpapers/custom`
- [ ] Sitemap check: `/wallpapers/custom` present in sitemap output

## KPI Snapshot

| Cohort | Clicks | Impressions | CTR | Avg Position | WoW Delta | Target Status |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| wallpapers-hub (`/wallpapers`) |  |  |  |  |  |  |
| wallpapers-day (`/wallpapers/day/*`) |  |  |  |  |  |  |
| wallpapers-zodiac (`/wallpapers/zodiac/*`) |  |  |  |  |  |  |
| wallpapers-intent (`/wallpapers/intent/*`) |  |  |  |  |  |  |
| wallpapers-custom (`/wallpapers/custom`) |  |  |  |  |  |  |

## Query Cohort Performance

| Query Cohort | Clicks | Impressions | CTR | Avg Position | WoW Delta |
| --- | ---: | ---: | ---: | ---: | --- |
| wallpapers-year (`วอลเปเปอร์สายมู*2569*`) |  |  |  |  |  |
| wallpapers-day (`วอลเปเปอร์*วัน...`) |  |  |  |  |  |
| wallpapers-finance (`วอลเปเปอร์*(การเงิน|โชค|ลาภ|เรียกทรัพย์)`) |  |  |  |  |  |
| wallpapers-love (`วอลเปเปอร์*(ความรัก|เสน่ห์|เมตตา)`) |  |  |  |  |  |
| wallpapers-work (`วอลเปเปอร์*(การงาน|บารมี|เลื่อนตำแหน่ง)`) |  |  |  |  |  |
| wallpapers-custom-core (`สร้างวอลเปเปอร์มงคล|วอลเปเปอร์มงคลส่วนตัว`) |  |  |  |  |  |

## Target Check Against Plan

- `wallpapers-day` impressions: target +20% in 14 days -> status:
- `wallpapers-intent` clicks: target >= 15 clicks/page in 14 days -> status:
- wallpaper cohort avg position: target +0.8 improvement -> status:
- wallpaper cohort CTR: target +0.7% absolute -> status:

## Top Winners (This Week)

1. Query:
- URL:
- Why it won:
- Action to scale:

2. Query:
- URL:
- Why it won:
- Action to scale:

3. Query:
- URL:
- Why it won:
- Action to scale:

## Underperformers (Need Fix)

1. URL:
- Problem signal (low CTR / stagnant position / low impressions):
- Likely cause:
- Fix this week:

2. URL:
- Problem signal:
- Likely cause:
- Fix this week:

## Cannibalization Watch (Name Cluster)

- Shared queries detected between `/`, `/search`, `/premium-search`, `/name-analysis`:
- Overlap trend vs last week:
- Mitigation applied:

## Next Week Action Plan

1. Metadata updates:
2. Internal linking updates:
3. New supporting content:
4. Technical SEO checks:

## Notes and Attachments

- GSC export link:
- Looker/Data Studio link:
- Additional notes:

## Mock Example (Filled Sample)

Use this section as a reference format for the first week after release.

### Week Summary (Example)

- Report period: 2026-05-04 to 2026-05-10
- Compare window: last 7 days vs previous 7 days
- Analyst: SEO Team
- Release changes included this week: Custom landing content + JSON-LD (`HowTo/FAQ/SoftwareApplication`) + internal links from day/zodiac/intent routes

### KPI Snapshot (Example)

| Cohort | Clicks | Impressions | CTR | Avg Position | WoW Delta | Target Status |
| --- | ---: | ---: | ---: | ---: | --- | --- |
| wallpapers-hub (`/wallpapers`) | 188 | 8,420 | 2.23% | 12.4 | +0.2 pos | on-track |
| wallpapers-day (`/wallpapers/day/*`) | 142 | 6,180 | 2.30% | 13.1 | +0.6 pos | on-track |
| wallpapers-zodiac (`/wallpapers/zodiac/*`) | 67 | 2,940 | 2.28% | 14.9 | +0.4 pos | monitor |
| wallpapers-intent (`/wallpapers/intent/*`) | 59 | 1,860 | 3.17% | 11.8 | +0.5 pos | on-track |
| wallpapers-custom (`/wallpapers/custom`) | 23 | 780 | 2.95% | 16.7 | new page lift | on-track |

### Query Cohort Performance (Example)

| Query Cohort | Clicks | Impressions | CTR | Avg Position | WoW Delta |
| --- | ---: | ---: | ---: | ---: | --- |
| wallpapers-year (`วอลเปเปอร์สายมู*2569*`) | 71 | 2,540 | 2.80% | 12.6 | +0.3 pos |
| wallpapers-day (`วอลเปเปอร์*วัน...`) | 94 | 3,980 | 2.36% | 13.0 | +0.5 pos |
| wallpapers-finance (`วอลเปเปอร์*(การเงิน|โชค|ลาภ|เรียกทรัพย์)`) | 35 | 1,050 | 3.33% | 11.2 | +0.6 pos |
| wallpapers-love (`วอลเปเปอร์*(ความรัก|เสน่ห์|เมตตา)`) | 27 | 870 | 3.10% | 11.9 | +0.4 pos |
| wallpapers-work (`วอลเปเปอร์*(การงาน|บารมี|เลื่อนตำแหน่ง)`) | 31 | 910 | 3.41% | 11.4 | +0.5 pos |
| wallpapers-custom-core (`สร้างวอลเปเปอร์มงคล|วอลเปเปอร์มงคลส่วนตัว`) | 19 | 520 | 3.65% | 15.8 | +1.1 pos |

### Decision Example

- Observation: impressions of `/wallpapers/custom` increased, but CTR still below intent pages.
- Action: test a tighter title with stronger benefit phrase and update opening paragraph to match top winning query language.
- Internal link follow-up: add 1 contextual link from `/wallpapers/zodiac/[sign]` pages with varied anchor text.
