# Hero Secondary Link Measurement

เอกสารนี้ใช้วัดผลลิงก์รองใน Hero หน้าแรก:
- `home.hero.secondary.phone`
- `home.hero.secondary.aura`

ข้อมูลอ้างอิงจากตาราง `user_action_events` (ผ่าน `/api/analytics/ingest`).

## 1) Daily Clicks by Button

```sql
select
  date_trunc('day', created_at) as day,
  button_key,
  count(*) as clicks,
  count(distinct session_id) as unique_sessions,
  count(distinct user_id) filter (where user_id is not null) as unique_users
from user_action_events
where created_at >= now() - interval '30 days'
  and event_name = 'click'
  and button_key in ('home.hero.secondary.phone', 'home.hero.secondary.aura')
group by 1, 2
order by 1 desc, 2;
```

## 2) Homepage Session CTR to Secondary Links

นิยาม CTR ในที่นี้:
- ตัวตั้ง: session ที่คลิก secondary link อย่างน้อย 1 ครั้ง
- ตัวหาร: session ที่มี event ใดๆ บนหน้า `/`

```sql
with homepage_sessions as (
  select distinct session_id
  from user_action_events
  where created_at >= now() - interval '30 days'
    and page_path = '/'
),
secondary_click_sessions as (
  select distinct session_id
  from user_action_events
  where created_at >= now() - interval '30 days'
    and event_name = 'click'
    and button_key in ('home.hero.secondary.phone', 'home.hero.secondary.aura')
)
select
  (select count(*) from secondary_click_sessions) as click_sessions,
  (select count(*) from homepage_sessions) as homepage_sessions,
  case
    when (select count(*) from homepage_sessions) = 0 then 0
    else round(
      (select count(*) from secondary_click_sessions)::numeric
      / (select count(*) from homepage_sessions)::numeric
      * 100,
      2
    )
  end as ctr_percent;
```

## 3) Downstream Landing Behavior (Phone vs Aura)

ดูคุณภาพทราฟฟิกหลังคลิก แยกตามปลายทางที่ผู้ใช้ไปต่อใน session เดียวกัน

```sql
with seed as (
  select
    session_id,
    min(created_at) as first_click_at,
    min(button_key) as button_key
  from user_action_events
  where created_at >= now() - interval '30 days'
    and event_name = 'click'
    and button_key in ('home.hero.secondary.phone', 'home.hero.secondary.aura')
  group by session_id
),
after_click as (
  select
    s.button_key,
    e.session_id,
    e.page_path,
    e.event_name,
    e.created_at
  from seed s
  join user_action_events e
    on e.session_id = s.session_id
   and e.created_at >= s.first_click_at
   and e.created_at < s.first_click_at + interval '30 minutes'
)
select
  button_key,
  page_path,
  count(*) as events,
  count(distinct session_id) as sessions
from after_click
where page_path in ('/phone-analysis', '/aura-analysis')
group by 1, 2
order by 1, sessions desc;
```

## 4) Baseline vs Post-change Comparison

ปรับวันที่ใน `windows` ให้ตรงกับช่วงก่อนและหลังปล่อย feature

```sql
with windows as (
  select 'baseline'::text as period, timestamp '2026-01-01' as start_at, timestamp '2026-01-14' as end_at
  union all
  select 'post'::text as period, timestamp '2026-01-15' as start_at, timestamp '2026-01-28' as end_at
),
agg as (
  select
    w.period,
    count(*) filter (
      where e.event_name = 'click'
        and e.button_key in ('home.hero.secondary.phone', 'home.hero.secondary.aura')
    ) as clicks,
    count(distinct e.session_id) filter (
      where e.page_path = '/'
    ) as homepage_sessions,
    count(distinct e.session_id) filter (
      where e.event_name = 'click'
        and e.button_key in ('home.hero.secondary.phone', 'home.hero.secondary.aura')
    ) as click_sessions
  from windows w
  left join user_action_events e
    on e.created_at >= w.start_at
   and e.created_at < w.end_at
  group by w.period
)
select
  period,
  clicks,
  homepage_sessions,
  click_sessions,
  case when homepage_sessions = 0 then 0 else round(click_sessions::numeric / homepage_sessions::numeric * 100, 2) end as ctr_percent
from agg
order by case when period = 'baseline' then 1 else 2 end;
```

## 5) Quick API Checks (Admin)

ใช้ API admin ที่มีอยู่เพื่อตรวจแบบเร็ว:
- `/api/admin/analytics?type=top-buttons&days=7&limit=50`
- `/api/admin/analytics?type=daily-trend&days=14`

หมายเหตุ: `top-buttons` รวมทุกปุ่ม ให้กรองเฉพาะ key ที่ขึ้นต้น `home.hero.secondary.` ตอนวิเคราะห์ผล.
