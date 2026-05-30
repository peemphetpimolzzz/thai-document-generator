const DIGITS = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
const POSITIONS = ['', 'สิบ', 'ร้อย', 'พัน', 'หมื่น', 'แสน'];

/** Reads a group of up to six digits in Thai (handles เอ็ด / ยี่ / สิบ specials). */
function readGroup(group: string): string {
  let result = '';
  const length = group.length;
  for (let i = 0; i < length; i++) {
    const digit = Number(group[i]);
    const position = length - i - 1;
    if (digit === 0) {
      continue;
    }
    if (position === 0 && digit === 1 && length > 1) {
      result += 'เอ็ด';
    } else if (position === 1 && digit === 2) {
      result += 'ยี่สิบ';
    } else if (position === 1 && digit === 1) {
      result += 'สิบ';
    } else {
      result += DIGITS[digit] + POSITIONS[position];
    }
  }
  return result;
}

function readNumber(value: number): string {
  if (value === 0) {
    return 'ศูนย์';
  }
  let result = '';
  const millions = Math.floor(value / 1_000_000);
  const remainder = value % 1_000_000;
  if (millions > 0) {
    result += readNumber(millions) + 'ล้าน';
  }
  if (remainder > 0) {
    result += readGroup(String(remainder));
  }
  return result;
}

/** Converts an amount in satang to its Thai-baht spelled-out form, e.g. "ห้าพันบาทถ้วน". */
export function bahtText(satang: number): string {
  const negative = satang < 0;
  const absolute = Math.abs(Math.round(satang));
  const baht = Math.floor(absolute / 100);
  const remainderSatang = absolute % 100;

  if (baht === 0 && remainderSatang === 0) {
    return 'ศูนย์บาทถ้วน';
  }

  let text = '';
  if (baht > 0) {
    text += readNumber(baht) + 'บาท';
  }
  if (remainderSatang === 0) {
    text += 'ถ้วน';
  } else {
    text += readGroup(String(remainderSatang)) + 'สตางค์';
  }

  return (negative ? 'ลบ' : '') + text;
}
