/** Romanian plate helpers: B 123 ABC → B123ABC */

const PLATE_RE =
  /^(?:B|AB|AR|AG|BC|BH|BN|BT|BV|BR|BZ|CS|CL|CJ|CT|CV|DB|DJ|GL|GR|GJ|HR|HD|IL|IS|IF|MM|MH|MS|NT|OT|PH|SM|SJ|SB|SV|TR|TM|TL|VL|VS|VN)\d{2,3}[A-Z]{3}$/;

export function normalizePlate(input: string): string {
  return input
    .toUpperCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Z0-9]/g, "");
}

export function formatPlateDisplay(normalized: string): string {
  const n = normalizePlate(normalized);
  // B123ABC → B 123 ABC ; CJ12ABC → CJ 12 ABC
  const m = n.match(/^([A-Z]{1,2})(\d{2,3})([A-Z]{3})$/);
  if (!m) return n;
  return `${m[1]} ${m[2]} ${m[3]}`;
}

export function isValidRoPlate(input: string): boolean {
  return PLATE_RE.test(normalizePlate(input));
}

export function generateBookingCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "SC";
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}
