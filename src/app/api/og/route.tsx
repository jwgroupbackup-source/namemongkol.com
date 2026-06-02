import { ImageResponse } from 'next/og';

export const runtime = 'edge';

const size = { width: 1200, height: 630 };

type OgVariant = 'default' | 'article' | 'about' | 'phone' | 'analysis';

const variantConfig: Record<OgVariant, { eyebrow: string; title: string; subtitle: string; accent: string; tag: string }> = {
  default: {
    eyebrow: 'AI-Powered Name Analysis',
    title: 'วิเคราะห์ชื่อมงคล',
    subtitle: 'ตรวจชื่อ นามสกุล เลขศาสตร์ ทักษา และอายตนะ 6 เพื่อเลือกชื่อที่เหมาะกับคุณ',
    accent: '#34d399',
    tag: 'NameMongkol',
  },
  article: {
    eyebrow: 'NameMongkol Articles',
    title: 'บทความชื่อมงคล',
    subtitle: 'คลังความรู้การตั้งชื่อ เลขศาสตร์ ทักษาปกรณ์ และเคล็ดลับเสริมดวง',
    accent: '#f59e0b',
    tag: 'Articles',
  },
  about: {
    eyebrow: 'About NameMongkol',
    title: 'NameMongkol',
    subtitle: 'ผู้เชี่ยวชาญด้านการวิเคราะห์ชื่อมงคลด้วยศาสตร์ไทยและเทคโนโลยีสมัยใหม่',
    accent: '#a78bfa',
    tag: 'About',
  },
  phone: {
    eyebrow: 'Phone Number Analysis',
    title: 'วิเคราะห์เบอร์มงคล',
    subtitle: 'เช็กพลังตัวเลข คู่เลข และภาพรวมเบอร์โทรศัพท์ก่อนเลือกใช้จริง',
    accent: '#38bdf8',
    tag: 'Phone',
  },
  analysis: {
    eyebrow: 'Personalized Result',
    title: 'ผลวิเคราะห์ชื่อ',
    subtitle: 'สรุปคะแนนและคำแนะนำเพื่อปรับชื่อให้สมดุลกับเป้าหมายชีวิต',
    accent: '#c9933a',
    tag: 'Analysis',
  },
};

function limit(text: string, max = 120) {
  if (!text) return '';
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

async function loadFont(requestUrl: string, path: string) {
  const fontUrl = new URL(path, requestUrl);
  const response = await fetch(fontUrl);

  if (!response.ok) {
    throw new Error(`OG font fetch failed: ${response.status}`);
  }

  return response.arrayBuffer();
}

export async function GET(req: Request) {
  const [thaiFontData, latinFontData] = await Promise.all([
    loadFont(req.url, '/fonts/noto-sans-thai-thai-400.woff'),
    loadFont(req.url, '/fonts/noto-sans-thai-latin-400.woff'),
  ]);
  const { searchParams } = new URL(req.url);
  const variantParam = searchParams.get('variant') as OgVariant | null;
  const variant: OgVariant = variantParam && variantParam in variantConfig ? variantParam : 'default';
  const config = variantConfig[variant];

  const title = limit(searchParams.get('title') || searchParams.get('name') || config.title, 72);
  const subtitle = limit(searchParams.get('subtitle') || searchParams.get('meta') || config.subtitle, 120);
  const tag = limit(searchParams.get('tag') || searchParams.get('category') || config.tag, 36);

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #050711 0%, #0f172a 52%, #111827 100%)',
          color: '#f8fafc',
          fontFamily: 'Noto Sans Thai',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -150,
            right: -100,
            width: 520,
            height: 520,
            borderRadius: 520,
            background: `radial-gradient(circle, ${config.accent}55 0%, transparent 64%)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -170,
            left: -90,
            width: 460,
            height: 460,
            borderRadius: 460,
            background: 'radial-gradient(circle, rgba(148,163,184,0.25) 0%, transparent 62%)',
          }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            padding: '66px 76px',
            position: 'relative',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 68,
                  height: 68,
                  borderRadius: 18,
                  background: `linear-gradient(135deg, ${config.accent}, #f8fafc22)`,
                  color: '#f8fafc',
                  fontSize: 28,
                  fontWeight: 700,
                }}
              >
                NM
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ fontSize: 28, fontWeight: 700 }}>NameMongkol</div>
                <div style={{ fontSize: 18, color: '#cbd5e1' }}>วิเคราะห์ชื่อมงคลอันดับต้นของไทย</div>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid rgba(248,250,252,0.18)',
                borderRadius: 999,
                padding: '10px 18px',
                background: 'rgba(15,23,42,0.72)',
                color: '#e2e8f0',
                fontSize: 20,
              }}
            >
              {tag}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 880 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: `1px solid ${config.accent}66`,
                borderRadius: 999,
                padding: '10px 18px',
                background: `${config.accent}22`,
                color: config.accent,
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {config.eyebrow}
            </div>
            <div style={{ fontSize: 76, lineHeight: 1.06, fontWeight: 700, letterSpacing: 0 }}>
              {title}
            </div>
            <div style={{ fontSize: 31, lineHeight: 1.45, color: '#cbd5e1' }}>
              {subtitle}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#cbd5e1', fontSize: 22 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: 10, background: config.accent }} />
              <div>namemongkol.com</div>
            </div>
            <div>ศาสตร์ไทยและ AI เพื่อการตัดสินใจที่มั่นใจขึ้น</div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      },
      fonts: [
        {
          name: 'Noto Sans Thai',
          data: thaiFontData,
          style: 'normal',
          weight: 400,
        },
        {
          name: 'Noto Sans Thai',
          data: latinFontData,
          style: 'normal',
          weight: 400,
        },
      ],
    }
  );
}
