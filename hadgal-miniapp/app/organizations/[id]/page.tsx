import OrganizationDetail from "@/app/components/OrgDetail";

interface PageProps {
  params: { id: string };
}

export default async function Page({ params }: PageProps) {
  const id = params.id;  // ✅ await хэрэггүй

  return <OrganizationDetail orgId={id} />;
}
