export function normalizeMobile(mobile: string): string {
  let raw = mobile.replace(/[^\d]/g, '');

  if (raw.startsWith('0098')) raw = raw.slice(2);
  if (raw.startsWith('98') && raw.length === 12) raw = `0${raw.slice(2)}`;

  return raw;
}

export function isValidMobile(mobile: string): boolean {
  const normalized = normalizeMobile(mobile);
  return /^09\d{9}$/.test(normalized);
}
