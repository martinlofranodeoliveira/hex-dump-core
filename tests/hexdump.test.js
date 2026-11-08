import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { dump, parse, HexError } from '../src/hexdump.mjs';

const HELLO = Uint8Array.from([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x0a]);

describe('dump', () => {
  it('formats a full 16-byte line exactly', () => {
    const bytes = Uint8Array.from({ length: 16 }, (_, i) => i);
    assert.equal(
      dump(bytes),
      '00000000  00 01 02 03 04 05 06 07  08 09 0a 0b 0c 0d 0e 0f  |................|\n',
    );
  });
  it('pads the last line and handles empty', () => {
    assert.equal(dump(new Uint8Array(0)), '');
    const one = dump(Uint8Array.from([0xff]));
    assert.ok(one.startsWith('00000000  ff'));
    assert.ok(one.endsWith('|.|' + '\n'));
    assert.equal(one.length, '00000000  '.length + 23 + 2 + 23 + 2 + '|.|'.length + 1);
  });
  it('rejects non-bytes and oversize', () => {
    assert.throws(() => dump('nope'), (e) => e.code === 'NOT_BYTES');
    assert.throws(() => dump(new Uint8Array(1048577)), (e) => e.code === 'TOO_BIG');
  });
});

describe('parse', () => {
  it('round-trips binary incl. all byte values', () => {
    const all = Uint8Array.from({ length: 256 }, (_, i) => i);
    assert.deepEqual(parse(dump(all)), all);
    assert.deepEqual(parse(dump(HELLO)), HELLO);
  });
  it('rejects broken offsets and bad lines', () => {
    const bad = dump(HELLO).replace('00000000', '00000010');
    assert.throws(() => parse(bad), (e) => e.code === 'BAD_OFFSET');
    assert.throws(() => parse('junk'), (e) => e.code === 'BAD_LINE');
    assert.ok(new HexError('X') instanceof Error);
  });
});
