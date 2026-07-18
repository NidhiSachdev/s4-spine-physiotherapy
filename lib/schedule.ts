export type Frequency = "Daily" | "Twice a Week" | "Thrice a Week" | "Weekly";

export const FREQUENCY_OPTIONS: { id: Frequency; label: string; description: string }[] = [
  { id: "Daily", label: "Daily", description: "Every day (Mon–Sat)" },
  { id: "Twice a Week", label: "Twice a Week", description: "2 sessions per week" },
  { id: "Thrice a Week", label: "Thrice a Week", description: "3 sessions per week" },
  { id: "Weekly", label: "Weekly", description: "Once a week" },
];

function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSunday(date: Date): boolean {
  return date.getDay() === 0;
}

function toDateStr(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Get the target weekdays for multi-day-per-week frequencies.
 * Returns day-of-week numbers (1=Mon ... 6=Sat) spread evenly across the week.
 */
function getWeekdays(startDow: number, perWeek: 2 | 3): number[] {
  const twiceMap: Record<number, number[]> = {
    1: [1, 4], 2: [2, 5], 3: [3, 6], 4: [4, 1], 5: [5, 2], 6: [6, 3],
  };
  const thriceMap: Record<number, number[]> = {
    1: [1, 3, 5], 2: [2, 4, 6], 3: [3, 5, 1], 4: [4, 6, 2], 5: [5, 1, 3], 6: [6, 2, 4],
  };

  const dow = startDow === 0 ? 1 : startDow;
  const map = perWeek === 2 ? twiceMap : thriceMap;
  return map[dow] || (perWeek === 2 ? [1, 4] : [1, 3, 5]);
}

/**
 * Generate session dates starting from startDate for the given count & frequency.
 * Sundays are always skipped (clinic closed).
 */
export function generateSessionDates(
  startDate: string,
  count: number,
  frequency: Frequency
): string[] {
  if (count <= 0) return [];

  const start = new Date(startDate + "T00:00:00");
  if (isSunday(start)) start.setDate(start.getDate() + 1);

  const dates: string[] = [toDateStr(start)];
  if (count === 1) return dates;

  if (frequency === "Daily") {
    let cur = start;
    while (dates.length < count) {
      cur = addDays(cur, 1);
      if (!isSunday(cur)) dates.push(toDateStr(cur));
    }
    return dates;
  }

  if (frequency === "Weekly") {
    let cur = start;
    while (dates.length < count) {
      cur = addDays(cur, 7);
      if (isSunday(cur)) cur = addDays(cur, 1);
      dates.push(toDateStr(cur));
    }
    return dates;
  }

  const perWeek = frequency === "Twice a Week" ? 2 : 3;
  const targetDays = getWeekdays(start.getDay(), perWeek as 2 | 3);

  let cur = addDays(start, 1);
  while (dates.length < count) {
    if (!isSunday(cur)) {
      const dow = cur.getDay() === 0 ? 7 : cur.getDay();
      if (targetDays.includes(dow)) {
        dates.push(toDateStr(cur));
      }
    }
    cur = addDays(cur, 1);
  }

  return dates;
}

/**
 * Parse the sessions field from treatments.json (e.g., "8-12 sessions", "24+ sessions")
 * into package size options.
 */
export function parseSessionOptions(sessionsStr: string): number[] {
  const cleaned = sessionsStr.replace(/\s*sessions?\s*/i, "").trim();

  if (cleaned.includes("+")) {
    const base = parseInt(cleaned.replace("+", ""), 10);
    return isNaN(base) ? [] : [base];
  }

  if (cleaned.includes("-")) {
    const [minStr, maxStr] = cleaned.split("-");
    const min = parseInt(minStr, 10);
    const max = parseInt(maxStr, 10);
    if (isNaN(min) || isNaN(max)) return [];
    return [min, max];
  }

  const single = parseInt(cleaned, 10);
  return isNaN(single) ? [] : [single];
}
