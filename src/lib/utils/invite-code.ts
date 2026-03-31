const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1 to avoid confusion

export function generateInviteCode(length = 8): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => CHARSET[byte % CHARSET.length]).join("");
}
