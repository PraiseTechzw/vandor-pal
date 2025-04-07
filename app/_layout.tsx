import { Colors } from '@/constants/Colors';
import { Stack } from 'expo-router';
import React from 'react';
import { useColorScheme } from 'react-native';
import { CurrencyProvider } from '@/contexts/CurrencyContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <CurrencyProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors[colorScheme ?? 'light'].background,
          },
          headerTintColor: Colors[colorScheme ?? 'light'].text,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </CurrencyProvider>
  );
}