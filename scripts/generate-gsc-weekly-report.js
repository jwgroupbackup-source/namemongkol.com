#!/usr/bin/env node
/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
    const args = {};
    for (let i = 2; i < argv.length; i += 1) {
        const token = argv[i];
        if (!token.startsWith('--')) continue;
        const key = token.slice(2);
        const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : 'true';
        args[key] = value;
        if (value !== 'true') i += 1;
    }
    return args;
}

function parseCsvLine(line) {
    const out = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i += 1) {
        const ch = line[i];
        if (ch === '"') {
            const next = line[i + 1];
            if (inQuotes && next === '"') {
                current += '"';
                i += 1;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === ',' && !inQuotes) {
            out.push(current);
            current = '';
        } else {
            current += ch;
        }
    }

    out.push(current);
    return out.map((v) => v.trim());
}

function normalizeHeader(value) {
    return value
        .toLowerCase()
        .replace(/[\s_\-./]/g, '')
        .replace(/[()]/g, '');
}

function toNumber(raw) {
    if (raw == null) return 0;
    const cleaned = String(raw).replace(/[%,$]/g, '').replace(/,/g, '').trim();
    const num = Number(cleaned);
    return Number.isFinite(num) ? num : 0;
}

function parseCsv(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/, '');
    const lines = raw.split(/\r?\n/).filter((line) => line.trim().length > 0);
    if (lines.length < 2) {
        throw new Error('CSV must include a header and at least one data row.');
    }

    const headers = parseCsvLine(lines[0]).map(normalizeHeader);

    const aliases = {
        query: ['query', 'queries', 'searchquery', 'คําคน้หา', 'คำค้นหา'],
        page: ['page', 'pages', 'url', 'landingpage', 'หน้า', 'หน้าเว็บ'],
        clicks: ['clicks', 'click', 'คลิก'],
        impressions: ['impressions', 'impression', 'การแสดงผล'],
        ctr: ['ctr'],
        position: ['position', 'avgposition', 'averageposition', 'อันดับ'],
    };

    const indexMap = {};
    for (const [key, candidates] of Object.entries(aliases)) {
        const found = headers.findIndex((h) => candidates.includes(h));
        indexMap[key] = found;
    }

    if (indexMap.query === -1 || indexMap.page === -1 || indexMap.clicks === -1 || indexMap.impressions === -1 || indexMap.position === -1) {
        throw new Error('Missing required columns. Need at least: query, page, clicks, impressions, position.');
    }

    const rows = [];
    for (let i = 1; i < lines.length; i += 1) {
        const cols = parseCsvLine(lines[i]);
        const row = {
            query: cols[indexMap.query] || '',
            page: cols[indexMap.page] || '',
            clicks: toNumber(cols[indexMap.clicks]),
            impressions: toNumber(cols[indexMap.impressions]),
            ctr: indexMap.ctr >= 0 ? toNumber(cols[indexMap.ctr]) : null,
            position: toNumber(cols[indexMap.position]),
        };
        if (!row.page || !row.query) continue;
        rows.push(row);
    }

    return rows;
}

function weightedPosition(rows) {
    const totalImpressions = rows.reduce((sum, r) => sum + r.impressions, 0);
    if (totalImpressions === 0) return 0;
    const weighted = rows.reduce((sum, r) => sum + (r.position * r.impressions), 0);
    return weighted / totalImpressions;
}

