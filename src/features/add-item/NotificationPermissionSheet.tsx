// src/features/add-item/NotificationPermissionSheet.tsx
// Notification permission pre-prompt bottom sheet per UIUX.md section 9.4.

import React from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Bell } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import {
  colors,
  elevation,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';

export interface NotificationPermissionSheetProps {
  visible: boolean;
  onAllow: () => void;
  onNotNow: () => void;
}

export function NotificationPermissionSheet({
  visible,
  onAllow,
  onNotNow,
}: NotificationPermissionSheetProps) {
  const handleAllow = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Ignored
    }
    onAllow();
  };

  const handleNotNow = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    } catch {
      // Ignored
    }
    onNotNow();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onNotNow}
      accessibilityRole="alert"
    >
      <Pressable
        style={styles.backdrop}
        onPress={onNotNow}
        testID="permission-sheet-backdrop"
      >
        <Pressable
          style={[styles.sheet, elevation.elev2]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Top handle pill */}
          <View style={styles.handle} />

          {/* Bell Icon Circle */}
          <View style={styles.iconCircle} testID="permission-icon-circle">
            {/* Subtle top gloss reflection */}
            <View style={styles.sheen} pointerEvents="none" />
            <Bell size={26} color={colors.white} strokeWidth={2.2} />
          </View>

          {/* Title */}
          <Text
            style={[styles.title, typography.titleMd, { color: colors.ink.title }]}
            testID="permission-sheet-title"
          >
            Stay ahead of expiry
          </Text>

          {/* Body */}
          <Text style={[styles.body, typography.body]}>
            Allow notifications and GROCIFY will remind you before your food expires.
          </Text>

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              testID="permission-sheet-allow-btn"
              onPress={handleAllow}
              accessibilityRole="button"
              accessibilityLabel="Allow notifications"
              style={[styles.allowBtn, elevation.elev1]}
            >
              <Text style={[styles.allowText, typography.button]}>
                Allow notifications
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              testID="permission-sheet-not-now-btn"
              onPress={handleNotNow}
              accessibilityRole="button"
              accessibilityLabel="Not now"
              style={styles.notNowBtn}
            >
              <Text style={[styles.notNowText, typography.button]}>Not now</Text>
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
    backgroundColor: colors.brand.forest,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    position: 'relative',
    overflow: 'hidden',
  },
  sheen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 22,
    borderTopLeftRadius: radius.full,
    borderTopRightRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  body: {
    color: '#4F5E59',
    textAlign: 'center',
    marginBottom: spacing.xl,
    lineHeight: 20,
    paddingHorizontal: spacing.sm,
  },
  actions: {
    width: '100%',
    gap: spacing.sm,
  },
  allowBtn: {
    height: 54,
    borderRadius: radius.xl,
    backgroundColor: colors.brand.forest,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  allowText: {
    color: colors.white,
  },
  notNowBtn: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  notNowText: {
    color: colors.ink.title,
    fontWeight: '500',
  },
});
