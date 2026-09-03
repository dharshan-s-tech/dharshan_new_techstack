import React from 'react';

interface HeroProps {
  title: string;
  subtitle?: string;
  bgImage?: string;
}

export default function Hero({ title, subtitle, bgImage }: HeroProps) {
  return (
    <section className="bg-[#0a3d30] text-white py-16 relative overflow-hidden">
      {bgImage && (
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img src={bgImage} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base sm:text-lg text-[#e6ecea] max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
