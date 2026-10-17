// src/components/common/SproutLogo.tsx
// Two-leaf sprout icon and GROCIFY wordmark with sprout leaf above the 'O'.
// Per UIUX.md Section 5 and Section 6.

import React from 'react';
import { StyleProp, StyleSheet, Text, TextStyle, View, ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, typography } from '@/theme/tokens';

export interface SproutLogoProps {
  width?: number;
  height?: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
}

export function SproutLogo({
  width = 24,
  height = 20,
  color = colors.brand.forest,
  style,
}: SproutLogoProps) {
  return (
    <View style={style} testID="sprout-logo">
      <Svg width={width} height={height} viewBox="0 0 24 20" fill="none">
        {/* Left leaf */}
        <Path
          d="M12 14C11.5 10 8 7 3 7.5C2.5 11.5 6 15 11 15"
          fill={color}
          opacity={0.92}
        />
        {/* Right leaf (slightly larger, organic curve) */}
        <Path
          d="M12 12C13 7.5 17 4.5 22 4C22.5 9 18.5 13 13 13.5"
          fill={color}
        />
        {/* Central stem */}
        <Path
          d="M12 20C12 16 12 12 12 10"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
}

export interface GrocifyWordmarkProps {
  size?: 'large' | 'compact';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  embossed?: boolean;
}

export function GrocifyWordmark({
  size = 'large',
  style,
  textStyle,
  embossed = false,
}: GrocifyWordmarkProps) {
  const isCompact = size === 'compact';

  if (isCompact) {
    return (
      <View style={[styles.compactContainer, style]} testID="grocify-wordmark-compact">
        <View style={styles.compactWordRow}>
          <Text style={[styles.compactText, textStyle]}>GROCIFY</Text>
          <SproutLogo width={14} height={12} color={colors.brand.logo} style={styles.compactSprout} />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.largeContainer, style]} testID="grocify-wordmark-large">
      {/* Positioned sprout right above the 'O' in GROCIFY */}
      <View style={styles.sproutContainer}>
        <SproutLogo width={24} height={20} color={colors.brand.logo} />
      </View>
      <View style={styles.lettersRow}>
        <Text
          style={[
            styles.largeText,
            typography.wordmark,
            embossed && styles.embossedShadow,
            textStyle,
          ]}
        >
          GROCIFY
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  largeContainer: {
    alignItems: 'center',
    position: 'relative',
    paddingTop: 10,
  },
  sproutContainer: {
    position: 'absolute',
    top: -6,
    // Slightly to the left of center to align with the 'O' in GROCIFY (letters: G-R-O-C-I-F-Y)
    left: '37%',
  },
  lettersRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  largeText: {
    color: colors.brand.logo,
    textAlign: 'center',
  },
  embossedShadow: {
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0.5,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactWordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactText: {
    fontFamily: 'Figtree_700Bold',
    fontSize: 18,
    lineHeight: 22,
    color: colors.brand.logo,
    letterSpacing: 1.5,
  },
  compactSprout: {
    marginLeft: 3,
    marginBottom: 4,
  },
});
