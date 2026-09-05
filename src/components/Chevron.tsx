/**
 * Chevron
 * The disclosure arrow, drawn from borders so it needs no icon set. Rotates a
 * quarter turn when open, as on macOS.
 */

import React from 'react';
import { View } from 'react-native';
import { control } from '../tokens';

export interface ChevronProps {
  open?: boolean;
  size?: number;
  color: string;
}

export function Chevron({ open = false, size = control.chevronSize, color }: ChevronProps) {
  const arm = size * 0.42;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={{
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{ rotate: open ? '90deg' : '0deg' }],
      }}
    >
      <View
        style={{
          width: arm,
          height: arm,
          borderTopWidth: 1.9,
          borderRightWidth: 1.9,
          borderColor: color,
          transform: [{ rotate: '45deg' }],
          marginLeft: -arm * 0.25,
        }}
      />
    </View>
  );
}
