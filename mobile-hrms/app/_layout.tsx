import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '@context/AuthContext';
import { RootNavigator } from '@/src/navigation/RootNavigator';
import { COLORS } from '@constants/colors';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
