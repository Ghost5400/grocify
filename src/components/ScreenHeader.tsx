// src/components/ScreenHeader.tsx
import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { CompartmentId } from '@/domain/types';
import { usePressScale } from '@/hooks/usePressScale';
import { compartmentTheme, elevation, radius, spacing, typography } from '@/theme/tokens';
import { CompartmentIconCircle } from './CompartmentIconCircle';

export interface ScreenHeaderProps {
  compartment: CompartmentId;
  title: string;
  height?: number; // 56 or 72
  circleSize?: 44 | 52;
  showBack?: boolean;
  onBack?: () => void;
  showChevronRight?: boolean;
  rightSlot?: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ScreenHeader({
  compartment,
  title,
  height = 56,
  circleSize,
  showBack = false,
  onBack,
  showChevronRight = false,
  rightSlot,
  onPress,
  style,
  testID,
}: ScreenHeaderProps) {
  const theme = compartmentTheme[compartment];
  const resolvedCircleSize = circleSize ?? (height >= 70 ? 52 : 44);

  const { animatedStyle, onPressIn, onPressOut } = usePressScale({
    targetScale: 0.985,
    inDuration: 90,
    outDuration: 120,
  });

  const content = (
    <View
      testID={testID}
      style={[
        styles.container,
        {
          height,
          backgroundColor: theme.tint,
        },
        style,
      ]}
    >
      {/* 1 pt inner white border */}
      <View style={styles.innerHighlight} />

      <View style={styles.leftGroup}>
        {showBack && (
          <TouchableOpacity
            testID="screen-header-back"
            onPress={onBack}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={theme.ink} strokeWidth={2.2} />
          </TouchableOpacity>
        )}

        <CompartmentIconCircle
          compartment={compartment}
          size={resolvedCircleSize}
        />

        <Text
          style={[styles.title, typography.titleMd, { color: theme.ink }]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      {/* Right side slot or chevron */}
      {rightSlot ? (
        <View style={styles.rightSlot}>{rightSlot}</View>
      ) : showChevronRight ? (
        <View style={styles.chevronRight}>
          <ChevronRight size={24} color={theme.ink} strokeWidth={2} />
        </View>
      ) : null}
    </View>
  );

  if (onPress) {
    return (
      <Animated.View style={[styles.wrapper, elevation.elev1, animatedStyle]}>
        <Pressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          accessibilityRole="button"
          accessibilityLabel={`${title} compartment`}
        >
          {content}
        </Pressable>
      </Animated.View>
    );
  }

  return (
    <View style={[styles.wrapper, elevation.elev1]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg, // 24
    width: '100%',
  },
  container: {
    width: '100%',
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: spacing.lg, // 16
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
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md, // 12
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -4,
  },
  title: {
    flex: 1,
  },
  rightSlot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevronRight: {
    paddingLeft: spacing.sm,
  },
});
