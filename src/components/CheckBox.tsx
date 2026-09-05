/**
 * CheckBox
 * Drawn from plain views rather than an icon set, so the core of the language
 * works in an app that has installed no symbol library at all.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { usePalette } from '../context';
import { control, radius as R } from '../tokens';

export interface CheckBoxProps {
  on: boolean;
  size?: number;
}

export function CheckBox({ on, size = control.checkboxSize }: CheckBoxProps) {
  const p = usePalette();
  const tick = size * 0.38;

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        s.box,
        {
          width: size,
          height: size,
          borderRadius: R.checkbox,
          backgroundColor: on ? p.accent : 'transparent',
          borderColor: on ? p.accent : p.label3,
        },
      ]}
    >
      {on && (
        // Two borders on a rotated box make the tick: the long leg up-right,
        // the short leg down-left.
        <View
          style={{
            width: tick * 1.7,
            height: tick,
            borderBottomWidth: 1.8,
            borderLeftWidth: 1.8,
            borderColor: '#FFFFFF',
            transform: [{ rotate: '-45deg' }],
            marginTop: -tick * 0.28,
          }}
        />
      )}
    </View>
  );
}

const s = StyleSheet.create({
  box: {
    borderWidth: 1.4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
