// import { config } from '@/config/index';
// import ListItemClient from './ListItemClient';

// export default async function ListItem({ url }: { url: string }) {
//   const response = await fetch(`${config.apiBaseUrl}/api/${url}`);
//   // const response = await fetch(`/api/${url}`);
//   const data = await response.json();

//   return (
//     <div>
//       <div className="mb-4 ml-2 mx-3 text-xl font-semibold">{url === "organizations" ? "Дусал тус" : "Ногоон тус"}</div>
//       <ListItemClient data={data} url={url} />
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { config } from "@/config/index";
import ListItemClient from "./ListItemClient";

export default function ListItem({ url }: { url: string }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${config.apiBaseUrl}/api/${url}`)
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.error("Failed to fetch:", err))
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div>
      <div className="mb-4 ml-2 mx-3 text-xl font-semibold">
        {url === "organizations" ? "Дусал тус" : "Ногоон тус"}
      </div>
      <ListItemClient data={data} url={url} />
    </div>
  );
}
