"use client";

import { useEffect, useState } from "react";
import BackCoin from "./backButton";
import '@/app/globals.css'
import TransferSec from "./transger";

interface Organization {
  id: number;
  name: string;
  account_number?: string;
  img_url?: string;
  projects?: string[];
  description?: string;
  contact_num?: string;
}

interface Props {
  orgId: string; // pass from the server page
}

export default function OrganizationDetail({ orgId }: Props) {
  const [organization, setOrganization] = useState<Organization | null>(null);

  useEffect(() => {
    fetch(`/api/organizations/${orgId}`)
      .then(res => res.json())
      .then(data => setOrganization(data))
      .catch(err => console.error(err));
  }, [orgId]);

  if (!organization) return <div>Loading...</div>;

  return (
    <div className="text-black w-full rounded-2xl bg-color m-0">
      <BackCoin />

      <div className="p-2 m-3">
        <div className="flex items-center justify-center h-[30vh] shadow-[0_0_40px_rgba(0,0,0,0.25)] rounded-sm">
          <img
            src={`/orgs/${organization.img_url}`}
            alt={organization.img_url}
            className="w-1/2 h-[50vh] object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold my-4">{organization.name}</h1>
        <ol className="list-decimal list-inside shadow-[0_0_40px_rgba(0,0,0,0.25)] rounded-2xl mb-3 p-3">
          Төслүүд:
          {organization.projects && (
            organization.projects.map((item, index) => (
              <li key={index}>{item}</li>
            ))
          )}
        </ol>

        <div className=" text-sm p-3 shadow-[0_0_40px_rgba(0,0,0,0.25)] rounded-2xl">
          Дэлгэрэнгүй: <br />
          {organization.description && (
            organization.description
          )}
        </div>

        <div className=" text-sm p-3 shadow-[0_0_40px_rgba(0,0,0,0.25)] rounded-2xl mt-3">
          Холбоо барих
        </div>

        <TransferSec projectId={organization.id} url="organization" />
      </div>
    </div>
  );
}
