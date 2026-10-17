// app/_dev/gallery.tsx
// Dev-only component gallery scaffold (Phase 1 scaffold, detailed in Phase 2).

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ItemImagePlaceholder } from '@/components/ItemImagePlaceholder';
import { colors, radius, spacing, typography } from '@/theme/tokens';

export default function DevGalleryScreen() {
  const router = useRouter();

  if (!__DEV__) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[styles.title, typography.titleMd]}>[DEV] Component Gallery</Text>
      </View>

      <View style={styles.content}>
        <Text style={[styles.sectionTitle, typography.label]}>Item Image Placeholders:</Text>
        <View style={styles.row}>
          <ItemImagePlaceholder name="Tomato" compartment="veggies" size={56} />
          <ItemImagePlaceholder name="Ice Cream" compartment="freezer" size={56} />
          <ItemImagePlaceholder name="Milk" compartment="packed" size={56} />
        </View>

        <Text style={[styles.info, typography.body]}>
          Shared design system components will be comprehensively rendered here in Phase 2.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.canvas,
    paddingTop: spacing.huge,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.rim.base,
  },
  backButton: {
    marginRight: spacing.md,
  },
  backText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.brand.forest,
  },
  title: {
    color: colors.ink.slate,
  },
  content: {
    padding: spacing.xl,
  },
  sectionTitle: {
    color: colors.ink.label,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  info: {
    color: colors.ink.helper,
  },
});
