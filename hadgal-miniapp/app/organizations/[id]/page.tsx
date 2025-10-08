// app/organizations/[id]/page.tsx
import OrganizationDetail from "@/app/components/OrgDetail";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <OrganizationDetail orgId={params.id} />;
}
