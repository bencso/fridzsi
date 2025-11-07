import { Colors } from "@/constants/theme";
import { PantryProvider } from "@/contexts/pantry-context";
import { useTheme } from "@/contexts/theme-context";
import { Stack } from "expo-router";

export default function ShoppingListLayout() {
  const { scheme } = useTheme();
  return (
    <PantryProvider>
      <Stack>
        <Stack.Screen name="index" options={{
          headerShown: false, contentStyle: {
            backgroundColor: Colors[scheme ?? "light"].background,
          }
        }} />
      </Stack>
    </PantryProvider>
  );
}