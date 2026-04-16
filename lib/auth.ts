import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { readExcel, updateRow } from "./blob-excel";

const SESSION_COOKIE = "s4_admin_session";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "default-secret-change-me";
const SESSION_MAX_AGE = 30 * 60; // 30 minutes

interface LoginRecord {
  Username: string;
  Password: string;
  Role: string;
  "Last Login": string;
}

const SEPARATOR = "|||";

function encodeSession(username: string): string {
  const payload = JSON.stringify({ username, exp: Date.now() + SESSION_MAX_AGE * 1000 });
  return Buffer.from(`${payload}${SEPARATOR}${SESSION_SECRET}`).toString("base64");
}

function decodeSession(token: string): { username: string } | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const sepIndex = decoded.indexOf(SEPARATOR);
    if (sepIndex === -1) return null;
    const payloadStr = decoded.slice(0, sepIndex);
    const secret = decoded.slice(sepIndex + SEPARATOR.length);
    if (secret !== SESSION_SECRET) return null;

    const payload = JSON.parse(payloadStr);
    if (payload.exp < Date.now()) return null;

    return { username: payload.username };
  } catch {
    return null;
  }
}

export async function verifyLogin(
  username: string,
  password: string
): Promise<boolean> {
  const logins = await readExcel<LoginRecord>("logins.xlsx");
  const user = logins.find(
    (l) => l.Username.toLowerCase() === username.toLowerCase()
  );
  if (!user) return false;

  const valid = await bcrypt.compare(password, user.Password);
  if (valid) {
    await updateRow<LoginRecord>(
      "logins.xlsx",
      "Username",
      user.Username,
      { "Last Login": new Date().toISOString().slice(0, 16).replace("T", " ") } as Partial<LoginRecord>
    );
  }
  return valid;
}

export async function createSession(username: string): Promise<void> {
  const token = encodeSession(username);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return decodeSession(token);
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function adminMiddleware(request: NextRequest): Promise<NextResponse | null> {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token || !decodeSession(token)) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  return null;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
