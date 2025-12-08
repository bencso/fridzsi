import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";
import { getCustomInputStyles } from "@/styles/customInput";

export const getCameraCustomInputsStyle = ({
  scheme,
  disabledButton,
}: {
  scheme: keyof typeof Colors;
  disabledButton: boolean;
}) => {
  const inputStyle = getCustomInputStyles({ scheme });
  return StyleSheet.create({
    titleContainer: {
      flexDirection: "column",
      gap: 8,
    },
    input: {
      ...inputStyle.input,
      backgroundColor: Colors[scheme ?? "light"].border,
      borderColor: Colors[scheme ?? "light"].border,
    },
    inputContainer: {
      ...inputStyle.inputContainer,
    },
    mainContainer: {
      flex: 1,
      display: "flex",
      justifyContent: "center",
      gap: 24,
      paddingVertical: 40,
      paddingHorizontal: 24,
    },
    button: {
      alignItems: "center",
      backgroundColor: Colors[scheme ?? "light"].button,
      borderRadius: 40,
      padding: 15,
      paddingTop: 18,
      paddingBottom: 18,
      fontWeight: "bold",
      width: "100%",
      fontSize: 20,
      opacity: !disabledButton ? 1 : 0.7,
    },
    notHaveAccount: {
      display: "flex",
      flexDirection: "row",
      gap: 4,
      justifyContent: "center",
      alignItems: "center",
    },
    quantityInput: {
      display: "flex",
      flexDirection: "row",
      width: "100%",
      gap: 6,
    },
  });
};
