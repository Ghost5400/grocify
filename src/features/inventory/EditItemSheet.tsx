// src/features/inventory/EditItemSheet.tsx
// Bottom sheet modal for editing an existing item's quantity, expiry date, and reminder lead time

import React, { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Trash2, X } from 'lucide-react-native';
import { isBefore, parseISO, startOfDay } from 'date-fns';
import { DateField } from '@/components/DateField';
import { ItemImage } from '@/components/ItemImage';
import { PrimaryButton } from '@/components/PrimaryButton';
import { QuantityStepper } from '@/components/QuantityStepper';
import { Item } from '@/domain/types';
import { ReminderChipGroup } from '@/features/add-item/ReminderChipGroup';
import {
  colors,
  compartmentTheme,
  elevation,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';

export interface EditItemSheetProps {
  visible: boolean;
  item: Item | null;
  onSave: (patch: { quantity: number; expiryDate: string; reminderDays: number }) => void;
  onDelete: () => void;
  onClose: () => void;
}

export function EditItemSheet({
  visible,
  item,
  onSave,
  onDelete,
  onClose,
}: EditItemSheetProps) {
  const [quantity, setQuantity] = useState(item?.quantity ?? 1);
  const [expiryDate, setExpiryDate] = useState(item?.expiryDate ?? '');
  const [reminderDays, setReminderDays] = useState(item?.reminderDays ?? 2);

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity);
      setExpiryDate(item.expiryDate);
      setReminderDays(item.reminderDays);
    }
  }, [item]);

  if (!item) return null;

  const theme = compartmentTheme[item.compartment];

  // Validation: Expiry date required and must not be in the past
  const isPastDate = expiryDate
    ? isBefore(startOfDay(parseISO(expiryDate)), startOfDay(new Date()))
    : false;
  const isValidDate = Boolean(expiryDate) && !isPastDate;

  const handleSave = () => {
    if (isValidDate) {
      onSave({
        quantity,
        expiryDate,
        reminderDays,
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable
        style={styles.backdrop}
        onPress={onClose}
        testID="edit-sheet-backdrop"
      >
        <View style={styles.sheetContainer}>
          <Pressable
            style={[styles.sheet, elevation.elev2]}
            onPress={(e) => e.stopPropagation()}
            testID="edit-sheet-content"
          >
            {/* Top drag handle */}
            <View style={styles.handle} />

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
              bounces={false}
            >
              {/* Header row: image, item name, close button */}
              <View style={styles.headerRow}>
                <View style={styles.itemPreview}>
                  <View style={styles.imageSquare}>
                    <ItemImage
                      name={item.name}
                      catalogId={item.catalogId || undefined}
                      compartment={item.compartment}
                      size={44}
                    />
                  </View>
                  <View style={styles.nameContainer}>
                    <Text
                      style={[styles.itemName, typography.titleMd, { color: colors.ink.title }]}
                      numberOfLines={1}
                      testID="edit-sheet-item-name"
                    >
                      {item.name}
                    </Text>
                    <Text style={[styles.compartmentSubtitle, typography.caption]}>
                      In {item.compartment.charAt(0).toUpperCase() + item.compartment.slice(1)}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  accessibilityRole="button"
                  accessibilityLabel="Close edit sheet"
                  style={styles.closeBtn}
                  testID="edit-sheet-close-btn"
                >
                  <X size={22} color={colors.ink.title} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              {/* Form Panel */}
              <View style={[styles.formPanel, { backgroundColor: theme.tint }]}>
                {/* 1 pt inner white border */}
                <View style={styles.formPanelBorder} pointerEvents="none" />

                {/* Quantity */}
                <Text style={[styles.fieldLabel, typography.label]}>
                  Quantity
                </Text>
                <View style={styles.stepperWrapper}>
                  <QuantityStepper
                    value={quantity}
                    onChange={setQuantity}
                    min={1}
                    max={99}
                  />
                </View>

                {/* Expiry Date */}
                <View style={styles.dateWrapper}>
                  <DateField
                    value={expiryDate}
                    onChange={setExpiryDate}
                    label="Expiry date"
                    placeholder="DD / MM / YYYY"
                    error={isPastDate ? 'Pick today or a later date' : false}
                    helperText="We'll remind you before it expires."
                  />
                </View>
              </View>

              {/* Reminder Lead Time */}
              <View style={styles.reminderCard}>
                <Text style={[styles.reminderHeading, typography.label]}>
                  Reminder lead time
                </Text>
                <ReminderChipGroup
                  selectedDays={reminderDays}
                  onSelect={setReminderDays}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <PrimaryButton
                  testID="edit-sheet-save-btn"
                  label="Save"
                  variant="check"
                  disabled={!isValidDate}
                  onPress={handleSave}
                />

                <TouchableOpacity
                  testID="edit-sheet-delete-btn"
                  onPress={onDelete}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${item.name}`}
                  style={styles.deleteRow}
                >
                  <Trash2 size={18} color={colors.status.expired.fg} strokeWidth={2} />
                  <Text style={[styles.deleteText, typography.button]}>
                    Remove item
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    width: '100%',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FAF7F2',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
    maxHeight: '90%',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: '#A9B2B3',
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  itemPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  imageSquare: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameContainer: {
    flex: 1,
  },
  itemName: {
    fontWeight: '700',
  },
  compartmentSubtitle: {
    color: '#4F5E59',
    marginTop: 2,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  formPanel: {
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: spacing.md,
  },
  formPanelBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  fieldLabel: {
    color: colors.ink.label,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  stepperWrapper: {
    marginBottom: spacing.md,
  },
  dateWrapper: {
    width: '100%',
  },
  reminderCard: {
    backgroundColor: '#F0F3E7',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },
  reminderHeading: {
    color: colors.ink.label,
    marginBottom: spacing.sm,
  },
  actions: {
    width: '100%',
    gap: spacing.md,
  },
  deleteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    gap: 8,
  },
  deleteText: {
    color: colors.status.expired.fg, // #B23B30
    fontWeight: '600',
    fontSize: 16,
  },
});
