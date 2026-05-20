import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import "../global.css";

import { ThemeProvider } from '@/lib/theme-context';

import { PortalHost } from '@rn-primitives/portal';

export const unstable_settings = {
  // Ensure any route can be accessed
  initialRouteName: 'index',
};

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSegments } from 'expo-router';

export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    const inAuthGroup = segments[0] === 'auth';

    if (!session && !inAuthGroup) {
      // Redirect to login if not logged in
      router.replace('/auth');
    } else if (session && inAuthGroup) {
      // Redirect to home if logged in and trying to access auth
      router.replace('/');
    }
  }, [session, segments]);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="history/index" />
        <Stack.Screen name="regu/index" />
        <Stack.Screen name="profile/index" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <PortalHost />
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
