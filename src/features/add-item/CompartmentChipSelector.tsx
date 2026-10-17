// src/features/add-item/CompartmentChipSelector.tsx
// Three compartment selector chips per UIUX.md Section 9.1.

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
import { CompartmentIconCircle } from '@/components/CompartmentIconCircle';
import { COMPARTMENT_LIST } from '@/data/compartments';
import { CompartmentId } from '@/domain/types';
import { colors, compartmentTheme, radius, spacing, typography } from '@/theme/tokens';

export interface CompartmentChipSelectorProps {
  selectedCompartment: CompartmentId;
  onSelect: (compartment: CompartmentId) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function CompartmentChipSelector({
  selectedCompartment,
  onSelect,
  style,
  testID = 'compartment-chip-selector',
}: CompartmentChipSelectorProps) {
  const handleSelect = (id: CompartmentId) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync().catch(() => {});
      } catch {
        // Fallback in tests
      }
    }
    onSelect(id);
  };

  return (
    <View testID={testID} style={[styles.container, style]}>
      {COMPARTMENT_LIST.map((comp) => {
        const isSelected = comp.id === selectedCompartment;
        const theme = compartmentTheme[comp.id];

        // Shorten Packed & Miscellaneous for compact chip width
        const displayName = comp.id === 'packed' ? 'Packed & Misc' : comp.name;

        return (
          <Pressable
            key={comp.id}
            testID={`chip-${comp.id}`}
            onPress={() => handleSelect(comp.id)}
            accessibilityRole="button"
            accessibilityLabel={`Select ${displayName}`}
            accessibilityState={{ selected: isSelected }}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: isSelected ? theme.accent : theme.tint,
                borderColor: isSelected ? theme.accent : 'rgba(255, 255, 255, 0.6)',
              },
              pressed && styles.chipPressed,
            ]}
          >
            <CompartmentIconCircle
              compartment={comp.id}
              size={28}
            />
            <Text
              style={[
                styles.chipText,
                typography.caption,
                {
                  color: isSelected ? colors.white : theme.ink,
                  fontWeight: isSelected ? '700' : '600',
                },
              ]}
              numberOfLines={1}
            >
              {displayName}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing.sm,
  },
  chip: {
    flex: 1,
    height: 44,
    borderRadius: radius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    gap: 6,
    borderWidth: 1,
  },
  chipPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  chipText: {
    fontSize: 13,
  },
});
