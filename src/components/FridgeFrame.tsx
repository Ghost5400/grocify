// src/components/FridgeFrame.tsx
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { colors, elevation, radius } from '@/theme/tokens';

export interface FridgeFrameProps {
  children: React.ReactNode;
  rimWidth?: number;
  insetHorizontal?: number;
  style?: StyleProp<ViewStyle>;
  innerStyle?: StyleProp<ViewStyle>;
}

export function FridgeFrame({
  children,
  rimWidth = 10,
  insetHorizontal = 10,
  style,
  innerStyle,
}: FridgeFrameProps) {
  return (
    <View
      style={[
        styles.outerFrame,
        elevation.elevFridge,
        {
          marginHorizontal: insetHorizontal,
          borderWidth: rimWidth,
          borderColor: colors.rim.base,
        },
        style,
      ]}
    >
      {/* 1 pt inner white highlight ring */}
      <View
        style={[
          styles.innerHighlight,
          {
            borderRadius: radius.xl - rimWidth / 2,
          },
        ]}
      />
      {/* Frame content */}
      <View style={[styles.innerContent, innerStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerFrame: {
    borderRadius: radius.xl, // 28
    backgroundColor: colors.canvas,
    overflow: 'hidden',
    position: 'relative',
    borderTopColor: colors.rim.light,
    borderBottomColor: colors.rim.shadow,
    borderLeftColor: colors.rim.base,
    borderRightColor: colors.rim.base,
  },
  innerHighlight: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    pointerEvents: 'none',
  },
  innerContent: {
    flex: 1,
    overflow: 'hidden',
  },
});
