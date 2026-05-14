import { Stack } from "expo-router";
import { OrderProvider } from "../contexts/OrderContext";

export default function RootLayout() {
  return (
    <OrderProvider>
      <Stack initialRouteName="(dashboard)" screenOptions={{ headerShown: true }}>
        <Stack.Screen name="(dashboard)" />
        <Stack.Screen name="restaurant" />
        <Stack.Screen name="(auth)" />
      </Stack>
    </OrderProvider>
  );
}
