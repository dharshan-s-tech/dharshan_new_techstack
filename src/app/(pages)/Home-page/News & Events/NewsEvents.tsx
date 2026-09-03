'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { dataManager, NewsItem } from '@/lib/dataManager';
import defaultFeaturedNewsImage from '@/app/Assets/Images/e2c5a3b888a0623426c634ce2f2bee016b8fb5ab.png';
import newsImage1 from '@/app/Assets/Images/4c1eaa81c93edbe02d6f7d5437565571dcec4b04.png';
import newsImage2 from '@/app/Assets/Images/cc8a1a5614f48c98f397dcafcf38e8f22843dc2a.png';
import newsImage3 from '@/app/Assets/Images/269d11ffce72c4343f0fa24955e0dc48a33d8255.png';

const getNewsImage = (id: string) => {
  if (id === 'news-1') return newsImage1.src;
  if (id === 'news-2') return newsImage2.src;
  if (id === 'news-3') return newsImage3.src;
  return defaultFeaturedNewsImage.src;
};

const HINDI_NEWS_TRANSLATIONS: Record<string, { title: string; desc: string }> = {
  'news-1': {
    title: '2025-26 के लिए केंद्र सरकार के वित्त खातों का विमोचन',
    desc: 'केंद्रीय मंत्रालयों के लिए लेखा परीक्षित वित्त और विनियोग खातों के विवरण का आधिकारिक प्रकाशन।'
  },
  'news-2': {
    title: 'पर्यावरण लेखा परीक्षा पर अंतर्राष्ट्रीय प्रशिक्षण कार्यक्रम शुरू',
    desc: 'iCISA पारिस्थितिक नीतियों के ऑडिट में 32 देशों के प्रतिनिधियों के लिए विशेष प्रशिक्षण की मेजबानी करता है।'
  },
  'news-3': {
    title: 'वित्तीय वर्ष 2026-27 के लिए चार्टर्ड अकाउंटेंट फर्मों के लिए पैनल खोलना',
    desc: 'योग्य सीए फर्में सार्वजनिक क्षेत्र की इकाइयों में ऑडिट आवंटन के लिए ऑनलाइन आवेदन जमा कर सकती हैं।'
  },
  'news-featured': {
    title: 'सीएजी ने भारतीय रेलवे आधुनिकीकरण योजनाओं पर निष्पादन लेखा परीक्षा रिपोर्ट पेश की',
    desc: 'संसद में पेश की गई सिग्नलिंग सिस्टम ऑडिट रिपोर्ट का विवरण देने वाली प्रमुख खबर।'
  }
};

const HINDI_VIDEOS_TRANSLATIONS: Record<string, { title: string; desc: string }> = {
  'v1': {
    title: 'वार्षिक लेखा परीक्षा शिखर सम्मेलन की कार्यवाही',
    desc: 'सार्वजनिक क्षेत्र के लेखा परीक्षा ढांचे पर राष्ट्रीय सम्मेलन के दौरान चर्चा की गई प्रमुख निष्कर्षों की मुख्य विशेषताएं।'
  },
  'v2': {
    title: 'प्रत्यक्ष लाभ अंतरण लेखा परीक्षा',
    desc: 'डिजिटल गवर्नेंस ऑडिट का विजुअल विवरण, सीधे नागरिकों तक पहुंचने वाले नकद कल्याणकारी योजनाओं के लाभों को ट्रैक करना।'
  },
  'v3': {
    title: 'राज्य वित्त समीक्षा दिशा-निर्देश',
    desc: 'एक ट्यूटोरियल वीडियो जिसमें बताया गया है कि महालेखाकार वार्षिक राज्य वित्त रिपोर्ट फाइलों को कैसे संकलित और समीक्षा करते हैं।'
  }
};

