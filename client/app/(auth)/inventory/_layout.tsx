import { Colors } from "@/constants/theme";
import { PantryProvider } from "@/contexts/pantry-context";
import { useTheme } from "@/contexts/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

export default function InventoryLayout() {
  const { scheme } = useTheme();
  return (
    <PantryProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="modify" options={{
          headerShown: true,
          title: "",
          presentation: "modal",
          headerLeft: () => (
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 5,
              }}
              onPress={() => {
                router.back();
              }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={Colors[scheme ?? "light"].text}
              />
            </TouchableOpacity>
          ), 
          animation: "simple_push"
        }} />
      </Stack>
    </PantryProvider>
  );
}