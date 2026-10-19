// app/compartment/[id].tsx
// Compartment Inventory screen matching UIUX.md Section 9.3 and Kickoff Phase 5 specs.

import React, { useCallback, useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeInDown, FadeOut, LinearTransition } from 'react-native-reanimated';
import { EmptyState } from '@/components/EmptyState';
import { FridgeFrame } from '@/components/FridgeFrame';
import { LightStrip } from '@/components/LightStrip';
import { CompartmentId, Item } from '@/domain/types';
import {
  DeleteConfirmSheet,
  EditItemSheet,
  InventoryHeader,
  SwipeableItemRow,
} from '@/features/inventory';
import { selectItemsByCompartment, useFridgeStore } from '@/store/fridgeStore';
import {
  colors,
  compartmentTheme,
  spacing,
} from '@/theme/tokens';

const VALID_COMPARTMENTS: readonly CompartmentId[] = ['freezer', 'packed', 'veggies'] as const;

function isValidCompartment(id: unknown): id is CompartmentId {
  return typeof id === 'string' && VALID_COMPARTMENTS.includes(id as CompartmentId);
}

export default function CompartmentInventoryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();

  const isKnown = isValidCompartment(id);

  // Safe redirect if invalid or unknown compartment id
  useEffect(() => {
    if (!isKnown) {
      router.replace('/fridge');
    }
  }, [isKnown, router]);

  const validId: CompartmentId = isKnown ? id : 'veggies';
  const theme = compartmentTheme[validId];

  // Store state and actions
  const allItems = useFridgeStore((state) => state.items);
  const items = React.useMemo(
    () => selectItemsByCompartment(allItems, validId),
    [allItems, validId]
  );
  const updateItem = useFridgeStore((state) => state.updateItem);
  const removeItem = useFridgeStore((state) => state.removeItem);

  // Modal states for editing and deleting
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deletingItem, setDeletingItem] = useState<Item | null>(null);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  const handleAdd = useCallback(() => {
    router.push(`/add/pick?compartment=${validId}` as any);
  }, [router, validId]);

  const handleRowPress = useCallback((item: Item) => {
    setEditingItem(item);
  }, []);

  const handleDeletePress = useCallback((item: Item) => {
    setDeletingItem(item);
  }, []);

  const handleSaveEdit = useCallback(
    async (patch: { quantity: number; expiryDate: string; reminderDays: number }) => {
      if (!editingItem) return;
      await updateItem(editingItem.id, patch);
      setEditingItem(null);
    },
    [editingItem, updateItem]
  );

  const handleDeleteFromEdit = useCallback(() => {
    if (!editingItem) return;
    const target = editingItem;
    setEditingItem(null);
    setDeletingItem(target);
  }, [editingItem]);

  const handleConfirmDelete = useCallback(async () => {
    if (!deletingItem) return;
    const idToDelete = deletingItem.id;
    setDeletingItem(null);
    await removeItem(idToDelete);
  }, [deletingItem, removeItem]);

  const getItemLayout = useCallback(
    (_data: ArrayLike<Item> | null | undefined, index: number) => ({
      length: 86, // 76 pt row height + 10 pt gap
      offset: 86 * index,
      index,
    }),
    []
  );

  const renderItem = useCallback(
    ({ item }: { item: Item }) => (
      <Animated.View
        entering={FadeInDown.duration(240)}
        exiting={FadeOut.duration(180)}
        layout={LinearTransition.duration(200)}
      >
        <SwipeableItemRow
          item={item}
          onPress={handleRowPress}
          onDelete={handleDeletePress}
          testID={`inventory-item-${item.id}`}
        />
      </Animated.View>
    ),
    [handleRowPress, handleDeletePress]
  );

  const keyExtractor = useCallback((item: Item) => item.id, []);

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
          {/* 1. Header Pill (72 pt) with back arrow, 52 pt icon, title, count chip, and + button */}
          <Animated.View entering={FadeIn.duration(260)} style={styles.headerWrapper}>
            <InventoryHeader
              compartment={validId}
              itemCount={items.length}
              onBack={handleBack}
              onAdd={handleAdd}
            />
          </Animated.View>

          {/* 2. Light Strip under the header */}
          <Animated.View entering={FadeIn.duration(300).delay(50)} style={styles.lightStripWrapper}>
            <LightStrip widthPercent={70} />
          </Animated.View>

          {/* 3. Compartment Cavity: Scrollable list of items or empty state */}
          <View style={styles.cavity}>
            {items.length === 0 ? (
              <Animated.View entering={FadeIn.duration(280)} style={styles.emptyContainer} testID="inventory-empty-state">
                <EmptyState
                  compartment={validId}
                  title="Nothing here yet"
                  body="Add your first item to this compartment."
                  buttonLabel="Add item"
                  onAddItem={handleAdd}
                />
              </Animated.View>
            ) : (
              <FlatList
                testID="inventory-list"
                data={items}
                keyExtractor={keyExtractor}
                renderItem={renderItem}
                getItemLayout={getItemLayout}
                ItemSeparatorComponent={ItemSeparator}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </FridgeFrame>
      </View>

      {/* Edit Item Bottom Sheet Modal */}
      <EditItemSheet
        visible={Boolean(editingItem)}
        item={editingItem}
        onSave={handleSaveEdit}
        onDelete={handleDeleteFromEdit}
        onClose={() => setEditingItem(null)}
      />

      {/* Delete Confirmation Sheet Modal */}
      <DeleteConfirmSheet
        visible={Boolean(deletingItem)}
        item={deletingItem}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingItem(null)}
      />
    </View>
  );
}

function ItemSeparator() {
  return <View style={styles.separator} />;
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
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerWrapper: {
    marginBottom: 8,
  },
  lightStripWrapper: {
    alignItems: 'center',
    marginBottom: 12,
  },
  cavity: {
    flex: 1,
    position: 'relative',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 4,
    paddingBottom: 20,
  },
  separator: {
    height: 10,
  },
});
