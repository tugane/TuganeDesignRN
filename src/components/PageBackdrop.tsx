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
import { useTugane } from '../context';

export interface PageBackdropProps {
  /** Symbol name, in whatever vocabulary your IconRenderer speaks. */
  symbol: string;
  /** Defaults to `palette.accent`. */
  tint?: string;
  /** Glyph point size. The Swift original uses 460. */
  size?: number;
  /** Blur radius. The Swift original uses 48. */
  blur?: number;
  opacity?: number;
}

const DRIFT_MS = 11_000;

export function PageBackdrop({
  symbol,
  tint,
  size = 460,
  blur = 48,
  opacity = 1,
}: PageBackdropProps) {
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

  if (!icon && __DEV__) {
    console.warn(
      '[TuganeDesign] <PageBackdrop> needs an `icon` renderer on <TuganeDesignProvider>.',
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, s.clip]} pointerEvents="none">
      <Animated.View
        style={{
          opacity,
          filter: [{ blur }],
          transform: [
            { translateX: interp(80, 150) },
            { translateY: interp(-80, 10) },
            {
              rotate: drift.interpolate({
                inputRange: [0, 1],
                outputRange: ['-14deg', '-2deg'],
              }),
            },
          ],
        }}
      >
        {icon?.({ name: symbol, size, color: tint ?? palette.accent })}
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  clip: { overflow: 'hidden', alignItems: 'flex-end', justifyContent: 'flex-start' },
});
