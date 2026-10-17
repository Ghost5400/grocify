// src/components/GlassShelf.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';

export interface GlassShelfProps {
  insetHorizontal?: number;
}

export function GlassShelf({ insetHorizontal = 10 }: GlassShelfProps) {
  return (
    <View style={[styles.container, { marginHorizontal: insetHorizontal }]}>
      {/* 2 pt top white highlight line */}
      <View style={styles.highlightLine} />
      {/* 14 pt translucent glass band */}
      <View style={styles.glassBand} />
      {/* 1 pt subtle bottom shadow */}
      <View style={styles.bottomShadow} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 'auto',
    position: 'relative',
  },
  highlightLine: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
  },
  glassBand: {
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 2,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  bottomShadow: {
    height: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
});
