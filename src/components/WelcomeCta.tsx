// src/components/WelcomeCta.tsx
import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { ArrowRight } from 'lucide-react-native';
import { usePressScale } from '@/hooks/usePressScale';
import { colors, elevation, radius, spacing, typography } from '@/theme/tokens';

export interface WelcomeCtaProps {
  label?: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function WelcomeCta({
  label = 'Open My Fridge',
  onPress,
  style,
  testID,
}: WelcomeCtaProps) {
  const { animatedStyle, onPressIn, onPressOut } = usePressScale({
    targetScale: 0.97,
    inDuration: 90,
    outDuration: 120,
  });

  return (
    <Animated.View style={[styles.wrapper, elevation.elev1, animatedStyle, style]}>
      <Pressable
        testID={testID}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        accessibilityRole="button"
        accessibilityLabel={label}
        style={styles.button}
      >
        <Text style={[styles.label, typography.button]}>{label}</Text>
        <ArrowRight size={20} color={colors.white} strokeWidth={2.2} />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 200,
    height: 48,
    borderRadius: radius.full,
    alignSelf: 'center',
  },
  button: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.brand.sage,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm, // 8
  },
  label: {
    color: colors.white,
    fontSize: 17,
    lineHeight: 22,
  },
});
