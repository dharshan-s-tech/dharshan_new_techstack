'use client';

import React from 'react';
import HomeBanner from '@/components/hero/HomeBanner';
import LatestReports from '@/features/home/LatestReports';
import WhoWeAre from '@/features/home/WhoWeAre';
import Details from '@/features/home/Details';
import NewsEvents from '@/features/home/NewsEvents';

export default function HomeView() {
  return (
    <div className="space-y-0">
      <HomeBanner />
      <LatestReports />
      <div className="content-bg" data-node-id="356:17043">
        <div className="content" data-node-id="356:17073">
          <WhoWeAre />
          <Details />
          <NewsEvents />
        </div>
      </div>
    </div>
  );
}
