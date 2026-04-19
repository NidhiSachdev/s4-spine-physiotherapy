import { NextRequest, NextResponse } from "next/server";
import { verifyLogin, createSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const valid = await verifyLogin(username, password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    await createSession(username);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Login error:", message);
    return NextResponse.json(
      { error: "Login failed", detail: message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { readExcel } = await import("@/lib/blob-excel");
    const logins = await readExcel<{ Username: string; Password: string }>("logins.xlsx");
    return NextResponse.json({
      count: logins.length,
      users: logins.map((l) => ({ username: l.Username, hasPassword: !!l.Password })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
