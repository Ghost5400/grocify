// src/components/fridge/CompartmentPanel.tsx
// Stacked fridge compartment panel per UIUX.md Section 6.

import React, { useEffect } from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import * as Haptics from 'expo-haptics';
import { LightStrip } from '@/components/LightStrip';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ShelfPreview } from '@/components/fridge/ShelfPreview';
import { CompartmentId, Item } from '@/domain/types';
import { usePressScale } from '@/hooks/usePressScale';
import { compartmentTheme } from '@/theme/tokens';

export interface CompartmentPanelProps {
  compartment: CompartmentId;
  name: string;
  items: Item[];
  onPress: () => void;
  isFirst?: boolean;
  isHighlighted?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function CompartmentPanel({
  compartment,
  name,
  items,
  onPress,
  isFirst = false,
  isHighlighted = false,
  style,
  testID,
}: CompartmentPanelProps) {
  const theme = compartmentTheme[compartment];

  const { animatedStyle, onPressIn, onPressOut } = usePressScale({
    targetScale: 0.985,
    inDuration: 90,
    outDuration: 120,
  });

  // Soft glow pulse (accent 0 -> 40% -> 0 over 600 ms) per UIUX Section 8
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    if (isHighlighted) {
      glowOpacity.value = withSequence(
        withTiming(0.4, { duration: 300 }),
        withTiming(0, { duration: 300 })
      );
    }
  }, [isHighlighted, glowOpacity]);

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync().catch(() => {});
    }
    onPress();
  };

  const topCornerRadius = isFirst ? 24 : 20;

  return (
    <Animated.View style={[styles.wrapper, animatedStyle, style]}>

      <Pressable
        testID={testID ?? `compartment-panel-${compartment}`}
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={`Open ${name}, ${items.length} ${items.length === 1 ? 'item' : 'items'}`}
        style={[
          styles.panel,
          {
            borderTopLeftRadius: topCornerRadius,
            borderTopRightRadius: topCornerRadius,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
          },
        ]}
      >
        {/* Background Vertical Gradient */}
        <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
          <Defs>
            <LinearGradient
              id={`panelGrad-${compartment}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <Stop offset="0" stopColor={theme.surface} />
              <Stop offset="1" stopColor={theme.surfaceDeep} />
            </LinearGradient>
          </Defs>
          <Rect
            width="100%"
            height="100%"
            fill={`url(#panelGrad-${compartment})`}
          />
        </Svg>

        {/* 1 pt inner white border at 50% */}
        <View
          style={[
            styles.innerBorder,
            {
              borderTopLeftRadius: topCornerRadius,
              borderTopRightRadius: topCornerRadius,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            },
          ]}
          pointerEvents="none"
        />

        {/* Top Light Strip (8 pt from top) */}
        <View style={styles.lightStripContainer} pointerEvents="none">
          <LightStrip widthPercent={70} />
        </View>

        {/* Header Pill (14 pt below light strip, inset 12 from sides) */}
        <View style={styles.headerPillWrapper} pointerEvents="none">
          <ScreenHeader
            compartment={compartment}
            title={name}
            height={56}
            circleSize={44}
            showChevronRight={true}
          />
        </View>

        {/* Shelf Preview area with items */}
        <View style={styles.shelfArea} pointerEvents="none">
          <ShelfPreview compartment={compartment} items={items} />
        </View>

        {/* Soft Accent Glow Pulse Overlay on Item Added */}
        <Animated.View
          style={[
            styles.glowOverlay,
            {
              backgroundColor: theme.accent,
              borderTopLeftRadius: topCornerRadius,
              borderTopRightRadius: topCornerRadius,
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
            },
            glowAnimatedStyle,
          ]}
          pointerEvents="none"
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    minHeight: 180,
    width: '100%',
  },
  glowOverlay: {
    ...StyleSheet.absoluteFill,
    zIndex: 15,
  },

  panel: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
    paddingBottom: 4,
  },
  innerBorder: {
    ...StyleSheet.absoluteFill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  lightStripContainer: {
    paddingTop: 8,
    alignItems: 'center',
    width: '100%',
  },
  headerPillWrapper: {
    paddingHorizontal: 12,
    marginTop: 10,
  },
  shelfArea: {
    width: '100%',
    justifyContent: 'flex-end',
    marginTop: 'auto',
  },
});
