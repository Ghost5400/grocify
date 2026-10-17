// src/components/FridgeBase.tsx
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '@/theme/tokens';

export function FridgeBase() {
  return (
    <View style={styles.container}>
      <View style={styles.panel}>
        {/* Two grille bars */}
        <View style={styles.grilleContainer}>
          <View style={styles.grilleBar} />
          <View style={styles.grilleBar} />
        </View>
      </View>

      {/* Two feet underneath */}
      <View style={[styles.foot, styles.footLeft]} />
      <View style={[styles.foot, styles.footRight]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  panel: {
    width: '100%',
    height: 64,
    backgroundColor: colors.base.body,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
  },
  grilleContainer: {
    gap: spacing.sm, // 8
    alignItems: 'center',
  },
  grilleBar: {
    width: 168,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.base.grille,
  },
  foot: {
    position: 'absolute',
    bottom: -6,
    width: 28,
    height: 10,
    borderRadius: 4,
    backgroundColor: colors.foot,
    zIndex: -1,
  },
  footLeft: {
    left: 28,
  },
  footRight: {
    right: 28,
  },
});
