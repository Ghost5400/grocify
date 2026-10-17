// app/fridge.tsx
// Fridge Home screen (Phase 1 Placeholder).

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { COMPARTMENT_LIST } from '@/data/compartments';
import { selectTotalCount, useFridgeStore } from '@/store/fridgeStore';
import { colors, compartmentTheme, radius, spacing, typography } from '@/theme/tokens';

export default function FridgeScreen() {
  const router = useRouter();
  const items = useFridgeStore((state) => state.items);
  const totalCount = selectTotalCount(items);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, typography.titleLg]}>GROCIFY Fridge</Text>
        <View style={styles.badge}>
          <Text style={[styles.badgeText, typography.label]}>
            {totalCount} {totalCount === 1 ? 'item' : 'items'}
          </Text>
        </View>
      </View>

      <Text style={[styles.helper, typography.body]}>
        Tap a compartment or press Add to test routing:
      </Text>

      {COMPARTMENT_LIST.map((comp) => {
        const theme = compartmentTheme[comp.id];
        return (
          <TouchableOpacity
            key={comp.id}
            style={[styles.compartmentCard, { backgroundColor: theme.surface, borderColor: theme.tint }]}
            onPress={() => router.push(`/compartment/${comp.id}` as any)}
            accessibilityRole="button"
            accessibilityLabel={`Open ${comp.name}`}
          >
            <View style={[styles.iconCircle, { backgroundColor: theme.accent }]}>
              <Text style={styles.iconText}>{comp.icon === 'snowflake' ? '❄' : comp.icon === 'package' ? '📦' : '🥬'}</Text>
            </View>
            <Text style={[styles.compartmentName, typography.titleMd, { color: theme.ink }]}>
              {comp.name}
            </Text>
            <Text style={[styles.chevron, { color: theme.ink }]}>›</Text>
          </TouchableOpacity>
        );
      })}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/add/pick' as any)}
        accessibilityRole="button"
        accessibilityLabel="Add item"
      >
        <Text style={[styles.addButtonText, typography.button]}>+ Add Grocery Item</Text>
      </TouchableOpacity>

      {__DEV__ && (
        <TouchableOpacity
          style={styles.devButton}
          onPress={() => router.push('/_dev/gallery' as any)}
        >
          <Text style={[styles.devButtonText, typography.caption]}>[DEV] Component Gallery</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xl,
    paddingTop: spacing.huge,
    backgroundColor: colors.canvas,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  title: {
    color: colors.brand.logo,
  },
  badge: {
    backgroundColor: colors.field.bg,
    borderColor: colors.field.border,
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  badgeText: {
    color: colors.ink.title,
  },
  helper: {
    color: colors.ink.slateSoft,
    marginBottom: spacing.xl,
  },
  compartmentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    fontSize: 20,
    color: colors.white,
  },
  compartmentName: {
    flex: 1,
  },
  chevron: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: colors.brand.forest,
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  addButtonText: {
    color: colors.white,
  },
  devButton: {
    marginTop: spacing.xl,
    alignItems: 'center',
    padding: spacing.sm,
  },
  devButtonText: {
    color: colors.ink.helper,
  },
});
