const BASE62_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const BASE = BASE62_ALPHABET.length;
const ACCEPT_BOUND = Math.floor(256 / BASE) * BASE;

function generateBase62Token(length = 9): string {
  const out: string[] = [];
  const buf = new Uint8Array(length);
  while (out.length < length) {
    crypto.getRandomValues(buf);
    for (let i = 0; i < buf.length && out.length < length; i++) {
      const byte = buf[i];
      if (byte >= ACCEPT_BOUND) continue;
      out.push(BASE62_ALPHABET[byte % BASE]);
    }
  }
  return out.join('');
}

export function generateAutoId(): string {
  return generateBase62Token();
}
