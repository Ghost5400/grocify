// app/compartment/[id].tsx
// Compartment Inventory screen (Phase 1 Placeholder).

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COMPARTMENTS } from '@/data/compartments';
import { CompartmentId } from '@/domain/types';
import { selectItemsByCompartment, useFridgeStore } from '@/store/fridgeStore';
import { colors, compartmentTheme, radius, spacing, typography } from '@/theme/tokens';

export default function CompartmentScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: CompartmentId }>();

  const validId: CompartmentId =
    id === 'freezer' || id === 'packed' || id === 'veggies' ? id : 'veggies';

  const compartmentInfo = COMPARTMENTS[validId] || COMPARTMENTS.veggies;
  const theme = compartmentTheme[validId];
  const items = useFridgeStore((state) => selectItemsByCompartment(state.items, validId));

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.header, { backgroundColor: theme.tint }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back to fridge"
        >
          <Text style={[styles.backText, { color: theme.ink }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, typography.titleMd, { color: theme.ink }]}>
          {compartmentInfo.name}
        </Text>
        <TouchableOpacity
          onPress={() => router.push(`/add/pick?compartment=${validId}` as any)}
          style={[styles.addCircle, { backgroundColor: theme.accent }]}
          accessibilityRole="button"
          accessibilityLabel={`Add item to ${compartmentInfo.name}`}
        >
          <Text style={styles.addCircleText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={[styles.subtitle, typography.headline, { color: theme.ink }]}>
          {items.length} {items.length === 1 ? 'item' : 'items'} in {compartmentInfo.name}
        </Text>
        <Text style={[styles.body, typography.body, { color: theme.ink }]}>
          Phase 1 Inventory Placeholder. Items listed will appear here in Phase 5.
        </Text>

        <TouchableOpacity
          style={[styles.cta, { backgroundColor: colors.brand.forest }]}
          onPress={() => router.push(`/add/pick?compartment=${validId}` as any)}
        >
          <Text style={[styles.ctaText, typography.button]}>Add Item to {compartmentInfo.name}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.huge,
    paddingBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
  },
  backText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
  },
  addCircle: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCircleText: {
    color: colors.white,
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: -2,
  },
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  body: {
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
  cta: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.xl,
  },
  ctaText: {
    color: colors.white,
  },
});
