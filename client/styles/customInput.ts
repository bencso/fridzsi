import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

//TODO: Több componens ugyanaz a style-al rendelkezik ezeket egyesíteni majd :)
export const getCustomInputStyles = ({
  scheme,
}: {
  scheme: keyof typeof Colors;
}) => {
  return StyleSheet.create({
    input: {
      color: Colors[scheme ?? "light"].text,
      paddingTop: 16,
      paddingBottom: 16,
      paddingStart: 10,
      borderWidth: 1,
      borderRadius: 100,
      fontSize: 16,
      borderColor: Colors[scheme ?? "light"].background,
      backgroundColor: Colors[scheme ?? "light"].background,
    },
    inputContainer: {
      display: "flex",
      gap: 16,
      justifyContent: "center",
    },
  });
};
