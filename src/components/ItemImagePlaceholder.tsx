// src/components/ItemImagePlaceholder.tsx
// Renders the food item's authentic emoji (e.g. 🍅 for Tomato) in place of cutout images.

import React from 'react';
import { Platform, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { CompartmentId } from '../domain/types';
import { getItemEmoji } from '../data/itemEmojis';

export interface ItemImagePlaceholderProps {
  name: string;
  compartment?: CompartmentId;
  catalogId?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
}

export const ItemImagePlaceholder: React.FC<ItemImagePlaceholderProps> = ({
  name,
  compartment = 'veggies',
  catalogId,
  size = 64,
  style,
}) => {
  const emoji = getItemEmoji(catalogId || name, compartment);
  // Scale emoji nicely relative to container size
  const fontSize = Math.max(16, Math.round(size * 0.7));

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
        style,
      ]}
      accessibilityRole="image"
      accessibilityLabel={`Image for ${name}`}
    >
      <Text
        style={[
          styles.emoji,
          {
            fontSize,
            lineHeight: Platform.OS === 'ios' ? Math.round(fontSize * 1.15) : undefined,
          },
        ]}
      >
        {emoji}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  emoji: {
    textAlign: 'center',
    includeFontPadding: false,
  },
});
