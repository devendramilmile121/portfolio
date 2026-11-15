const yearOf = (part: string): string | null => part.match(/\d{4}/)?.[0] ?? null;

/**
 * Compact year range for index rows.
 * "Sep 2026 - Present" -> "2026–", "Dec 2024 - Dec 2025" -> "2024–25", "Jan 2022 - Oct 2024" -> "2022–24",
 * "Mar 2023 - Nov 2023" -> "2023".
 */
export function formatYears(period: string): string {
  const [startPart, endPart = ''] = period.split(/\s+[-–—]\s+/);
  const start = yearOf(startPart);
  if (!start) return period;
  if (/present|now/i.test(endPart)) return `${start}–`;
  const end = yearOf(endPart);
  if (!end || end === start) return start;
  return start.slice(0, 2) === end.slice(0, 2) ? `${start}–${end.slice(2)}` : `${start}–${end}`;
}

/** "Jan 2026 - Present" -> "Jan 2026 – Now" */
export function formatPeriod(period: string): string {
  return period.replace(/\s+[-–—]\s+/, ' – ').replace(/present/i, 'Now');
}

/** "2026-03-15" -> "Mar 2026" */
export function formatMonthYear(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'UTC' });
}

/** "2026-03-15" -> "15 Mar" */
export function formatDayMonth(date: string): string {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return date;
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' });
}

/** Current time in Pune, e.g. "14:32" */
export function formatPuneTime(now: Date = new Date()): string {
  return now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' });
}

export function readingMinutes(text: string): number {
  return Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 220));
}
