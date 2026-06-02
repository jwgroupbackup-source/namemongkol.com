# SEO/AEO Audit: `/articles` และบทความทั้งหมด

วันที่ตรวจ: 2026-06-02  
ขอบเขต: `/articles`, local article data 50 slugs, local rendered routes, live `/articles`, และ route-level robots/sitemap  
ข้อจำกัด: ไม่มี Google Search Console/Analytics จึงจัดลำดับจาก best practice, crawl/index risk, content quality, internal linking, schema และโอกาส AI search

## Implementation Status - 2026-06-02

Implemented in this follow-up:

- Added missing `metaTitle` and `metaDescription` for `namemongkol-number-pairs`, `what-is-name-analysis`, and `lucky-names-for-2026-grade-a-plus`.
- Fixed broken `relatedSlugs` on `namemongkol-number-pairs` and added a manual pillar-cluster `relatedSlugs` set for `what-is-name-analysis`.
- Updated article sitemap freshness to use `dateModified || date` for both local and DB articles.
- Updated `/articles` ItemList schema to use `dateModified || date`.
- Added DB-to-local fallback for article detail/list data so empty DB fields do not suppress curated local `metaTitle`, `metaDescription`, `toc`, `faqItems`, `relatedSlugs`, and `dateModified`.
- Added automatic TOC fallback from visible `h2`/`h3` headings for article detail pages.
- Added visible FAQ fallback and matching `FAQPage` JSON-LD for article detail pages that do not have curated `faqItems`.
- Added Article schema `isAccessibleForFree`, `about`, `mentions`, and `speakable` fields, aligned with visible content and NameMongkol tool links.
- Brought the dedicated `/articles/lucky-names-by-birthday-2569` route up to the same AEO baseline with a visible direct-answer block and Article schema `isAccessibleForFree`, `about`, `mentions`, and `speakable`.

Validation after implementation:

- Local inventory: 50 article slugs, 0 broken `relatedSlugs`, 0 missing local meta, 0 missing local `relatedSlugs`.
- `npm run lint`: passed with 0 errors; existing warnings remain.
- `npm run build`: passed; static generation completed 136/136 pages.
- Production route checks on `localhost:3001`: `/articles`, `/articles/what-is-name-analysis`, `/articles/namemongkol-number-pairs`, `/articles/lucky-names-by-birthday-2569`, and `/sitemap.xml` returned 200 and included FAQ/speakable/direct-answer signals where expected.

## Executive Summary

สถานะรวม: โครงสร้าง SEO พื้นฐานค่อนข้างดีแล้ว แต่ยังมีช่องว่างด้าน AEO/GEO และ topical authority ที่ควรเก็บเป็นรอบปรับปรุงถัดไป

Top 5 issues/opportunities:

1. **High: บทความบางหน้า thin หรือ content source ตรวจวัดไม่ได้**  
   8 slugs มี content น้อยกว่า 1,500 characters จาก static inventory โดยเฉพาะ `700-auspicious-names-by-birthday-2569` ได้ 0 chars ในตัว parser เพราะ content อาจถูก compose จาก structure/arrays ไม่ใช่ template string ปกติ ต้องตรวจ rendered content และทำ direct-answer section เพิ่ม

2. **High: meta title/description ขาด 3 หน้า**  
   `namemongkol-number-pairs`, `what-is-name-analysis`, `lucky-names-for-2026-grade-a-plus` ยัง fallback ไป title/excerpt ทำให้ SERP copy และ target query ไม่คมพอ

3. **High: internal related link broken risk 1 หน้า**  
   `namemongkol-number-pairs` มี `relatedSlugs` เป็น `article-lucky-numbers-2569`, `article-thaksa-guide` ซึ่งไม่ใช่ canonical slugs ใน inventory

4. **Medium: AEO blocks ยังไม่สม่ำเสมอ**  
   24/50 ขาด TOC, 30/50 ขาด FAQ data, และ local rendered check พบ FAQPage signal เฉพาะ 6/50 หน้า แม้ article template มี FAQ rendering เมื่อมี `faqItems`

