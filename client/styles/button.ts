import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const getButtonStyles = ({scheme, disabled}:{scheme: keyof typeof Colors, disabled: boolean}) =>
  StyleSheet.create({
    button: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      borderRadius: 40,
      fontWeight: "bold",
      fontSize: 20,
      justifyContent: "space-between",
      backgroundColor: `${Colors[scheme ?? "light"].button}`,
      opacity: !disabled ? 1 : 0.7,
      paddingHorizontal: 20,
      paddingVertical: 14
    },
    row:{
      display: "flex",
      flexDirection: "row",
      alignItems: "center"
    },
    chevron: {
      opacity: 0.9,
      marginLeft: 12
    },
    icon: {
      marginRight: 20,
    },
  });
