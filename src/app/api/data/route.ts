import { promises as fs } from "fs";

import { config } from "@/config";
export async function GET() {
  if (config.env == "development") {
    try {
      const data = await fs.readFile(
        process.cwd() + "/src/data/frame_00.json",
        "utf-8"
      );
      return Response.json(JSON.parse(data));
    } catch (error) {
      console.error(error);
      return Response.error();
    }
  } else {
    const dataRes = await fetch(config.dataUrl);
    if (!dataRes.ok) return Response.error();
    const data = await dataRes.json();
    return Response.json(data);
  }
}
