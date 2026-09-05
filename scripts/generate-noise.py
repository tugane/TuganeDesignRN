#!/usr/bin/env python3
"""
Regenerate src/noise.ts — the tiled film-grain texture.

The tile is checked in rather than generated at runtime: the grain is a fixed
asset of the design language, and re-rolling it per build would make the same
screen render differently on two machines. Seeded for that reason.

Usage: python3 scripts/generate-noise.py
"""
import base64
import pathlib
import random
import struct
import zlib

SIZE = 128
SEED = 20260904

random.seed(SEED)

raw = bytearray()
for _ in range(SIZE):
    raw.append(0)                                    # PNG filter type 0 per scanline
    raw.extend(random.randint(0, 255) for _ in range(SIZE))


def chunk(tag: bytes, data: bytes) -> bytes:
    return (struct.pack('>I', len(data)) + tag + data
            + struct.pack('>I', zlib.crc32(tag + data) & 0xFFFFFFFF))


png = (b'\x89PNG\r\n\x1a\n'
       + chunk(b'IHDR', struct.pack('>IIBBBBB', SIZE, SIZE, 8, 0, 0, 0, 0))  # 8-bit grayscale
       + chunk(b'IDAT', zlib.compress(bytes(raw), 9))
       + chunk(b'IEND', b''))

b64 = base64.b64encode(png).decode()
out = pathlib.Path(__file__).resolve().parent.parent / 'src' / 'noise.ts'
out.write_text(
    "// Generated once, checked in on purpose: the grain is a fixed asset of the\n"
    "// design language, not something each build should re-roll. 128x128 8-bit\n"
    "// grayscale noise, tiled by NoiseOverlay.\n"
    "//\n"
    "// Regenerate with scripts/generate-noise.py if the texture ever changes.\n\n"
    f"export const NOISE_PNG_BASE64 =\n  'data:image/png;base64,{b64}';\n"
)
print(f"wrote {out} ({len(png)} byte png)")
