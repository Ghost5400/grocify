// src/hooks/usePressScale.ts
import { useCallback } from 'react';
import {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { motion } from '@/theme/tokens';
import { useReducedMotion } from './useReducedMotion';

interface UsePressScaleOptions {
  targetScale?: number;
  inDuration?: number;
  outDuration?: number;
}

export function usePressScale({
  targetScale = 0.98,
  inDuration = motion.fast, // 90ms
  outDuration = 120,
}: UsePressScaleOptions = {}) {
  const isReducedMotion = useReducedMotion();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const onPressIn = useCallback(() => {
    if (isReducedMotion) {
      opacity.value = withTiming(0.85, {
        duration: motion.base,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    } else {
      scale.value = withTiming(targetScale, {
        duration: inDuration,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    }
  }, [inDuration, isReducedMotion, opacity, scale, targetScale]);

  const onPressOut = useCallback(() => {
    if (isReducedMotion) {
      opacity.value = withTiming(1, {
        duration: motion.base,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    } else {
      scale.value = withTiming(1, {
        duration: outDuration,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
      });
    }
  }, [isReducedMotion, opacity, outDuration, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    if (isReducedMotion) {
      return {
        opacity: opacity.value,
      };
    }
    return {
      transform: [{ scale: scale.value }],
    };
  });

  return {
    animatedStyle,
    onPressIn,
    onPressOut,
  };
}
