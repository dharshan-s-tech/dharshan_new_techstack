/**
 * Parse bilingual CMS text stored as plain string or JSON:
 * {"default":"English title","hi":"हिन्दी शीर्षक"} / {"en":"...","hi":"..."}
 */
export function parseLocalizedText(
  raw: unknown,
  lang: 'en' | 'hi' = 'en'
): string {
  if (raw == null) return '';
  if (typeof raw !== 'string') {
    if (typeof raw === 'object') {
      const obj = raw as Record<string, unknown>;
      const pick =
        (lang === 'hi'
          ? obj.hi || obj.hindi || obj.default || obj.en
          : obj.default || obj.en || obj.hi) ?? '';
      return String(pick).trim();
    }
    return String(raw).trim();
  }

  const s = raw.trim();
  if (!s) return '';

  if (s.startsWith('{') && s.endsWith('}')) {
    try {
      const j = JSON.parse(s) as Record<string, unknown>;
      if (j && typeof j === 'object') {
        const pick =
          (lang === 'hi'
            ? j.hi || j.hindi || j.default || j.en
            : j.default || j.en || j.hi) ?? '';
        const text = String(pick).trim();
        if (text) return text;
      }
    } catch {
      // fall through
    }
  }

  return s.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function parseLocalizedPair(raw: unknown): { en: string; hi: string } {
  return {
    en: parseLocalizedText(raw, 'en'),
    hi: parseLocalizedText(raw, 'hi'),
  };
}
