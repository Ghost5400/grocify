// src/features/add-item/ReminderChipGroup.tsx
// Expiry reminder lead time selector chips per UIUX.md Section 9.2.

import React from 'react';
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Bell } from 'lucide-react-native';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export interface ReminderOption {
  label: string;
  days: number;
}

export const REMINDER_OPTIONS: ReminderOption[] = [
  { label: '1 day', days: 1 },
  { label: '2 days', days: 2 },
  { label: '3 days', days: 3 },
  { label: '1 week', days: 7 },
];

export interface ReminderChipGroupProps {
  selectedDays: number;
  onSelect: (days: number) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ReminderChipGroup({
  selectedDays,
  onSelect,
  style,
  testID = 'reminder-chip-group',
}: ReminderChipGroupProps) {
  const handleSelect = (days: number) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync().catch(() => {});
      } catch {
        // Fallback in tests
      }
    }
    onSelect(days);
  };

  return (
    <View testID={testID} style={[styles.container, style]}>
      {/* Label Row with Bell Icon */}
      <View style={styles.headerRow}>
        <Bell size={18} color={colors.ink.label} strokeWidth={2.2} />
        <Text style={[styles.label, typography.label]}>Remind me</Text>
      </View>

      {/* 4 Chips */}
      <View style={styles.chipsRow}>
        {REMINDER_OPTIONS.map((opt) => {
          const isSelected = opt.days === selectedDays;
          return (
            <Pressable
              key={opt.days}
              testID={`reminder-chip-${opt.days}`}
              onPress={() => handleSelect(opt.days)}
              accessibilityRole="button"
              accessibilityLabel={`Remind ${opt.label} before expiry`}
              accessibilityState={{ selected: isSelected }}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: isSelected ? colors.brand.forest : colors.field.bg,
                  borderColor: isSelected ? colors.brand.forest : colors.field.border,
                },
                pressed && styles.chipPressed,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  typography.caption,
                  {
                    color: isSelected ? colors.white : colors.ink.label,
                    fontWeight: isSelected ? '700' : '500',
                  },
                ]}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Helper text */}
      <Text style={[styles.helperText, typography.caption]}>
        You'll get a notification on the morning of that day.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  label: {
    color: colors.ink.label,
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
    marginVertical: spacing.xs,
  },
  chip: {
    flex: 1,
    height: 36,
    borderRadius: radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  chipPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.96 }],
  },
  chipText: {
    fontSize: 13,
  },
  helperText: {
    color: colors.ink.helper,
    marginTop: 4,
    textAlign: 'left',
  },
});
