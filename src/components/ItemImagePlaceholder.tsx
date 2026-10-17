// src/components/ItemImagePlaceholder.tsx
// Fallback placeholder rendering the first letter of the item in its compartment tint.

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CompartmentId } from '../domain/types';
import { compartmentTheme, fontNames, radius } from '../theme/tokens';

interface ItemImagePlaceholderProps {
  name: string;
  compartment?: CompartmentId;
  size?: number;
}

export const ItemImagePlaceholder: React.FC<ItemImagePlaceholderProps> = ({
  name,
  compartment = 'veggies',
  size = 64,
}) => {
  const theme = compartmentTheme[compartment];
  const initial = (name.trim().charAt(0) || '?').toUpperCase();
  const fontSize = Math.max(14, Math.round(size * 0.42));

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          backgroundColor: theme.tint,
          borderColor: theme.accent,
        },
      ]}
      accessibilityRole="image"
      accessibilityLabel={`Placeholder image for ${name}`}
    >
      <Text style={[styles.letter, { color: theme.ink, fontSize }]}>{initial}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  letter: {
    fontFamily: fontNames.bold,
    textAlign: 'center',
  },
});
