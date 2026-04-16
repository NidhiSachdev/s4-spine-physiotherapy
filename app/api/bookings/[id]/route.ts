import { NextRequest, NextResponse } from "next/server";
import { updateRow } from "@/lib/blob-excel";

const VALID_STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"];

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be one of: Pending, Confirmed, Completed, Cancelled" },
        { status: 400 }
      );
    }

    const updated = await updateRow<{ ID: string; Status: string }>(
      "bookings.xlsx",
      "ID",
      id,
      { Status: status }
    );

    if (!updated) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
