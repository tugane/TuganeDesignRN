/**
 * PageBackdrop
 * The large blurred watermark behind a page: a decorative glyph, heavily
 * blurred, drifting on a slow loop. It is what gives the language its sense of
 * depth, and it is deliberately a *symbol* rather than a gradient: the
 * silhouette keeps the shape organic instead of a perfect circle.
 *
 * Use a different glyph per page, distinct from the nav icons.
 *
 * The blur is React Native's `filter: [{ blur }]` (RN 0.76+), which maps onto
 * the same thing SwiftUI's `.blur(radius:)` does. Android draws it through
 * RenderEffect, so on API < 31 the filter is a no-op and the glyph renders
 * crisp; `opacity` keeps it a backdrop either way.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Defs, Filter, FeGaussianBlur, G, Text as SvgText } from 'react-native-svg';
import { useTugane } from '../context';

export interface PageBackdropProps {
  /** Symbol name, in whatever vocabulary your IconRenderer speaks. */
  symbol: string;
  /** Defaults to `palette.accent`. */
  tint?: string;
  /**
   * Glyph point size. The Swift original uses 460, chosen against a window of
   * at least 980pt — roughly 47% of the width. On a phone, passing 460
   * literally makes the glyph wider than the screen and it reads as a wash
   * rather than a corner watermark. Scale it to the viewport instead.
   */
  size?: number;
  /**
   * Blur radius. Defaults proportionally to `size` so the softness matches the
   * Swift original at any scale (48 when size is 460).
   */
  blur?: number;
  opacity?: number;
  /**
   * Render the glyph as SVG text behind a real Gaussian blur, instead of
   * through the `icon` renderer with a CSS `filter`.
   *
   * Prefer this. React Native's `filter: [{ blur }]` does not render on iOS
   * unless the `enableSwiftUIBasedFilters` feature flag is on — it defaults to
   * false and Expo does not enable it — and it is a no-op on Android below API
   * 31. So the CSS path produces a hard-edged glyph on every platform we ship
   * to, which is not the effect at all: the Swift original is unrecognisable
   * once blurred, and that softness *is* the design.
   *
   * `family` is the icon font's family name and `glyph` the character it maps
   * to, e.g. Ionicons `wallet` is `\uf625`.
   */
  font?: { family: string; glyph: string };
}

const DRIFT_MS = 11_000;

/** The Swift original's glyph size; every other magnitude is relative to it. */
const REFERENCE_SIZE = 460;

export function PageBackdrop({
  symbol,
  tint,
  size = REFERENCE_SIZE,
  blur,
  opacity = 1,
  font,
}: PageBackdropProps) {
  // Everything below scales with the glyph, so a smaller `size` reproduces the
  // original composition rather than a big glyph shoved off-screen. At the
  // default size these resolve to exactly the Swift values.
  const k = size / REFERENCE_SIZE;
  const blurRadius = blur ?? 48 * k;
  /**
   * SwiftUI's `.blur(radius:)` approximates a Gaussian whose standard
   * deviation is about half the stated radius, while SVG's `stdDeviation` is
   * sigma itself. Passing the radius straight through renders twice as diffuse
   * as the Swift original, so halve it here.
   */
  const stdDeviation = blurRadius / 2;
  const { palette, icon } = useTugane();
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const leg = (to: number) =>
      Animated.timing(drift, {
        toValue: to,
        duration: DRIFT_MS,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      });
    // .repeatForever(autoreverses: true)
    const loop = Animated.loop(Animated.sequence([leg(1), leg(0)]));
    loop.start();
    return () => loop.stop();
  }, [drift]);

  const interp = (from: number, to: number) =>
    drift.interpolate({ inputRange: [0, 1], outputRange: [from, to] });

  if (!icon && !font && __DEV__) {
    console.warn(
      '[TuganeDesign] <PageBackdrop> needs an `icon` renderer on <TuganeDesignProvider>.',
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, s.clip]} pointerEvents="none">
      <Animated.View
        style={{
          opacity,
          filter: [{ blur: blurRadius }],
          transform: [
            { translateX: interp(80 * k, 150 * k) },
            { translateY: interp(-80 * k, 10 * k) },
            {
              rotate: drift.interpolate({
                inputRange: [0, 1],
                outputRange: ['-14deg', '-2deg'],
              }),
            },
          ],
        }}
      >
        {font ? (
          // The filter region has to be oversized or the blur is clipped to the
          // glyph's bounding box and comes back with hard edges at the crop.
          <Svg width={size * 2} height={size * 2}>
            <Defs>
              <Filter id="pageBackdropBlur" x="-50%" y="-50%" width="200%" height="200%">
                <FeGaussianBlur stdDeviation={stdDeviation} />
              </Filter>
            </Defs>
            <G filter="url(#pageBackdropBlur)">
              <SvgText
                x={size}
                y={size * 1.25}
                textAnchor="middle"
                fontFamily={font.family}
                fontSize={size}
                fill={tint ?? palette.accent}
              >
                {font.glyph}
              </SvgText>
            </G>
          </Svg>
        ) : (
          icon?.({ name: symbol, size, color: tint ?? palette.accent })
        )}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  clip: { overflow: 'hidden', alignItems: 'flex-end', justifyContent: 'flex-start' },
});
