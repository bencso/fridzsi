import { PantryProvider } from "@/contexts/pantry-context";
import { Stack } from "expo-router";

export default function ShoppinglistModifyLayout() {
  return (
    <PantryProvider>
      <Stack>
        <Stack.Screen name="deleteItem" options={{ headerShown: false }} />
        <Stack.Screen name="editItem" options={{ headerShown: false }} />
      </Stack>
    </PantryProvider>
  );
}