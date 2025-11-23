import { Colors, Fonts } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const getInventoryStyle = ({colorScheme} : {colorScheme: keyof typeof Colors}) =>{
   return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? "light"].background,
    },
    content: {
      padding: 12,
      paddingTop: 24,
      alignItems: "center",
      justifyContent: "center",
    },
    textContainer: {
      flexDirection: "row",
      gap: 12,
      alignItems: "center",
      alignContent: "center",
      marginVertical: 8,
    },
    productTitle: {
      fontWeight: "bold",
      fontSize: 18,
      textTransform: "uppercase",
      fontFamily: Fonts.bold,
      color: Colors[colorScheme ?? "light"].text,
      maxWidth: 300,
      textOverflow: "clip"
    },
    productSecond: {
      fontSize: 16,
      color: Colors[colorScheme ?? "light"].text,
    },
    productIcon: {
      width: 50,
      height: 50,
      borderRadius: "100%",
      justifyContent: "center",
      alignItems: "center",
      color: "white"
    },
    deleteButton: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 15,
      paddingRight: 15,
      backgroundColor: `${Colors[colorScheme??"light"].uncorrect}40`,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20
    },
    editButton: {
      paddingTop: 10,
      paddingBottom: 10,
      paddingLeft: 15,
      paddingRight: 15,
      backgroundColor: Colors[colorScheme??"light"].button,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 20
    },
    deleteButtonText:{
      color: Colors[colorScheme??"light"].buttomText,
    }
  });
}