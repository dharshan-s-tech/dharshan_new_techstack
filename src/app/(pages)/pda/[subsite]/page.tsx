import { redirect } from 'next/navigation';

export default async function PdaSubsiteRedirect({
  params,
}: {
  params: Promise<{ subsite: string }>;
}) {
  const { subsite } = await params;
  redirect(`/pda/${subsite}/en`);
}
