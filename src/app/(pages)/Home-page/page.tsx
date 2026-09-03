'use client';

import React from 'react';
import Banner from './Banner/Banner';
import LatestReports from './Latest Audit Reports & Accounts/LatestReports';
import WhoWeAre from './Who We Are/WhoWeAre';
import Details from './Details/Details';
import NewsEvents from './News & Events/NewsEvents';

export default function HomePage() {
  return (
    <div className="space-y-0">
      <Banner />
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
