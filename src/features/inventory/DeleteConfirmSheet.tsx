// src/features/inventory/DeleteConfirmSheet.tsx
// Confirmation bottom sheet modal for removing an item

import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Trash2 } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Item } from '@/domain/types';
import {
  colors,
  elevation,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';

export interface DeleteConfirmSheetProps {
  visible: boolean;
  item: Item | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmSheet({
  visible,
  item,
  onConfirm,
  onCancel,
}: DeleteConfirmSheetProps) {
  if (!item) return null;

  const handleConfirm = () => {
    try {
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType?.Warning || ('warning' as any)
      ).catch(() => {});
    } catch {
      // ignore
    }
    onConfirm();
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      accessibilityRole="alert"
    >
      <Pressable
        style={styles.backdrop}
        onPress={onCancel}
        testID="delete-sheet-backdrop"
      >
        <Pressable style={[styles.sheet, elevation.elev2]} onPress={(e) => e.stopPropagation()}>
          {/* Top handle pill */}
          <View style={styles.handle} />

          {/* Warning Icon Circle */}
          <View style={styles.iconCircle}>
            <Trash2 size={24} color={colors.status.expired.fg} strokeWidth={2.2} />
          </View>

          {/* Title */}
          <Text
            style={[styles.title, typography.titleMd, { color: colors.ink.title }]}
            testID="delete-sheet-title"
          >
            Remove {item.name}?
          </Text>

          {/* Description */}
          <Text style={[styles.body, typography.body]}>
            This item will be removed from your fridge.
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              testID="delete-sheet-confirm-btn"
              onPress={handleConfirm}
              accessibilityRole="button"
              accessibilityLabel={`Confirm remove ${item.name}`}
              style={[styles.confirmBtn, elevation.elev1]}
            >
              <Trash2 size={20} color={colors.white} strokeWidth={2.2} style={styles.btnIcon} />
              <Text style={[styles.confirmText, typography.button]}>Remove</Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="delete-sheet-cancel-btn"
              onPress={handleCancel}
              accessibilityRole="button"
              accessibilityLabel="Cancel removal"
              style={styles.cancelBtn}
            >
              <Text style={[styles.cancelText, typography.button]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
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
  sheet: {
    backgroundColor: '#FAF7F2',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: spacing.xxl,
    paddingTop: spacing.md,
    paddingBottom: spacing.huge,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: '#A9B2B3',
    marginBottom: spacing.lg,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: colors.status.expired.bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  body: {
    color: '#4F5E59',
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
  actions: {
    width: '100%',
    gap: spacing.sm,
  },
  confirmBtn: {
    height: 54,
    borderRadius: radius.xl,
    backgroundColor: colors.status.expired.fg, // #B23B30
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  btnIcon: {
    marginRight: 8,
  },
  confirmText: {
    color: colors.white,
  },
  cancelBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  cancelText: {
    color: colors.ink.title,
    fontWeight: '500',
  },
});
