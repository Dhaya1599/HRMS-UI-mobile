import { Stack } from 'expo-router';
import { COLORS } from '@constants/colors';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
        cardStyle: {
          backgroundColor: COLORS.background,
        },
      }}
    >
      <Stack.Screen name="login" />
    </Stack>
  );
}
