# Design — hex-dump-core

Dumping is mechanical; parsing is strict. The regex pins the whole line
shape, the offset must equal the running byte count, and the cell count
must match the ascii length — a hand-edited dump with a miscounted
column fails instead of decoding shifted bytes.

Oracle: byte-exact full line, 0–255 round-trip, tampered offset, junk
input. Empty input is the only empty output.