5. **Medium: contextual tool links ยังไม่สม่ำเสมอ**  
   21/50 ไม่มี explicit link ไป `/name-check` หรือ `/name-analysis` ใน content body แม้ template มี CTA ท้ายบทความแล้ว ควรเพิ่ม contextual link ในย่อหน้าที่ตรง intent เพื่อกระจาย internal relevance ดีกว่า CTA ท้ายหน้าอย่างเดียว

## Validation Notes

- Local rendered checks: 50/50 article slugs ตอบ `200`, canonical ครบทุกหน้า, breadcrumb signal ครบทุกหน้า
- Local `/articles`: `200`, มี structured data ในหน้า
- Local `/robots.txt`: `200`, มี `Sitemap:` directive
- Local `/sitemap.xml`: `200`, มี `/articles/` 58 URLs และใช้ canonical host `https://www.namemongkol.com`
- Live `/articles`: crawler เห็น H1, intro, topic clusters, และรายการบทความจำนวนมากแล้ว
- Live robots/sitemap fetch จาก shell ใน environment นี้ต่อออกไม่ได้ แต่ source route และ local route ตรวจผ่าน ควร verify ซ้ำใน Google Search Console Robots report และ Sitemap report

อ้างอิงมาตรฐาน:

- Google ระบุว่า AI features ยังใช้ SEO fundamentals เดิม เช่น crawlability, internal links, textual content, page experience, และ structured data ที่ตรงกับ visible text
- Article structured data ควรมี author, datePublished/dateModified, concise headline, image ที่ crawl/index ได้ และ representative ต่อเนื้อหา
- Helpful content ควรแสดง original information, comprehensive description, first-hand expertise และทำเพื่อผู้ใช้ ไม่ใช่เพื่อ manipulate rankings
- Sitemap `lastmod` ควรเปลี่ยนเมื่อ main content, structured data, หรือ links เปลี่ยนอย่างมีนัยสำคัญ

Sources:

- https://developers.google.com/search/docs/appearance/ai-overviews
- https://developers.google.com/search/docs/appearance/structured-data/article
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/blog/2023/06/sitemaps-lastmod-ping
- https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data

## Technical Findings

| Priority | Finding | Evidence | Recommendation |
| --- | --- | --- | --- |
| High | Missing meta on 3 pages | Static inventory found no `metaTitle`/`metaDescription` on `namemongkol-number-pairs`, `what-is-name-analysis`, `lucky-names-for-2026-grade-a-plus` | Add query-led meta title 50-60 chars and description 140-165 chars. Use one target query per page. |
| High | Broken related slugs | `namemongkol-number-pairs` links to `article-lucky-numbers-2569`, `article-thaksa-guide` | Replace with canonical slugs: likely `lucky-numbers-2569-guide`, `thaksa-pakorn-naming-guide`, plus `micro-analysis-lucky-number-pairs`. |
| Medium | Sitemap freshness signal can be sharper | `src/app/sitemap.ts` maps local article `lastModified` from `article.date`, not `article.dateModified` | Use `article.dateModified || article.date` for local article URLs. Keep `lastmod` meaningful only for real content/schema/link changes. |
| Medium | FAQPage not broadly emitted | 30/50 local articles have no `faqItems`; local rendered check saw FAQPage signal only 6/50 | Add 3-5 visible FAQs to high-priority pages first. Keep JSON-LD in sync with visible FAQ. |
| Medium | TOC missing on many pages | 24/50 have no `toc` data | Add TOC to long guides and definition pages. TOC headings should mirror actual H2 IDs. |
| Low | Article schema detector ambiguity in dev output | Source template includes Article JSON-LD; dev HTML contains `@type` and `Article`, but script id parsing is not stable in Turbopack dev output | Validate production pages with Rich Results Test / Schema Markup Validator after deployment. |

## Article Inventory

Legend:

- `High`: can affect crawl quality, SERP targeting, or content eligibility now
- `Medium`: strong AEO/internal-link improvement
- `Low`: healthy, only normal refresh needed

