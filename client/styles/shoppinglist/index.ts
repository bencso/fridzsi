import { Colors } from "@/constants/theme";
import { StyleSheet } from "react-native";

export const getShoppingListStyle = ({colorScheme} : {colorScheme: keyof typeof Colors}) =>{
   return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors[colorScheme ?? "light"].background,
    },
  });
}