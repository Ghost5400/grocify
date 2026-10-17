// src/components/QuantityStepper.tsx
import React, { useEffect, useRef } from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Minus, Plus } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  style,
  testID,
}: QuantityStepperProps) {
  const isMin = value <= min;
  const isMax = value >= max;

  const prevValue = useRef(value);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (prevValue.current !== value) {
      const isIncrease = value > prevValue.current;
      prevValue.current = value;

      // 4 pt vertical slide with cross-fade over 120ms
      translateY.value = isIncrease ? 4 : -4;
      opacity.value = 0.3;

      translateY.value = withTiming(0, { duration: 120 });
      opacity.value = withTiming(1, { duration: 120 });
    }
  }, [value, translateY, opacity]);

  const animatedValueStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      } catch {
        // Safe fallback in test or unsupported environments
      }
    }
  };

  const handleDecrement = () => {
    if (!isMin) {
      triggerHaptic();
      onChange(Math.max(min, value - 1));
    }
  };

  const handleIncrement = () => {
    if (!isMax) {
      triggerHaptic();
      onChange(Math.min(max, value + 1));
    }
  };

  return (
    <View testID={testID} style={[styles.container, style]}>
      {/* Minus Button */}
      <Pressable
        testID="stepper-decrement"
        onPress={handleDecrement}
        disabled={isMin}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        accessibilityState={{ disabled: isMin }}
        style={({ pressed }) => [
          styles.stepperButton,
          isMin && styles.stepperButtonDisabled,
          pressed && !isMin && styles.stepperButtonPressed,
        ]}
      >
        <Minus
          size={22}
          color={colors.ink.title}
          strokeWidth={2.5}
          style={{ opacity: isMin ? 0.35 : 1 }}
        />
      </Pressable>

      {/* Value */}
      <View style={styles.valueContainer}>
        <Animated.View style={animatedValueStyle}>
          <Text
            testID="stepper-value"
            style={[styles.valueText, typography.stepperValue]}
            accessibilityRole="text"
          >
            {value}
          </Text>
        </Animated.View>
      </View>

      {/* Plus Button */}
      <Pressable
        testID="stepper-increment"
        onPress={handleIncrement}
        disabled={isMax}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        accessibilityState={{ disabled: isMax }}
        style={({ pressed }) => [
          styles.stepperButton,
          isMax && styles.stepperButtonDisabled,
          pressed && !isMax && styles.stepperButtonPressed,
        ]}
      >
        <Plus
          size={22}
          color={colors.ink.title}
          strokeWidth={2.5}
          style={{ opacity: isMax ? 0.35 : 1 }}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 60,
    borderRadius: radius.full,
    backgroundColor: colors.field.bg,
    borderWidth: 1.5,
    borderColor: colors.field.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm, // 8 inset
  },
  stepperButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.stepperButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonDisabled: {
    opacity: 0.6,
  },
  stepperButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.94 }],
  },
  valueContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  valueText: {
    color: colors.ink.title,
    textAlign: 'center',
  },
});
