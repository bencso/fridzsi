import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const getEditModalStyle = ({
  colorScheme,
}: {
  colorScheme: keyof typeof Colors;
}) => {
  return StyleSheet.create({
    modalContainer: {
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.7)",
      flex: 1,
      gap: 12,
    },
    modal: {
      justifyContent: "center",
      paddingHorizontal: 18,
      paddingVertical: 12,
      elevation: 2,
      flexDirection: "column",
      borderRadius: 0,
      width: "100%",
      height: "100%",
      minHeight: 200,
      maxHeight: 300,
      gap: 24,
      bottom: 0,
      position: "absolute",
      left: 0,
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32,
      backgroundColor: "white",
    },
    input: {
      color: Colors[colorScheme ?? "light"].text,
      paddingTop: 16,
      paddingBottom: 16,
      paddingStart: 16,
      paddingEnd: 16,
      borderRadius: 32,
      fontSize: 16,
      flex: 1,
      backgroundColor: Colors[colorScheme ?? "light"].border,
    },
    quantityInput: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      gap: 6,
    },
  });
};
