import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { deleteRow, readExcel } from "@/lib/blob-excel";

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), ".local-data", "uploads");

interface VideoRow {
  ID: string;
  FilePath: string;
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const videos = await readExcel<VideoRow>("videos.xlsx");
    const video = videos.find((v) => v.ID === id);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (useBlob && video.FilePath.startsWith("http")) {
      const { del } = await import("@vercel/blob");
      await del(video.FilePath);
    } else if (!useBlob) {
      const filename = path.basename(video.FilePath);
      const filePath = path.join(LOCAL_UPLOADS_DIR, filename);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await deleteRow<VideoRow>("videos.xlsx", "ID", id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
