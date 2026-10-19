// src/features/inventory/InventoryHeader.tsx
// Header pill for Compartment Inventory matching UIUX.md Section 9.3

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ChevronLeft, Package, Plus } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { CompartmentIconCircle } from '@/components/CompartmentIconCircle';
import { COMPARTMENTS } from '@/data/compartments';
import { CompartmentId } from '@/domain/types';
import {
  colors,
  compartmentTheme,
  elevation,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';

export interface InventoryHeaderProps {
  compartment: CompartmentId;
  itemCount: number;
  onBack: () => void;
  onAdd: () => void;
  testID?: string;
}

export function InventoryHeader({
  compartment,
  itemCount,
  onBack,
  onAdd,
  testID = 'inventory-header',
}: InventoryHeaderProps) {
  const theme = compartmentTheme[compartment];
  const compartmentInfo = COMPARTMENTS[compartment];
  const countLabel = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`;

  const handleAddPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onAdd();
  };

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    onBack();
  };

  return (
    <View testID={testID} style={[styles.wrapper, elevation.elev1]}>
      <View style={[styles.container, { backgroundColor: theme.tint }]}>
        {/* 1 pt inner white border */}
        <View style={styles.innerHighlight} pointerEvents="none" />

        {/* Left group: Back button, 52 pt Icon Circle, Title */}
        <View style={styles.leftGroup}>
          <TouchableOpacity
            testID="inventory-header-back"
            onPress={handleBackPress}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Back to fridge"
            style={styles.backButton}
          >
            <ChevronLeft size={24} color={theme.ink} strokeWidth={2.2} />
          </TouchableOpacity>

          <CompartmentIconCircle
            compartment={compartment}
            size={52}
          />

          <Text
            style={[styles.title, typography.titleMd, { color: theme.ink }]}
            numberOfLines={1}
            testID="inventory-header-title"
          >
            {compartmentInfo.name}
          </Text>
        </View>

        {/* Right group: Count chip ("6 items") and 40 pt + button */}
        <View style={styles.rightGroup}>
          <View style={styles.countChip} testID="inventory-count-chip">
            <Package size={15} color={colors.ink.title} strokeWidth={2} />
            <Text style={[styles.countText, typography.caption]}>
              {countLabel}
            </Text>
          </View>

          <TouchableOpacity
            testID="inventory-header-add"
            onPress={handleAddPress}
            accessibilityRole="button"
            accessibilityLabel={`Add item to ${compartmentInfo.name}`}
            style={[
              styles.addButton,
              { backgroundColor: theme.accent },
              elevation.elev1,
            ]}
          >
            <Plus size={22} color={colors.white} strokeWidth={2.4} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg, // 24
    width: '100%',
  },
  container: {
    height: 72,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 8,
    paddingRight: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  innerHighlight: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm, // 8
    flex: 1,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flexShrink: 1,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  countChip: {
    height: 32,
    borderRadius: radius.full,
    backgroundColor: '#E6E9DC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    gap: 5,
  },
  countText: {
    color: colors.ink.title,
    fontWeight: '600',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
