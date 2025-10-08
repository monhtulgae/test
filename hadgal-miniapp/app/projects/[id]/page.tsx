import ProjectDetail from "@/app/components/ProjDetail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <ProjectDetail orgId={id} />;
}
