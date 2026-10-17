// app/fridge.tsx
// Virtual Fridge Home screen per UIUX.md Section 6 and reference images.

import React from 'react';
import {
  ActionSheetIOS,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  CompartmentPanel,
  FridgeBase,
  FridgeHeader,
} from '@/components';
import { getSampleItems } from '@/data/sampleData';
import { CompartmentId } from '@/domain/types';
import {
  selectItemsByCompartment,
  selectTotalCount,
  useFridgeStore,
} from '@/store/fridgeStore';
import { colors, elevation, radius, spacing } from '@/theme/tokens';

export default function FridgeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const items = useFridgeStore((state) => state.items);
  const resetAllForDev = useFridgeStore((state) => state.resetAllForDev);
  const seedSampleItemsForDev = useFridgeStore((state) => state.seedSampleItemsForDev);

  const totalCount = selectTotalCount(items);
  const freezerItems = selectItemsByCompartment(items, 'freezer');
  const packedItems = selectItemsByCompartment(items, 'packed');
  const veggiesItems = selectItemsByCompartment(items, 'veggies');

  const handleOpenCompartment = (id: CompartmentId) => {
    router.push(`/compartment/${id}`);
  };

  const handlePressAdd = () => {
    router.push('/add/pick');
  };

  const handleDevMenu = () => {
    if (!__DEV__) return;

    const options = [
      'Load Sample Data (UIUX Sec 6)',
      'Clear All Data',
      'Open Component Gallery',
      'Cancel',
    ];

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: 3,
          destructiveButtonIndex: 1,
          title: 'GROCIFY Dev Tools',
        },
        (buttonIndex) => {
          if (buttonIndex === 0) {
            seedSampleItemsForDev(getSampleItems());
          } else if (buttonIndex === 1) {
            resetAllForDev();
          } else if (buttonIndex === 2) {
            router.push('/_dev/gallery');
          }
        }
      );
    } else {
      Alert.alert(
        'GROCIFY Dev Tools',
        'Choose a development helper action:',
        [
          {
            text: 'Load Sample Data',
            onPress: () => seedSampleItemsForDev(getSampleItems()),
          },
          {
            text: 'Clear All Data',
            style: 'destructive',
            onPress: () => resetAllForDev(),
          },
          {
            text: 'Component Gallery',
            onPress: () => router.push('/_dev/gallery'),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          {
            paddingTop: Math.max(insets.top, spacing.xs),
            paddingBottom: Math.max(insets.bottom + spacing.sm, spacing.xl),
          },
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Compact Header (48 pt) */}
        <FridgeHeader
          totalCount={totalCount}
          onPressAdd={handlePressAdd}
          onLongPressWordmark={handleDevMenu}
        />

        {/* Outer Fridge Frame with 6 pt Silver Rim */}
        <View style={styles.fridgeFrameContainer}>
          <View style={[styles.outerRim, elevation.elevFridge]}>
            {/* 1 pt inner white highlight ring */}
            <View style={styles.innerHighlightRing} pointerEvents="none" />

            {/* Stacked Compartments */}
            <View style={styles.compartmentsStack}>
              {/* 1. Freezer Compartment */}
              <CompartmentPanel
                compartment="freezer"
                name="Freezer"
                items={freezerItems}
                onPress={() => handleOpenCompartment('freezer')}
                isFirst={true}
              />

              {/* 6 pt Glass Divider */}
              <View style={styles.glassDivider} pointerEvents="none">
                <View style={styles.dividerTopLine} />
                <View style={styles.dividerBase} />
              </View>

              {/* 2. Packed & Miscellaneous Compartment */}
              <CompartmentPanel
                compartment="packed"
                name="Packed & Misc"
                items={packedItems}
                onPress={() => handleOpenCompartment('packed')}
              />

              {/* 6 pt Glass Divider */}
              <View style={styles.glassDivider} pointerEvents="none">
                <View style={styles.dividerTopLine} />
                <View style={styles.dividerBase} />
              </View>

              {/* 3. Veggies Compartment */}
              <CompartmentPanel
                compartment="veggies"
                name="Veggies"
                items={veggiesItems}
                onPress={() => handleOpenCompartment('veggies')}
              />
            </View>

            {/* Fridge Base with Grille and Feet */}
            <FridgeBase />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  fridgeFrameContainer: {
    paddingHorizontal: 12,
    marginTop: spacing.xs,
    flex: 1,
  },
  outerRim: {
    borderRadius: radius.xl, // 28
    borderWidth: 6,
    borderTopColor: colors.rim.light,
    borderLeftColor: colors.rim.base,
    borderRightColor: colors.rim.base,
    borderBottomColor: colors.rim.shadow,
    backgroundColor: colors.canvas,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 640,
  },
  innerHighlightRing: {
    ...StyleSheet.absoluteFill,
    borderRadius: radius.xl - 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.7)',
    margin: 1,
    zIndex: 10,
  },
  compartmentsStack: {
    flex: 1,
    width: '100%',
  },
  glassDivider: {
    height: 6,
    width: '100%',
    backgroundColor: colors.rim.base,
    position: 'relative',
  },
  dividerTopLine: {
    height: 1.5,
    width: '100%',
    backgroundColor: colors.rim.light,
  },
  dividerBase: {
    height: 4.5,
    width: '100%',
    backgroundColor: 'rgba(201, 208, 208, 0.85)',
  },
});
