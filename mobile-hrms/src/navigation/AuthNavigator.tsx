import React from 'react';
import { Stack } from 'expo-router';
import { COLORS } from '@constants/colors';

export const AuthNavigator: React.FC = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.background },
        animationEnabled: true,
      }}
    >
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
  );
};
