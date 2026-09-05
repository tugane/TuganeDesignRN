/**
 * FieldLabel / SectionLabel
 * The small pieces: a caption introducing a field, and the uppercase heading
 * that opens a section.
 */

import React from 'react';
import { Text, type StyleProp, type TextStyle } from 'react-native';
import { usePalette } from '../context';
import { type } from '../tokens';

export interface LabelProps {
  children: string;
  style?: StyleProp<TextStyle>;
}

/** Small semibold caption introducing a field or group. */
export function FieldLabel({ children, style }: LabelProps) {
  const p = usePalette();
  return <Text style={[type.fieldLabel, { color: p.label2 }, style]}>{children}</Text>;
}

/** Uppercase section heading used in sidebars and long pages. */
export function SectionLabel({ children, style }: LabelProps) {
  const p = usePalette();
  return (
    <Text style={[type.sectionLabel, { color: p.label3 }, style]}>
      {children.toUpperCase()}
    </Text>
  );
}
