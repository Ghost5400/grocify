// src/components/ItemImage.tsx
import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Image, ImageStyle } from 'expo-image';
import { CompartmentId } from '@/domain/types';
import { getItemImageSource } from '@/data/itemImages';
import { ItemImagePlaceholder } from './ItemImagePlaceholder';

export interface ItemImageProps {
  name: string;
  compartment: CompartmentId;
  catalogId?: string;
  size?: number;
  style?: StyleProp<ImageStyle | ViewStyle>;
}

export function ItemImage({
  name,
  compartment,
  catalogId,
  size = 56,
  style,
}: ItemImageProps) {
  const normalizedKey = catalogId || name.toLowerCase().replace(/\s+/g, '-');
  const imageSource = getItemImageSource(normalizedKey);

  if (imageSource) {
    return (
      <View style={[styles.container, { width: size, height: size }, style]}>
        <Image
          source={imageSource}
          style={{ width: size, height: size }}
          contentFit="contain"
          accessibilityRole="image"
          accessibilityLabel={name}
        />
      </View>
    );
  }

  return (
    <ItemImagePlaceholder
      name={name}
      compartment={compartment}
      catalogId={catalogId}
      size={size}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