function summarize(rows) {
    const cohortMatchers = [
        { key: 'wallpapers-hub', label: '/wallpapers', match: (u) => /\/wallpapers$/.test(u) },
        { key: 'wallpapers-day', label: '/wallpapers/day/*', match: (u) => /\/wallpapers\/day\//.test(u) },
        { key: 'wallpapers-zodiac', label: '/wallpapers/zodiac/*', match: (u) => /\/wallpapers\/zodiac/.test(u) },
        { key: 'wallpapers-intent', label: '/wallpapers/intent/*', match: (u) => /\/wallpapers\/intent\//.test(u) },
        { key: 'wallpapers-custom', label: '/wallpapers/custom', match: (u) => /\/wallpapers\/custom$/.test(u) },
    ];

    const queryMatchers = [
        { key: 'wallpapers-year', pattern: /วอลเปเปอร์.*2569/i },
        { key: 'wallpapers-day', pattern: /วอลเปเปอร์.*วัน(จันทร์|อังคาร|พุธ|พฤหัส|ศุกร์|เสาร์|อาทิตย์)/i },
        { key: 'wallpapers-finance', pattern: /วอลเปเปอร์.*(การเงิน|โชค|ลาภ|เรียกทรัพย์)/i },
        { key: 'wallpapers-love', pattern: /วอลเปเปอร์.*(ความรัก|เสน่ห์|เมตตา)/i },
        { key: 'wallpapers-work', pattern: /วอลเปเปอร์.*(การงาน|บารมี|เลื่อนตำแหน่ง)/i },
        { key: 'wallpapers-custom-core', pattern: /(สร้างวอลเปเปอร์มงคล|วอลเปเปอร์มงคลส่วนตัว)/i },
    ];

    const cohortSummary = cohortMatchers.map((cohort) => {
        const bucket = rows.filter((r) => cohort.match(r.page));
        const clicks = bucket.reduce((sum, r) => sum + r.clicks, 0);
        const impressions = bucket.reduce((sum, r) => sum + r.impressions, 0);
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
        const position = weightedPosition(bucket);
        return {
            key: cohort.key,
            label: cohort.label,
            clicks,
            impressions,
            ctr,
            position,
        };
    });

    const querySummary = queryMatchers.map((cohort) => {
        const bucket = rows.filter((r) => cohort.pattern.test(r.query));
        const clicks = bucket.reduce((sum, r) => sum + r.clicks, 0);
        const impressions = bucket.reduce((sum, r) => sum + r.impressions, 0);
        const ctr = impressions > 0 ? (clicks / impressions) * 100 : 0;
        const position = weightedPosition(bucket);
        return {
            key: cohort.key,
            clicks,
            impressions,
            ctr,
            position,
        };
    });

    const byQuery = new Map();
    for (const row of rows) {
        const key = row.query.trim();
        const prev = byQuery.get(key) || { query: key, clicks: 0, impressions: 0, weightedPos: 0 };
        prev.clicks += row.clicks;
        prev.impressions += row.impressions;
        prev.weightedPos += row.position * row.impressions;
        byQuery.set(key, prev);
    }

    const topQueries = Array.from(byQuery.values())
        .map((q) => ({
            query: q.query,
            clicks: q.clicks,
            impressions: q.impressions,
            ctr: q.impressions > 0 ? (q.clicks / q.impressions) * 100 : 0,
            position: q.impressions > 0 ? q.weightedPos / q.impressions : 0,
        }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

    return { cohortSummary, querySummary, topQueries };
}

function pct(value) {
    return `${value.toFixed(2)}%`;
}

function num(value) {
    return Intl.NumberFormat('en-US').format(Math.round(value));
}

function pos(value) {
    return value > 0 ? value.toFixed(1) : '-';
}

function generateMarkdown(summary, period, sourceFile) {
    const cohortRows = summary.cohortSummary
        .map((c) => `| ${c.key} (\`${c.label}\`) | ${num(c.clicks)} | ${num(c.impressions)} | ${pct(c.ctr)} | ${pos(c.position)} | n/a | n/a |`)
        .join('\n');

    const queryRows = summary.querySummary
        .map((c) => `| ${c.key} | ${num(c.clicks)} | ${num(c.impressions)} | ${pct(c.ctr)} | ${pos(c.position)} | n/a |`)
        .join('\n');

    const winners = summary.topQueries
        .slice(0, 3)
        .map((q, i) => `${i + 1}. ${q.query} | clicks: ${num(q.clicks)} | impressions: ${num(q.impressions)} | ctr: ${pct(q.ctr)} | position: ${pos(q.position)}`)
        .join('\n');

    return [
        '# Weekly GSC Report (Auto-generated)',
        '',
        `- Report period: ${period}`,
        '- Compare window: last 7 days vs previous 7 days',
        `- Source CSV: ${sourceFile}`,
        '',
        '## KPI Snapshot',
        '',
        '| Cohort | Clicks | Impressions | CTR | Avg Position | WoW Delta | Target Status |',
        '| --- | ---: | ---: | ---: | ---: | --- | --- |',
        cohortRows,
        '',
        '## Query Cohort Performance',
        '',
        '| Query Cohort | Clicks | Impressions | CTR | Avg Position | WoW Delta |',
        '| --- | ---: | ---: | ---: | ---: | --- |',
        queryRows,
        '',
        '## Top Queries By Clicks',
        '',
        winners || '1. n/a',
        '',
        '## Notes',
        '',
        '- Fill WoW Delta and Target Status after comparing with previous period export.',
        '- Paste this section into docs/seo-gsc-weekly-wallpapers-template.md if needed.',
        '',
    ].join('\n');
}

function main() {
    const args = parseArgs(process.argv);
    const input = args.input;
    const output = args.output;
    const period = args.period || 'not specified';

    if (!input) {
        console.error('Usage: node scripts/generate-gsc-weekly-report.js --input <gsc.csv> [--output <out.md>] [--period "YYYY-MM-DD to YYYY-MM-DD"]');
        process.exit(1);
    }

    const inputPath = path.resolve(input);
    if (!fs.existsSync(inputPath)) {
        console.error(`Input file not found: ${inputPath}`);
        process.exit(1);
    }

    const rows = parseCsv(inputPath);
    const summary = summarize(rows);
    const markdown = generateMarkdown(summary, period, inputPath);

    if (output) {
        const outPath = path.resolve(output);
        fs.mkdirSync(path.dirname(outPath), { recursive: true });
        fs.writeFileSync(outPath, markdown, 'utf8');
        console.log(`Report written to: ${outPath}`);
    } else {
        console.log(markdown);
    }
}

main();
