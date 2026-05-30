const THAI_MONTHS = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

/**
 * Formats an ISO date as a Thai date. Defaults to the Buddhist era (พ.ศ. = ค.ศ. + 543).
 * Uses UTC components so the output is deterministic regardless of the host timezone.
 */
export function formatThaiDate(iso: string, era: 'be' | 'ce' = 'be'): string {
  const date = new Date(iso);
  const day = date.getUTCDate();
  const month = THAI_MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear() + (era === 'be' ? 543 : 0);
  return `${day} ${month} ${year}`;
}