| Priority | Slug | Intent | Evidence | Recommended fix |
| --- | --- | --- | --- | --- |
| High | `700-auspicious-names-by-birthday-2569` | Name list / birthday | rendered 200, static chars 0, has TOC/FAQ, no contextual tool link | Verify rendered body source, add short direct answer near top, add contextual `/name-check` and `/name-analysis` links. |
| Medium | `auspicious-boy-names-2569` | Boy names broad | 19,455 chars, TOC/FAQ, no contextual tool link | Add in-body links to `/premium-search` and `/name-check`; clarify this is broad 400-name inspiration page. |
| Low | `boy-names-2569-50-auspicious` | Boy names curated | 3,225 chars, TOC/FAQ, bulk link | Keep as curated shortlist; refresh examples yearly. |
| Low | `change-auspicious-name-checklist-numerology-thaksa-ayatana-surname` | Change name checklist | 2,728 chars, TOC/FAQ, `/name-check` link | Add HowTo schema only if steps are visible and stable. |
| Low | `free-name-analysis-numerology-guide` | Tool education | 2,335 chars, TOC/FAQ, `/name-check` link | Keep aligned with `/name-check` UI and update screenshots/copy after tool changes. |
| Low | `girl-names-2569-auspicious-modern` | Girl names broad | 25,667 chars, TOC/FAQ, `/name-check` link | Strong page; add comparison block to distinguish from 50-name and 100-name pages. |
| Low | `girl-names-2569-50-auspicious` | Girl names curated | 3,014 chars, TOC/FAQ, bulk link | Add short “who this list is for” answer block. |
| Low | `baby-naming-guide-2569` | Baby naming guide | 5,459 chars, TOC/FAQ, bulk link | Keep as beginner pillar; link to gender/day cluster pages. |
| Medium | `lucky-phone-numbers-guide-2569` | Phone numbers | 4,192 chars, TOC/FAQ, no tool link | Add contextual `/phone-analysis` CTA inside first third of article. |
| Medium | `monday-girl-names-2569-no-sara` | Day-specific girl names | 18,491 chars, TOC/FAQ, no tool link | Add contextual `/name-check` link and clarify “no vowel/no sara” intent in intro. |
| Low | `monday-girl-names-2569-no-vowels-meaning` | Day-specific girl names | 1,904 chars, TOC/FAQ, `/name-check` link | Expand intro with direct answer and table usage guidance. |
| Low | `lucky-names-by-birthday-2569` | Names by birthday | 6,443 chars, TOC/FAQ, `/name-check` and bulk links | Keep as day-birthday cluster support. |
| Low | `nickname-kalakini-effect` | Nickname/kalakini | 3,088 chars, TOC/FAQ, tool links | Add examples by weekday if not already visible. |
| High | `namemongkol-number-pairs` | Number pairs | 4,947 chars, missing meta, broken related slugs | Add meta, repair related slugs, distinguish from `micro-analysis-lucky-number-pairs`. |
| Low | `sunday-boy-names-2569-avoid-kalakini` | Day-specific boy names | 1,820 chars, TOC/FAQ, `/name-check` link | Expand answer block and add table summary for Sunday forbidden letters. |
| Medium | `thaksa-pakorn-naming-guide` | Thaksa guide | 2,813 chars, TOC/FAQ, no tool link | Add contextual `/name-check` link where explaining kalakini/thaksa checking. |
| High | `what-is-name-analysis` | Definition / tool education | 3,841 chars, missing meta, no TOC/FAQ | Add meta, TOC, 4 FAQs, and direct answer: “วิเคราะห์ชื่อคืออะไร”. |
| Medium | `change-name-destiny-tuning-2569` | Change name / ritual | 7,019 chars, TOC/FAQ, no tool link | Add contextual `/name-check` before legal/ritual checklist. |
| Medium | `auspicious-names-by-birthday-2026` | Names by birthday pillar | 7,563 chars, TOC, no FAQ, no tool link | Add FAQ and contextual `/name-check`; avoid over-targeting broad “ตั้งชื่อลูก”. |
| Medium | `100-auspicious-women-names-2026` | Girl names list | 9,328 chars, TOC, no FAQ | Add FAQ comparing 100-name broad list vs 50-name curated page. |
| Medium | `17-auspicious-thai-cats-2569` | Lifestyle / pet naming | 3,057 chars, TOC, no FAQ | Add FAQ and link to cat-name page / name-check where relevant. |
| Medium | `supajee-suthampun-numerology-a-plus` | Case study | 4,588 chars, TOC, no FAQ | Add FAQ and transparent methodology block. |
| High | `lucky-names-for-2026-grade-a-plus` | A+ name list | 4,401 chars, missing meta, no FAQ | Add meta and FAQ; define how this differs from 100/400-name list pages. |
| Medium | `history-of-thai-naming-tradition` | History / authority | 7,367 chars, TOC, no FAQ | Add source/citation section and FAQ for E-E-A-T. |
| High | `case-study-khemanit-name-analysis` | Case study | 1,307 chars, no TOC/FAQ/tool link | Expand methodology, add direct answer, TOC, FAQ, and `/name-check` link. |
| High | `shadow-power-ayatana-6-meaning` | Naming science | 960 chars, no TOC/FAQ/tool link | Expand as pillar or consolidate with `what-is-shadow-power`/`what-is-ayatana-6`. |
| High | `micro-analysis-lucky-number-pairs` | Number pairs | 736 chars, no TOC/FAQ/tool link | Expand or canonicalize with `namemongkol-number-pairs`; add examples 00-99 and `/name-check`. |
| Medium | `naming-style-evolution-5-generations` | Naming trends | 5,168 chars, no TOC/FAQ | Add TOC and FAQ; add data/source note. |
| Medium | `thai-chinese-naming-bazi-five-elements` | Chinese naming | 4,474 chars, no TOC/FAQ/tool link | Add TOC, FAQ, and explain difference from Thai thaksa/number pages. |
| Medium | `100-auspicious-boy-names-2569` | Boy names list | 3,971 chars, no TOC/FAQ | Add TOC/FAQ and canonical intent note vs 400-name page. |
| Medium | `top-20-popular-thai-names-numerology-analysis` | Popular name analysis | 5,715 chars, no TOC/FAQ | Add methodology, FAQ, and links to individual `/meaning/{name}` pages. |
| High | `free-999-auspicious-names-2568` | Large name list | 1,412 chars, no TOC/FAQ/tool link | Either refresh to 2569 or mark as archived; add canonical pathway to current list. |
| Medium | `auspicious-phone-number-guide-2026` | Phone number guide | 2,760 chars, no TOC/FAQ/tool link | Add TOC/FAQ and contextual `/phone-analysis` link. |
| Medium | `thai-naming-stats-2025-popular-initials` | Stats / trends | 3,415 chars, no TOC/FAQ | Add data source/methodology and FAQ. |
| Medium | `unfavorable-love-numbers-guide` | Phone/love numbers | 2,644 chars, no TOC/FAQ/tool link | Add `/phone-analysis` link and table of number pairs. |
| High | `power-of-naming-analysis` | Naming science | 1,351 chars, no TOC/FAQ | Expand or merge into naming science pillar; add FAQ. |
| Medium | `naming-tips-2026-year-of-horse` | Baby naming / year | 4,998 chars, no TOC/FAQ | Add TOC/FAQ and link down to gender-specific pages. |
| High | `forbidden-letters-kalakini` | Kalakini definition | 1,127 chars, no TOC/FAQ | Expand as pillar, add 7-day table, FAQ, and link to checker/tool. |
| High | `what-is-ayatana-6` | Naming science definition | 1,118 chars, no TOC/FAQ/tool link | Expand, add examples and FAQ; link to `shadow-power-ayatana-6-meaning`. |
| Medium | `lucky-numbers-2569-guide` | Lucky numbers | 2,855 chars, no TOC/FAQ/tool link | Add TOC/FAQ and route to `/phone-analysis` when phone intent appears. |
| Medium | `auspicious-colors-2569-guide` | Lucky colors | 2,291 chars, no TOC/FAQ/tool link | Add TOC/FAQ and link to `/wallpapers` intent pages. |
| Medium | `4-pillars-of-naming` | Naming science pillar | 2,437 chars, no TOC/FAQ | Add TOC/FAQ; make this the hub for thaksa/numerology/ayatana/shadow pages. |
| Medium | `numerology-0-9-power-guide` | Numerology guide | 3,292 chars, no TOC/FAQ/tool link | Add TOC/FAQ and link to number pair pages. |
| Medium | `check-kalakini-letters-7-days` | Kalakini checker content | 1,694 chars, no TOC/FAQ | Add TOC/FAQ and cross-link to `forbidden-letters-kalakini`. |
| Medium | `most-accurate-phone-number-analysis-2026` | Phone analysis | 3,212 chars, no TOC/FAQ/tool link | Add contextual `/phone-analysis` link and method comparison table. |
| Medium | `what-is-shadow-power` | Naming science definition | 3,151 chars, no TOC/FAQ/tool link | Add TOC/FAQ and decide canonical relationship with `shadow-power-ayatana-6-meaning`. |
| Medium | `caishen-wallpaper-free-download` | Wallpaper/lifestyle | 6,085 chars, no TOC/FAQ/tool link | Add TOC/FAQ and link to `/wallpapers/intent/finance`. |
| Low | `131-grade-a-auspicious-digital-nicknames` | Nickname list | 11,974 chars, TOC/FAQ, bulk link | Healthy; add yearly refresh note if names are time-sensitive. |
| Low | `naming-baby-year-of-horse-2569` | Baby naming year pillar | 6,580 chars, TOC/FAQ, bulk link | Strong page; ensure it remains main year-specific baby naming hub. |
| Low | `lucky-cat-names-by-birthday-2026` | Pet names | 7,739 chars, TOC/FAQ, bulk link | Healthy; add link to cat article and wallpaper/lifestyle pages. |

