import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const LOCAL_UPLOADS_DIR = path.join(process.cwd(), ".local-data", "uploads");

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  const filename = pathSegments.join("/");
  if (!filename || filename.includes("..")) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }
  const filePath = path.join(LOCAL_UPLOADS_DIR, filename);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filename).toLowerCase();
  const contentType =
    ext === ".mp4" ? "video/mp4" : ext === ".webm" ? "video/webm" : "application/octet-stream";
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Length": String(buffer.length),
    },
  });
}
