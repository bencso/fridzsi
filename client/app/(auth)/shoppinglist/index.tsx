import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/theme-context";
import { useTranslation } from "react-i18next";
import { Alert, View } from "react-native";
import { usePantry } from "@/contexts/pantry-context";
import { useCallback, useState } from "react";
import getNavbarStyles from "@/styles/navbar";
import { useFocusEffect } from "expo-router";
import { getShoppingListStyle } from "@/styles/shoppinglist";
import { DaysNextTwoMonth } from "@/components/main/DaysList";
import { Fonts } from "@/constants/theme";
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function ShoppingListScreen() {
  const { scheme: colorScheme } = useTheme();
  const { t } = useTranslation();
  const { loadPantry } = usePantry();
  const [notes, setNotes] = useState<{ id: number; text: string; color: string; textColor: string; amount: number; type: string; rotate: string; }[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadPantry();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const styles = getShoppingListStyle({ colorScheme });
  const navbarStyle = getNavbarStyles({ colorScheme });

  useFocusEffect(
    useCallback(() => {

      function getRandomPosition() {
        const MAX = 3;
        const oneOrNull = Math.random();
        const maximumFive = Math.floor(Math.random() * MAX);
        return `${oneOrNull < 0.5 ? "-" : "+"}${maximumFive}deg`;
      }

      setNotes([
        { id: 1, text: "Egész csirke", color: "#FFF9C4", textColor: "#795548", amount: 4, type: "db", rotate: getRandomPosition() },
        { id: 2, text: "Krumpli", color: "#FFECB3", textColor: "#6D4C41", amount: .85, type: "kg", rotate: getRandomPosition() },
        { id: 3, text: "Coca Cola", color: "#B3E5FC", textColor: "#01579B", amount: 1, type: "liter", rotate: getRandomPosition() },
      ]);
    }, [])
  )

  return (
    <>
      <View style={navbarStyle.navbar}>
        <ThemedText type="title" style={navbarStyle.title}>
          {t("shoppinglist.title")}
        </ThemedText>
      </View>
      <ThemedView style={styles.container}>
        <DaysNextTwoMonth />
            <GestureHandlerRootView>
          <View style={{ flexDirection: "row", justifyContent: "center", gap: 24, flexWrap: "wrap", marginTop: 24 }}>
            {notes.map((note, idx) => (
              <Swipeable
                key={note.id + "-" + idx}
                onSwipeableOpen={() => {
                  Alert.alert(
                    t("alerts.deleteItemTitle") || "Delete item",
                    t("alerts.deleteItemMessage") || "Are you sure you want to delete this item?",
                    [
                      { text: t("alerts.cancel") || "Cancel", style: "cancel" },
                      { text: t("alerts.ok") || "OK", onPress: () => {/* törlés logika */ } }
                    ]
                  );
                }}
              >
                <View
                  style={[
                    {
                      paddingHorizontal: 24,
                      paddingVertical: 24,
                      backgroundColor: note.color,
                      shadowColor: "#000",
                      shadowOffset: { width: 1, height: 3 },
                      shadowOpacity: 0.2,
                      elevation: 2,
                      flexDirection: "column",
                      alignItems: "flex-start",
                      gap: 10,
                      minWidth: 120,
                      maxWidth: 160,
                      marginBottom: 10,
                      borderRadius: 0,
                      transform: [{ rotate: note.rotate }],
                    },
                  ]}
                >
                  <ThemedText style={{ fontSize: 18, fontWeight: "900", color: note.textColor, fontFamily: Fonts.bold }}>
                    {note.text}
                  </ThemedText>
                  <ThemedText style={{ fontSize: 15, marginTop: 8, color: note.textColor, fontFamily: Fonts.rounded }}>
                    {note.amount} {note.type} {t("shoppinglist.stickyNote")}
                  </ThemedText>
                </View>
              </Swipeable>
            ))}
          </View>
        </GestureHandlerRootView>
      </ThemedView>
    </>
  );
}