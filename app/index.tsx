// app/index.tsx
// Full Welcome screen per UIUX.md Section 5 and reference images.

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WelcomeFridge } from '@/components/welcome/WelcomeFridge';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useFridgeStore } from '@/store/fridgeStore';
import { colors, motion, spacing } from '@/theme/tokens';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const markWelcomeSeen = useFridgeStore((state) => state.markWelcomeSeen);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const fridgeScale = useSharedValue(1.0);
  const fridgeOpacity = useSharedValue(1.0);

  const handleNavigate = () => {
    router.replace('/fridge');
  };

  const handleOpenFridge = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    markWelcomeSeen();

    if (reduceMotion) {
      fridgeOpacity.value = withTiming(
        0,
        {
          duration: 200,
          easing: Easing.linear,
        },
        (finished) => {
          if (finished) {
            runOnJS(handleNavigate)();
          }
        }
      );
    } else {
      const [x1, y1, x2, y2] = motion.easing.standard;
      const standardEasing = Easing.bezier(x1, y1, x2, y2);

      fridgeScale.value = withTiming(1.04, {
        duration: motion.fade, // 450 ms
        easing: standardEasing,
      });

      fridgeOpacity.value = withTiming(
        0,
        {
          duration: motion.fade, // 450 ms
          easing: standardEasing,
        },
        (finished) => {
          if (finished) {
            runOnJS(handleNavigate)();
          }
        }
      );
    }
  };

  const animatedFridgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fridgeScale.value }],
    opacity: fridgeOpacity.value,
  }));

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingTop: Math.max(insets.top + spacing.sm, spacing.xl),
            paddingBottom: Math.max(insets.bottom + spacing.lg, spacing.xxl),
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View style={[styles.fridgeWrapper, animatedFridgeStyle]}>
          <WelcomeFridge onOpenFridge={handleOpenFridge} testID="welcome-fridge" />
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  fridgeWrapper: {
    width: '100%',
    maxWidth: 393,
    alignItems: 'center',
  },
});