## Cannibalization & Keyword Mapping

| Conflict / topic | Primary page | Supporting pages | Risk | Resolution |
| --- | --- | --- | --- | --- |
| Broad baby naming 2569 | `naming-baby-year-of-horse-2569` | `baby-naming-guide-2569`, `auspicious-names-by-birthday-2026`, gender/day pages | High | Keep primary page for “ตั้งชื่อลูกปีมะเมีย 2569”; supporting pages must use modifiers like gender, day, no-vowel, birthday. |
| Boy names 2569 | `auspicious-boy-names-2569` | `100-auspicious-boy-names-2569`, `boy-names-2569-50-auspicious`, `sunday-boy-names-2569-avoid-kalakini` | High | Define 400-name inspiration vs 100-name quick list vs 50-name curated A+ vs Sunday-specific. Add comparison links. |
| Girl names 2569 | `girl-names-2569-auspicious-modern` | `100-auspicious-women-names-2026`, `girl-names-2569-50-auspicious`, `monday-girl-names-*` | High | Make broad page target “ชื่อมงคลผู้หญิง 2569”; curated pages target “50/100 ชื่อ”; Monday pages target weekday constraints. |
| Name analysis tool intent | `/name-check` | `what-is-name-analysis`, `free-name-analysis-numerology-guide`, case studies | Medium | Tool page owns transactional query “วิเคราะห์ชื่อฟรี”; articles explain methods and link to tool. |
| Number pair / micro analysis | `namemongkol-number-pairs` or `micro-analysis-lucky-number-pairs` | `numerology-0-9-power-guide`, `lucky-numbers-2569-guide` | High | Pick one canonical pillar for “คู่เลขในชื่อ”; merge/expand weaker page or set clear distinction. |
| Ayatana / shadow power | `shadow-power-ayatana-6-meaning` or `4-pillars-of-naming` | `what-is-ayatana-6`, `what-is-shadow-power` | High | Use `4-pillars-of-naming` as hub; keep `what-is-*` as definitions; expand `shadow-power-ayatana-6-meaning` or consolidate if redundant. |
| Kalakini | `forbidden-letters-kalakini` | `check-kalakini-letters-7-days`, weekday name pages | Medium | Pillar explains concept; checker/list page targets table lookup; weekday pages must include weekday modifier in title/H1. |
| Phone numbers | `auspicious-phone-number-guide-2026` or `most-accurate-phone-number-analysis-2026` | `lucky-phone-numbers-guide-2569`, `unfavorable-love-numbers-guide`, `lucky-numbers-2569-guide` | Medium | Choose one main phone guide and redirect/internal-link older equivalent if both serve the same intent. |

