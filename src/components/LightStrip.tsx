// src/components/LightStrip.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { radius } from '@/theme/tokens';

export interface LightStripProps {
  widthPercent?: number; // e.g., 70 or 64
}

export function LightStrip({ widthPercent = 70 }: LightStripProps) {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.glow,
          { width: `${widthPercent}%` },
        ]}
      />
      <View
        style={[
          styles.strip,
          { width: `${widthPercent}%` },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    height: 14,
  },
  glow: {
    position: 'absolute',
    height: 12,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    // Shadow glow for iOS/Web/Android
    shadowColor: '#FFFFFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 3,
  },
  strip: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
});
