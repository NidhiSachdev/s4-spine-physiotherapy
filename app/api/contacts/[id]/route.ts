import { NextRequest, NextResponse } from "next/server";
import { updateRow } from "@/lib/blob-excel";

interface ContactRow {
  ID: string;
  Status: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Missing required field: status" },
        { status: 400 }
      );
    }

    const validStatuses = ["Read", "Unread"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Status must be Read or Unread" },
        { status: 400 }
      );
    }

    const updated = await updateRow<ContactRow>(
      "contacts.xlsx",
      "ID",
      id,
      { Status: status }
    );

    if (!updated) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to update contact";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
