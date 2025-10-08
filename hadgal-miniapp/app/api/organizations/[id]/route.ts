// import { NextResponse } from "next/server";
// import fs from "fs/promises";
// import path from "path";


// interface Params {
//   params: { id: string };
// }

// export async function GET(request: Request, { params }: Params) {
//   const { id } = params;

//   try {
//     const filePath = path.join(process.cwd(), "data", "organizations.json");
//     const fileData = await fs.readFile(filePath, "utf-8");
//     const organizations = JSON.parse(fileData);

//     return NextResponse.json(organizations[Number(id) - 1]);
//   } catch (error) {
//     console.error("Error reading organizations.json:", error);
//     return NextResponse.json(
//       { error: "Failed to load organizations" },
//       { status: 500 }
//     );
//   }
// }
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  // Await params to cover both local and Vercel build
  const params = await context.params;
  const { id } = params;

  try {
    const filePath = path.join(process.cwd(), "data", "projects.json");
    const fileData = await fs.readFile(filePath, "utf-8");
    const projects = JSON.parse(fileData);

    // Return project by ID
    return NextResponse.json(projects[Number(id) - 1]);
  } catch (error) {
    console.error("Error reading projects.json:", error);
    return NextResponse.json(
      { error: "Failed to load project" },
      { status: 500 }
    );
  }
}
