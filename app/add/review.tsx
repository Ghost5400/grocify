import React, { useEffect, useState } from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { BellOff, CalendarDays } from 'lucide-react-native';
import { CompartmentIconCircle } from '@/components/CompartmentIconCircle';
import { FridgeFrame } from '@/components/FridgeFrame';
import { ItemShowcaseCavity } from '@/components/common/ItemShowcaseCavity';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { StatusBadge } from '@/components/StatusBadge';
import { TextButton } from '@/components/TextButton';
import { COMPARTMENTS } from '@/data/compartments';
import { NotificationPermissionSheet } from '@/features/add-item/NotificationPermissionSheet';
import { ReminderChipGroup } from '@/features/add-item/ReminderChipGroup';
import { notificationsService } from '@/services/notifications';
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
  const hasPromptedNotificationPermission = useFridgeStore(
    (state) => !!state.settings.hasPromptedNotificationPermission
  );
  const setHasPromptedNotificationPermission = useFridgeStore(
    (state) => state.setHasPromptedNotificationPermission
  );

  const [showPermissionSheet, setShowPermissionSheet] = useState(false);
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean | null>(null);

  useEffect(() => {
    notificationsService.checkPermission().then((granted) => {
      setIsPermissionGranted(granted);
    });
  }, []);

  const theme = compartmentTheme[compartment];
  const compartmentName = COMPARTMENTS[compartment].name;
  const itemName = catalogEntry?.name || 'Grocery Item';

  const handleBack = () => {
    router.back();
  };

  const executeSave = async () => {
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

  const handleSaveClick = async () => {
    if (!hasPromptedNotificationPermission) {
      setShowPermissionSheet(true);
      return;
    }
    await executeSave();
  };

  const handleAllowPermission = async () => {
    setShowPermissionSheet(false);
    setHasPromptedNotificationPermission(true);
    await notificationsService.ensurePermission();
    await executeSave();
  };

  const handleNotNowPermission = async () => {
    setShowPermissionSheet(false);
    setHasPromptedNotificationPermission(true);
    await executeSave();
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
            <Animated.View entering={FadeIn.duration(260)}>
              <ScreenHeader
                compartment={compartment}
                title="Review"
                height={56}
                circleSize={44}
                showBack={true}
                onBack={handleBack}
                style={styles.headerPill}
              />
            </Animated.View>

            {/* 2. Shortened Showcase Cavity (~190 pt) */}
            <Animated.View entering={FadeInDown.duration(320)} style={styles.cavityWrapper}>
              <ItemShowcaseCavity
                compartment={compartment}
                itemName={itemName}
                catalogId={catalogEntry?.id}
                height={190}
                imageSize={130}
              />
            </Animated.View>

            {/* 3. Summary Card */}
            <Animated.View
              entering={FadeInDown.duration(300).delay(80)}
              style={[styles.summaryCard, { backgroundColor: theme.tint }]}
            >
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
            </Animated.View>

            {/* Optional Permission Denied Non-Blocking Hint */}
            {hasPromptedNotificationPermission && isPermissionGranted === false && (
              <Animated.View entering={FadeIn.duration(240)} style={styles.permissionNotice} testID="review-permission-hint">
                <View style={styles.permissionNoticeIconWrap}>
                  <BellOff size={16} color={colors.status.expiringSoon.fg} strokeWidth={2.2} />
                </View>
                <Text style={[styles.permissionNoticeText, typography.label]}>
                  Turn on notifications to get expiry reminders
                </Text>
                <TouchableOpacity
                  testID="review-open-settings-btn"
                  accessibilityRole="button"
                  accessibilityLabel="Open settings to turn on notifications"
                  onPress={() => Linking.openSettings().catch(() => {})}
                  style={styles.settingsLinkBtn}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={[styles.settingsLinkText, typography.label]}>Settings</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* 4. Action Buttons */}
            <Animated.View entering={FadeInUp.duration(300).delay(120)} style={styles.actionsContainer}>
              <PrimaryButton
                testID="review-save-btn"
                label="Add to fridge"
                variant="check"
                onPress={handleSaveClick}
              />
              <TextButton
                testID="review-edit-btn"
                label="Edit"
                onPress={handleBack}
                style={styles.editButton}
              />
            </Animated.View>
          </ScrollView>
        </FridgeFrame>
      </View>

      {/* Notification Permission Pre-Prompt Bottom Sheet */}
      <NotificationPermissionSheet
        visible={showPermissionSheet}
        onAllow={handleAllowPermission}
        onNotNow={handleNotNowPermission}
      />
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
  permissionNotice: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.status.expiringSoon.bg,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: '#E8D5B0',
  },
  permissionNoticeIconWrap: {
    width: 28,
    height: 28,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  permissionNoticeText: {
    flex: 1,
    color: colors.ink.title,
  },
  settingsLinkBtn: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  settingsLinkText: {
    color: colors.brand.forest,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
