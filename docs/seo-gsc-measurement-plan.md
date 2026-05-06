# GSC Measurement Plan (Wallpapers SEO)

## Objective

Track SEO impact after the wallpaper intent updates and reduce keyword cannibalization across name-related pages.

## Compare Window

- Primary comparison: last 7 days vs previous 7 days
- Validation comparison: last 28 days vs previous 28 days

## URL Cohorts

- `wallpapers-hub`: `/wallpapers`
- `wallpapers-day`: `/wallpapers/day/*`
- `wallpapers-zodiac`: `/wallpapers/zodiac/*`
- `wallpapers-intent`: `/wallpapers/intent/finance|love|work`
- `name-home`: `/`
- `name-search-free`: `/search`
- `name-search-pro`: `/premium-search`
- `name-bulk-analysis`: `/name-analysis`

## Query Cohorts

- `wallpapers-year`: `วอลเปเปอร์สายมู*2569*`
- `wallpapers-day`: `วอลเปเปอร์*วัน(จันทร์|อังคาร|พุธ|พฤหัส|ศุกร์|เสาร์|อาทิตย์)`
- `wallpapers-finance`: `วอลเปเปอร์*(การเงิน|โชค|ลาภ|เรียกทรัพย์)`
- `wallpapers-love`: `วอลเปเปอร์*(ความรัก|เสน่ห์|เมตตา)`
- `wallpapers-work`: `วอลเปเปอร์*(การงาน|บารมี|เลื่อนตำแหน่ง)`
- `name-analysis-core`: `วิเคราะห์ชื่อ*`
- `name-search-free`: `ค้นหาชื่อมงคลฟรี*`
- `name-search-pro`: `ค้นหาชื่อมงคล pro*`
- `name-bulk`: `(เช็คชื่อมงคลหลายชื่อ|bulk name analysis)*`

## KPI Thresholds (Quick Win Targets)

- `wallpapers-day` impressions: +20% within 14 days
- `wallpapers-intent` clicks: >= 15 clicks/page within 14 days
- wallpaper cohort average position: improve by 0.8+
- wallpaper cohort CTR: +0.7% absolute
- reduce shared-query overlap between `/`, `/search`, `/premium-search`, `/name-analysis` by at least 15%

## Reporting Cadence

- Daily: monitor crawl/indexing anomalies and major ranking drops
- Weekly: report click/impression/CTR/position by cohort
- Bi-weekly: identify winning queries and expand new long-tail pages

## Decision Rules

- If impressions rise but CTR drops: rewrite title/description for affected pages.
- If CTR rises but position stagnates: add stronger internal links from `/wallpapers` and update supporting content blocks.
- If overlap persists in name cluster: tighten metadata language and on-page H1 copy by route intent.
