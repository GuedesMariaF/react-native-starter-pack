import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ToastProviderWithViewport } from '@/components/ui';
import { queryClient } from '@/lib/query-client';
import { ThemeProvider } from '@/lib/theme';
import { useAuthStore } from '@/stores/auth-store';

SplashScreen.setOptions({
  duration: 2000,
  fade: true,
});

function RootNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  useEffect(() => {
    useAuthStore.getState().bootstrap();
  }, []);

  if (isLoading) {
    return (
      <View>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(protected)" />
      </Stack.Protected>

      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="sign-in" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProviderWithViewport>
            <RootNavigator />
            <StatusBar style="auto" />
          </ToastProviderWithViewport>
        </QueryClientProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
