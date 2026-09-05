/**
 * Mascot
 * The icon badge used for hero, empty, error and sheet spots. Renders no image
 * asset: it scales to whatever frame you give it.
 *
 * The symbol itself is drawn by the app's `IconRenderer` (see `context.tsx`),
 * because React Native ships no symbol set and this package will not pick one
 * for you.
 */

import React, { useState } from 'react';
import { View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';
import { useTugane } from '../context';

export interface MascotProps {
  /** Symbol name, in whatever vocabulary your IconRenderer speaks. */
  symbol: string;
  /** Defaults to `palette.accent`. */
  tint?: string;
  style?: StyleProp<ViewStyle>;
}

export function Mascot({ symbol, tint, style }: MascotProps) {
  const { palette, icon } = useTugane();
  const [side, setSide] = useState(0);

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSide(Math.min(width, height));
  };

  if (!icon && __DEV__) {
    console.warn(
      '[TuganeDesign] <Mascot> needs an `icon` renderer on <TuganeDesignProvider>.',
    );
  }

  return (
    <View style={[{ flex: 1, alignItems: 'center', justifyContent: 'center' }, style]} onLayout={onLayout}>
      {side > 0 && icon?.({ name: symbol, size: side * 0.58, color: tint ?? palette.accent })}
    </View>
  );
}
