import { describe, expect, it } from 'vitest';
import { formatTHB, toSatang } from '../../src/format/money';

describe('money', () => {
  it('converts baht to integer satang', () => {
    expect(toSatang(1234.56)).toBe(123456);
    expect(toSatang(0.1)).toBe(10);
    expect(toSatang(0)).toBe(0);
  });

  it('formats satang as THB with grouping and two decimals', () => {
    expect(formatTHB(123456)).toBe('1,234.56');
    expect(formatTHB(0)).toBe('0.00');
    expect(formatTHB(5000)).toBe('50.00');
  });
});
