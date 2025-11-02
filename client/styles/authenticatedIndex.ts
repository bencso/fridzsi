import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export default function getAuthenticatedIndexStyles({
  colorScheme,
}: {
  colorScheme: keyof typeof Colors;
}) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? "light"].background,
    },
    content: {
      gap: 12,
    },
    buttons: {
      flexDirection: "row",
      alignItems: "center",
      color: Colors[colorScheme ?? "light"].text,
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: Colors[colorScheme ?? "light"].neutral + "CC",
      borderRadius: 12,
      fontSize: 16,
      backgroundColor: `${Colors[colorScheme ?? "light"].primary}10`,
    },
    settingGroup: {
      gap: 28,
      backgroundColor: `${Colors[colorScheme ?? "light"].tabIconDefault}`,
      padding: 18,
      borderEndStartRadius: 32,
      borderEndEndRadius: 32,
    },
    title: {
      maxWidth: "80%",
      color: `${Colors[colorScheme ?? "light"].background}`,
    },
    topBar: {
      flexDirection: "column",
      gap: 12,
      color: Colors[colorScheme ?? "light"].text,
      backgroundColor: Colors[colorScheme ?? "light"].background,
      paddingHorizontal: 16,
      borderRadius: 24,
      fontSize: 16,
      overflow: "scroll",
      maxHeight: 180,
    },
    topBarItem: {
      flexDirection: "row",
      width: "100%",
      padding: 12,
      paddingTop: 20,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorScheme ?? "light"].border,
      borderRadius: 12,
      alignItems: "center",
      justifyContent: "space-between",
    },
    topBarItemPicture: {
      width: 50,
      height: 50,
      backgroundColor: "black",
      borderRadius: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
    card: {
      width: 70,
      paddingVertical: 15,
      borderRadius: 120,
      backgroundColor: Colors[colorScheme ?? "light"].background,
      marginHorizontal: 6,
      elevation: 1,
    },
    activeCard: {
      width: 70,
      paddingVertical: 15,
      borderRadius: 120,
      backgroundColor: Colors[colorScheme ?? "light"].primary,
      marginHorizontal: 6,
      elevation: 1,
    },
    cardTop: {
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      paddingVertical: 2,
      paddingHorizontal: 5,
    },
    flexRow: { flexDirection: "row", gap: 16, alignItems: "center" },
    amountText: { fontSize: 14, color: Colors[colorScheme ?? "light"].text },
  });
}
