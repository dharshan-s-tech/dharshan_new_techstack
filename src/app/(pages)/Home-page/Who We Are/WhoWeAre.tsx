'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function WhoWeAre() {
  const [activePopup, setActivePopup] = useState<{ title: string; text: string } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const popupsData: Record<string, string> = {
    'Audit Portal': 'The Audit Portal provides restricted access to authorized public sector officials, central ministries, state department officers, and IA&AD auditors for compiling, submitting, and validating audit files. Please authenticate using your government smart card token key.',
    'Statistics': 'Statistical overview and interactive dashboards compiling public expenditure, audit reports tabled, CA firms audit allocations, and departmental recruitment demographics over the past financial decade.',
    'Contacts': 'Office of the Comptroller and Auditor General of India\nAddress: Pocket-9, Deen Dayal Upadhyaya Marg, New Delhi - 110124\nSupport Hotline: +91-11-23235790\nGeneral Email: cagoffice@cag.gov.in\nOffice Hours: 9:00 AM - 5:30 PM (Monday to Friday)'
  };

  const handleLinkClick = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    const text = popupsData[title] || 'This is a mock description detailing institutional guidelines for the Comptroller and Auditor General of India portal.';
    setActivePopup({ title, text });
  };

  // Determine active item: active only when hovered
  const isItemActive = (index: number) => {
    return hoveredIndex === index;
  };

  return (
    <>
      {/* Most Viewed */}
      <section className="most-viewed" data-node-id="356:17074" aria-labelledby="most-viewed-heading">
        <h2 id="most-viewed-heading" className="section-heading" data-node-id="356:17075">Most Viewed</h2>
        <div 
          className="quick-links" 
          data-node-id="356:17076"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {/* Row 1, Col 1: Latest Reports */}
          <Link 
            href="/Reports" 
            className={`quick-link ${isItemActive(0) ? 'quick-link--active' : ''}`} 
            onMouseEnter={() => setHoveredIndex(0)}
            data-node-id="356:17083"
          >
            <div className="quick-link__icon-wrap">
              <img src="/assets/59d09d67fc097dcb3fe6785027400d737b662e4c.svg" alt="Latest Reports icon" className="quick-link__icon" />
            </div>
            <p className="quick-link__label" data-node-id="356:17095">Latest Reports</p>
          </Link>

          {/* Row 1, Col 2: Accounts */}
          <Link 
            href="/Reports/accounts" 
            className={`quick-link ${isItemActive(1) ? 'quick-link--active' : ''}`}
            onMouseEnter={() => setHoveredIndex(1)} 
            data-node-id="356:17114"
          >
            <div className="quick-link__icon-wrap">
              <img src="/assets/accounts-report.png" alt="Accounts icon" className="quick-link__icon" />
            </div>
            <p className="quick-link__label" data-node-id="356:17118">Accounts</p>
          </Link>

          {/* Row 1, Col 3: Publications */}
          <Link 
            href="/Resources" 
            className={`quick-link ${isItemActive(2) ? 'quick-link--active' : ''}`}
            onMouseEnter={() => setHoveredIndex(2)} 
            data-node-id="356:17124"
          >
            <div className="quick-link__icon-wrap">
              <img src="/assets/3ab96faf3d3790b7f5862061b13bb6914a1bfa1b.svg" alt="Publications icon" className="quick-link__icon" />
            </div>
            <p className="quick-link__label" data-node-id="356:17131">Publications</p>
          </Link>

          {/* Row 2, Col 1: Audit Portal */}
          <a 
            href="#" 
            className={`quick-link ${isItemActive(3) ? 'quick-link--active' : ''}`}
            onMouseEnter={() => setHoveredIndex(3)} 
            onClick={(e) => handleLinkClick(e, 'Audit Portal')} 
            data-node-id="356:17096"
          >
            <div className="quick-link__icon-wrap">
              <img src="/assets/audit-portal.svg" alt="Audit Portal icon" className="quick-link__icon quick-link__icon--audit" />
            </div>
            <p className="quick-link__label" data-node-id="356:17113">Audit Portal</p>
          </a>

          {/* Row 2, Col 2: Statistics */}
          <a 
            href="#" 
            className={`quick-link ${isItemActive(4) ? 'quick-link--active' : ''}`}
            onMouseEnter={() => setHoveredIndex(4)} 
            onClick={(e) => handleLinkClick(e, 'Statistics')} 
            data-node-id="356:17119"
          >
            <div className="quick-link__icon-wrap">
              <img src="/assets/a34af813ad6761ed67820237129e6e411ff04a5a.svg" alt="Statistics icon" className="quick-link__icon" />
            </div>
            <p className="quick-link__label" data-node-id="356:17123">Statistics</p>
          </a>

          {/* Row 2, Col 3: Contacts */}
          <a 
            href="#" 
            className={`quick-link ${isItemActive(5) ? 'quick-link--active' : ''}`}
            onMouseEnter={() => setHoveredIndex(5)} 
            onClick={(e) => handleLinkClick(e, 'Contacts')} 
            data-node-id="356:17132"
          >
            <div className="quick-link__icon-wrap">
              <svg 
                className="quick-link__icon" 
                viewBox="0 0 48 48" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="24" cy="15" r="7.5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M10 40C10 32.5 16.2 27 24 27C31.8 27 38 32.5 38 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="quick-link__label" data-node-id="356:17136">Contacts</p>
          </a>
        </div>
      </section>

      {/* Horizontal Divider between Most Viewed and Who We Are */}
      <div className="home-section-divider"></div>

      {/* Who We Are details */}
      <section className="who-we-are" data-node-id="356:17138" aria-labelledby="who-we-are-heading">
        <div className="who-we-are__intro" data-node-id="356:17140">
          <h2 id="who-we-are-heading" className="section-heading" data-node-id="356:17141">Who We Are</h2>
          <p className="section-subtext" data-node-id="356:17142">
            The Comptroller and Auditor General of India is an independent supreme audit institution responsible for auditing all government revenues and expenditures.
          </p>
        </div>
        <div className="who-we-are__details" data-node-id="356:17143">
          <div className="cag-cards" data-node-id="356:17144">
            <div className="cag-card" data-node-id="356:17148">
              <div className="cag-card__icon">
                <img src="/assets/6482d2822bc16f1e27c743aba1a1d5efe9974975.svg" alt="Constitutional Role icon" />
              </div>
              <div className="cag-card__divider"></div>
              <h3 className="cag-card__title">Constitutional Role</h3>
              <p className="cag-card__desc">Appointed under Article 148 of the Indian Constitution as guardian of public finances.</p>
            </div>
            <div className="cag-card" data-node-id="356:17152">
              <div className="cag-card__icon">
                <img src="/assets/d296a6454ef5b1d6927204433862eee4294545d4.svg" alt="Our Mission icon" />
              </div>
              <div className="cag-card__divider"></div>
              <h3 className="cag-card__title">Our Mission</h3>
              <p className="cag-card__desc">To conduct comprehensive audits ensuring transparency, accountability, and efficiency.</p>
            </div>
            <div className="cag-card" data-node-id="356:17156">
              <div className="cag-card__icon">
                <img src="/assets/d8fd77ee881f90073f924df1844719ec722ec892.svg" alt="Global Standards icon" />
              </div>
              <div className="cag-card__divider"></div>
              <h3 className="cag-card__title">Global Standards</h3>
              <p className="cag-card__desc">Following International Standards of Supreme Audit Institutions and best practices.</p>
            </div>
            <div className="cag-card" data-node-id="356:17161">
              <div className="cag-card__icon">
                <img src="/assets/c432a5b68483c46d01761b0880d7551cd6d812f2.svg" alt="Performance Audits icon" />
              </div>
              <div className="cag-card__divider"></div>
              <h3 className="cag-card__title">Performance Audits</h3>
              <p className="cag-card__desc">Beyond financial compliance, we audit programs for economy, efficiency, and effectiveness.</p>
            </div>
          </div>
          <Link href="/About/About-Us/Our-Vision,-Mission-&-Core-Values" className="btn btn--outline-dark" data-node-id="356:17162">
            Learn More
          </Link>
        </div>
      </section>

      {/* Stats band */}
      <section className="stats" data-node-id="356:17163" aria-label="Key statistics">
        <div className="stats__inner" data-node-id="356:17165">
          <div className="stat" data-node-id="356:17166">
            <img src="/assets/eebeff0eb4acf32e821992e39ae1a96ca7d9bf95.svg" alt="" className="stat__icon" />
            <p className="stat__number" data-node-id="356:17173">150+</p>
            <p className="stat__caption" data-node-id="356:17175">Years of excellence\nFounded in 1858</p>
          </div>
          <div className="stat" data-node-id="356:17176">
            <img src="/assets/4ac162869e8195d293791744857e765655519102.svg" alt="" className="stat__icon" />
            <p className="stat__number" data-node-id="356:17182">700+</p>
            <p className="stat__caption" data-node-id="356:17184">Reports tabled In Parliament annually</p>
          </div>
          <div className="stat" data-node-id="356:17185">
            <img src="/assets/966e437fa2336aee29c529b12cc4d949d9cfae00.svg" alt="" className="stat__icon" />
            <p className="stat__number" data-node-id="356:17190">28+</p>
            <p className="stat__caption" data-node-id="356:17192">State audit offices \nPan-India average</p>
          </div>
          <div className="stat" data-node-id="356:17193">
            <img src="/assets/1f82b2a28cc40a20776e4b740699bded23f2f91c.svg" alt="" className="stat__icon" />
            <p className="stat__number" data-node-id="356:17204">700+</p>
            <p className="stat__caption" data-node-id="356:17206">Officers &amp; Staff IAAD workforce</p>
          </div>
        </div>
      </section>

      {/* Info Popup Modal */}
      {activePopup && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl overflow-hidden max-w-xl w-full shadow-2xl relative">
            <div className="p-4 border-b border-[#e6e6e6] flex justify-between items-center bg-[#0a3d30]">
              <h3 className="font-bold text-white text-sm">{activePopup.title}</h3>
              <button 
                onClick={() => setActivePopup(null)}
                className="text-white hover:text-zinc-300 font-bold text-sm cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            <div className="p-6 text-sm text-zinc-700 leading-relaxed whitespace-pre-line">
              {activePopup.text}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
 