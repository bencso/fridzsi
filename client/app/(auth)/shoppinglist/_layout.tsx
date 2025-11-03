import { PantryProvider } from "@/contexts/pantry-context";
import { Stack } from "expo-router";

export default function ShoppingListLayout() {
  return (
    <PantryProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </PantryProvider>
  );
}