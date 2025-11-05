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
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import StickyNote from "@/components/inventory/StickyNotes";
import { Note } from "@/constants/note.interface";
import { TFunction } from "i18next";


export default function ShoppingListScreen() {
  const { scheme: colorScheme } = useTheme();
  const { t } = useTranslation();
  const { loadPantry } = usePantry();
  const [notes, setNotes] = useState<Note[]>([]);

  const styles = getShoppingListStyle({ colorScheme });
  const navbarStyle = getNavbarStyles({ colorScheme });

  const noteRefs = useRef<{ pan: Animated.ValueXY; panResponder: any }[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadPantry();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );


  //TODO: API integráció késöbbiekben!
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

  if (noteRefs.current.length !== notes.length) {
    noteRefs.current = notes.map((note: Note) => {
      const pan = new Animated.ValueXY();
      const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: () => {
          Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false });
          deleteAlert({ t: t, note: note })
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
            {notes.map((note: Note, idx: number) => (
              <StickyNote noteRefs={noteRefs} note={note} idx={idx} styles={styles} key={note.id + "-" + idx} />
            ))}
          </SafeAreaView>
        </SafeAreaProvider>
      </ThemedView>
    </>
  );
}

function deleteAlert({ t, note }: { t: TFunction<"translation", undefined>, note: Note }) {
  return Alert.alert(
    t('shoppinglist.deleteItem.title'),
    `${t('shoppinglist.deleteItem.message')}: ${note.text}`,
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
}