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
  } catch {
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  }
}
