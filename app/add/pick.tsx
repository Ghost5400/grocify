// app/add/pick.tsx
// Item Picker screen per UIUX.md Section 9.1 and Kickoff Phase 4 specs.

import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { ChevronLeft, Search, X } from 'lucide-react-native';
import { FridgeFrame } from '@/components/FridgeFrame';
import { ItemImage } from '@/components/ItemImage';
import { ScreenHeader } from '@/components/ScreenHeader';
import { CATALOG } from '@/data/catalog';
import { COMPARTMENTS } from '@/data/compartments';
import { CatalogEntry, CompartmentId } from '@/domain/types';
import { CompartmentChipSelector } from '@/features/add-item/CompartmentChipSelector';
import { useDraftStore } from '@/store/draftStore';
import {
  colors,
  compartmentTheme,
  elevation,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';

export default function ItemPickerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ compartment?: CompartmentId }>();

  // If a valid compartment is provided via query param, it is locked/preselected.
  // Otherwise, user can pick via compartment chips.
  const hasPreselectedCompartment =
    params.compartment === 'freezer' ||
    params.compartment === 'packed' ||
    params.compartment === 'veggies';

  const [selectedCompartment, setSelectedCompartment] = useState<CompartmentId>(
    hasPreselectedCompartment ? (params.compartment as CompartmentId) : 'veggies'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const activeCompartment = hasPreselectedCompartment
    ? (params.compartment as CompartmentId)
    : selectedCompartment;

  const theme = compartmentTheme[activeCompartment];
  const setCatalogEntry = useDraftStore((state) => state.setCatalogEntry);
  const setQuantity = useDraftStore((state) => state.setQuantity);
  const setExpiryDate = useDraftStore((state) => state.setExpiryDate);
  const setReminderDays = useDraftStore((state) => state.setReminderDays);

  const filteredItems = useMemo(() => {
    const compartmentItems = CATALOG.filter(
      (entry) => entry.compartment === activeCompartment
    );
    const query = searchQuery.trim().toLowerCase();
    if (!query) return compartmentItems;
    return compartmentItems.filter((entry) =>
      entry.name.toLowerCase().includes(query)
    );
  }, [activeCompartment, searchQuery]);

  const handleSelectItem = (entry: CatalogEntry) => {
    if (Platform.OS !== 'web') {
      try {
        Haptics.selectionAsync().catch(() => {});
      } catch {
        // Safe fallback
      }
    }

    setCatalogEntry(entry);
    setQuantity(1);
    setExpiryDate(null);
    setReminderDays(2);

    router.push('/add/details');
  };

  const handleBack = () => {
    router.back();
  };

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
          {/* Header */}
          <View style={styles.headerContainer}>
            {hasPreselectedCompartment ? (
              <ScreenHeader
                compartment={activeCompartment}
                title={`Add to ${COMPARTMENTS[activeCompartment].name}`}
                height={56}
                showBack={true}
                onBack={handleBack}
              />
            ) : (
              <View style={styles.neutralHeaderWrapper}>
                <View style={[styles.neutralHeaderPill, elevation.elev1]}>
                  <View style={styles.innerHighlight} />
                  <TouchableOpacity
                    testID="picker-back-btn"
                    onPress={handleBack}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                    style={styles.backButton}
                  >
                    <ChevronLeft size={24} color={colors.ink.title} strokeWidth={2.2} />
                  </TouchableOpacity>
                  <Text
                    style={[
                      styles.neutralHeaderTitle,
                      typography.titleMd,
                      { color: colors.ink.title },
                    ]}
                  >
                    Add item
                  </Text>
                  <View style={{ width: 44 }} />
                </View>

                {/* Compartment Selector row */}
                <View style={styles.chipSelectorWrapper}>
                  <CompartmentChipSelector
                    selectedCompartment={selectedCompartment}
                    onSelect={setSelectedCompartment}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Search field */}
          <View style={styles.searchContainer}>
            <View style={styles.searchField}>
              <Search
                size={22}
                color="#2F4A47"
                strokeWidth={2}
                style={styles.searchIcon}
              />
              <TextInput
                testID="picker-search-input"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search items"
                placeholderTextColor={colors.placeholder}
                style={[styles.searchInput, typography.body]}
                accessibilityLabel="Search items"
                returnKeyType="search"
                autoCorrect={false}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  testID="picker-search-clear"
                  onPress={() => setSearchQuery('')}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  accessibilityRole="button"
                  accessibilityLabel="Clear search"
                  style={styles.clearButton}
                >
                  <X size={18} color={colors.placeholder} />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 3-Column Item Grid */}
          <FlatList
            testID="picker-item-grid"
            data={filteredItems}
            keyExtractor={(item) => item.id}
            numColumns={3}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContent}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable
                testID={`picker-tile-${item.id}`}
                onPress={() => handleSelectItem(item)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${item.name}`}
                style={({ pressed }) => [
                  styles.tile,
                  elevation.elev1,
                  {
                    backgroundColor: theme.tint,
                  },
                  pressed && styles.tilePressed,
                ]}
              >
                {/* 1 pt inner white border */}
                <View style={styles.tileInnerBorder} pointerEvents="none" />

                {/* 64 pt Image */}
                <View style={styles.tileImageWrapper} pointerEvents="none">
                  <ItemImage
                    name={item.name}
                    compartment={item.compartment}
                    catalogId={item.id}
                    size={64}
                  />
                </View>

                {/* Name Label */}
                <Text
                  style={[
                    styles.tileName,
                    typography.label,
                    { color: theme.ink },
                  ]}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, typography.body]}>
                  No items match. Try another name.
                </Text>
              </View>
            }
          />
        </FridgeFrame>
      </View>
    </View>
  );
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
    paddingBottom: 8,
  },
  headerContainer: {
    marginBottom: spacing.sm,
  },
  neutralHeaderWrapper: {
    gap: spacing.sm,
  },
  neutralHeaderPill: {
    height: 56,
    borderRadius: radius.lg, // 24
    backgroundColor: '#E4E8DC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: spacing.lg,
    position: 'relative',
    overflow: 'hidden',
  },
  innerHighlight: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    pointerEvents: 'none',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  neutralHeaderTitle: {
    flex: 1,
    textAlign: 'center',
  },
  chipSelectorWrapper: {
    width: '100%',
  },
  searchContainer: {
    marginVertical: spacing.xs,
  },
  searchField: {
    width: '100%',
    height: 52,
    borderRadius: radius.md, // 18
    backgroundColor: colors.field.bg,
    borderWidth: 1.5,
    borderColor: colors.field.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  searchIcon: {
    marginRight: spacing.md,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: colors.ink.title,
  },
  clearButton: {
    padding: spacing.xs,
  },
  gridContent: {
    paddingTop: spacing.xs,
    paddingBottom: spacing.lg,
    flexGrow: 1,
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 10,
  },
  tile: {
    flex: 1,
    height: 124,
    borderRadius: radius.lg, // 24
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 6,
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '32%',
  },
  tilePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  tileInnerBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.75)',
  },
  tileImageWrapper: {
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileName: {
    textAlign: 'center',
    fontSize: 13,
    lineHeight: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.huge,
    paddingHorizontal: spacing.xl,
  },
  emptyText: {
    color: colors.ink.slateSoft,
    textAlign: 'center',
  },
});
