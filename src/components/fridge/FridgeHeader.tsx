// src/components/fridge/FridgeHeader.tsx
// Compact 48 pt header per UIUX.md Section 6 and reference images.

import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { Package, Plus } from 'lucide-react-native';
import { GrocifyWordmark } from '@/components/common/SproutLogo';
import { usePressScale } from '@/hooks/usePressScale';
import { colors, elevation, radius, spacing, typography } from '@/theme/tokens';

export interface FridgeHeaderProps {
  totalCount: number;
  onPressAdd: () => void;
  onLongPressWordmark?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function FridgeHeader({
  totalCount,
  onPressAdd,
  onLongPressWordmark,
  style,
}: FridgeHeaderProps) {
  const { animatedStyle: addBtnScale, onPressIn: onAddPressIn, onPressOut: onAddPressOut } = usePressScale({
    targetScale: 0.92,
    inDuration: 90,
    outDuration: 120,
  });

  const countLabel = `${totalCount} ${totalCount === 1 ? 'item' : 'items'}`;

  return (
    <View style={[styles.header, style]} testID="fridge-header">
      {/* Left: Small wordmark with sprout leaf */}
      <Pressable
        onLongPress={onLongPressWordmark}
        delayLongPress={500}
        accessibilityRole="button"
        accessibilityLabel="GROCIFY Home Logo"
        testID="header-wordmark"
      >
        <GrocifyWordmark size="compact" />
      </Pressable>

      {/* Right: Item Count Chip + Add '+' Button */}
      <View style={styles.rightGroup}>
        {/* Count chip */}
        <View style={styles.countChip} testID="fridge-count-chip">
          <Package size={16} color={colors.ink.title} strokeWidth={2.2} />
          <Text style={[styles.countText, typography.caption]}>{countLabel}</Text>
        </View>

        {/* Add button */}
        <TouchableOpacity
          onPress={onPressAdd}
          onPressIn={onAddPressIn}
          onPressOut={onAddPressOut}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel="Add grocery item"
          testID="fridge-add-button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={[styles.addButton, elevation.elev1]}
        >
          <Plus size={22} color={colors.white} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  countChip: {
    height: 32,
    borderRadius: radius.full,
    backgroundColor: '#E6E9DC',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    gap: 6,
  },
  countText: {
    fontFamily: 'Figtree_600SemiBold',
    color: colors.ink.title,
    fontSize: 13,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.brand.forest,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
