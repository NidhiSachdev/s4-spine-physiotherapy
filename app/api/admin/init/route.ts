import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { readExcel, writeExcel } from "@/lib/blob-excel";

interface LoginRecord {
  Username: string;
  Password: string;
  Role: string;
  "Last Login": string;
}

export async function GET() {
  try {
    const logins = await readExcel<LoginRecord>("logins.xlsx");

    if (logins.length > 0) {
      return NextResponse.json({ message: "Already initialized" });
    }

    const hashedPassword = await hashPassword("admin123");
    const defaultAdmin: LoginRecord = {
      Username: "admin",
      Password: hashedPassword,
      Role: "admin",
      "Last Login": "",
    };

    await writeExcel("logins.xlsx", [defaultAdmin]);
    return NextResponse.json({
      success: true,
      message: "Default admin created",
    });
  } catch (error) {
    console.error("Init error:", error);
    return NextResponse.json(
      { error: "Failed to initialize" },
      { status: 500 }
    );
  }
}
