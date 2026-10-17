// app/add/review.tsx
// Confirmation / Review screen per UIUX.md Section 9.2.

import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { CalendarDays } from 'lucide-react-native';
import { CompartmentIconCircle } from '@/components/CompartmentIconCircle';
import { FridgeFrame } from '@/components/FridgeFrame';
import { ItemShowcaseCavity } from '@/components/common/ItemShowcaseCavity';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { TextButton } from '@/components/TextButton';
import { COMPARTMENTS } from '@/data/compartments';
import { ReminderChipGroup } from '@/features/add-item/ReminderChipGroup';
import { useDraftStore } from '@/store/draftStore';
import { useFridgeStore } from '@/store/fridgeStore';
import {
  colors,
  compartmentTheme,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';
import { formatDateLong, getTodayIso } from '@/utils/date';

export default function ReviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const catalogEntry = useDraftStore((state) => state.catalogEntry);
  const compartment = useDraftStore((state) => state.compartment) || 'veggies';
  const quantity = useDraftStore((state) => state.quantity);
  const expiryDate = useDraftStore((state) => state.expiryDate) || getTodayIso();
  const reminderDays = useDraftStore((state) => state.reminderDays);

  const setReminderDays = useDraftStore((state) => state.setReminderDays);
  const resetDraft = useDraftStore((state) => state.resetDraft);
  const addItem = useFridgeStore((state) => state.addItem);

  const theme = compartmentTheme[compartment];
  const compartmentName = COMPARTMENTS[compartment].name;
  const itemName = catalogEntry?.name || 'Grocery Item';

  const handleBack = () => {
    router.back();
  };

  const handleSave = async () => {
    // 1. Persist to fridge store
    await addItem({
      catalogId: catalogEntry?.id || null,
      name: itemName,
      compartment,
      imageKey: catalogEntry?.imageKey || 'tomato',
      quantity,
      expiryDate,
      reminderDays,
    });

    // 2. Success haptic
    if (Platform.OS !== 'web') {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } catch {
        // Fallback
      }
    }

    // 3. Clear add-item draft
    resetDraft();

    // 4. Return to fridge with justAdded parameter to trigger highlight glow pulse
    router.replace({
      pathname: '/fridge',
      params: { justAdded: compartment },
    });
  };

  return (
    <View style={styles.screen}>
      <View
        style={[
          styles.container,
          {
            paddingTop: Math.max(insets.top, spacing.xs),
            paddingBottom: Math.max(insets.bottom, spacing.md),
          },
        ]}
      >
        <FridgeFrame
          rimWidth={10}
          insetHorizontal={10}
          style={styles.frame}
          innerStyle={[styles.innerFrame, { backgroundColor: theme.surface }]}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* 1. Header Pill ("Review") */}
            <ScreenHeader
              compartment={compartment}
              title="Review"
              height={56}
              circleSize={44}
              showBack={true}
              onBack={handleBack}
              style={styles.headerPill}
            />

            {/* 2. Shortened Showcase Cavity (~190 pt) */}
            <View style={styles.cavityWrapper}>
              <ItemShowcaseCavity
                compartment={compartment}
                itemName={itemName}
                catalogId={catalogEntry?.id}
                height={190}
                imageSize={130}
              />
            </View>

            {/* 3. Summary Card */}
            <View style={[styles.summaryCard, { backgroundColor: theme.tint }]}>
              {/* 1 pt inner white border */}
              <View style={styles.cardInnerBorder} pointerEvents="none" />

              {/* Title & Quantity Chip */}
              <View style={styles.itemTitleRow}>
                <Text
                  testID="review-item-name"
                  style={[styles.itemName, typography.titleLg, { color: theme.ink }]}
                  numberOfLines={1}
                >
                  {itemName}
                </Text>
                <View style={styles.quantityChip}>
                  <Text
                    testID="review-quantity-chip"
                    style={[styles.quantityChipText, typography.label]}
                  >
                    × {quantity}
                  </Text>
                </View>
              </View>

              {/* Compartment Row */}
              <View style={styles.metaRow}>
                <CompartmentIconCircle compartment={compartment} size={28} />
                <Text style={[styles.metaText, typography.bodyLg, { color: theme.ink }]}>
                  {compartmentName}
                </Text>
              </View>

              {/* Expiry Date Row */}
              <View style={styles.metaRow}>
                <CalendarDays size={22} color={theme.ink} strokeWidth={2} />
                <Text
                  testID="review-expiry-text"
                  style={[styles.metaText, typography.bodyLg, { color: theme.ink }]}
                >
                  {formatDateLong(expiryDate)}
                </Text>
              </View>

              {/* Status Badge */}
              <View style={styles.badgeRow}>
                <StatusBadge expiryDate={expiryDate} reminderDays={reminderDays} />
              </View>

              {/* Reminder Chip Group */}
              <View style={styles.reminderRow}>
                <ReminderChipGroup
                  selectedDays={reminderDays}
                  onSelect={setReminderDays}
                />
              </View>
            </View>

            {/* 4. Action Buttons */}
            <View style={styles.actionsContainer}>
              <PrimaryButton
                testID="review-save-btn"
                label="Add to fridge"
                variant="check"
                onPress={handleSave}
              />
              <TextButton
                testID="review-edit-btn"
                label="Edit"
                onPress={handleBack}
                style={styles.editButton}
              />
            </View>
          </ScrollView>
        </FridgeFrame>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  container: {
    flex: 1,
  },
  frame: {
    flex: 1,
  },
  innerFrame: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  headerPill: {
    marginBottom: 10,
  },
  cavityWrapper: {
    width: '100%',
    marginBottom: 10,
  },
  summaryCard: {
    width: '100%',
    borderRadius: radius.lg, // 24
    padding: spacing.lg, // 16
    position: 'relative',
    overflow: 'hidden',
    gap: 12,
    marginBottom: 16,
  },
  cardInnerBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  itemTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemName: {
    flex: 1,
  },
  quantityChip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: radius.full,
    backgroundColor: colors.field.bg,
    borderWidth: 1,
    borderColor: colors.field.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityChipText: {
    color: colors.ink.title,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  metaText: {
    fontWeight: '500',
  },
  badgeRow: {
    marginVertical: 2,
  },
  reminderRow: {
    marginTop: 4,
  },
  actionsContainer: {
    width: '100%',
    marginTop: 'auto',
    alignItems: 'center',
    gap: spacing.sm,
  },
  editButton: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
  },
});
