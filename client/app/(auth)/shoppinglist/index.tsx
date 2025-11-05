import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/theme-context";
import { useTranslation } from "react-i18next";
import { Alert, Animated, PanResponder, View } from "react-native";
import { usePantry } from "@/contexts/pantry-context";
import { useCallback, useRef, useState } from "react";
import getNavbarStyles from "@/styles/navbar";
import { useFocusEffect } from "expo-router";
import { getShoppingListStyle } from "@/styles/shoppinglist";
import { DaysNextTwoMonth } from "@/components/main/DaysList";
import { Fonts } from "@/constants/theme";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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

  const noteRefs = useRef<{ pan: Animated.ValueXY; panResponder: any }[]>([]);

  if (noteRefs.current.length !== notes.length) {
    noteRefs.current = notes.map(() => {
      const pan = new Animated.ValueXY();
      const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: () => {
          Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false });
          Alert.alert(
            t('shoppinglist.deleteItem.title'),
            t('shoppinglist.deleteItem.message'),
            [
              {
                text: t('shoppinglist.deleteItem.cancel'),
                style: "cancel"
              },
              {
                text: t('shoppinglist.deleteItem.submit'),
                style: "default",
                onPress: async () => {

                }
              }
            ]
          );
        },
        onPanResponderRelease: () => {
          pan.extractOffset();
        }
      });
      return { pan, panResponder };
    });
  }


  return (
    <>
      <View style={navbarStyle.navbar}>
        <ThemedText type="title" style={navbarStyle.title}>
          {t("shoppinglist.title")}
        </ThemedText>
      </View>
      <ThemedView style={styles.container}>
        <DaysNextTwoMonth />
        <SafeAreaProvider>
          <SafeAreaView style={{ flexDirection: "row", justifyContent: "center", gap: 24, flexWrap: "wrap", marginTop: 24 }}>
            {notes.map((note, idx) => (
              <Animated.View
                key={note.id + "-" + idx}
                style={{
                  transform: [
                    { translateX: noteRefs.current[idx].pan.x },
                    { translateY: noteRefs.current[idx].pan.y },
                    { rotate: note.rotate }
                  ],
                  backgroundColor: note.color,
                  ...styles.stickyNote

                }}
                {...noteRefs.current[idx].panResponder.panHandlers}
              >
                <ThemedText style={{ fontSize: 18, fontWeight: "900", color: note.textColor, fontFamily: Fonts.bold }}>
                  {note.text}
                </ThemedText>
                <ThemedText style={{ fontSize: 15, marginTop: 8, color: note.textColor, fontFamily: Fonts.rounded }}>
                  {note.amount} {note.type}{t("shoppinglist.stickyNote")}
                </ThemedText>
              </Animated.View>
            ))}
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemedView>
    </>
  );
}