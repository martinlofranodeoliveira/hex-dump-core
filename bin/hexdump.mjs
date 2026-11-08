#!/usr/bin/env node
// Demo: dump and reparse 'Hello\n', asserts exact round-trip. --assert exits non-zero on mismatch.
import { dump, parse } from '../src/hexdump.mjs';

const HELLO = Uint8Array.from([0x48, 0x65, 0x6c, 0x6c, 0x6f, 0x0a]);

let failed = 0;
const text = dump(HELLO);
const back = parse(text);
const pass = back.length === HELLO.length && back.every((v, i) => v === HELLO[i]);
console.log(text.trimEnd());
console.log(`${pass ? 'PASS' : 'FAIL'} round-trip ${HELLO.length} bytes`);
if (!pass) failed++;
if (process.argv.includes('--assert') && failed > 0) process.exit(1);
if (failed > 0) process.exitCode = 1;
console.log(failed === 0 ? 'demo: all cases as expected' : `demo: ${failed} mismatch(es)`);
