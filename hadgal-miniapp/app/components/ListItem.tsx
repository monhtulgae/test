import { config } from '@/config/index';
import ListItemClient from './ListItemClient';

export default async function ListItem({ url }: { url: string }) {
  const response = await fetch(`${config.apiBaseUrl}/api/${url}`);
  const data = await response.json();

  return (
    <div>
      <div className="mb-4 ml-2 mx-3 text-xl font-semibold">{url === "organizations" ? "Дусал тус" : "Ногоон тус"}</div>
      <ListItemClient data={data} url={url} />
    </div>
  );
}
