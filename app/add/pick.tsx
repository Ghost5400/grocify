// app/add/pick.tsx
// Item Picker screen (Phase 1 Placeholder).

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CATALOG } from '@/data/catalog';
import { COMPARTMENTS } from '@/data/compartments';
import { CatalogEntry, CompartmentId } from '@/domain/types';
import { useDraftStore } from '@/store/draftStore';
import { colors, compartmentTheme, radius, spacing, typography } from '@/theme/tokens';

export default function ItemPickerScreen() {
  const router = useRouter();
  const { compartment } = useLocalSearchParams<{ compartment?: CompartmentId }>();

  const selectedCompartment: CompartmentId =
    compartment === 'freezer' || compartment === 'packed' || compartment === 'veggies'
      ? compartment
      : 'veggies';

  const setCatalogEntry = useDraftStore((state) => state.setCatalogEntry);
  const items = CATALOG.filter((entry) => entry.compartment === selectedCompartment);
  const theme = compartmentTheme[selectedCompartment];

  const handleSelectItem = (entry: CatalogEntry) => {
    setCatalogEntry(entry);
    router.push('/add/details' as any);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={[styles.header, { backgroundColor: theme.tint }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: theme.ink }]}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, typography.titleMd, { color: theme.ink }]}>
          Pick Item ({COMPARTMENTS[selectedCompartment].name})
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={[styles.hint, typography.body, { color: theme.ink }]}>
          Select an item to continue to details (Phase 1 Placeholder):
        </Text>

        {items.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={[styles.itemCard, { borderColor: theme.accent }]}
            onPress={() => handleSelectItem(entry)}
            accessibilityRole="button"
            accessibilityLabel={`Select ${entry.name}`}
          >
            <Text style={[styles.itemName, typography.titleMd, { color: theme.ink }]}>
              {entry.name}
            </Text>
            <Text style={[styles.itemArrow, { color: theme.accent }]}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.huge,
    paddingBottom: spacing.lg,
  },
  backButton: {
    padding: spacing.xs,
  },
  backText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  title: {
    textAlign: 'center',
  },
  list: {
    padding: spacing.lg,
  },
  hint: {
    marginBottom: spacing.lg,
  },
  itemCard: {
    backgroundColor: colors.field.bg,
    borderRadius: radius.md,
    borderWidth: 1.5,
    padding: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 18,
  },
  itemArrow: {
    fontSize: 22,
    fontWeight: 'bold',
  },
});
