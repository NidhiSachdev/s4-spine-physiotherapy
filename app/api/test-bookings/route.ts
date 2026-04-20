import { NextRequest, NextResponse } from "next/server";
import { appendRow, readExcel, getNextId } from "@/lib/blob-excel";
import { getCurrentTimestamp } from "@/lib/utils";

interface TestBookingRow {
  ID: string;
  Name: string;
  Phone: string;
  Age?: number;
  "Test Type": string;
  "Preferred Date": string;
  "Preferred Time": string;
  Notes?: string;
  Status: string;
  "Submitted At": string;
}

const SLOT_TIMES: Record<string, string[]> = {
  Morning: ["8:00 AM", "8:45 AM", "9:30 AM", "10:15 AM", "11:00 AM", "11:45 AM"],
  Afternoon: ["12:00 PM", "12:45 PM", "1:30 PM", "2:15 PM", "3:00 PM", "3:45 PM"],
  Evening: ["4:00 PM", "4:45 PM", "5:30 PM", "6:15 PM", "7:00 PM", "7:45 PM"],
};

function getBookedTimesForSlot(bookings: TestBookingRow[], date: string, slotLabel: string): string[] {
  const slotTimes = SLOT_TIMES[slotLabel] || [];
  return bookings
    .filter((b) => b["Preferred Date"] === date && slotTimes.includes(b["Preferred Time"]) && b.Status !== "Cancelled")
    .map((b) => b["Preferred Time"]);
}

function getNextAvailableTime(bookings: TestBookingRow[], date: string, slotLabel: string): string | null {
  const slotTimes = SLOT_TIMES[slotLabel] || [];
  const booked = getBookedTimesForSlot(bookings, date, slotLabel);
  return slotTimes.find((t) => !booked.includes(t)) || null;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testType, date, timeSlot, name, phone, age, notes } = body;

    if (!testType || !date || !timeSlot || !name || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: testType, date, timeSlot, name, phone" },
        { status: 400 }
      );
    }

    const bookings = await readExcel<TestBookingRow>("test-bookings.xlsx");
    const assignedTime = getNextAvailableTime(bookings, date, timeSlot);

    if (!assignedTime) {
      return NextResponse.json(
        { error: `No available slots for ${timeSlot} on ${date}. Please choose a different time.` },
        { status: 409 }
      );
    }

    const bookingId = await getNextId("test-bookings.xlsx", "TB");

    const row: TestBookingRow = {
      ID: bookingId,
      Name: String(name).trim(),
      Phone: String(phone).trim(),
      Age: age != null && age !== "" ? Number(age) : undefined,
      "Test Type": String(testType),
      "Preferred Date": String(date),
      "Preferred Time": assignedTime,
      Notes: notes ? String(notes).trim() : undefined,
      Status: "Pending",
      "Submitted At": getCurrentTimestamp(),
    };

    await appendRow<TestBookingRow>("test-bookings.xlsx", row);
    return NextResponse.json({ success: true, bookingId, assignedTime });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create test booking";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const bookings = await readExcel<TestBookingRow & Record<string, unknown>>("test-bookings.xlsx");

    let filtered = bookings;
    if (status) {
      filtered = filtered.filter((b) => String(b.Status).toLowerCase() === status.toLowerCase());
    }

    return NextResponse.json({ bookings: filtered });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch test bookings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
