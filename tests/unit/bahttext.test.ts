import { describe, expect, it } from 'vitest';
import { bahtText } from '../../src/format/bahttext';

describe('bahtText', () => {
  it('reads whole-baht amounts with ถ้วน', () => {
    expect(bahtText(100)).toBe('หนึ่งบาทถ้วน'); // 1.00
    expect(bahtText(2100)).toBe('ยี่สิบเอ็ดบาทถ้วน'); // 21.00
    expect(bahtText(500000)).toBe('ห้าพันบาทถ้วน'); // 5,000.00
  });

  it('reads millions', () => {
    expect(bahtText(100_000_000)).toBe('หนึ่งล้านบาทถ้วน'); // 1,000,000.00
  });

  it('reads satang', () => {
    expect(bahtText(12550)).toBe('หนึ่งร้อยยี่สิบห้าบาทห้าสิบสตางค์'); // 125.50
  });

  it('reads zero', () => {
    expect(bahtText(0)).toBe('ศูนย์บาทถ้วน');
  });
});
