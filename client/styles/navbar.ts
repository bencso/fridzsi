import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export default function getNavbarStyles({
  colorScheme,
}: {
  colorScheme: keyof typeof Colors;
}) {
  return StyleSheet.create({
    navbar: {
      flexDirection: "column",
      paddingTop: 48,
      paddingLeft: 20,
      paddingRight: 20,
    },
    title: {
      maxWidth: "80%",
      color: `${Colors[colorScheme ?? "light"].text}`,
    },
  });
}
