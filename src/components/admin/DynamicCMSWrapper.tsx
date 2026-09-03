'use client';

import React, { useState, useEffect } from 'react';
import { dataManager } from '@/lib/dataManager';

interface DynamicCMSWrapperProps {
  slug: string;
  fallbackContent: React.ReactNode;
}

export default function DynamicCMSWrapper({ slug, fallbackContent }: DynamicCMSWrapperProps) {
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');
  const [cmsData, setCmsData] = useState<{ title: string; contentHtml: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLang(dataManager.getLanguage());
    const handleLangChange = () => {
      setLang(dataManager.getLanguage());
    };
    window.addEventListener('languageChange', handleLangChange);
    return () => window.removeEventListener('languageChange', handleLangChange);
  }, []);

  useEffect(() => {
    // Fetch dynamic page from API
    fetch(`/api/pages/${encodeURIComponent(slug)}`)
      .then(res => {
        if (!res.ok) throw new Error('Page not found in DB');
        return res.json();
      })
      .then(data => {
        if (data) {
          setCmsData({
            title: lang === 'हिन्दी' ? (data.title_hi || data.title) : data.title,
            contentHtml: lang === 'हिन्दी' ? (data.content_hi || data.content_html) : data.content_html
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setCmsData(null);
        setLoading(false);
      });
  }, [slug, lang]);

  if (loading) {
    return <div className="text-center py-20 text-[#0a3d30] font-medium">Loading Content...</div>;
  }

  if (cmsData) {
    return (
      <div className="cms-dynamic-content py-4">
        <h2 className="text-2xl font-bold mb-6 text-[#0a3d30]">{cmsData.title}</h2>
        <div 
          className="prose max-w-none text-zinc-700 text-sm leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: cmsData.contentHtml }} 
        />
      </div>
    );
  }

  return <>{fallbackContent}</>;
}
