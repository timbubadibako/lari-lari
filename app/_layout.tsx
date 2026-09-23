import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";

import { ThemeProvider } from '@/lib/theme-context';
import { PortalHost } from '@rn-primitives/portal';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// Keep the splash screen visible while we fetch the session
// Safely prevent auto hide to avoid uncaught promise rejections
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();

  const [fontsLoaded] = useFonts({
    'DMSerifDisplay-Regular': require('../assets/fonts/DMSerifDisplay-Regular.ttf'),
    'DMSerifDisplay-Italic': require('../assets/fonts/DMSerifDisplay-Italic.ttf'),
    'Poppins-Light': require('../assets/fonts/Poppins-Light.ttf'),
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'JetBrainsMono': require('../assets/fonts/Poppins-Regular.ttf'), // Fallback for now if mono is needed
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitialized(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!isInitialized || !navigationState?.key || !fontsLoaded) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      router.replace('/auth');
    } else if (session && inAuthGroup) {
      router.replace('/');
    }

    // Hide splash screen safely
    SplashScreen.hideAsync().catch(() => {
      // ignore
    });
  }, [session, segments, isInitialized, navigationState?.key, fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // WE MUST ALWAYS RETURN <Stack> IN EXPO ROUTER v3
  // Returning a View/ActivityIndicator destroys the Navigation Context
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="auth" />
          <Stack.Screen name="history/index" />
          <Stack.Screen name="territory/index" />
          <Stack.Screen name="profile/index" />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <PortalHost />
        <StatusBar style="light" />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
