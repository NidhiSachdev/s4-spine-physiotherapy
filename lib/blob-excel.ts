import * as XLSX from "xlsx";
import fs from "fs";
import path from "path";

const useBlob = !!process.env.BLOB_READ_WRITE_TOKEN;

const LOCAL_DATA_DIR = path.join(process.cwd(), ".local-data");

function ensureLocalDir() {
  if (!fs.existsSync(LOCAL_DATA_DIR)) {
    fs.mkdirSync(LOCAL_DATA_DIR, { recursive: true });
  }
}

function localPath(filename: string): string {
  return path.join(LOCAL_DATA_DIR, filename);
}

// --- Blob helpers (only used when token is available) ---

async function blobFindUrl(filename: string): Promise<string | null> {
  const { list } = await import("@vercel/blob");
  const blobPath = `data/${filename}`;
  const { blobs } = await list({ prefix: blobPath });
  const match = blobs.find((b) => b.pathname === blobPath);
  return match?.url ?? null;
}

async function blobRead<T>(filename: string): Promise<T[]> {
  const url = await blobFindUrl(filename);
  if (!url) return [];
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<T>(sheet);
}

async function blobWrite<T>(filename: string, rows: T[]): Promise<void> {
  const { put, del } = await import("@vercel/blob");
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

  const existingUrl = await blobFindUrl(filename);
  if (existingUrl) await del(existingUrl);

  await put(`data/${filename}`, buffer, {
    access: "public",
    contentType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}

// --- Local file helpers ---

function localRead<T>(filename: string): T[] {
  ensureLocalDir();
  const fp = localPath(filename);
  if (!fs.existsSync(fp)) return [];
  const buffer = fs.readFileSync(fp);
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json<T>(sheet);
}

function localWrite<T>(filename: string, rows: T[]): void {
  ensureLocalDir();
  const workbook = XLSX.utils.book_new();
  const sheet = XLSX.utils.json_to_sheet(rows);
  XLSX.utils.book_append_sheet(workbook, sheet, "Sheet1");
  const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
  fs.writeFileSync(localPath(filename), buffer);
}

// --- Public API (auto-selects blob vs local) ---

export async function readExcel<T>(filename: string): Promise<T[]> {
  if (useBlob) return blobRead<T>(filename);
  return localRead<T>(filename);
}

export async function writeExcel<T>(filename: string, rows: T[]): Promise<void> {
  if (useBlob) return blobWrite<T>(filename, rows);
  localWrite<T>(filename, rows);
}

export async function appendRow<T>(filename: string, newRow: T): Promise<void> {
  const existing = await readExcel<T>(filename);
  existing.push(newRow);
  await writeExcel(filename, existing);
}

export async function updateRow<T>(
  filename: string,
  idField: keyof T,
  idValue: unknown,
  updates: Partial<T>
): Promise<boolean> {
  const rows = await readExcel<T>(filename);
  const index = rows.findIndex((row) => row[idField] === idValue);
  if (index === -1) return false;
  rows[index] = { ...rows[index], ...updates };
  await writeExcel(filename, rows);
  return true;
}

export async function deleteRow<T>(
  filename: string,
  idField: keyof T,
  idValue: unknown
): Promise<boolean> {
  const rows = await readExcel<T>(filename);
  const filtered = rows.filter((row) => row[idField] !== idValue);
  if (filtered.length === rows.length) return false;
  await writeExcel(filename, filtered);
  return true;
}

export async function getNextId(filename: string, prefix: string): Promise<string> {
  const rows = await readExcel<{ ID: string }>(filename);
  if (rows.length === 0) return `${prefix}-001`;

  const nums = rows
    .map((r) => {
      const match = r.ID?.match(/\d+$/);
      return match ? parseInt(match[0], 10) : 0;
    })
    .filter((n) => !isNaN(n));

  const max = nums.length > 0 ? Math.max(...nums) : 0;
  return `${prefix}-${String(max + 1).padStart(3, "0")}`;
}

export async function downloadExcelBuffer(filename: string): Promise<Buffer | null> {
  if (useBlob) {
    const url = await blobFindUrl(filename);
    if (!url) return null;
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }
  ensureLocalDir();
  const fp = localPath(filename);
  if (!fs.existsSync(fp)) return null;
  return fs.readFileSync(fp);
}
