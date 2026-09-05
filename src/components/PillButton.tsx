/**
 * PillButton
 * The action vocabulary. Ported from the Swift package, with one translation:
 * macOS drives the `*Hover` tokens from the pointer, and a phone has no pointer,
 * so they are driven by the *press* instead. Same tokens, same two-state feel.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { usePalette } from '../context';
import { control, hitSlopFor, radius as R, type } from '../tokens';

export type PillRole = 'accent' | 'neutral' | 'destructive';

export interface PillButtonProps {
  title: string;
  role?: PillRole;
  height?: number;
  hpad?: number;
  radius?: number;
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

export function PillButton({
  title,
  role = 'neutral',
  height = control.pillHeight,
  hpad = control.pillHPad,
  radius = R.pill,
  disabled = false,
  onPress,
  style,
  accessibilityLabel,
}: PillButtonProps) {
  const p = usePalette();

  const fill = (pressed: boolean) => {
    switch (role) {
      case 'accent':      return pressed ? p.accentHover : p.accent;
      case 'destructive': return pressed ? p.redHover    : p.red;
      default:            return pressed ? p.btnHover    : p.btn;
    }
  };
  const fg = role === 'neutral' ? p.label : '#FFFFFF';

  return (
    // A pill states an action: it keeps its intrinsic width and lets the
    // surrounding layout give way, so a tight row can never hyphenate the
    // label into "Clon e...".
    <View style={[s.wrap, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        hitSlop={hitSlopFor(height)}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? title}
        accessibilityState={{ disabled }}
        style={({ pressed }) => [
          s.pill,
          {
            height,
            paddingHorizontal: hpad,
            borderRadius: radius,
            backgroundColor: fill(pressed),
            opacity: disabled ? 0.45 : 1,
          },
        ]}
      >
        <Text numberOfLines={1} style={[type.pill, { color: fg }]}>
          {title}
        </Text>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignSelf: 'flex-start' },
  pill: { alignItems: 'center', justifyContent: 'center' },
});
