import { NextRequest, NextResponse } from "next/server";
import { readExcel } from "@/lib/blob-excel";

interface TestBookingRow {
  ID: string;
  "Preferred Date": string;
  "Preferred Time": string;
  Status: string;
}

const SLOT_TIMES: Record<string, string[]> = {
  Morning: ["8:00 AM", "8:45 AM", "9:30 AM", "10:15 AM", "11:00 AM", "11:45 AM"],
  Afternoon: ["12:00 PM", "12:45 PM", "1:30 PM", "2:15 PM", "3:00 PM", "3:45 PM"],
  Evening: ["4:00 PM", "4:45 PM", "5:30 PM", "6:15 PM", "7:00 PM", "7:45 PM"],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json({ error: "date query param required" }, { status: 400 });
    }

    const bookings = await readExcel<TestBookingRow>("test-bookings.xlsx");
    const dateBookings = bookings.filter(
      (b) => b["Preferred Date"] === date && b.Status !== "Cancelled"
    );

    const availability: Record<string, { total: number; booked: number; available: number; nextTime: string | null; full: boolean }> = {};

    for (const [slot, times] of Object.entries(SLOT_TIMES)) {
      const bookedTimes = dateBookings
        .filter((b) => times.includes(b["Preferred Time"]))
        .map((b) => b["Preferred Time"]);

      const available = times.length - bookedTimes.length;
      const nextTime = times.find((t) => !bookedTimes.includes(t)) || null;

      availability[slot] = {
        total: times.length,
        booked: bookedTimes.length,
        available,
        nextTime,
        full: available === 0,
      };
    }

    return NextResponse.json({ date, availability });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to check availability";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
