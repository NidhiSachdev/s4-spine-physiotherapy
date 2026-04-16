import { NextRequest, NextResponse } from "next/server";
import { appendRow, readExcel, getNextId } from "@/lib/blob-excel";
import { getCurrentTimestamp } from "@/lib/utils";

interface ContactRow {
  ID: string;
  Name: string;
  Email?: string;
  Phone: string;
  Subject?: string;
  Message: string;
  Status: string;
  "Submitted At": string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, phone, message" },
        { status: 400 }
      );
    }

    if (String(message).trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    const id = await getNextId("contacts.xlsx", "CT");

    const row: ContactRow = {
      ID: id,
      Name: String(name).trim(),
      Email: email ? String(email).trim() : undefined,
      Phone: String(phone).trim(),
      Subject: subject ? String(subject).trim() : undefined,
      Message: String(message).trim(),
      Status: "Unread",
      "Submitted At": getCurrentTimestamp(),
    };

    await appendRow<ContactRow>("contacts.xlsx", row);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit contact";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const contacts = await readExcel<ContactRow>("contacts.xlsx");

    let filtered = contacts;
    if (status) {
      filtered = filtered.filter(
        (c) => String(c.Status).toLowerCase() === status.toLowerCase()
      );
    }

    return NextResponse.json({ contacts: filtered });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch contacts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
