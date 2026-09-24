import React from 'react';
import GenericStateSubsiteDynamicPage from '../../[state]/[...slug]/page';
import { ANDHRA_PRADESH_PAGES } from '@/data/stateSubsites/andhraPradeshPages';

export async function generateStaticParams() {
  return Object.keys(ANDHRA_PRADESH_PAGES).map((slugKey) => ({
    slug: slugKey.split('/')
  }));
}

interface PageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function StateSubsiteDynamicPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <GenericStateSubsiteDynamicPage
      params={Promise.resolve({
        state: 'andhra-pradesh',
        slug: resolvedParams.slug
      })}
    />
  );
}
