import { NextRequest, NextResponse } from "next/server";
import { updateRow, deleteRow } from "@/lib/blob-excel";

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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { patientName, rating, story, category, active } = body;

    const updates: Partial<TestimonialRow> = {};

    if (patientName !== undefined) updates.PatientName = String(patientName).trim();
    if (rating !== undefined) {
      const numRating = Number(rating);
      if (isNaN(numRating) || numRating < 1 || numRating > 5) {
        return NextResponse.json(
          { error: "Rating must be a number between 1 and 5" },
          { status: 400 }
        );
      }
      updates.Rating = numRating;
    }
    if (story !== undefined) updates.Story = String(story).trim();
    if (category !== undefined) updates.Category = String(category).trim();
    if (active !== undefined) updates.Active = active ? "Yes" : "No";

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ success: true });
    }

    const updated = await updateRow<TestimonialRow>(
      "testimonials.xlsx",
      "ID",
      id,
      updates
    );

    if (!updated) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update testimonial";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const deleted = await deleteRow<TestimonialRow>(
      "testimonials.xlsx",
      "ID",
      id
    );

    if (!deleted) {
      return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to delete testimonial";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
