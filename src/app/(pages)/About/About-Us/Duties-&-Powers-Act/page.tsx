import React from 'react';
import AboutLayout from '@/app/(pages)/About/AboutLayout';

export default function DutiesPowersActPage() {
  return (
    <AboutLayout title="DPC Act — CAG's Duties, Powers and Conditions of Service">
      <div className="space-y-8">
        <p className="text-zinc-600 italic text-sm leading-relaxed border-l-4 border-[#751639] pl-4">
          DPC ACT, 1971: The Comptroller and Auditor-General's (Duties, Powers and Conditions of Service) Amendment Act, 1971.
        </p>

        {/* Table of Contents */}
        <section className="bg-zinc-50 border border-zinc-200 rounded-lg p-6 space-y-6">
          <h3 className="text-lg font-bold text-zinc-800 border-b border-zinc-300 pb-2">Table of Contents</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-[#751639]">Chapter-I: Preliminary</h4>
              <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-1">
                <li>Short Title</li>
                <li>Definitions</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-[#751639]">Chapter-II: Salary &amp; Conditions of Service</h4>
              <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-1">
                <li>Salary &amp; Term of Office</li>
                <li>Leave, Pension &amp; General Provident Fund</li>
                <li>Other conditions of service</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-[#751639]">Chapter-III: Duties &amp; Powers of the CAG</h4>
              <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-1">
                <li>Compile accounts of Union and States</li>
                <li>General provisions relating to audit</li>
                <li>Audit of receipts and expenditure of bodies</li>
                <li>Audit of Government companies &amp; corporations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-[#751639]">Chapter-IV: Miscellaneous</h4>
              <ul className="list-disc pl-5 text-xs text-zinc-600 space-y-1">
                <li>Delegation of power</li>
                <li>Power to make rules &amp; regulations</li>
                <li>Power to dispense with detailed audit</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Chapter 1 */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-[#751639]">Chapter I — Preliminary</h3>
          <p className="text-sm text-zinc-700 leading-relaxed">
            An Act to determine the conditions of service of the Comptroller and Auditor-General of India and to prescribe his duties and powers and for matters connected therewith or incidental thereto.
          </p>
          <p className="text-sm text-zinc-700 leading-relaxed font-semibold">
            Be it enacted by Parliament in the Twenty-second year of the Republic of India as follows:
          </p>

          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-bold text-sm text-zinc-800 mb-1">1. Short Title</h4>
              <p className="text-sm text-zinc-600 leading-relaxed pl-4">
                This Act may be called the Comptroller and Auditor-General's (Duties, Powers and Conditions of Service) Act, 1971.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-sm text-zinc-800 mb-1">2. Definitions</h4>
              <p className="text-sm text-zinc-600 leading-relaxed mb-2">
                In this Act, unless the context otherwise requires:
              </p>
              <ol className="list-decimal pl-6 text-sm text-zinc-600 space-y-2">
                <li>
                  <strong className="text-zinc-800">"Accounts"</strong>, in relation to commercial undertakings of a Government, includes trading, manufacturing and profit and loss accounts and balance-sheets and other subsidiary accounts.
                </li>
                <li>
                  <strong className="text-zinc-800">"Appropriation accounts"</strong> means accounts which relate to the expenditure brought to account during a financial year, the several items specified in the law made in accordance with the provisions of the Constitution or of the Government of Union Territories Act, 1963, for the appropriation of moneys out of the Consolidated Fund of India or of a State.
                </li>
                <li>
                  <strong className="text-zinc-800">"Comptroller and Auditor General"</strong> means the Comptroller and Auditor General of India appointed under article 148 of the Constitution.
                </li>
                <li>
                  <strong className="text-zinc-800">"State"</strong> means a State specified in the First Schedule to the Constitution.
                </li>
                <li>
                  <strong className="text-zinc-800">"Union"</strong> includes a Union territory, whether having a Legislative Assembly or not.
                </li>
              </ol>
            </div>
          </div>
        </section>
      </div>
    </AboutLayout>
  );
}
