/**
 * NoiseOverlay
 * The film grain that gives large flat surfaces some tooth. Part of the
 * language, not an Auger-only flourish.
 *
 * The Swift version generates the texture at launch and blends it with
 * soft-light. Here the tile is a checked-in asset (see `../noise.ts`) and the
 * blend uses React Native's `mixBlendMode`, which is a ViewStyle prop, so it
 * goes on the wrapper rather than the image.
 */

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import NOISE_SOURCE from '../noise.png';

/**
 * A real asset, not a base64 data URI. Metro resolves it once and hands every
 * overlay the same asset id, so the tile is decoded a single time — where the
 * data URI was re-parsed per instance and carried 21.6 KB of string through the
 * JS bundle, parsed at every app launch.
 */

export interface NoiseOverlayProps {
  opacity?: number;
  /**
   * Soft-light blending. On by default — it is what makes the grain sit *in*
   * the surface rather than on top of it.
   *
   * Turn it off on anything that animates or repeats. `mixBlendMode` forces the
   * view into an off-screen buffer to composite, every frame, per instance; a
   * grain layer inside a moving tab bar or on every button costs GPU time on
   * the same frame budget the animation is drawing from. Without it the texture
   * is a plain alpha overlay: slightly flatter, effectively free.
   */
  blend?: boolean;
}

export function NoiseOverlay({ opacity = 0.2, blend = true }: NoiseOverlayProps) {
  return (
    <View
      pointerEvents="none"
      // No `shouldRasterizeIOS` here, deliberately. It looks like free
      // performance for a layer that never changes, but it snapshots the layer
      // at whatever size it had when the snapshot was taken — and an overlay
      // that fills its parent is frequently measured before the parent has
      // settled. The cached bitmap is then reused at the final, larger size,
      // and the grain stops in a hard vertical line partway across: Namba's
      // tab bar showed exactly this, grain over the first two icons and bare
      // surface after. A tiled fill of a decoded image is cheap; a wrong one
      // is not cheaper.
      //
      // renderToHardwareTextureAndroid goes with it: same promise, same
      // staleness, and keeping one platform on a cached layer would mean the
      // two platforms disagree about where the grain ends.
      //
      // soft-light shows on dark and light without crushing legibility.
      style={[
        StyleSheet.absoluteFill,
        { opacity },
        blend && { mixBlendMode: 'soft-light' as const },
      ]}
    >
      <Image
        source={NOISE_SOURCE}
        resizeMode="repeat"
        style={StyleSheet.absoluteFill}
        fadeDuration={0}
      />
    </View>
  );
}
