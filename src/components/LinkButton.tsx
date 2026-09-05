/**
 * LinkButton
 * A text action. The hover colour becomes the pressed colour, as everywhere
 * else in the React Native port.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { control, hitSlopFor, type } from '../tokens';

export interface LinkButtonProps {
  title: string;
  color: string;
  /** Shown while pressed. Falls back to `color`. */
  pressColor?: string;
  disabled?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function LinkButton({
  title,
  color,
  pressColor,
  disabled = false,
  onPress,
  style,
}: LinkButtonProps) {
  return (
    <View style={[s.wrap, style]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        hitSlop={hitSlopFor(control.pillHeight - 12)}
        accessibilityRole="link"
        accessibilityLabel={title}
        accessibilityState={{ disabled }}
      >
        {({ pressed }) => (
          <Text
            numberOfLines={1}
            style={[
              type.link,
              { color: pressed ? (pressColor ?? color) : color, opacity: disabled ? 0.45 : 1 },
            ]}
          >
            {title}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({ wrap: { alignSelf: 'flex-start' } });
