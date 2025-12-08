import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const getShoppingListModalStyle = ({
  colorScheme,
}: {
  colorScheme: keyof typeof Colors;
}) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? "light"].background,
      paddingTop: 24,
    },
    modal: {
      backgroundColor: "#B3E5FC",
      justifyContent: "center",
      paddingHorizontal: 18,
      paddingVertical: 12,
      shadowColor: "#000",
      shadowOffset: { width: 1, height: 3 },
      shadowOpacity: 0.6,
      elevation: 2,
      flexDirection: "column",
      minWidth: 200,
      maxWidth: 300,
      borderRadius: 0,
      width: "100%",
      height: "auto",
      minHeight: 200,
      maxHeight: 450,
      gap: 24,
      paddingTop: 24,
      paddingBottom: 24
    },
    input: {
      color: Colors[colorScheme ?? "light"].text,
      paddingTop: 16,
      paddingBottom: 16,
      paddingStart: 16,
      paddingEnd: 16,
      borderRadius: 32,
      fontSize: 16,
      backgroundColor: Colors[colorScheme ?? "light"].background,
    },
    button: {
      backgroundColor: Colors[colorScheme ?? "light"].primary,
      borderRadius: 24,
      paddingVertical: 12,
      paddingHorizontal: 32,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
    },
    buttonText: {
      color: Colors[colorScheme ?? "light"].text,
      fontWeight: "bold",
      fontSize: 16,
      letterSpacing: 1,
    },
    quantityInput:{
      display: "flex",
      flexDirection: "row",
      width: "100%",
      gap: 6
    }
  });
};
