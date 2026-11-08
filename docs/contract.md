# Contract — hex-dump-core

Pure ESM in `src/hexdump.mjs`, zero runtime dependencies, Node >= 22.
16 bytes per line: 8-hex offset, two 8-cell groups, `|ascii|` (`.` for
non-printables). Up to 1 MiB.

| Export | Result |
| --- | --- |
| `MAX_BYTES` (1048576) | Hard bound. |
| `dump(bytes)` | Canonical text, empty input → `''`. |
| `parse(text)` | `Uint8Array`. Offsets must chain exactly; hex cells and ascii length must agree. |

Errors: `NOT_BYTES` · `TOO_BIG` · `NOT_STRING` · `BAD_LINE` ·
`BAD_OFFSET` · `ASCII_MISMATCH`.
