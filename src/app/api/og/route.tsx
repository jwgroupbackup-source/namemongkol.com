import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const size = { width: 1200, height: 630 };

function limit(text: string, max = 120) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function toTitleCase(text: string) {
  if (!text) return '';
  return text
    .split(' ')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

// Use raw.githubusercontent.com directly — github.com/raw/* redirects to it,
// but Edge Runtime does NOT follow redirects, so the old URL returned HTML instead of binary.
const fontBold = fetch(
  'https://raw.githubusercontent.com/google/fonts/main/ofl/notosansthai/NotoSansThai-Bold.ttf'
).then((res) => {
  if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
  return res.arrayBuffer();
}).catch(() => null); // graceful fallback: render image without custom font vs. hard crash

export async function GET(req: Request) {
  const fontData = await fontBold;
  const { searchParams } = new URL(req.url);
  const variant = searchParams.get('variant') || 'default';

  const title = limit(searchParams.get('title') || 'NameMongkol - วิเคราะห์ชื่อมงคล');
  const subtitle = limit(
    searchParams.get('subtitle') ||
    'วิเคราะห์ชื่อ-นามสกุล ผลรวมเลขศาสตร์ ทักษา อายตนะ 6 พร้อมคำแนะนำเสริมดวง'
  );
  const tag = limit(searchParams.get('tag') || 'namemongkol.com', 40);

  const name = limit(searchParams.get('name') || 'ชื่อของคุณ', 48);
  const surname = limit(searchParams.get('surname') || '', 48);
  const score = searchParams.get('score');
  const scoreLabel = score ? `ผลรวม ${score}` : '';

  const articleCategory = toTitleCase(limit(searchParams.get('category') || '', 40));
  const articleMeta = limit(searchParams.get('meta') || '', 80);

  const baseBackground = 'linear-gradient(135deg, #0f172a 0%, #111827 40%, #111827 70%, #0b1224 100%)';

  const pillStyle = {
    padding: '10px 18px',
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.08)',
    color: '#cbd5e1',
    fontSize: 22,
    border: '1px solid rgba(255,255,255,0.08)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 10,
  } as const;

  let content: React.ReactNode;

  if (variant === 'analysis') {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ ...pillStyle, background: 'rgba(99,102,241,0.15)', color: '#c7d2fe', borderColor: 'rgba(99,102,241,0.35)' }}>
            วิเคราะห์ชื่อมงคล
          </div>
          {scoreLabel && (
            <div style={{ ...pillStyle, background: 'rgba(16,185,129,0.15)', color: '#a7f3d0', borderColor: 'rgba(16,185,129,0.35)' }}>
              {scoreLabel}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 64, fontWeight: 800, color: '#f8fafc', letterSpacing: -1 }}>{name} {surname}</div>
          <div style={{ fontSize: 30, color: '#cbd5e1', maxWidth: 900 }}>{subtitle}</div>
        </div>
      </div>
    );
  } else if (variant === 'phone') {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', gap: 0 }}>
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <span style={{ fontSize: 72, fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>
            วิเคราะห์เบอร์มงคล
          </span>
          <span style={{ fontSize: 72, fontWeight: 800, color: '#fbbf24', lineHeight: 1 }}>
            แม่นยำที่สุด!
          </span>
        </div>

        {/* Subtitle */}
        <div style={{ fontSize: 46, fontWeight: 700, color: '#f1f5f9', marginBottom: 24 }}>
          เช็คเกรดเบอร์โทรศัพท์ พร้อมกราฟเจาะลึกรอบด้าน
        </div>

        {/* Description */}
        <div style={{ fontSize: 26, color: '#94a3b8', maxWidth: 880, lineHeight: 1.6, display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 48 }}>
          <span>เช็คเบอร์มงคลฟรี ด้วยระบบ AI อัจฉริยะ วิเคราะห์ลึกถึงคู่เลข ผลรวม และกราฟ</span>
          <span>ชีวิต รู้ทันทีว่าเบอร์ดีหรือร้าย พร้อมวิธีแก้เคล็ดที่ <span style={{ color: '#cbd5e1' }}>Namemongkol</span></span>
        </div>

        {/* Mock Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 860,
          height: 100,
          background: 'rgba(30, 41, 59, 0.4)',
          border: '1px solid rgba(71, 85, 105, 0.4)',
          borderRadius: 24,
          padding: '8px 8px 8px 32px',
        }}>
          <span style={{ fontSize: 28, color: '#64748b', letterSpacing: '0.02em' }}>
            ใส่เบอร์ทั้ง 10 หลัก (เช่น 0812345678)
          </span>

          {/* Button */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#334155',
            padding: '0 32px',
            height: '100%',
            borderRadius: 18,
            gap: 12,
            border: '1px solid rgba(255,255,255,0.05)'
          }}>
            {/* Search Icon */}
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <span style={{ fontSize: 26, fontWeight: 600, color: 'white' }}>ทำนายเบอร์</span>
          </div>
        </div>
      </div>
    );
  } else if (variant === 'article') {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          {articleCategory ? (
            <div style={{ ...pillStyle, background: 'rgba(236,72,153,0.16)', color: '#fecdd3', borderColor: 'rgba(236,72,153,0.45)' }}>
              {articleCategory}
            </div>
          ) : null}
          <div style={{ ...pillStyle, background: 'rgba(59,130,246,0.16)', color: '#bfdbfe', borderColor: 'rgba(59,130,246,0.35)', fontSize: 20 }}>
            บทความ NameMongkol
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ fontSize: 58, fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>{title}</div>
          {articleMeta && (
            <div style={{ fontSize: 28, color: '#cbd5e1', maxWidth: 980 }}>{articleMeta}</div>
          )}
        </div>
      </div>
    );
  } else if (variant === 'about') {
    content = (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', gap: 24 }}>
        <div style={{ ...pillStyle, background: 'rgba(139,92,246,0.16)', color: '#c4b5fd', borderColor: 'rgba(139,92,246,0.35)', fontSize: 20 }}>
          เกี่ยวกับเรา
        </div>
        <div style={{ fontSize: 64, fontWeight: 800, color: '#f8fafc', lineHeight: 1.1 }}>
          NameMongkol
        </div>
        <div style={{ fontSize: 32, color: '#fbbf24', fontWeight: 700 }}>
          ผู้เชี่ยวชาญวิเคราะห์ชื่อมงคล อันดับ 1 ของไทย
        </div>
        <div style={{ fontSize: 24, color: '#94a3b8', maxWidth: 800, lineHeight: 1.5 }}>
          ผสาน 4 ศาสตร์มงคล: เลขศาสตร์ ทักษาปกรณ์ อายตนะ 6 นิรันดร์ศาสตร์ เข้ากับเทคโนโลยี AI
        </div>
      </div>
    );
  } else {
    content = (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingRight: 20 }}>
        {/* Left Side */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24, flex: 1 }}>
          <div style={{ ...pillStyle, background: 'rgba(16,185,129,0.08)', color: '#34d399', borderColor: 'rgba(16,185,129,0.2)', width: 'fit-content', fontSize: 16, fontWeight: 700, padding: '8px 16px', letterSpacing: '0.05em' }}>
            <span style={{ marginRight: 8 }}>●</span> AI-POWERED ANALYSIS
          </div>
          <div style={{ fontSize: 72, fontWeight: 800, color: '#f8fafc', lineHeight: 1.1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              วิเคราะห์
              <span style={{ color: '#34d399' }}>ชื่อมงคล</span>
            </div>
            <div style={{ color: '#fbbf24' }}>พลิกชีวิต</div>
          </div>
          <div style={{ fontSize: 26, color: '#94a3b8', lineHeight: 1.5, maxWidth: 640 }}>
            เจาะลึก 4 ศาสตร์มงคล: โดย <span style={{ color: '#f8fafc', fontWeight: 600 }}>NameMongkol</span> ครบจบในที่เดียว แม่นยำที่สุด
          </div>
        </div>

        {/* Right Side Cards */}
        <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
          {/* Card 1: 99% */}
          <div style={{
            width: 190, height: 190,
            background: 'linear-gradient(180deg, rgba(30,41,59,0.4) 0%, rgba(15,23,42,0.6) 100%)',
            border: '1px solid rgba(51,65,85,0.4)',
            borderRadius: 28,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <div style={{ marginBottom: 16 }}>
              {/* Target Icon */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <circle cx="12" cy="12" r="6" />
                <circle cx="12" cy="12" r="2" />
              </svg>
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>99%</div>
            <div style={{ fontSize: 18, color: '#94a3b8', marginTop: 4 }}>แม่นยำ</div>
          </div>

          {/* Card 2: AI */}
          <div style={{
            width: 190, height: 190,
            background: 'linear-gradient(180deg, rgba(30,41,59,0.4) 0%, rgba(15,23,42,0.6) 100%)',
            border: '1px solid rgba(51,65,85,0.4)',
            borderRadius: 28,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <div style={{ marginBottom: 16 }}>
              {/* Lightning Icon */}
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <div style={{ fontSize: 42, fontWeight: 800, color: '#f8fafc', lineHeight: 1 }}>AI</div>
            <div style={{ fontSize: 18, color: '#94a3b8', marginTop: 4 }}>รวดเร็ว</div>
          </div>
        </div>
      </div>
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: `${size.width}px`,
          height: `${size.height}px`,
          display: 'flex',
          position: 'relative',
          alignItems: 'stretch',
          justifyContent: 'stretch',
          backgroundImage: baseBackground,
          overflow: 'hidden',
          color: '#f8fafc',
          // fontFamily: 'Inter, "Noto Sans Thai", system-ui, -apple-system, sans-serif',
          fontFamily: '"Noto Sans Thai"',
          letterSpacing: '-0.01em',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 520,
            height: 520,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 30%, rgba(99,102,241,0.35), transparent 55%)',
            top: -80,
            right: -60,
            // filter: 'blur(2px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 420,
            height: 420,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 60% 40%, rgba(16,185,129,0.35), transparent 60%)',
            bottom: -140,
            left: -40,
            // filter: 'blur(2px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(120deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 45%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: 28,
            padding: '64px 72px',
            position: 'relative',
            zIndex: 1,
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                display: 'grid',
                placeItems: 'center',
                color: '#fff',
                fontWeight: 800,
                fontSize: 28,
                boxShadow: '0 18px 40px rgba(99,102,241,0.35)',
              }}
            >
              NM
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#e2e8f0' }}>NameMongkol</div>
              <div style={{ fontSize: 18, color: '#cbd5e1' }}>วิเคราะห์ชื่อมงคล อันดับ 1</div>
            </div>
            {variant !== 'default' && (
              <div style={{ marginLeft: 'auto', ...pillStyle, fontSize: 20, background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)' }}>
                {variant === 'analysis' ? 'Personalized Result' : variant === 'article' ? 'Article' : 'Preview'}
              </div>
            )}
          </div>

          {content}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#cbd5e1', fontSize: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 12px #22c55e' }} />
              <span>พร้อมใช้งาน 24/7 · วิเคราะห์ฟรีบางฟีเจอร์</span>
            </div>
            <div style={{ ...pillStyle, fontSize: 20, padding: '10px 16px', background: 'rgba(255,255,255,0.08)', borderColor: 'rgba(255,255,255,0.18)' }}>
              {tag}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
      fonts: fontData
        ? [
            {
              name: 'Noto Sans Thai',
              data: fontData,
              style: 'normal' as const,
              weight: 700,
            },
          ]
        : [],
    }
  );
}
