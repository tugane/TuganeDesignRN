/**
 * Card
 * The container surface: a solid rounded panel filled with a palette token.
 * Clips its content so row fills and separators cannot paint over the corners.
 *
 * The Swift side is a `View.card(_:radius:)` modifier; a component is the
 * idiomatic shape here, and does the same two things.
 */

import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { usePalette } from '../context';
import { radius as R } from '../tokens';

export interface CardProps {
  /** Surface token. Defaults to `palette.card`. */
  color?: string;
  radius?: number;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function Card({ color, radius = R.card, style, children }: CardProps) {
  const p = usePalette();
  return (
    <View
      style={[
        { backgroundColor: color ?? p.card, borderRadius: radius, overflow: 'hidden' },
        style,
      ]}
    >
      {children}
    </View>
  );
}
