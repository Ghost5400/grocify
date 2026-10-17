// app/_dev/gallery.tsx
// Dev-only component gallery route showcasing all Phase 2 shared components in all states.

import React, { useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import {
  CompartmentIconCircle,
  DateField,
  EmptyState,
  FridgeBase,
  FridgeFrame,
  GlassShelf,
  ItemImage,
  ItemRow,
  LightStrip,
  NamePill,
  PrimaryButton,
  QuantityStepper,
  ScreenHeader,
  StatusBadge,
  TextButton,
  WelcomeCta,
} from '@/components';
import { CompartmentId } from '@/domain/types';
import { colors, compartmentTheme, radius, spacing, typography } from '@/theme/tokens';

export default function DevGalleryScreen() {
  const router = useRouter();
  const [activeCompartment, setActiveCompartment] = useState<CompartmentId>('veggies');
  const [stepperVal, setStepperVal] = useState<number>(3);
  const [dateVal, setDateVal] = useState<string>('2026-12-25');
  const [showDateError, setShowDateError] = useState<boolean>(false);

  if (!__DEV__) {
    return null;
  }

  const theme = compartmentTheme[activeCompartment];

  const compartments: Array<{ id: CompartmentId; label: string }> = [
    { id: 'freezer', label: 'Freezer' },
    { id: 'packed', label: 'Packed & Misc' },
    { id: 'veggies', label: 'Veggies' },
  ];

  return (
    <View style={styles.screen}>
      {/* Dev Header */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <ChevronLeft size={24} color={colors.ink.title} />
          <Text style={[styles.backText, typography.button]}>Back</Text>
        </TouchableOpacity>
        <Text style={[styles.galleryTitle, typography.titleMd]}>Component Gallery</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Compartment Switcher */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, typography.label]}>
            Active Compartment Theme:
          </Text>
          <View style={styles.switcherRow}>
            {compartments.map((comp) => {
              const isSelected = activeCompartment === comp.id;
              const compColors = compartmentTheme[comp.id];
              return (
                <Pressable
                  key={comp.id}
                  onPress={() => setActiveCompartment(comp.id)}
                  style={[
                    styles.switcherChip,
                    {
                      backgroundColor: isSelected ? compColors.accent : compColors.tint,
                    },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${comp.label}`}
                >
                  <CompartmentIconCircle compartment={comp.id} size={44} />
                  <Text
                    style={[
                      styles.chipText,
                      typography.label,
                      { color: isSelected ? compColors.onAccent : compColors.ink },
                    ]}
                  >
                    {comp.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 1. ScreenHeader Variants */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, typography.label]}>1. ScreenHeader</Text>
          <View style={styles.componentStack}>
            <Text style={styles.subLabel}>Home Screen Header (height 56, chevron):</Text>
            <ScreenHeader
              compartment={activeCompartment}
              title={
                activeCompartment === 'freezer'
                  ? 'Freezer'
                  : activeCompartment === 'packed'
                  ? 'Packed & Miscellaneous'
                  : 'Veggies'
              }
              showChevronRight
            />

            <Text style={styles.subLabel}>Detail/Add Screen Header (height 72, back arrow):</Text>
            <ScreenHeader
              compartment={activeCompartment}
              title={`Add to ${
                activeCompartment === 'freezer'
                  ? 'Freezer'
                  : activeCompartment === 'packed'
                  ? 'Packed'
                  : 'Veggies'
              }`}
              height={72}
              showBack
              onBack={() => {}}
            />
          </View>
        </View>

        {/* 2. Appliance Primitives: LightStrip, GlassShelf, FridgeFrame, FridgeBase */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, typography.label]}>
            2. Appliance Primitives (Frame, LightStrip, GlassShelf)
          </Text>
          <FridgeFrame rimWidth={8} insetHorizontal={0} style={styles.framePreview}>
            <View
              style={[
                styles.cavityPreview,
                { backgroundColor: theme.surface },
              ]}
            >
              <LightStrip widthPercent={70} />

              <View style={styles.cavityCenter}>
                <ItemImage
                  name="Tomato"
                  catalogId="tomato"
                  compartment={activeCompartment}
                  size={80}
                />
              </View>

              <GlassShelf insetHorizontal={12} />
            </View>
          </FridgeFrame>
        </View>

        {/* 3. NamePill */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, typography.label]}>3. NamePill</Text>
          <NamePill name={activeCompartment === 'veggies' ? 'Tomato' : activeCompartment === 'freezer' ? 'Ice Cream' : 'Milk'} />
        </View>

        {/* 4. Form Controls: QuantityStepper & DateField */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, typography.label]}>
            4. Form Controls (Stepper & DateField)
          </Text>
          <View style={styles.stepperCenter}>
            <Text style={[styles.fieldLabel, typography.label]}>Quantity</Text>
            <QuantityStepper value={stepperVal} onChange={setStepperVal} />
          </View>

          <View style={styles.fieldSpacer} />

          <DateField
            value={dateVal}
            onChange={setDateVal}
            label="Expiry date (interactive)"
            error={showDateError ? 'Pick today or a later date' : false}
          />

          <View style={styles.toggleRow}>
            <TouchableOpacity
              onPress={() => setShowDateError(!showDateError)}
              style={styles.toggleErrorBtn}
            >
              <Text style={styles.toggleErrorText}>
                Toggle Date Error State: {showDateError ? 'ON' : 'OFF'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.fieldSpacer} />

          <DateField
            value=""
            onChange={() => {}}
            label="Date Field Placeholder State"
          />
        </View>

        {/* 5. Buttons: PrimaryButton, WelcomeCta, TextButton */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, typography.label]}>5. Buttons</Text>
          <View style={styles.componentStack}>
            <Text style={styles.subLabel}>PrimaryButton (Arrow variant):</Text>
            <PrimaryButton label="Continue" onPress={() => {}} variant="arrow" />

            <Text style={styles.subLabel}>PrimaryButton (Check variant):</Text>
            <PrimaryButton label="Add to fridge" onPress={() => {}} variant="check" />

            <Text style={styles.subLabel}>PrimaryButton (Disabled state):</Text>
            <PrimaryButton label="Continue" onPress={() => {}} disabled variant="arrow" />

            <Text style={styles.subLabel}>Welcome CTA:</Text>
            <WelcomeCta onPress={() => {}} />

            <Text style={styles.subLabel}>TextButton:</Text>
            <TextButton label="Edit" onPress={() => {}} />
          </View>
        </View>

        {/* 6. StatusBadges */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, typography.label]}>6. StatusBadge</Text>
          <View style={styles.badgeRow}>
            <StatusBadge status="fresh" label="Fresh" />
            <StatusBadge status="expiringSoon" label="Expires in 2 days" />
            <StatusBadge status="expired" label="Expired" />
          </View>
        </View>

        {/* 7. ItemRow */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, typography.label]}>7. ItemRow</Text>
          <View style={styles.componentStack}>
            <ItemRow
              name="Tomato"
              catalogId="tomato"
              quantity={stepperVal}
              expiryDate="2026-12-25"
              compartment={activeCompartment}
              onPress={() => {}}
            />
            <ItemRow
              name="Green Peas"
              catalogId="green-peas"
              quantity={1}
              expiryDate="2026-10-18"
              compartment="freezer"
              onPress={() => {}}
            />
          </View>
        </View>

        {/* 8. EmptyState */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, typography.label]}>8. EmptyState</Text>
          <View style={[styles.emptyContainer, { backgroundColor: theme.surface }]}>
            <EmptyState
              compartment={activeCompartment}
              onAddItem={() => {}}
            />
          </View>
        </View>

        {/* 9. FridgeBase */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, typography.label]}>9. FridgeBase</Text>
          <FridgeBase />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
    paddingTop: Platform.OS === 'web' ? spacing.md : spacing.huge,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.rim.base,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    minHeight: 44,
  },
  backText: {
    color: colors.brand.forest,
  },
  galleryTitle: {
    color: colors.ink.title,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.huge * 2,
  },
  section: {
    marginBottom: spacing.xxl,
  },
  sectionHeading: {
    color: colors.ink.title,
    fontSize: 16,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subLabel: {
    color: colors.ink.helper,
    fontSize: 13,
    marginBottom: 4,
    marginTop: spacing.sm,
  },
  componentStack: {
    gap: spacing.sm,
  },
  switcherRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  switcherChip: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: radius.md,
    gap: spacing.xs,
  },
  chipText: {
    fontSize: 12,
    textAlign: 'center',
  },
  framePreview: {
    height: 180,
  },
  cavityPreview: {
    flex: 1,
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  cavityCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperCenter: {
    alignItems: 'center',
    width: '100%',
  },
  fieldLabel: {
    color: colors.ink.label,
    marginBottom: spacing.xs,
  },
  fieldSpacer: {
    height: spacing.md,
  },
  toggleRow: {
    marginTop: spacing.xs,
    alignItems: 'flex-end',
  },
  toggleErrorBtn: {
    padding: spacing.xs,
  },
  toggleErrorText: {
    fontSize: 12,
    color: colors.brand.forest,
    textDecorationLine: 'underline',
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  emptyContainer: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
});
