// app/add/details.tsx
// Add Details screen matching Fridge_Tomato_Add_Item_Screen.png and UIUX.md Section 7.

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { isBefore, parseISO, startOfDay } from 'date-fns';
import { DateField } from '@/components/DateField';
import { FridgeFrame } from '@/components/FridgeFrame';
import { ItemShowcaseCavity } from '@/components/common/ItemShowcaseCavity';
import { NamePill } from '@/components/NamePill';
import { PrimaryButton } from '@/components/PrimaryButton';
import { QuantityStepper } from '@/components/QuantityStepper';
import { ScreenHeader } from '@/components/ScreenHeader';
import { COMPARTMENTS } from '@/data/compartments';
import { useDraftStore } from '@/store/draftStore';
import {
  colors,
  compartmentTheme,
  radius,
  spacing,
  typography,
} from '@/theme/tokens';

export default function DetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const catalogEntry = useDraftStore((state) => state.catalogEntry);
  const compartment = useDraftStore((state) => state.compartment) || 'veggies';
  const quantity = useDraftStore((state) => state.quantity);
  const expiryDate = useDraftStore((state) => state.expiryDate);

  const setQuantity = useDraftStore((state) => state.setQuantity);
  const setExpiryDate = useDraftStore((state) => state.setExpiryDate);

  const theme = compartmentTheme[compartment];
  const compartmentName = COMPARTMENTS[compartment].name;
  const itemName = catalogEntry?.name || 'Item';

  // Validation: Expiry date required and must not be in the past
  const isPastDate = expiryDate
    ? isBefore(startOfDay(parseISO(expiryDate)), startOfDay(new Date()))
    : false;
  const isValidDate = Boolean(expiryDate) && !isPastDate;

  const handleContinue = () => {
    if (isValidDate) {
      router.push('/add/review');
    }
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
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* 1. Header Pill (72 pt tall) with back chevron, 52 pt icon circle */}
            <ScreenHeader
              compartment={compartment}
              title={`Add to ${compartmentName}`}
              height={72}
              circleSize={52}
              showBack={true}
              onBack={handleBack}
              style={styles.headerPill}
            />

            {/* 2. Showcase Cavity (~258 pt) with interior light gradient, light strip, glass shelf */}
            <View style={styles.cavityWrapper}>
              <ItemShowcaseCavity
                compartment={compartment}
                itemName={itemName}
                catalogId={catalogEntry?.id}
                height={258}
                imageSize={180}
              />
            </View>

            {/* 3. Name Pill (60 pt) with centered item name */}
            <View style={styles.namePillWrapper}>
              <NamePill name={itemName} />
            </View>


            {/* 4. Form Panel with Quantity Stepper & Expiry Date Field */}
            <View
              style={[
                styles.formPanel,
                {
                  backgroundColor: theme.tint,
                },
              ]}
            >
              {/* 1 pt inner white border */}
              <View style={styles.formPanelBorder} pointerEvents="none" />

              {/* Quantity Label */}
              <Text style={[styles.quantityLabel, typography.label]}>
                Quantity
              </Text>

              {/* Stepper */}
              <View style={styles.stepperContainer}>
                <QuantityStepper
                  value={quantity}
                  onChange={setQuantity}
                  min={1}
                  max={99}
                />
              </View>

              {/* Expiry Date Field */}
              <View style={styles.dateFieldWrapper}>
                <DateField
                  value={expiryDate || undefined}
                  onChange={setExpiryDate}
                  label="Expiry date"
                  placeholder="DD / MM / YYYY"
                  error={isPastDate ? 'Pick today or a later date' : false}
                  helperText="We'll remind you before it expires."
                  suggestedDays={catalogEntry?.defaultShelfLifeDays}
                />
              </View>
            </View>

            {/* 5. Primary Button ("Continue") */}
            <View style={styles.buttonWrapper}>
              <PrimaryButton
                testID="details-continue-btn"
                label="Continue"
                variant="arrow"
                disabled={!isValidDate}
                onPress={handleContinue}
              />
            </View>
          </ScrollView>
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
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  headerPill: {
    marginBottom: 12,
  },
  cavityWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  namePillWrapper: {
    width: '100%',
    marginBottom: 12,
  },
  formPanel: {
    width: '100%',
    borderRadius: radius.lg, // 24
    padding: spacing.lg, // 16
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 16,
  },
  formPanelBorder: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  quantityLabel: {
    color: colors.ink.label,
    textAlign: 'center',
    marginBottom: spacing.xs, // 4
  },
  stepperContainer: {
    marginBottom: spacing.lg, // 16
  },
  dateFieldWrapper: {
    width: '100%',
  },
  buttonWrapper: {
    width: '100%',
    marginTop: 'auto',
  },
});
