#!/usr/bin/env python3
"""
Diff src/theme.ts against the Swift package's Theme.swift and fail on drift.

The Swift package is the source of truth for the palette. This exists so the two
cannot quietly diverge: run it after touching either side.

Usage: python3 scripts/verify-palette.py [path/to/TuganeDesign]
Exits non-zero if any token differs or is missing.
"""
import pathlib
import re
import sys

DEFAULT_SWIFT = pathlib.Path(__file__).resolve().parent.parent.parent / 'TuganeDesign'

root = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_SWIFT
swift_path = root / 'Sources' / 'TuganeDesign' / 'Theme.swift'
ts_path = pathlib.Path(__file__).resolve().parent.parent / 'src' / 'theme.ts'

if not swift_path.exists():
    sys.exit(f'Swift source not found: {swift_path}\nPass its repo root as an argument.')

swift = swift_path.read_text()
ts = ts_path.read_text()


def swift_palette(name: str) -> dict[str, str]:
    """Read a `Palette(...)` literal and normalise each Color to CSS."""
    m = re.search(rf'public static let {name} = Palette\((.*?)\n    \)', swift, re.S)
    if not m:
        sys.exit(f'Could not find Swift palette "{name}"')
    out: dict[str, str] = {}
    for field, expr in re.findall(r'(\w+):\s*(Color\([^)]*\)|true|false)', m.group(1)):
        if expr in ('true', 'false'):
            out[field] = expr
        elif h := re.search(r'hex:\s*0x([0-9A-Fa-f]{6})(?:,\s*opacity:\s*([\d.]+))?', expr):
            hexv, op = h.group(1).upper(), h.group(2)
            if op is None:
                out[field] = '#' + hexv
            else:
                r, g, b = int(hexv[0:2], 16), int(hexv[2:4], 16), int(hexv[4:6], 16)
                out[field] = f'rgba({r},{g},{b},{op})'
        elif w := re.search(r'(?:white|black):\s*([\d.]+),\s*opacity:\s*([\d.]+)', expr):
            v = int(round(float(w.group(1)) * 255))
            out[field] = f'rgba({v},{v},{v},{w.group(2)})'
    return out


def ts_palette(name: str) -> dict[str, str]:
    m = re.search(rf'export const {name}: Palette = \{{(.*?)\n\}};', ts, re.S)
    if not m:
        sys.exit(f'Could not find TS palette "{name}"')
    body = m.group(1)
    out = {f: v for f, v in re.findall(r"(\w+):\s*'([^']+)'", body)}
    out.update({f: v for f, v in re.findall(r'(\w+):\s*(true|false),', body)})
    return out


drift = 0
for swift_name, ts_name in (('dark', 'darkPalette'), ('light', 'lightPalette')):
    sw, t = swift_palette(swift_name), ts_palette(ts_name)
    for field, want in sw.items():
        got = t.get(field)
        if got != want:
            drift += 1
            print(f'  {swift_name}.{field}: swift={want!r} ts={got!r}')
    print(f'{swift_name}: checked {len(sw)} tokens')

if drift:
    sys.exit(f'\n{drift} token(s) drifted from the Swift palette.')
print('\nPalette matches the Swift source exactly.')
