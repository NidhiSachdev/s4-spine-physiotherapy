import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { readExcel, writeExcel } from "@/lib/blob-excel";

interface LoginRecord {
  Username: string;
  Password: string;
  Role: string;
  "Last Login": string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reset = searchParams.get("reset") === "true";

    if (!reset) {
      const logins = await readExcel<LoginRecord>("logins.xlsx");
      if (logins.length > 0) {
        return NextResponse.json({ message: "Already initialized" });
      }
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
      message: reset ? "Admin credentials reset" : "Default admin created",
      credentials: { username: "admin", password: "admin123" },
    });
  } catch (error) {
    console.error("Init error:", error);
    return NextResponse.json(
      { error: "Failed to initialize" },
      { status: 500 }
    );
  }
}
