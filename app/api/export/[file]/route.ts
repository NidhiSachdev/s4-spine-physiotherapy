import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { downloadExcelBuffer } from "@/lib/blob-excel";

const ALLOWED_FILES = ["bookings", "contacts", "testimonials"] as const;

const HEADERS: Record<string, string[]> = {
  bookings: ["ID", "Name", "Phone", "Age", "Treatment", "Preferred Date", "Preferred Time", "Condition Notes", "Status", "Submitted At"],
  contacts: ["ID", "Name", "Email", "Phone", "Subject", "Message", "Status", "Submitted At"],
  testimonials: ["ID", "PatientName", "Rating", "Story", "Category", "VideoPath", "Active", "CreatedAt"],
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ file: string }> }
) {
  try {
    const { file } = await params;
    if (!ALLOWED_FILES.includes(file as (typeof ALLOWED_FILES)[number])) {
      return NextResponse.json(
        { error: "Invalid file. Allowed: bookings, contacts, testimonials" },
        { status: 400 }
      );
    }

    const filename = `${file}.xlsx`;
    let buf: Buffer | null = await downloadExcelBuffer(filename);

    if (buf === null) {
      const workbook = XLSX.utils.book_new();
      const sheet = XLSX.utils.aoa_to_sheet([HEADERS[file]]);
      XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
      buf = Buffer.from(XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
    }

    const buffer = buf;
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
