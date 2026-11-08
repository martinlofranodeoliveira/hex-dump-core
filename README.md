# hex-dump-core

Classic hexdump: bytes to offset/hex/ascii lines and strict reparse
back. Zero runtime dependencies, Node >= 22.

Part of the LOFRANO TECNOLOGIA open-source lab. MIT.

```js
import { dump, parse } from './src/hexdump.mjs';
parse(dump(bytes)); // identical bytes
```

```sh
npm test          # 5 tests incl. 0–255 round-trip, no dependencies
npm run demo
```

At most 1 MiB. MIT — see `LICENSE`. [Versão em português](README.pt-BR.md).
