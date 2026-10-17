// src/components/fridge/ShelfPreview.tsx
// Renders the shelf line and up to 6 item images bottom-aligned on the shelf with soft contact shadows.
// Per UIUX.md Section 6.

import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { GlassShelf } from '@/components/GlassShelf';
import { ItemImage } from '@/components/ItemImage';
import { CompartmentId, Item } from '@/domain/types';
import { compartmentTheme, typography } from '@/theme/tokens';

export interface ShelfPreviewProps {
  compartment: CompartmentId;
  items: Item[];
  maxVisible?: number;
  style?: StyleProp<ViewStyle>;
}

export function ShelfPreview({
  compartment,
  items,
  maxVisible = 6,
  style,
}: ShelfPreviewProps) {
  const theme = compartmentTheme[compartment];
  const displayItems = items.slice(0, maxVisible);
  const isEmpty = displayItems.length === 0;

  return (
    <View style={[styles.container, style]} testID={`shelf-preview-${compartment}`}>
      {/* Items Cavity Area */}
      <View style={styles.itemsCavity}>
        {isEmpty ? (
          <View style={styles.emptyContainer} testID="shelf-empty-state">
            <Text
              style={[
                styles.emptyText,
                typography.caption,
                { color: theme.ink },
              ]}
            >
              Empty
            </Text>
          </View>
        ) : (
          <View style={styles.itemsRow}>
            {displayItems.map((item, index) => {
              const shouldOverlap = displayItems.length > 4 && index < displayItems.length - 1;
              return (
                <View
                  key={item.id}
                  style={[
                    styles.itemWrapper,
                    shouldOverlap && styles.overlappingItem,
                    { zIndex: index + 1 },
                  ]}
                  testID={`shelf-item-${item.id}`}
                >
                  {/* Item Image (contain, ~64-72 pt) */}
                  <ItemImage
                    name={item.name}
                    compartment={compartment}
                    catalogId={item.catalogId ?? undefined}
                    size={64}
                  />
                  {/* Soft contact shadow ellipse beneath the item */}
                  <View style={styles.contactShadow} />
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Recessed Glass Shelf along bottom edge */}
      <GlassShelf insetHorizontal={10} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    justifyContent: 'flex-end',
    position: 'relative',
    minHeight: 90,
  },
  itemsCavity: {
    height: 74,
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
  },
  emptyContainer: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    opacity: 0.5,
    fontFamily: 'Figtree_400Regular',
    fontSize: 13,
    letterSpacing: 0.2,
  },
  itemsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    paddingBottom: 2,
  },
  itemWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  overlappingItem: {
    marginRight: -8,
  },
  contactShadow: {
    width: 44,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(0, 0, 0, 0.14)',
    marginTop: -2,
  },
});
