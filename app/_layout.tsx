// app/_layout.tsx
// Root layout: font loading, splash screen management, store hydration, and stack configuration.

import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Stack, usePathname, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Notifications from 'expo-notifications';
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
  const pathname = usePathname();
  const hydrated = useFridgeStore((state) => state.hydrated);
  const hasSeenWelcome = useFridgeStore((state) => state.settings.hasSeenWelcome);
  const reconcileNotifications = useFridgeStore((state) => state.reconcileNotifications);

  const [fontsLoaded] = useFonts({
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
    Figtree_800ExtraBold,
  });

  const isReady = fontsLoaded && hydrated;

  // On Web, automatically blur focused descendants when routes change or when ancestors receive aria-hidden="true"
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof document === 'undefined') return;

    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'aria-hidden'
        ) {
          const target = mutation.target as HTMLElement;
          if (
            target &&
            target.getAttribute('aria-hidden') === 'true' &&
            document.activeElement &&
            target.contains(document.activeElement)
          ) {
            (document.activeElement as HTMLElement)?.blur?.();
          }
        }
      }
    });

    observer.observe(document.body, {
      attributes: true,
      subtree: true,
      attributeFilter: ['aria-hidden'],
    });

    return () => {
      observer.disconnect();
    };
  }, [pathname]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync().catch(() => {
        /* ignore */
      });
      // Reconcile reminders on launch after store hydration per TRD section 8
      reconcileNotifications().catch(() => {
        /* ignore */
      });
    }
  }, [isReady, reconcileNotifications]);

  // Notification tap interaction & deep linking (TRD section 8 & Kickoff Task 3)
  useEffect(() => {
    if (Platform.OS === 'web') return;

    function handleNotificationResponse(response: Notifications.NotificationResponse) {
      const compartment = response?.notification?.request?.content?.data?.compartment;
      if (
        compartment === 'freezer' ||
        compartment === 'packed' ||
        compartment === 'veggies'
      ) {
        router.push(`/compartment/${compartment}`);
        Notifications.clearLastNotificationResponseAsync().catch(() => {});
      }
    }

    // 1. Initial notification response (app opened from closed state via notification tap)
    Notifications.getLastNotificationResponseAsync()
      .then((response) => {
        if (response) {
          handleNotificationResponse(response);
        }
      })
      .catch(() => {});

    // 2. Active notification response listener
    const subscription = Notifications.addNotificationResponseReceivedListener(
      handleNotificationResponse
    );

    return () => {
      subscription.remove();
    };
  }, [router]);

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