## Content Expansion Backlog

Critical additions:

1. Add meta title/description to the 3 missing pages.
2. Fix `namemongkol-number-pairs` related slugs.
3. Expand or consolidate the 8 thin pages.
4. Add FAQ + TOC to the highest-opportunity missing pages.
5. Add contextual tool links in content body, not only global CTA.

AEO module template to add to priority articles:

```md
## คำตอบสั้น ๆ
[Primary query] คือ ... เหมาะกับ ... ต้องเช็ก ... ก่อนใช้จริง

## สรุปสิ่งที่ควรรู้
- ...
- ...
- ...

## วิธีใช้ข้อมูลนี้ต่อ
หลังอ่านแล้วให้ตรวจชื่อจริงกับนามสกุลที่ /name-check หรือวิเคราะห์หลายชื่อที่ /name-analysis

## FAQ
### [Question 1]
[Visible answer]
```

Recommended FAQ themes:

- Name list pages: “ชื่อนี้ใช้ได้ทุกวันเกิดไหม”, “ต้องเช็กนามสกุลด้วยไหม”, “ชื่อความหมายดีแต่เลขไม่ดีควรทำอย่างไร”
- Kalakini pages: “กาลกิณีคืออะไร”, “ชื่อมีอักษรกาลกิณี 1 ตัวใช้ได้ไหม”, “พุธกลางวัน/กลางคืนต่างกันอย่างไร”
- Number pages: “ผลรวมดีพอไหม”, “คู่เลขสำคัญกว่าผลรวมไหม”, “ใช้กับเบอร์โทรได้ไหม”
- Tool education pages: “วิเคราะห์ชื่อฟรีแม่นไหม”, “ต้องใส่นามสกุลไหม”, “ต่างจากดูดวงชื่ออย่างไร”

