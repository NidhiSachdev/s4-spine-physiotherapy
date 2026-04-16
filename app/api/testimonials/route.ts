import { NextRequest, NextResponse } from "next/server";
import { appendRow, readExcel, getNextId } from "@/lib/blob-excel";

interface TestimonialRow {
  ID: string;
  PatientName: string;
  Rating: number;
  Story: string;
  Category: string;
  VideoPath?: string;
  Active: string;
  CreatedAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") === "true";

    const rows = await readExcel<TestimonialRow>("testimonials.xlsx");

    let filtered = rows;
    if (activeOnly) {
      filtered = filtered.filter((r) => String(r.Active).toLowerCase() === "yes");
    }

    const testimonials = filtered.map((r) => ({
      id: r.ID,
      patientName: r.PatientName,
      rating: Number(r.Rating) || 0,
      story: r.Story,
      category: r.Category,
      videoPath: r.VideoPath ?? null,
      active: String(r.Active).toLowerCase() === "yes",
    }));

    return NextResponse.json(testimonials);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch testimonials";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { patientName, rating, story, category, videoPath, source } = body;

    if (!patientName || rating == null || !story || !category) {
      return NextResponse.json(
        { error: "Missing required fields: patientName, rating, story, category" },
        { status: 400 }
      );
    }

    const numRating = Number(rating);
    if (isNaN(numRating) || numRating < 1 || numRating > 5) {
      return NextResponse.json(
        { error: "Rating must be a number between 1 and 5" },
        { status: 400 }
      );
    }

    const id = await getNextId("testimonials.xlsx", "TM");
    const isAdmin = source === "admin";

    const row: TestimonialRow = {
      ID: id,
      PatientName: String(patientName).trim(),
      Rating: numRating,
      Story: String(story).trim(),
      Category: String(category).trim(),
      VideoPath: videoPath ? String(videoPath).trim() : undefined,
      Active: isAdmin ? "Yes" : "No",
      CreatedAt: new Date().toISOString(),
    };

    await appendRow<TestimonialRow>("testimonials.xlsx", row);
    return NextResponse.json({ success: true, id, pending: !isAdmin });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create testimonial";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
