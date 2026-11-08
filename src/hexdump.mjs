// SPDX-License-Identifier: MIT
// Classic hexdump: bytes -> offset/hex/ascii lines and back. 16 bytes per
// line, canonical spacing, strict reparse. No network, no I/O.

export const MAX_BYTES = 1048576; // 1 MiB

export class HexError extends Error {
  constructor(code, detail = '') {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'HexError';
    this.code = code;
  }
}

const hx = (b) => b.toString(16).padStart(2, '0');
const printable = (b) => (b >= 0x20 && b <= 0x7e ? String.fromCharCode(b) : '.');

/** Bytes -> canonical dump text (offset 8 hex digits). */
export function dump(bytes) {
  if (!(bytes instanceof Uint8Array)) throw new HexError('NOT_BYTES');
  if (bytes.length > MAX_BYTES) throw new HexError('TOO_BIG');
  if (bytes.length === 0) return '';
  const lines = [];
  for (let off = 0; off < bytes.length; off += 16) {
    const chunk = bytes.slice(off, off + 16);
    const hex = [...chunk].map(hx);
    while (hex.length < 16) hex.push('  ');
    const left = hex.slice(0, 8).join(' ');
    const right = hex.slice(8).join(' ');
    const ascii = [...chunk].map(printable).join('');
    lines.push(`${off.toString(16).padStart(8, '0')}  ${left}  ${right}  |${ascii}|`);
  }
  return lines.join('\n') + '\n';
}

/** Canonical dump text -> bytes. Strict: offsets must chain exactly. */
export function parse(text) {
  if (typeof text !== 'string') throw new HexError('NOT_STRING');
  if (text.trim() === '') return new Uint8Array(0);
  const lines = text.replace(/\r\n?/g, '\n').trimEnd().split('\n');
  const out = [];
  let expect = 0;
  for (const line of lines) {
    const m = /^([0-9a-f]{8})  ((?:[0-9a-f]{2}|\s\s)(?: (?:[0-9a-f]{2}|\s\s)){7})  ((?:[0-9a-f]{2}|\s\s)(?: (?:[0-9a-f]{2}|\s\s)){7})  \|(.{0,16})\|$/.exec(line);
    if (!m) throw new HexError('BAD_LINE');
    const off = Number.parseInt(m[1], 16);
    if (off !== expect) throw new HexError('BAD_OFFSET');
    const cells = `${m[2]} ${m[3]}`.split(' ').filter((c) => c !== '');
    const ascii = m[4];
    if (cells.length !== ascii.length) throw new HexError('ASCII_MISMATCH');
    for (const c of cells) out.push(Number.parseInt(c, 16));
    expect += cells.length;
  }
  return Uint8Array.from(out);
}
