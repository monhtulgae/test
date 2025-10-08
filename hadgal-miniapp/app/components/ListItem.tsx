import ListItemClient from "./ListItemClient";

export default async function ListItem({ url }: { url: string }) {
  let data: any[] = [];

  try {
    const baseUrl =
      typeof window === "undefined"
        ? process.env.NEXT_PUBLIC_BASE_URL || "https://hadgal-digi.vercel.app"
        : "";

    const response = await fetch(`${baseUrl}/api/${url}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("❌ API fetch error:", response.status);
    } else {
      data = await response.json();
    }
  } catch (err) {
    console.error("❌ Fetch failed:", err);
  }

  return (
    <div>
      <div className="mb-4 ml-2 mx-3 text-xl font-semibold">
        {url === "organizations" ? "Дусал тус" : "Ногоон тус"}
      </div>
      <ListItemClient data={Array.isArray(data) ? data : []} url={url} />
    </div>
  );
}
