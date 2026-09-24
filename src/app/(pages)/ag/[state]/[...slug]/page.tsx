import React from 'react';
import GenericStateSubsiteDynamicView from '@/components/states/GenericStateSubsiteDynamicView';

interface PageProps {
  params: Promise<{
    state: string;
    slug: string[];
  }>;
}

export default async function AgStateSubsiteDynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <GenericStateSubsiteDynamicView
      state={resolvedParams.state}
      slug={resolvedParams.slug}
      prefix="ag"
    />
  );
}
