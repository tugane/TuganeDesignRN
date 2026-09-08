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
import { NOISE_PNG_BASE64 } from '../noise';

/**
 * Hoisted. Written inline as `source={{ uri: … }}` this allocated a fresh
 * object on every render, and React Native keys its image cache on the source —
 * a new object each time invites a re-decode of the tile per render, per
 * instance. One frozen object means one decode, shared by every overlay.
 */
const NOISE_SOURCE = { uri: NOISE_PNG_BASE64 } as const;

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
      // soft-light shows on dark and light without crushing legibility.
      style={[
        StyleSheet.absoluteFill,
        { opacity },
        blend && { mixBlendMode: 'soft-light' as const },
      ]}
    >
      <Image
        source={{ uri: NOISE_PNG_BASE64 }}
        resizeMode="repeat"
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
