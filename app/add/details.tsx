// app/add/details.tsx
// Add Details screen (Phase 1 Placeholder).

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useDraftStore } from '@/store/draftStore';
import { colors, compartmentTheme, radius, spacing, typography } from '@/theme/tokens';
import { getTodayIso } from '@/utils/date';

export default function DetailsScreen() {
  const router = useRouter();
  const catalogEntry = useDraftStore((state) => state.catalogEntry);
  const compartment = useDraftStore((state) => state.compartment) || 'veggies';
  const quantity = useDraftStore((state) => state.quantity);
  const expiryDate = useDraftStore((state) => state.expiryDate);
  const setQuantity = useDraftStore((state) => state.setQuantity);
  const setExpiryDate = useDraftStore((state) => state.setExpiryDate);

  const theme = compartmentTheme[compartment];

  // Set default mock date for placeholder navigation test if not set
  React.useEffect(() => {
    if (!expiryDate) {
      setExpiryDate(getTodayIso());
    }
  }, [expiryDate, setExpiryDate]);

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.header, { backgroundColor: theme.tint }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.ink }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, typography.titleMd, { color: theme.ink }]}>
          Add to {compartment.charAt(0).toUpperCase() + compartment.slice(1)}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={[styles.itemName, typography.titleLg, { color: theme.ink }]}>
          {catalogEntry?.name || 'Item'}
        </Text>

        <View style={styles.card}>
          <Text style={[styles.label, typography.label]}>Quantity: {quantity}</Text>
          <View style={styles.stepperRow}>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Text style={styles.stepBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={[styles.stepVal, typography.stepperValue]}>{quantity}</Text>
            <TouchableOpacity
              style={styles.stepBtn}
              onPress={() => setQuantity(Math.min(99, quantity + 1))}
            >
              <Text style={styles.stepBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, typography.label, { marginTop: spacing.lg }]}>
            Expiry Date: {expiryDate || 'Select Date'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={() => router.push('/add/review' as any)}
          accessibilityRole="button"
          accessibilityLabel="Continue to Review"
        >
          <Text style={[styles.continueText, typography.button]}>Continue →</Text>
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
  itemName: {
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.field.bg,
    borderColor: colors.field.border,
    borderWidth: 1.5,
    borderRadius: radius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
  },
  label: {
    color: colors.ink.label,
    marginBottom: spacing.sm,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  stepBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.stepperButton,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnText: {
    fontSize: 24,
    color: colors.ink.title,
    fontWeight: 'bold',
  },
  stepVal: {
    marginHorizontal: spacing.xl,
    color: colors.ink.title,
  },
  continueButton: {
    backgroundColor: colors.brand.forest,
    paddingVertical: spacing.lg,
    borderRadius: radius.xl,
    alignItems: 'center',
  },
  continueText: {
    color: colors.white,
  },
});
