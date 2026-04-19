import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { appendRow, readExcel, getNextId, deleteRow } from "@/lib/blob-excel";
import { getCurrentTimestamp } from "@/lib/utils";

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;
const LOCAL_UPLOADS_DIR = path.join(process.cwd(), ".local-data", "uploads");

interface VideoRow {
  ID: string;
  Title: string;
  Description: string;
  Treatment: string;
  Category: string;
  Difficulty: string;
  FilePath: string;
  CreatedAt: string;
}

function ensureUploadsDir() {
  if (!fs.existsSync(LOCAL_UPLOADS_DIR)) {
    fs.mkdirSync(LOCAL_UPLOADS_DIR, { recursive: true });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const description = (formData.get("description") as string) || "";
    const treatment = (formData.get("treatment") as string) || "";
    const category = (formData.get("category") as string) || "";
    const difficulty = (formData.get("difficulty") as string) || "";

    if (!file || !title?.trim()) {
      return NextResponse.json(
        { error: "Missing required fields: file and title" },
        { status: 400 }
      );
    }

    const ext = path.extname(file.name).toLowerCase();
    if (![".mp4", ".webm"].includes(ext)) {
      return NextResponse.json(
        { error: "Only .mp4 and .webm files are allowed" },
        { status: 400 }
      );
    }

    const id = await getNextId("videos.xlsx", "VD");
    const filename = `${id}${ext}`;

    let filePath: string;
    let url: string;

    if (useBlob) {
      const { put } = await import("@vercel/blob");
      const buffer = Buffer.from(await file.arrayBuffer());
      const blob = await put(`uploads/${filename}`, buffer, {
        access: "private",
        contentType: file.type || "video/mp4",
      });
      url = blob.url;
      filePath = blob.url;
    } else {
      ensureUploadsDir();
      const localPath = path.join(LOCAL_UPLOADS_DIR, filename);
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(localPath, buffer);
      filePath = filename;
      url = `/api/upload/serve/${filename}`;
    }

    const row: VideoRow = {
      ID: id,
      Title: title.trim(),
      Description: description.trim(),
      Treatment: treatment.trim(),
      Category: category.trim(),
      Difficulty: difficulty.trim(),
      FilePath: filePath,
      CreatedAt: getCurrentTimestamp(),
    };

    await appendRow<VideoRow>("videos.xlsx", row);
    return NextResponse.json({ success: true, id, url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const videos = await readExcel<VideoRow>("videos.xlsx");
    const list = videos.map((v) => ({
      id: v.ID,
      title: v.Title,
      description: v.Description,
      treatment: v.Treatment,
      category: v.Category,
      difficulty: v.Difficulty,
      filePath: v.FilePath,
      createdAt: v.CreatedAt,
      url: v.FilePath.startsWith("http")
        ? v.FilePath
        : `/api/upload/serve/${v.FilePath}`,
    }));
    return NextResponse.json({ videos: list });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch videos";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
