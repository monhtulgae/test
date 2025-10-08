import ProjectDetail from "@/app/components/ProjDetail";

interface PageProps {
  params: { id: string };
}

export default function Page({ params }: PageProps) {
  return <ProjectDetail orgId={params.id} />;
}
