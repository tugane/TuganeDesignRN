/**
 * tokens.ts
 * Sizes, radii and weights lifted out of the Swift components so they are
 * stated once instead of re-typed per app.
 *
 * The language sets type in explicit points rather than semantic styles, so a
 * card title is the same size in every app. Keep it that way.
 */

import type { TextStyle } from 'react-native';

/** SwiftUI `Font.Weight` -> React Native `fontWeight`. */
export const weight = {
  regular:  '400',
  medium:   '500',
  semibold: '600',
  bold:     '700',
} as const satisfies Record<string, TextStyle['fontWeight']>;

export const radius = {
  checkbox: 5,
  pill:     9,
  card:     12,
} as const;

/**
 * The type scale, matching the Swift components' `.system(size:weight:)` calls.
 * Colour is deliberately absent: it comes from the palette at the call site.
 */
export const type = {
  /** PillButton label. */
  pill:         { fontSize: 13.5, fontWeight: weight.medium },
  /** LinkButton label. */
  link:         { fontSize: 13,   fontWeight: weight.medium },
  /** FieldLabel. */
  fieldLabel:   { fontSize: 13,   fontWeight: weight.semibold },
  /** SectionLabel: uppercase, tracked out. */
  sectionLabel: { fontSize: 11.5, fontWeight: weight.semibold, letterSpacing: 0.6 },
} as const satisfies Record<string, TextStyle>;

export const control = {
  /** PillButton default height, as on macOS. */
  pillHeight:  36,
  pillHPad:    18,
  checkboxSize: 19,
  chevronSize:  14,
  /**
   * Touch slop added around controls shorter than the 44pt minimum target.
   * The pill keeps its 36pt *look* and grows only its *touch* area: the
   * language should not get chunkier just because it moved to a phone.
   */
  minTarget: 44,
} as const;

/** Extra tap area needed to reach `minTarget` for a control of `height`. */
export const hitSlopFor = (height: number) => {
  const pad = Math.max(0, (control.minTarget - height) / 2);
  return { top: pad, bottom: pad, left: 0, right: 0 };
};
