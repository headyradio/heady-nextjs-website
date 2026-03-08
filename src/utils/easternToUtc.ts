/**
 * Convert RadioBoss Eastern Time timestamps to UTC.
 * RadioBoss always reports in America/New_York (EST/EDT).
 * US DST: starts 2nd Sunday of March at 2 AM, ends 1st Sunday of November at 2 AM.
 *
 * Input format: "2026-02-26 03:22:12"
 */
export function easternToUtc(ts: string): string {
  if (!ts) return new Date().toISOString();
  const [datePart, timePart] = ts.split(' ');
  if (!datePart || !timePart) return new Date().toISOString();

  const [year, month, day] = datePart.split('-').map(Number);
  const [hour] = timePart.split(':').map(Number);

  let isDST = false;
  if (month > 3 && month < 11) {
    isDST = true;
  } else if (month === 3) {
    // Second Sunday of March
    const dow = new Date(year, 2, 1).getDay();
    const secondSunday = dow === 0 ? 8 : (14 - dow + 1);
    isDST = day > secondSunday || (day === secondSunday && hour >= 2);
  } else if (month === 11) {
    // First Sunday of November
    const dow = new Date(year, 10, 1).getDay();
    const firstSunday = dow === 0 ? 1 : (8 - dow);
    isDST = day < firstSunday || (day === firstSunday && hour < 2);
  }

  const offset = isDST ? '-04:00' : '-05:00';
  const date = new Date(`${datePart}T${timePart}${offset}`);
  return isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}
