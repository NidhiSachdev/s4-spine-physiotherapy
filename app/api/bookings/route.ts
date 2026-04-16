import { NextRequest, NextResponse } from "next/server";
import { appendRow, readExcel, getNextId } from "@/lib/blob-excel";
import { getCurrentTimestamp } from "@/lib/utils";
import treatmentsData from "@/data/treatments.json";

interface BookingRow {
  ID: string;
  Name: string;
  Phone: string;
  Age?: number;
  Treatment: string;
  "Preferred Date": string;
  "Preferred Time": string;
  "Condition Notes"?: string;
  Status: string;
  "Submitted At": string;
}

const treatments = treatmentsData as { name: string; slug: string }[];

function getTreatmentName(slug: string): string {
  const t = treatments.find((x) => x.slug === slug);
  return t?.name ?? slug;
}

const SLOT_TIMES: Record<string, string[]> = {
  Morning: ["9:00 AM", "9:45 AM", "10:30 AM", "11:15 AM"],
  Afternoon: ["12:00 PM", "12:45 PM", "1:30 PM", "2:15 PM"],
  Evening: ["4:00 PM", "4:45 PM", "5:30 PM", "6:15 PM"],
};

function getBookedTimesForSlot(bookings: BookingRow[], date: string, slotLabel: string): string[] {
  const slotTimes = SLOT_TIMES[slotLabel] || [];
  return bookings
    .filter((b) => b["Preferred Date"] === date && slotTimes.includes(b["Preferred Time"]) && b.Status !== "Cancelled")
    .map((b) => b["Preferred Time"]);
}

function getNextAvailableTime(bookings: BookingRow[], date: string, slotLabel: string): string | null {
  const slotTimes = SLOT_TIMES[slotLabel] || [];
  const booked = getBookedTimesForSlot(bookings, date, slotLabel);
  return slotTimes.find((t) => !booked.includes(t)) || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { treatment, date, timeSlot, name, phone, age, notes } = body;

    if (!treatment || !date || !timeSlot || !name || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: treatment, date, timeSlot, name, phone" },
        { status: 400 }
      );
    }

    const bookings = await readExcel<BookingRow>("bookings.xlsx");
    const assignedTime = getNextAvailableTime(bookings, date, timeSlot);

    if (!assignedTime) {
      return NextResponse.json(
        { error: `No available slots for ${timeSlot} on ${date}. Please choose a different time.` },
        { status: 409 }
      );
    }

    const bookingId = await getNextId("bookings.xlsx", "BK");
    const treatmentName = getTreatmentName(treatment);

    const row: BookingRow = {
      ID: bookingId,
      Name: String(name).trim(),
      Phone: String(phone).trim(),
      Age: age != null && age !== "" ? Number(age) : undefined,
      Treatment: treatmentName,
      "Preferred Date": String(date),
      "Preferred Time": assignedTime,
      "Condition Notes": notes ? String(notes).trim() : undefined,
      Status: "Pending",
      "Submitted At": getCurrentTimestamp(),
    };

    await appendRow<BookingRow>("bookings.xlsx", row);
    return NextResponse.json({ success: true, bookingId, assignedTime });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const treatment = searchParams.get("treatment");

    const bookings = await readExcel<BookingRow & Record<string, unknown>>("bookings.xlsx");

    let filtered = bookings;
    if (status) {
      filtered = filtered.filter((b) => String(b.Status).toLowerCase() === status.toLowerCase());
    }
    if (treatment) {
      filtered = filtered.filter(
        (b) =>
          String(b.Treatment).toLowerCase().includes(treatment.toLowerCase()) ||
          treatments.some((t) => t.slug === treatment && t.name === b.Treatment)
      );
    }

    return NextResponse.json({ bookings: filtered });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch bookings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
