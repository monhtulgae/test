import OrganizationDetail from "@/app/components/OrgDetail";
import { use } from 'react'

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const id = await params.id;

  return <OrganizationDetail orgId={id} />;
}
