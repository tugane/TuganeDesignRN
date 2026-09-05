/**
 * theme.ts
 * TuganeDesign for React Native: the palette, ported 1:1 from the Swift package's
 * `Theme.swift`.
 *
 * Every colour is resolved from an explicit `Palette` rather than a platform
 * semantic colour, exactly as on macOS: apps carry their own light/dark toggle
 * and push the palette down, so an in-app theme can never disagree with what is
 * drawn. Nothing here reads `useColorScheme()`.
 */

// ─── Theme ────────────────────────────────────────────────────────────────────

export type Theme = 'dark' | 'light';

export const toggled = (t: Theme): Theme => (t === 'dark' ? 'light' : 'dark');

/** Label for a theme toggle; names the theme you'd switch *to*. */
export const toggleLabel = (t: Theme): string => (t === 'dark' ? 'Light' : 'Dark');

// ─── Palette ──────────────────────────────────────────────────────────────────

/** One resolved set of colours. Mirrors the Swift `Palette` field for field. */
export interface Palette {
  win:     string;
  sidebar: string;
  content: string;

  card:      string;
  cardHover: string;
  well:      string;

  sep:  string;
  sep2: string;

  label:  string;
  label2: string;
  label3: string;

  btn:      string;
  btnHover: string;

  accent:      string;
  accentHover: string;
  accentTint:  string;

  red:      string;
  redHover: string;
  green:    string;
  amber:    string;
  /**
   * Distinct from `amber` in BOTH palettes. Light-mode amber is already an
   * orange, so a state needing its own orange must use this.
   */
  orange: string;

  /**
   * Status colours darkened for small text. The vivid `green/amber/orange/red`
   * are icon/fill colours: at caption sizes on a light card they fall to ~2:1
   * contrast. Use these whenever a status colour carries *text*.
   */
  greenText:  string;
  amberText:  string;
  orangeText: string;
  redText:    string;

  sheet: string;
  scrim: string;

  /**
   * True for the dark palette. Lets views tune effects that don't translate
   * (glows, shadows) without reaching for the system colour scheme, which the
   * in-app theme toggle can disagree with.
   */
  isDark: boolean;

  /** Dark palettes carry the vivid glow; light ones smear unless dialed back. */
  glowStrength: number;
}

export const darkPalette: Palette = {
  win:         '#1C1C1E',
  sidebar:     'rgba(38,38,40,0.72)',
  content:     '#1C1C1E',
  card:        '#2C2C2E',
  cardHover:   '#333335',
  well:        '#242426',
  sep:         'rgba(255,255,255,0.09)',
  sep2:        'rgba(255,255,255,0.055)',
  label:       '#FFFFFF',
  label2:      'rgba(255,255,255,0.66)',
  label3:      'rgba(255,255,255,0.56)',
  btn:         'rgba(255,255,255,0.11)',
  btnHover:    'rgba(255,255,255,0.17)',
  accent:      '#0A84FF',
  accentHover: '#3D9DFF',
  accentTint:  'rgba(10,132,255,0.16)',
  red:         '#FF453A',
  redHover:    '#FF6259',
  green:       '#30D158',
  amber:       '#FFD60A',
  orange:      '#FF9F0A',
  greenText:   '#30D158',
  amberText:   '#FFD60A',
  orangeText:  '#FF9F0A',
  redText:     '#FF453A',
  sheet:       '#3A3A3C',
  scrim:       'rgba(0,0,0,0.42)',
  isDark:       true,
  glowStrength: 1.0,
};

export const lightPalette: Palette = {
  win:         '#FFFFFF',
  sidebar:     'rgba(246,246,248,0.80)',
  content:     '#FFFFFF',
  card:        '#F5F5F7',
  cardHover:   '#EEEEF1',
  well:        '#FAFAFC',
  sep:         'rgba(0,0,0,0.09)',
  sep2:        'rgba(0,0,0,0.055)',
  label:       '#000000',
  label2:      'rgba(0,0,0,0.64)',
  label3:      'rgba(0,0,0,0.58)',
  btn:         'rgba(0,0,0,0.06)',
  btnHover:    'rgba(0,0,0,0.10)',
  accent:      '#007AFF',
  accentHover: '#0A6FE0',
  accentTint:  'rgba(0,122,255,0.12)',
  red:         '#FF3B30',
  redHover:    '#E32A20',
  green:       '#34C759',
  amber:       '#FF9F0A',
  orange:      '#C93400',
  greenText:   '#1F8A3D',
  amberText:   '#B36200',
  orangeText:  '#C93400',
  redText:     '#D70015',
  sheet:       '#F2F2F5',
  scrim:       'rgba(0,0,0,0.24)',
  isDark:       false,
  glowStrength: 0.4,
};

export const paletteFor = (t: Theme): Palette =>
  t === 'dark' ? darkPalette : lightPalette;

// ─── Colour helpers ───────────────────────────────────────────────────────────

interface RGB { r: number; g: number; b: number }

function parseHex(hex: string): RGB | null {
  const h = hex.replace('#', '').trim();
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h;
  if (full.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

const clamp255 = (n: number) => Math.max(0, Math.min(255, Math.round(n)));

/** `#RRGGBB` at a given alpha, as an `rgba()` string React Native accepts. */
export function withAlpha(hex: string, alpha: number): string {
  const c = parseHex(hex);
  if (!c) return hex;
  return `rgba(${c.r},${c.g},${c.b},${alpha})`;
}

/** Mix toward white (`amount` 0..1). */
export function lighten(hex: string, amount: number): string {
  const c = parseHex(hex);
  if (!c) return hex;
  const mix = (v: number) => clamp255(v + (255 - v) * amount);
  return `rgb(${mix(c.r)},${mix(c.g)},${mix(c.b)})`;
}

/** Mix toward black (`amount` 0..1). */
export function darken(hex: string, amount: number): string {
  const c = parseHex(hex);
  if (!c) return hex;
  const mix = (v: number) => clamp255(v * (1 - amount));
  return `rgb(${mix(c.r)},${mix(c.g)},${mix(c.b)})`;
}

/**
 * A palette with a different accent.
 *
 * The Swift package ships a single system-blue accent because its apps are
 * desktop tools. An app that lets the user pick an accent (Namba does) can pass
 * one here and keep every other token identical, so the language still holds.
 * Pass nothing and you get the canonical blue.
 *
 * The hover and tint variants are derived the same direction the canonical
 * palette derives them: dark lightens, light darkens.
 */
export function makePalette(theme: Theme, accent?: string): Palette {
  const base = paletteFor(theme);
  if (!accent || !parseHex(accent)) return base;
  return {
    ...base,
    accent,
    accentHover: base.isDark ? lighten(accent, 0.22) : darken(accent, 0.12),
    accentTint:  withAlpha(accent, base.isDark ? 0.16 : 0.12),
  };
}
