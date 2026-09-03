import React from 'react';
import AboutLayout from '@/app/(pages)/About/AboutLayout';
import FormerCAGCards from '@/Reusable components/Cards/Former CAG Cards/FormerCAGCards';

export default function FormerCAGPage() {
  return (
    <AboutLayout title="Former-Comptroller-and-Auditors-General">
      <FormerCAGCards />
    </AboutLayout>
  );
}