export default function NewsEvents() {
  const [activeVideo, setActiveVideo] = useState<{ title: string; embedUrl: string } | null>(null);
  const [activePopup, setActivePopup] = useState<{ title: string; text: string } | null>(null);

  const [trendingNews, setTrendingNews] = useState<NewsItem[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsItem | null>(null);
  const [lang, setLang] = useState<'English' | 'हिन्दी'>('English');

  useEffect(() => {
    const loadNewsData = () => {
      const all = dataManager.getNews();
      setTrendingNews(all.filter(n => n.type === 'trending'));
      setFeaturedNews(all.find(n => n.type === 'featured') || null);
    };

    loadNewsData();
    setLang(dataManager.getLanguage());

    const handleLangChange = () => setLang(dataManager.getLanguage());
    window.addEventListener('languageChange', handleLangChange);
    window.addEventListener('newsChange', loadNewsData);

    return () => {
      window.removeEventListener('languageChange', handleLangChange);
      window.removeEventListener('newsChange', loadNewsData);
    };
  }, []);

  const isHindi = lang === 'हिन्दी';

  const videosList = [
    {
      id: 'v1',
      title: isHindi ? HINDI_VIDEOS_TRANSLATIONS.v1.title : 'Annual Audit Summit Proceedings',
      desc: isHindi ? HINDI_VIDEOS_TRANSLATIONS.v1.desc : 'Highlights of key findings discussed during the national conference on public sector audit frameworks.',
      date: 'June 4, 2026',
      tag: 'Finance',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 'v2',
      title: isHindi ? HINDI_VIDEOS_TRANSLATIONS.v2.title : 'Direct Benefit Transfer Audits',
      desc: isHindi ? HINDI_VIDEOS_TRANSLATIONS.v2.desc : 'Visual breakdown of digital governance audits, tracking cash welfare schemes benefits reaching citizens directly.',
      date: 'June 4, 2026',
      tag: 'Finance',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    },
    {
      id: 'v3',
      title: isHindi ? HINDI_VIDEOS_TRANSLATIONS.v3.title : 'State Finances Reviews Guidelines',
      desc: isHindi ? HINDI_VIDEOS_TRANSLATIONS.v3.desc : 'A tutorial video explaining how accountant generals compile and review annual state finance report files.',
      date: 'June 4, 2026',
      tag: 'Finance',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
  ];

  return (
    <>
      {/* Latest Videos */}
      <section className="videos" aria-labelledby="videos-heading">
        <h2 id="videos-heading" className="section-heading">
          {isHindi ? 'नवीनतम वीडियो' : 'Latest Videos'}
        </h2>
        <div className="videos__grid">
          {videosList.map((video) => (
            <article 
              key={video.id} 
              className="video-card"
              onClick={() => setActiveVideo({ title: video.title, embedUrl: video.embedUrl })}
            >
              <div className="video-card__banner bg-[#e6e6e6] aspect-video relative flex items-center justify-center">
                <div 
                  className="video-card__play cursor-pointer hover:scale-110 transition-transform" 
                  aria-label="Play video"
                >
                  <img src="/assets/6a8e196ed104ce6e5fe5cd7fe7a791b5a5fc2769.svg" alt="" />
                </div>
              </div>
              <div className="video-card__details">
                <div className="video-card__meta">
                  <span className="video-card__date">{video.date}</span>
                  <span className="video-card__tag">{video.tag}</span>
                </div>
                <h3 className="video-card__title">{video.title}</h3>
                <p className="video-card__desc">{video.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* News & Events */}
      <section className="news-events" aria-labelledby="news-events-heading">
        <div className="news-events__intro">
          <h2 id="news-events-heading" className="section-heading">
            {isHindi ? 'समाचार एवं घटनाएँ' : 'News & Events'}
          </h2>
          <p className="section-subtext">
            {isHindi 
              ? 'भारत के नियंत्रक और महालेखापरीक्षक द्वारा हाल ही में प्रकाशित लेखा परीक्षा रिपोर्टों, वित्तीय विवरणों और जवाबदेही समीक्षाओं का पता लगाएं।' 
              : 'Explore recently published audit reports, financial statements, and accountability reviews from the Comptroller and Auditor General of India.'}
          </p>
        </div>
        <div className="news-events__grid">
          <div className="trending-news">
            <h3 className="trending-news__heading">
              {isHindi ? 'ट्रेंडिंग समाचार' : 'Trending News'}
            </h3>
            
            {trendingNews.map((news) => {
              const details = isHindi && HINDI_NEWS_TRANSLATIONS[news.id] ? HINDI_NEWS_TRANSLATIONS[news.id] : {
                title: news.title,
                desc: news.desc
              };

              const isEmpanelment = news.id === 'news-3' || news.title.toLowerCase().includes('empanelment');
              const isTraining = news.id === 'news-2' || news.title.toLowerCase().includes('training');
              const isAccounts = news.id === 'news-1' || news.title.toLowerCase().includes('accounts');
              
              if (isEmpanelment) {
                return (
                  <div 
                    key={news.id}
                    className="trending-card cursor-pointer hover:bg-zinc-50 transition-colors"
                    onClick={() => setActivePopup({
                      title: details.title,
                      text: isHindi 
                        ? 'भारत के सीएजी के कार्यालय के साथ वित्तीय वर्ष 2026-27 के लिए चार्टर्ड अकाउंटेंट फर्मों का ऑनलाइन पैनल खुला है।\n\nपात्र फर्में 1 अगस्त, 2026 से 15 सितंबर, 2026 तक ऑनलाइन आवेदन जमा कर सकती हैं।\n\nकृपया दस्तावेज जमा करने और आवेदन की स्थिति को ट्रैक करने के लिए आधिकारिक सीएजी पोर्टल https://cag.gov.in/en/empanelment-ca-firms पर जाएं।'
                        : news.desc
                    })}
                  >
                    <div className="trending-card__thumb" aria-hidden="true" style={{ overflow: 'hidden' }}>
                      <img 
                        src={getNewsImage(news.id)} 
                        alt="" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                      />
                    </div>
                    <div className="trending-card__details">
                      <span className="trending-card__date">{news.date}</span>
                      <h4 className="trending-card__title">{details.title}</h4>
                      <p className="trending-card__desc">{details.desc}</p>
                    </div>
                  </div>
                );
              }

              const href = isAccounts 
                ? '/Reports/accounts' 
                : isTraining 
                  ? '/Our-Presence/Index-Menu/Traning-Institutes?filter=iced' 
                  : '/Reports';

              return (
                <Link 
                  key={news.id}
                  href={href} 
                  className="trending-card cursor-pointer hover:bg-zinc-50 transition-colors block"
                >
                  <div className="trending-card__thumb" aria-hidden="true" style={{ overflow: 'hidden' }}>
                    <img 
                      src={getNewsImage(news.id)} 
                      alt="" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} 
                    />
                  </div>
                  <div className="trending-card__details">
                    <span className="trending-card__date">{news.date}</span>
                    <h4 className="trending-card__title">{details.title}</h4>
                    <p className="trending-card__desc">{details.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {featuredNews && (
            <Link href="/Reports/rep-3" className="featured-news cursor-pointer block hover:scale-[1.01] transition-transform">
              <img 
                src={featuredNews.image || defaultFeaturedNewsImage.src} 
                alt={isHindi && HINDI_NEWS_TRANSLATIONS['news-featured'] ? HINDI_NEWS_TRANSLATIONS['news-featured'].title : featuredNews.title} 
                className="featured-news__photo" 
              />
              <div className="featured-news__overlay"></div>
              <span className="featured-news__tag">{isHindi ? 'समाचार' : (featuredNews.tag || 'News')}</span>
              <div className="featured-news__text">
                <span className="featured-news__date">{featuredNews.date}</span>
                <h3 className="featured-news__headline">
                  {isHindi && HINDI_NEWS_TRANSLATIONS['news-featured'] ? HINDI_NEWS_TRANSLATIONS['news-featured'].title : featuredNews.title}
                </h3>
              </div>
            </Link>
          )}
        </div>
      </section>

      {/* Video Play Modal */}
      {activeVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl overflow-hidden max-w-3xl w-full shadow-2xl relative">
            <div className="p-4 border-b border-[#e6e6e6] flex justify-between items-center bg-[#0a3d30]">
              <h3 className="font-bold text-white text-sm">{activeVideo.title}</h3>
              <button 
                onClick={() => setActiveVideo(null)}
                className="text-white hover:text-zinc-300 font-bold text-sm cursor-pointer bg-transparent border-none"
              >
                ✕ {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe 
                src={activeVideo.embedUrl} 
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Info Popup Modal */}
      {activePopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl overflow-hidden max-w-xl w-full shadow-2xl relative">
            <div className="p-4 border-b border-[#e6e6e6] flex justify-between items-center bg-[#0a3d30]">
              <h3 className="font-bold text-white text-sm">{activePopup.title}</h3>
              <button 
                onClick={() => setActivePopup(null)}
                className="text-white hover:text-zinc-300 font-bold text-sm cursor-pointer bg-transparent border-none"
              >
                ✕ {isHindi ? 'बंद करें' : 'Close'}
              </button>
            </div>
            <div className="p-6 text-sm text-zinc-700 leading-relaxed whitespace-pre-line bg-[#fbfbfb]">
              {activePopup.text}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
