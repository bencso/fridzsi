import { Colors } from "@/constants/theme";
import { PantryProvider } from "@/contexts/pantry-context";
import { useTheme } from "@/contexts/theme-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { TouchableOpacity } from "react-native";

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
              <MaterialCommunityIcons
                name="chevron-left"
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