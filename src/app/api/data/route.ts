import { config } from "@/config";
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const frame = url.searchParams.get("frame") || "00";

  if (config.env === "development" && config.useLocalData) {
    try {
      const filePath = `${process.cwd()}/src/data/frame_${frame.padStart(
        2,
        "0"
      )}.json`;
      const data = await fs.readFile(filePath, "utf-8");
      return NextResponse.json(JSON.parse(data));
    } catch (error) {
      console.error(`Error loading frame ${frame}:`, error);
      return new NextResponse("Error loading data", { status: 500 });
    }
  } else {
    try {
      const dataRes = await fetch(`${config.dataUrl}${frame}.json`);
      if (!dataRes.ok)
        return new NextResponse("Error fetching data", { status: 500 });
      const data = await dataRes.json();
      return NextResponse.json(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      return new NextResponse("Error fetching data", { status: 500 });
    }
  }
}
