import { describe, expect, it } from 'vitest';
import { formatThaiDate } from '../../src/format/date';

describe('formatThaiDate', () => {
  it('formats the Buddhist era by default (CE + 543)', () => {
    expect(formatThaiDate('2026-05-30')).toBe('30 พฤษภาคม 2569');
  });

  it('formats the Christian era when requested', () => {
    expect(formatThaiDate('2026-05-30', 'ce')).toBe('30 พฤษภาคม 2026');
  });

  it('handles the year boundary', () => {
    expect(formatThaiDate('2026-12-31')).toBe('31 ธันวาคม 2569');
    expect(formatThaiDate('2026-01-01')).toBe('1 มกราคม 2569');
  });
});
