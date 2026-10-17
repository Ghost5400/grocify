// src/components/ItemRow.tsx
import React from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { CompartmentId } from '@/domain/types';
import { usePressScale } from '@/hooks/usePressScale';
import { compartmentTheme, elevation, radius, spacing, typography } from '@/theme/tokens';
import { formatDateShort } from '@/utils/date';
import { ItemImage } from './ItemImage';
import { StatusBadge } from './StatusBadge';

export interface ItemRowProps {
  name: string;
  quantity: number;
  expiryDate: string;
  compartment: CompartmentId;
  reminderDays?: number;
  catalogId?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ItemRow({
  name,
  quantity,
  expiryDate,
  compartment,
  reminderDays = 2,
  catalogId,
  onPress,
  style,
  testID,
}: ItemRowProps) {
  const theme = compartmentTheme[compartment];
  const { animatedStyle, onPressIn, onPressOut } = usePressScale({
    targetScale: 0.985,
    inDuration: 90,
    outDuration: 120,
  });

  const formattedDate = formatDateShort(expiryDate);
  const subtitle = `Qty ${quantity} · Expires ${formattedDate}`;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        elevation.elev1,
        animatedStyle,
        style,
      ]}
    >
      <Pressable
        testID={testID}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        disabled={!onPress}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${subtitle}`}
        style={[
          styles.container,
          { backgroundColor: theme.tint },
        ]}
      >
        {/* 1 pt inner white border */}
        <View style={styles.innerHighlight} />

        {/* Left 60x60 square with item image */}
        <View style={styles.imageSquare}>
          <ItemImage
            name={name}
            catalogId={catalogId}
            compartment={compartment}
            size={48}
          />
        </View>

        {/* Middle title and subtitle */}
        <View style={styles.detailsContainer}>
          <Text
            style={[styles.title, typography.bodyLg, { color: theme.ink }]}
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text style={[styles.subtitle, typography.caption]}>
            {subtitle}
          </Text>
        </View>

        {/* Right Status Badge */}
        <View style={styles.badgeContainer}>
          <StatusBadge
            expiryDate={expiryDate}
            reminderDays={reminderDays}
          />
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: radius.lg, // 24
    width: '100%',
  },
  container: {
    height: 76,
    borderRadius: radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md, // 12
    position: 'relative',
    overflow: 'hidden',
  },
  innerHighlight: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
    pointerEvents: 'none',
  },
  imageSquare: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md, // 12
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    fontWeight: '600',
  },
  subtitle: {
    color: '#4F5E59',
    marginTop: 2,
  },
  badgeContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
});
