// src/components/welcome/WelcomeFridge.tsx
// Layered code-drawn retro two-door blue fridge per UIUX.md Section 5 and reference images.

import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { GrocifyWordmark } from '@/components/common/SproutLogo';
import { WelcomeCta } from '@/components/WelcomeCta';
import { colors, elevation, radius, spacing, typography } from '@/theme/tokens';

export interface WelcomeFridgeProps {
  onOpenFridge: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function WelcomeFridge({
  onOpenFridge,
  style,
  testID,
}: WelcomeFridgeProps) {
  return (
    <View style={[styles.rootContainer, style]} testID={testID}>
      {/* Outer Fridge Container with shadow */}
      <View style={[styles.fridgeCasing, elevation.elevFridge]}>
        {/* ================= FREEZER DOOR (TOP ~22%) ================= */}
        <View style={styles.freezerDoor}>
          {/* Background vertical gradient */}
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <LinearGradient id="freezerGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.fridgeBlue.top} />
                <Stop offset="0.5" stopColor={colors.fridgeBlue.mid} />
                <Stop offset="1" stopColor={colors.fridgeBlue.bottom} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#freezerGrad)" />
          </Svg>

          {/* Vertical sheen band on the right third (white at 12%) */}
          <View style={styles.sheenBand} pointerEvents="none" />

          {/* Freezer Handle (vertical rounded bar, width 17, radius 9, left 24) */}
          <View style={styles.freezerHandle}>
            <View style={styles.handleHighlight} />
          </View>
        </View>

        {/* ================= DOOR SEAM ================= */}
        <View style={styles.seamContainer}>
          <View style={styles.seamDarkLine} />
          <View style={styles.seamHighlightLine} />
        </View>

        {/* ================= MAIN DOOR (BOTTOM ~78%) ================= */}
        <View style={styles.mainDoor}>
          {/* Background vertical gradient */}
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <LinearGradient id="mainDoorGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={colors.fridgeBlue.top} />
                <Stop offset="0.55" stopColor={colors.fridgeBlue.mid} />
                <Stop offset="1" stopColor={colors.fridgeBlue.bottom} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#mainDoorGrad)" />
          </Svg>

          {/* Vertical sheen band on right third */}
          <View style={styles.sheenBand} pointerEvents="none" />

          {/* Main Door Handle */}
          <View style={styles.mainHandle}>
            <View style={styles.handleHighlight} />
          </View>

          {/* Content Group (centered horizontally in main door, right of handle) */}
          <View style={styles.contentGroup}>
            {/* 1. GROCIFY Logo with two-leaf sprout above the 'O' */}
            <GrocifyWordmark size="large" embossed={true} />

            <View style={styles.spacer40} />

            {/* 2. "Welcome to" */}
            <Text style={[styles.welcomeToText, typography.headline]}>
              Welcome to
            </Text>

            {/* 3. "GROCIFY" */}
            <Text style={[styles.grocifyTitle, typography.display]}>
              GROCIFY
            </Text>

            <View style={styles.spacer28} />

            {/* 4. Tagline */}
            <Text style={[styles.tagline, typography.body]}>
              Your fridge, perfectly organized. Keep track of your groceries and never lose sight of expiry dates.
            </Text>

            <View style={styles.spacer36} />

            {/* 5. Open My Fridge CTA */}
            <WelcomeCta
              label="Open My Fridge"
              onPress={onOpenFridge}
              testID="welcome-open-fridge-button"
            />
          </View>
        </View>
      </View>

      {/* ================= RETRO FEET ================= */}
      <View style={styles.feetRow} pointerEvents="none">
        <View style={styles.foot} />
        <View style={styles.foot} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    width: '100%',
    alignItems: 'center',
  },
  fridgeCasing: {
    width: '100%',
    borderRadius: radius.lg, // 24
    overflow: 'hidden',
    backgroundColor: colors.fridgeBlue.mid,
  },
  freezerDoor: {
    height: 140,
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'center',
  },
  sheenBand: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    width: '32%',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  freezerHandle: {
    position: 'absolute',
    left: 24,
    top: '50%',
    transform: [{ translateY: -52 }],
    width: 17,
    height: 105,
    borderRadius: 9,
    backgroundColor: colors.fridgeBlue.handle,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  handleHighlight: {
    position: 'absolute',
    top: 3,
    left: 2,
    right: 2,
    height: '40%',
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  seamContainer: {
    height: 3,
    width: '100%',
  },
  seamDarkLine: {
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(60, 80, 100, 0.35)',
  },
  seamHighlightLine: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  mainDoor: {
    width: '100%',
    minHeight: 480,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    position: 'relative',
    paddingBottom: spacing.xxl,
  },
  mainHandle: {
    position: 'absolute',
    left: 24,
    top: 24,
    width: 17,
    height: 280,
    borderRadius: 9,
    backgroundColor: colors.fridgeBlue.handle,
    shadowColor: '#000000',
    shadowOffset: { width: 3, height: 2 },
    shadowOpacity: 0.22,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.45)',
  },
  contentGroup: {
    paddingLeft: 46, // give clearance to handle at left: 24 + 17
    paddingRight: 24,
    paddingTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer40: {
    height: 36,
  },
  spacer28: {
    height: 24,
  },
  spacer36: {
    height: 32,
  },
  welcomeToText: {
    color: colors.ink.slateSoft,
    textAlign: 'center',
    marginBottom: 4,
  },
  grocifyTitle: {
    color: colors.ink.slate,
    textAlign: 'center',
  },
  tagline: {
    color: colors.ink.slateSoft,
    textAlign: 'center',
    maxWidth: 250,
    lineHeight: 22,
  },
  feetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 30,
    marginTop: -2,
  },
  foot: {
    width: 34,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.fridgeBlue.foot,
  },
});
