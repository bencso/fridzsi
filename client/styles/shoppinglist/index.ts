import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const getShoppingListStyle = ({
  colorScheme,
}: {
  colorScheme: keyof typeof Colors;
}) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? "light"].background,
    },
    stickyNote: {
      paddingHorizontal: 24,
      paddingVertical: 32,
      shadowColor: "#000",
      shadowOffset: { width: 1, height: 3 },
      shadowOpacity: 0.2,
      elevation: 2,
      flexDirection: "column",
      alignItems: "flex-start",
      gap: 1,
      minWidth: 120,
      maxWidth: 160,
      borderRadius: 0,
      width: 160,
      height: 150,
      minHeight: 120,
      maxHeight: 150,
    },
  });
};