## Technical Fix Backlog

| Priority | Task | Implementation note |
| --- | --- | --- |
| P0 | Fix missing meta for 3 pages | Update article objects in `src/data/articles.ts` / article modules. |
| P0 | Fix broken `relatedSlugs` | Replace non-canonical `article-*` slugs with actual article slugs. |
| P1 | Use `dateModified` in sitemap | In `src/app/sitemap.ts`, local article `lastModified` should use `article.dateModified || article.date`. DB sitemap should select/use `date_modified` if available. |
| P1 | Add FAQ/TOC to priority pages | Start with high-priority pages and cannibalization pillars. |
| P1 | Add contextual internal links | Add 1-2 in-body links per article to `/name-check`, `/name-analysis`, `/phone-analysis`, `/wallpapers` depending on intent. |
| P2 | Validate production structured data | Run Rich Results Test/Schema Validator on top 10 priority pages after deploy. |
| P2 | Add GSC overlay later | Map rows to impressions/clicks/queries/index status once GSC access is available. |

## Recommended 14-Day Action Plan

Week 1:

1. Fix meta + broken related slugs.
2. Add sitemap `dateModified` support.
3. Expand `micro-analysis-lucky-number-pairs`, `shadow-power-ayatana-6-meaning`, `forbidden-letters-kalakini`, `what-is-ayatana-6`.
4. Add FAQ/TOC to `what-is-name-analysis`, `lucky-names-for-2026-grade-a-plus`, `namemongkol-number-pairs`.

Week 2:

1. Resolve boy/girl/baby naming cannibalization with comparison blocks and internal anchors.
2. Add contextual tool links to 21 no-tool-link pages.
3. Add FAQ/TOC to phone-number and naming-science clusters.
4. Validate production URLs in Search Console URL Inspection and submit sitemap recrawl.
