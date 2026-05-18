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

const PRESETS = {
    wallpapers: {
        title: 'Weekly GSC Report (Wallpapers SEO)',
        cohortMatchers: [
            { key: 'wallpapers-hub', label: '/wallpapers', match: (u) => /\/wallpapers$/.test(u) },
            { key: 'wallpapers-day', label: '/wallpapers/day/*', match: (u) => /\/wallpapers\/day\//.test(u) },
            { key: 'wallpapers-zodiac', label: '/wallpapers/zodiac/*', match: (u) => /\/wallpapers\/zodiac/.test(u) },
            { key: 'wallpapers-intent', label: '/wallpapers/intent/*', match: (u) => /\/wallpapers\/intent\//.test(u) },
            { key: 'wallpapers-custom', label: '/wallpapers/custom', match: (u) => /\/wallpapers\/custom$/.test(u) },
        ],
        queryMatchers: [
            { key: 'wallpapers-year', pattern: /วอลเปเปอร์.*2569/i },
            { key: 'wallpapers-day', pattern: /วอลเปเปอร์.*วัน(จันทร์|อังคาร|พุธ|พฤหัส|ศุกร์|เสาร์|อาทิตย์)/i },
            { key: 'wallpapers-finance', pattern: /วอลเปเปอร์.*(การเงิน|โชค|ลาภ|เรียกทรัพย์)/i },
            { key: 'wallpapers-love', pattern: /วอลเปเปอร์.*(ความรัก|เสน่ห์|เมตตา)/i },
            { key: 'wallpapers-work', pattern: /วอลเปเปอร์.*(การงาน|บารมี|เลื่อนตำแหน่ง)/i },
            { key: 'wallpapers-custom-core', pattern: /(สร้างวอลเปเปอร์มงคล|วอลเปเปอร์มงคลส่วนตัว)/i },
        ],
        cannibalizationPages: [
            { key: 'wallpapers-day', label: '/wallpapers/day/*', match: (u) => /\/wallpapers\/day\//.test(u) },
            { key: 'wallpapers-zodiac', label: '/wallpapers/zodiac/*', match: (u) => /\/wallpapers\/zodiac/.test(u) },
            { key: 'wallpapers-intent', label: '/wallpapers/intent/*', match: (u) => /\/wallpapers\/intent\//.test(u) },
            { key: 'wallpapers-custom', label: '/wallpapers/custom', match: (u) => /\/wallpapers\/custom$/.test(u) },
        ],
    },
    'boy-names': {
        title: 'Weekly GSC Report (Boy Names SEO)',
        cohortMatchers: [
            { key: 'boy-names-pillar', label: '/articles/boy-names-2569-50-auspicious', match: (u) => /\/articles\/boy-names-2569-50-auspicious$/.test(u) },
            { key: 'boy-names-ideas', label: '/articles/auspicious-boy-names-2569', match: (u) => /\/articles\/auspicious-boy-names-2569$/.test(u) },
            { key: 'boy-names-free-100', label: '/articles/100-auspicious-boy-names-2569', match: (u) => /\/articles\/100-auspicious-boy-names-2569$/.test(u) },
        ],
        queryMatchers: [
            { key: 'boy-names-primary', pattern: /ชื่อผู้ชายมงคล/i },
            { key: 'boy-names-baby', pattern: /ชื่อลูกชายมงคล/i },
            { key: 'boy-names-realname', pattern: /ชื่อจริงลูกชายมงคล/i },
            { key: 'boy-names-year', pattern: /(ชื่อผู้ชาย|ชื่อลูกชาย).*2569/i },
        ],
        cannibalizationPages: [
            { key: 'boy-names-pillar', label: '/articles/boy-names-2569-50-auspicious', match: (u) => /\/articles\/boy-names-2569-50-auspicious$/.test(u) },
            { key: 'boy-names-ideas', label: '/articles/auspicious-boy-names-2569', match: (u) => /\/articles\/auspicious-boy-names-2569$/.test(u) },
            { key: 'boy-names-free-100', label: '/articles/100-auspicious-boy-names-2569', match: (u) => /\/articles\/100-auspicious-boy-names-2569$/.test(u) },
        ],
    },
};

function buildCannibalizationSummary(rows, trackedPages) {
    if (!trackedPages || trackedPages.length === 0) {
        return { totalOverlapQueries: 0, sharedQueryClicks: 0, sharedQueryImpressions: 0, topSharedQueries: [] };
    }

    const byQuery = new Map();

    for (const row of rows) {
        const matchedPages = trackedPages.filter((page) => page.match(row.page));
        if (matchedPages.length === 0) continue;

        const queryKey = row.query.trim();
        const entry = byQuery.get(queryKey) || {
            query: queryKey,
            clicks: 0,
            impressions: 0,
            weightedPos: 0,
            pages: new Map(),
        };

        entry.clicks += row.clicks;
        entry.impressions += row.impressions;
        entry.weightedPos += row.position * row.impressions;

        for (const page of matchedPages) {
            const pageEntry = entry.pages.get(page.key) || { key: page.key, label: page.label, clicks: 0, impressions: 0 };
            pageEntry.clicks += row.clicks;
            pageEntry.impressions += row.impressions;
            entry.pages.set(page.key, pageEntry);
        }

        byQuery.set(queryKey, entry);
    }

    const overlaps = Array.from(byQuery.values())
        .filter((entry) => entry.pages.size >= 2)
        .map((entry) => ({
            query: entry.query,
            clicks: entry.clicks,
            impressions: entry.impressions,
            ctr: entry.impressions > 0 ? (entry.clicks / entry.impressions) * 100 : 0,
            position: entry.impressions > 0 ? entry.weightedPos / entry.impressions : 0,
            pages: Array.from(entry.pages.values()).sort((a, b) => b.impressions - a.impressions),
        }))
        .sort((a, b) => b.impressions - a.impressions);

    return {
        totalOverlapQueries: overlaps.length,
        sharedQueryClicks: overlaps.reduce((sum, entry) => sum + entry.clicks, 0),
        sharedQueryImpressions: overlaps.reduce((sum, entry) => sum + entry.impressions, 0),
        topSharedQueries: overlaps.slice(0, 10),
    };
}

function summarize(rows, preset) {
    const cohortMatchers = preset.cohortMatchers;
    const queryMatchers = preset.queryMatchers;

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

    const cannibalization = buildCannibalizationSummary(rows, preset.cannibalizationPages);

    return { cohortSummary, querySummary, topQueries, cannibalization };
}

function mapByKey(items) {
    return new Map(items.map((item) => [item.key, item]));
}

function compareMetrics(currentValue, previousValue) {
    if (!Number.isFinite(previousValue) || previousValue <= 0) return 'new';
    const deltaPct = ((currentValue - previousValue) / previousValue) * 100;
    const sign = deltaPct > 0 ? '+' : '';
    return `${sign}${deltaPct.toFixed(1)}%`;
}

function comparePosition(currentValue, previousValue) {
    if (!Number.isFinite(previousValue) || previousValue <= 0) return 'new';
    const delta = previousValue - currentValue;
    const sign = delta > 0 ? '+' : '';
    return `${sign}${delta.toFixed(1)} pos`;
}

function decorateSummaryWithPrevious(current, previous) {
    if (!previous) return current;

    const prevCohorts = mapByKey(previous.cohortSummary);
    const prevQueries = mapByKey(previous.querySummary);

    current.cohortSummary = current.cohortSummary.map((item) => {
        const prev = prevCohorts.get(item.key);
        return {
            ...item,
            wowDelta: prev ? compareMetrics(item.clicks, prev.clicks) : 'new',
            positionDelta: prev ? comparePosition(item.position, prev.position) : 'new',
        };
    });

    current.querySummary = current.querySummary.map((item) => {
        const prev = prevQueries.get(item.key);
        return {
            ...item,
            wowDelta: prev ? compareMetrics(item.clicks, prev.clicks) : 'new',
            positionDelta: prev ? comparePosition(item.position, prev.position) : 'new',
        };
    });

    const prevOverlap = previous.cannibalization ? previous.cannibalization.totalOverlapQueries : 0;
    current.cannibalization.overlapDelta = prevOverlap > 0
        ? compareMetrics(current.cannibalization.totalOverlapQueries, prevOverlap)
        : 'new';

    return current;
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

function generateMarkdown(summary, period, sourceFile, options) {
    const cohortRows = summary.cohortSummary
        .map((c) => `| ${c.key} (\`${c.label}\`) | ${num(c.clicks)} | ${num(c.impressions)} | ${pct(c.ctr)} | ${pos(c.position)} | ${c.wowDelta || 'n/a'} | ${c.positionDelta || 'n/a'} |`)
        .join('\n');

    const queryRows = summary.querySummary
        .map((c) => `| ${c.key} | ${num(c.clicks)} | ${num(c.impressions)} | ${pct(c.ctr)} | ${pos(c.position)} | ${c.wowDelta || 'n/a'} |`)
        .join('\n');

    const winners = summary.topQueries
        .slice(0, 3)
        .map((q, i) => `${i + 1}. ${q.query} | clicks: ${num(q.clicks)} | impressions: ${num(q.impressions)} | ctr: ${pct(q.ctr)} | position: ${pos(q.position)}`)
        .join('\n');

    const sharedQueries = summary.cannibalization.topSharedQueries.length > 0
        ? summary.cannibalization.topSharedQueries
            .slice(0, 5)
            .map((entry, index) => {
                const pages = entry.pages.map((page) => `${page.key} (${num(page.impressions)} imp)`).join(', ');
                return `${index + 1}. ${entry.query} | impressions: ${num(entry.impressions)} | position: ${pos(entry.position)} | pages: ${pages}`;
            })
            .join('\n')
        : '1. n/a';

    return [
        `# ${options.title}`,
        '',
        `- Report period: ${period}`,
        `- Compare window: ${options.compareWindow}`,
        `- Preset: ${options.presetKey}`,
        `- Source CSV: ${sourceFile}`,
        ...(options.compareSourceFile ? [`- Previous CSV: ${options.compareSourceFile}`] : []),
        '',
        '## KPI Snapshot',
        '',
        '| Cohort | Clicks | Impressions | CTR | Avg Position | Click Delta | Position Delta |',
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
        '## Cannibalization Watch',
        '',
        `- Overlap queries across tracked URLs: ${num(summary.cannibalization.totalOverlapQueries)}`,
        `- Shared-query impressions: ${num(summary.cannibalization.sharedQueryImpressions)}`,
        `- Shared-query clicks: ${num(summary.cannibalization.sharedQueryClicks)}`,
        `- Overlap delta vs previous export: ${summary.cannibalization.overlapDelta || 'n/a'}`,
        '',
        sharedQueries,
        '',
        '## Notes',
        '',
        '- Use --compare with the previous period CSV to auto-fill click/position deltas and overlap changes.',
        '- Paste this section into your weekly SEO report document if needed.',
        '',
    ].join('\n');
}

function main() {
    const args = parseArgs(process.argv);
    const input = args.input;
    const compare = args.compare;
    const output = args.output;
    const period = args.period || 'not specified';
    const presetKey = args.preset || 'wallpapers';
    const preset = PRESETS[presetKey];

    if (!preset) {
        console.error(`Unknown preset: ${presetKey}. Available presets: ${Object.keys(PRESETS).join(', ')}`);
        process.exit(1);
    }

    if (!input) {
        console.error('Usage: node scripts/generate-gsc-weekly-report.js --input <gsc.csv> [--compare <previous-gsc.csv>] [--preset wallpapers|boy-names] [--output <out.md>] [--period "YYYY-MM-DD to YYYY-MM-DD"]');
        process.exit(1);
    }

    const inputPath = path.resolve(input);
    if (!fs.existsSync(inputPath)) {
        console.error(`Input file not found: ${inputPath}`);
        process.exit(1);
    }

    const rows = parseCsv(inputPath);
    const comparePath = compare ? path.resolve(compare) : null;
    if (comparePath && !fs.existsSync(comparePath)) {
        console.error(`Compare file not found: ${comparePath}`);
        process.exit(1);
    }

    const previousRows = comparePath ? parseCsv(comparePath) : null;
    const currentSummary = summarize(rows, preset);
    const previousSummary = previousRows ? summarize(previousRows, preset) : null;
    const summary = decorateSummaryWithPrevious(currentSummary, previousSummary);
    const markdown = generateMarkdown(summary, period, inputPath, {
        title: preset.title,
        presetKey,
        compareWindow: comparePath ? 'current export vs previous export' : 'single export snapshot',
        compareSourceFile: comparePath,
    });

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
