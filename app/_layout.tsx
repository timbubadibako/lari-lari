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

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
        <Stack.Screen name="index" />
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
