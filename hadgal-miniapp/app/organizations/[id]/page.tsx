import OrganizationDetail from "@/app/components/OrgDetail";

interface PageProps {
  params: { id: string };
}

// default export function байх ёстой
export default function Page({ params }: PageProps) {
  const id = params.id;
  return <OrganizationDetail orgId={id} />;
}
