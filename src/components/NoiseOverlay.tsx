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

export interface NoiseOverlayProps {
  opacity?: number;
}

export function NoiseOverlay({ opacity = 0.2 }: NoiseOverlayProps) {
  return (
    <View
      pointerEvents="none"
      // soft-light shows on dark and light without crushing legibility.
      style={[StyleSheet.absoluteFill, { opacity, mixBlendMode: 'soft-light' }]}
    >
      <Image
        source={{ uri: NOISE_PNG_BASE64 }}
        resizeMode="repeat"
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}
