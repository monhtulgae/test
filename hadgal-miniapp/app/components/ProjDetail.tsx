"use client";

import { useEffect, useState } from "react";
import BackCoin from "./backButton";
import '@/app/globals.css'
import TransferSec from "./transger";

interface Project {
  id: number;
  name: string;
  account_number?: string;
  img_url?: string;
  outcomes?: string[];
  description?: string;
  contact: {
    email?: string;
    phone?: string;
    organization: string;
  };
  current: number;
  budget: number;
  irr: number;
}

interface Props {
  orgId: string;
}

export default function ProjectDetail({ orgId }: Props) {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    fetch(`/api/projects/${orgId}`)
      .then(res => res.json())
      .then(data => setProject(data))
      .catch(err => console.error(err));
  }, [orgId]);

  if (!project) return <div>Loading...</div>;

  return (
    <div className="text-black w-full rounded-2xl bg-color m-0">
      <BackCoin />

      <div className="p-2 m-3">
        <h1 className="text-2xl font-bold mb-4">{project.name}</h1>

        <div className=" text-sm p-3 mb-3 shadow-[0_0_40px_rgba(0,0,0,0.25)] rounded-2xl">
          <div className="text-base">
            Дэлгэрэнгүй: <br />
          </div>
          {project.description && (
            project.description
          )}
        </div>

        <ol className="list-decimal list-inside shadow-[0_0_40px_rgba(0,0,0,0.25)] rounded-2xl mb-3 p-3">
          Үр дүнгүүд:
          {project.outcomes && (
            project.outcomes.map((item, index) => (
              <li key={index}>{item}</li>
            ))
          )}
        </ol>

        <div className="list-decimal list-inside shadow-[0_0_40px_rgba(0,0,0,0.25)] rounded-2xl mb-3 p-3 ">
          Шаардлагатай дүн:
          <div className="relative w-full border border-black rounded-lg bg-green-200 h-8">
            <div
              className="bg-green-400 rounded-lg h-full transition-all"
              style={{ width: `${(project.current / project.budget) * 100 || 0}%` }}
            />
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-semibold text-black whitespace-nowrap">
              {`${(project.current * 0.0035).toLocaleString("mn-MN", { maximumFractionDigits: 0 })} сая / ${(project.budget * 0.0035).toLocaleString("mn-MN", { maximumFractionDigits: 0 })} сая`}
            </span>
          </div>
        </div>

        <div className="list-decimal list-inside shadow-[0_0_40px_rgba(0,0,0,0.25)] rounded-2xl mb-3 p-3 ">
          Ногоон ашиг:
          <div>
            <div className="font-semibold">
            {project.irr}%
          </div>
          </div>
        </div>

        <div className=" text-sm p-3 shadow-[0_0_40px_rgba(0,0,0,0.25)] rounded-2xl mt-3">
          Гүйцэтгэгч байгууллага:
          <div className="font-semibold">
            {project.contact.organization}
          </div>
        </div>

        <div className=" text-sm p-3 shadow-[0_0_40px_rgba(0,0,0,0.25)] rounded-2xl mt-3">
          Холбоо барих: <br />
          <div className="font-semibold">
            {project.contact.email}
          </div>
        </div>

        <TransferSec projectId={project.id} url= "project" />
      </div>
    </div>
  );
}
