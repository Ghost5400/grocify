// src/components/PrimaryButton.tsx
import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { ArrowRight, Check } from 'lucide-react-native';
import { usePressScale } from '@/hooks/usePressScale';
import { colors, elevation, radius, spacing, typography } from '@/theme/tokens';

export interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'arrow' | 'check' | 'none';
  style?: StyleProp<ViewStyle>;
  testID?: string;
  accessibilityLabel?: string;
}

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  variant = 'arrow',
  style,
  testID,
  accessibilityLabel,
}: PrimaryButtonProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale({
    targetScale: 0.98,
    inDuration: 90,
    outDuration: 120,
  });

  const renderIcon = () => {
    if (variant === 'arrow') {
      return <ArrowRight size={26} color={colors.white} strokeWidth={2.2} />;
    }
    if (variant === 'check') {
      return <Check size={26} color={colors.white} strokeWidth={2.5} />;
    }
    return null;
  };

  return (
    <Animated.View
      style={[
        styles.wrapper,
        !disabled && elevation.elev2,
        animatedStyle,
        style,
      ]}
    >
      <Pressable
        testID={testID}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || label}
        accessibilityState={{ disabled }}
        style={[
          styles.button,
          disabled && styles.buttonDisabled,
        ]}
      >
        {/* Gradient background when active */}
        {!disabled && (
          <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
            <Defs>
              <LinearGradient id="buttonGrad" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={colors.brand.forestTop} />
                <Stop offset="100%" stopColor={colors.brand.forestBottom} />
              </LinearGradient>
            </Defs>
            <Rect width="100%" height="100%" fill="url(#buttonGrad)" rx={radius.xl} />
          </Svg>
        )}

        {/* 1 pt top inner highlight */}
        {!disabled && <View style={styles.topHighlight} />}

        {/* Centered label */}
        <Text
          style={[
            styles.label,
            typography.button,
            disabled && styles.labelDisabled,
          ]}
        >
          {label}
        </Text>

        {/* Pinned trailing icon */}
        {variant !== 'none' && (
          <View style={[styles.iconContainer, disabled && styles.iconDisabled]}>
            {renderIcon()}
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.xl, // 28
    width: '100%',
  },
  button: {
    height: 64,
    borderRadius: radius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    paddingHorizontal: spacing.xxl,
  },
  buttonDisabled: {
    backgroundColor: '#9DB5A3',
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.28)',
    borderRadius: radius.full,
  },
  label: {
    color: colors.white,
    textAlign: 'center',
  },
  labelDisabled: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  iconContainer: {
    position: 'absolute',
    right: spacing.xxl, // 24 padding
  },
  iconDisabled: {
    opacity: 0.65,
  },
});
