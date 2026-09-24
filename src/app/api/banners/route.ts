import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { cdn } from '@/lib/cdn';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const websiteId = searchParams.get('website_id');

    let sql = `
      SELECT id, category_id, text, image, link, hi_link, status, display_order, created_at
      FROM banners
      WHERE status = 1 AND image IS NOT NULL AND image != ''
      ORDER BY display_order ASC, id DESC
      LIMIT $1;
    `;
    let params: any[] = [limit];

    const res = await query(sql, params);

    const banners = res.rows.map((r: any) => {
      let titleEn = '';
      let titleHi = '';

      if (r.text) {
        try {
          const parsed = JSON.parse(r.text);
          titleEn = (parsed.default || parsed.en || '').replace(/<[^>]*>/g, '').trim();
          titleHi = (parsed.hi || titleEn).replace(/<[^>]*>/g, '').trim();
        } catch {
          titleEn = r.text.replace(/<[^>]*>/g, '').trim();
          titleHi = titleEn;
        }
      }

      let imgUrl = r.image ? cdn.banner(r.image) : '';

      return {
        id: r.id,
        title_en: titleEn || 'Supreme Audit Institution of India',
        title_hi: titleHi || 'भारत का सर्वोच्च लेखापरीक्षा संस्थान',
        subtitle_en: titleEn,
        subtitle_hi: titleHi,
        image_url: imgUrl,
        link_url: r.link || '#',
        display_order: r.display_order ?? 0,
        is_active: r.status === 1,
      };
    });

    return NextResponse.json(banners);
  } catch (error: any) {
    console.error('[API /api/banners] error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
