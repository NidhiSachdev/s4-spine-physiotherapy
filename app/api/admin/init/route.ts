import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { readExcel, writeExcel, debugBlobList } from "@/lib/blob-excel";

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
    const debug = searchParams.get("debug") === "true";

    if (debug) {
      const blobInfo = await debugBlobList();
      const logins = await readExcel<LoginRecord>("logins.xlsx");
      return NextResponse.json({ blobInfo, loginCount: logins.length, hasToken: !!process.env.BLOB_READ_WRITE_TOKEN });
    }

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

    const verify = await readExcel<LoginRecord>("logins.xlsx");

    return NextResponse.json({
      success: true,
      message: reset ? "Admin credentials reset" : "Default admin created",
      verified: verify.length > 0,
      verifiedCount: verify.length,
    });
  } catch (error) {
    console.error("Init error:", error);
    const message = error instanceof Error ? error.message : "Unknown";
    return NextResponse.json(
      { error: "Failed to initialize", detail: message },
      { status: 500 }
    );
  }
}
