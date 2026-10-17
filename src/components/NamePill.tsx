// src/components/NamePill.tsx
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, radius, typography } from '@/theme/tokens';

export interface NamePillProps {
  name: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function NamePill({ name, style, testID }: NamePillProps) {
  return (
    <View testID={testID} style={[styles.container, style]}>
      {/* 1 pt inner white highlight */}
      <View style={styles.innerHighlight} />
      <Text style={[styles.nameText, typography.titleLg]}>{name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 60,
    borderRadius: radius.lg, // 24
    backgroundColor: colors.card.name,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  innerHighlight: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    pointerEvents: 'none',
  },
  nameText: {
    color: colors.ink.title,
    textAlign: 'center',
  },
});
