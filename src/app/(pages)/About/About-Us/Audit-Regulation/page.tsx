import React from 'react';
import AboutLayout from '@/app/(pages)/About/AboutLayout';

export default function AuditRegulationPage() {
  const documents = [
    {
      title: 'Gazette publication-Regulations on Audit & Accounts -2020',
      type: 'PDF Document',
      size: '34.7 MB'
    },
    {
      title: 'Book - Regulations on Audit & Accounts -2020',
      type: 'PDF Document',
      size: '12.4 MB'
    },
    {
      title: 'Earlier Version on Regulation on Audit & Accounts - 2007',
      type: 'PDF Document',
      size: '8.2 MB'
    }
  ];

  return (
    <AboutLayout title="Audit-Regulation">
      <div className="space-y-6">
        <p className="text-sm text-zinc-600 mb-6">
          The Regulations on Audit and Accounts govern the scope, standards, and methods of audit conducted by the Comptroller and Auditor General of India, updated to reflect current governance practices.
        </p>

        <div className="space-y-4">
          {documents.map((doc, idx) => (
            <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-zinc-50 border border-zinc-200 rounded-lg hover:border-zinc-300 transition-colors">
              <div className="mb-3 sm:mb-0">
                <h4 className="font-bold text-sm text-[#751639]">{doc.title}</h4>
                <p className="text-xs text-zinc-500">{doc.type}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-500 font-semibold">{doc.size}</span>
                <a 
                  href="#" 
                  className="px-4 py-2 bg-[#751639] text-white text-xs font-semibold rounded hover:bg-[#801e42] transition-colors"
                >
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AboutLayout>
  );
}
