// src/components/EmptyState.tsx
import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { CompartmentId } from '@/domain/types';
import { compartmentTheme, radius, spacing, typography } from '@/theme/tokens';
import { GlassShelf } from './GlassShelf';
import { PrimaryButton } from './PrimaryButton';

export interface EmptyStateProps {
  compartment: CompartmentId;
  onAddItem: () => void;
  title?: string;
  body?: string;
  buttonLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function EmptyState({
  compartment,
  onAddItem,
  title = 'Nothing here yet',
  body = 'Add your first item to this compartment.',
  buttonLabel = 'Add item',
  style,
  testID,
}: EmptyStateProps) {
  const theme = compartmentTheme[compartment];

  return (
    <View testID={testID} style={[styles.container, style]}>
      {/* Code-drawn empty shelf illustration */}
      <View style={styles.shelfIllustration}>
        {/* Faint dashed rounded outline of an item standing on shelf */}
        <View
          style={[
            styles.dashedItemOutline,
            { borderColor: theme.accent },
          ]}
        />
        <GlassShelf insetHorizontal={24} />
      </View>

      <Text style={[styles.title, typography.titleMd, { color: theme.ink }]}>
        {title}
      </Text>

      <Text style={[styles.body, typography.body]}>
        {body}
      </Text>

      <View style={styles.buttonWrapper}>
        <PrimaryButton
          label={buttonLabel}
          onPress={onAddItem}
          variant="arrow"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.huge,
    width: '100%',
  },
  shelfIllustration: {
    width: '100%',
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  dashedItemOutline: {
    width: 68,
    height: 68,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    opacity: 0.35,
    marginBottom: -2,
  },
  title: {
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  body: {
    color: '#4F5E59',
    textAlign: 'center',
    maxWidth: 240,
    marginBottom: spacing.xxl,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 280,
  },
});
