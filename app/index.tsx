// app/index.tsx
// Welcome screen (Phase 1 Placeholder).

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useFridgeStore } from '@/store/fridgeStore';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export default function WelcomeScreen() {
  const router = useRouter();
  const markWelcomeSeen = useFridgeStore((state) => state.markWelcomeSeen);

  const handleOpenFridge = () => {
    markWelcomeSeen();
    router.replace('/fridge');
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.wordmark, typography.wordmark]}>GROCIFY</Text>
      <Text style={[styles.subtitle, typography.headline]}>Welcome to GROCIFY</Text>
      <Text style={[styles.caption, typography.body]}>
        Your fridge, perfectly organized. (Phase 1 Placeholder)
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={handleOpenFridge}
        accessibilityRole="button"
        accessibilityLabel="Open My Fridge"
      >
        <Text style={[styles.buttonText, typography.button]}>Open My Fridge →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
  },
  wordmark: {
    color: colors.brand.logo,
    marginBottom: spacing.sm,
  },
  subtitle: {
    color: colors.ink.slate,
    marginBottom: spacing.md,
  },
  caption: {
    color: colors.ink.slateSoft,
    textAlign: 'center',
    marginBottom: spacing.xxxl,
  },
  button: {
    backgroundColor: colors.brand.sage,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: radius.full,
  },
  buttonText: {
    color: colors.white,
  },
});
