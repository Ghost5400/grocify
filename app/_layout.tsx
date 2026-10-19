// app/_layout.tsx
// Root layout: font loading, splash screen management, store hydration, and stack configuration.

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
  Figtree_800ExtraBold,
} from '@expo-google-fonts/figtree';
import { useFridgeStore } from '@/store/fridgeStore';
import { colors } from '@/theme/tokens';

// Keep the splash screen visible while loading fonts and rehydrating persisted store
SplashScreen.preventAutoHideAsync().catch(() => {
  /* ignore */
});

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const hydrated = useFridgeStore((state) => state.hydrated);
  const hasSeenWelcome = useFridgeStore((state) => state.settings.hasSeenWelcome);

  const [fontsLoaded] = useFonts({
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
    Figtree_800ExtraBold,
  });

  const isReady = fontsLoaded && hydrated;

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {
        /* ignore */
      });
    }
  }, [isReady]);

  // Launch routing logic
  useEffect(() => {
    if (!isReady) return;

    const firstSegment = (segments as string[])[0];
    const inWelcome = !firstSegment || firstSegment === 'index';
    if (hasSeenWelcome && inWelcome) {
      // User has already seen welcome screen, direct to fridge
      router.replace('/fridge');
    }
  }, [isReady, hasSeenWelcome, segments, router]);

  if (!isReady) {
    return <View style={styles.splashFill} />;
  }

  return (
    <GestureHandlerRootView style={styles.rootView}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.canvas },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" options={{ animation: 'fade' }} />
        <Stack.Screen name="fridge" options={{ animation: 'fade' }} />
        <Stack.Screen name="compartment/[id]" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="add/pick" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="add/details" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="add/review" options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="_dev/gallery" options={{ animation: 'slide_from_bottom' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  splashFill: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  rootView: {
    flex: 1,
  },
});
