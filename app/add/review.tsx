// app/add/review.tsx
// Confirmation / Review screen (Phase 1 Placeholder).

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useDraftStore } from '@/store/draftStore';
import { useFridgeStore } from '@/store/fridgeStore';
import { colors, compartmentTheme, radius, spacing, typography } from '@/theme/tokens';
import { getTodayIso } from '@/utils/date';

export default function ReviewScreen() {
  const router = useRouter();
  const catalogEntry = useDraftStore((state) => state.catalogEntry);
  const compartment = useDraftStore((state) => state.compartment) || 'veggies';
  const quantity = useDraftStore((state) => state.quantity);
  const expiryDate = useDraftStore((state) => state.expiryDate) || getTodayIso();
  const reminderDays = useDraftStore((state) => state.reminderDays);
  const resetDraft = useDraftStore((state) => state.resetDraft);

  const addItem = useFridgeStore((state) => state.addItem);
  const theme = compartmentTheme[compartment];

  const handleSave = async () => {
    await addItem({
      catalogId: catalogEntry?.id || null,
      name: catalogEntry?.name || 'Item',
      compartment,
      imageKey: catalogEntry?.imageKey || 'tomato',
      quantity,
      expiryDate,
      reminderDays,
    });

    resetDraft();
    router.replace('/fridge');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.header, { backgroundColor: theme.tint }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.ink }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, typography.titleMd, { color: theme.ink }]}>Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={[styles.itemName, typography.titleLg]}>
            {catalogEntry?.name || 'Grocery Item'}
          </Text>
          <Text style={[styles.row, typography.body]}>Quantity: {quantity}</Text>
          <Text style={[styles.row, typography.body]}>
            Compartment: {compartment.charAt(0).toUpperCase() + compartment.slice(1)}
          </Text>
          <Text style={[styles.row, typography.body]}>Expiry Date: {expiryDate}</Text>
          <Text style={[styles.row, typography.body]}>Reminder Lead: {reminderDays} days</Text>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
          accessibilityRole="button"
          accessibilityLabel="Add to fridge"
        >
          <Text style={[styles.saveButtonText, typography.button]}>✓ Add to Fridge</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.editButton} onPress={() => router.back()}>
          <Text style={[styles.editButtonText, typography.body]}>Edit</Text>
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
  content: {
    flex: 1,
    padding: spacing.xl,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.field.bg,
    borderColor: colors.field.border,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  itemName: {
    color: colors.ink.title,
    marginBottom: spacing.md,
  },
  row: {
    color: colors.ink.label,
    marginBottom: spacing.xs,
  },
  saveButton: {
    backgroundColor: colors.brand.forest,
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  saveButtonText: {
    color: colors.white,
  },
  editButton: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  editButtonText: {
    color: colors.ink.slateSoft,
  },
});
