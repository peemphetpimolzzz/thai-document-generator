/**
 * Money is handled as integer satang (1 baht = 100 satang) everywhere internally to
 * avoid floating-point drift; it is only formatted back to baht at the edges.
 */
export function toSatang(baht: number): number {
  return Math.round(baht * 100);
}

export function formatTHB(satang: number): string {
  const baht = satang / 100;
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(baht);
}
