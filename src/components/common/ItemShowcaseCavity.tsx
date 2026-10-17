// src/components/common/ItemShowcaseCavity.tsx
// Recessed fridge interior cavity showcase per UIUX.md Section 7 and reference screen.

import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Line, Rect, Stop } from 'react-native-svg';
import { LightStrip } from '@/components/LightStrip';
import { ItemImage } from '@/components/ItemImage';
import { CompartmentId } from '@/domain/types';
import { compartmentTheme, radius } from '@/theme/tokens';

export interface ItemShowcaseCavityProps {
  compartment: CompartmentId;
  itemName: string;
  catalogId?: string;
  height?: number; // default 258 pt (Details), ~190 pt (Review)
  imageSize?: number; // default 180 pt (Details), ~130 pt (Review)
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ItemShowcaseCavity({
  compartment,
  itemName,
  catalogId,
  height = 258,
  imageSize = 180,
  style,
  testID = 'item-showcase-cavity',
}: ItemShowcaseCavityProps) {
  const theme = compartmentTheme[compartment];

  return (
    <View
      testID={testID}
      style={[
        styles.cavity,
        {
          height,
          backgroundColor: theme.surface,
        },
        style,
      ]}
    >
      {/* Background Vertical Lighting Gradient */}
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <LinearGradient
            id={`cavityGrad-${compartment}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
            <Stop offset="30%" stopColor={theme.surface} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={theme.surfaceDeep} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        <Rect
          width="100%"
          height="100%"
          fill={`url(#cavityGrad-${compartment})`}
          rx={20}
        />

        {/* Back-wall guide lines simulating fridge shelving */}
        <Line
          x1="18%"
          y1="15%"
          x2="18%"
          y2="88%"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.5"
        />
        <Line
          x1="82%"
          y1="15%"
          x2="82%"
          y2="88%"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.5"
        />
        <Line
          x1="8%"
          y1="52%"
          x2="92%"
          y2="52%"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeWidth="1"
          strokeDasharray="4, 4"
        />
      </Svg>

      {/* 1 pt inner white border at 50% */}
      <View style={styles.innerBorder} pointerEvents="none" />

      {/* Top Light Strip with glow (16 pt from top, 64% width) */}
      <View style={styles.lightStripWrapper} pointerEvents="none">
        <LightStrip widthPercent={64} />
      </View>


      {/* Food Item Image sitting on shelf */}
      <View style={styles.itemContainer} pointerEvents="none">
        <ItemImage
          name={itemName}
          compartment={compartment}
          catalogId={catalogId}
          size={imageSize}
        />
        {/* Soft elliptical contact shadow beneath item */}
        <View
          style={[
            styles.contactShadow,
            {
              width: Math.min(imageSize * 0.78, 160),
            },
          ]}
        />
      </View>

      {/* Glass Shelf along bottom edge (2 pt white line + 14 pt glass band) */}
      <View style={styles.glassShelf} pointerEvents="none">
        <View style={styles.shelfTopHighlight} />
        <View style={styles.glassBand} />
        <View style={styles.shelfShadow} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cavity: {
    width: '100%',
    borderRadius: radius.lg - 4, // 20
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'space-between',
  },
  innerBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.lg - 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  lightStripWrapper: {
    paddingTop: 14,
    alignItems: 'center',
    width: '100%',
    zIndex: 2,
  },
  itemContainer: {
    position: 'absolute',
    top: 0,
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 3,
  },
  contactShadow: {
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
    marginTop: -8,
  },
  glassShelf: {
    width: '100%',
    height: 18,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 4,
  },
  shelfTopHighlight: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
  },
  glassBand: {
    width: '100%',
    height: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.5)',
  },
  shelfShadow: {
    width: '100%',
    height: 2,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
});
