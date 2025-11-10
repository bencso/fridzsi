import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/theme-context";
import { useTranslation } from "react-i18next";
import { Alert, Animated, PanResponder, ScrollView, TouchableHighlight, View } from "react-native";
import { useCallback, useRef, useState } from "react";
import getNavbarStyles from "@/styles/navbar";
import { useFocusEffect } from "expo-router";
import { getShoppingListStyle } from "@/styles/shoppinglist";
import { DaysNextTwoMonth } from "@/components/inventory/DaysList";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import StickyNote from "@/components/inventory/StickyNotes";
import { TFunction } from "i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fonts } from "@/constants/theme";
import AddShoppinglistModal from "@/components/inventory/AddShoppinglistModal";
import { useShoppingList } from "@/contexts/shoppinglist-context";
import { ShoppingListItem } from "@/types/noteClass";

export default function ShoppingListScreen() {
  const { scheme: colorScheme } = useTheme();
  const { t } = useTranslation();
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const styles = getShoppingListStyle({ colorScheme });
  const navbarStyle = getNavbarStyles({ colorScheme });
  const { getFirstDate, shoppingList, deleteItem } = useShoppingList();

  const noteRefs = useRef<{ pan: Animated.ValueXY; panResponder: any }[]>([]);

  //TODO: Automatikusan majd törölni ha lejárt a nap, minden első lépésnél akár
  //TODO: IDŐZÓNA hiba a JS datekezeléssel szóval kell majd egy jó dátumkezelés :)
  useFocusEffect(
    useCallback(() => {
      getFirstDate();
    }, [])
  );

  if (noteRefs.current.length !== shoppingList.length) {
    noteRefs.current = shoppingList.map((note: ShoppingListItem) => {
      const pan = new Animated.ValueXY();
      const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: () => {
          Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false });
          deleteAlert({ t, note, deleteItem })
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
      <ThemedView style={styles.container}>
        <ScrollView
          bounces={false}
          overScrollMode="never"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          fadingEdgeLength={0}
        >
          <View style={navbarStyle.navbar}>
            <ThemedText type="title" style={navbarStyle.title}>
              {t("shoppinglist.title")}
            </ThemedText>
          </View>
          <DaysNextTwoMonth />
          <SafeAreaProvider>
            <SafeAreaView style={{ flexDirection: "row", justifyContent: "center", gap: 24, flexWrap: "wrap", marginTop: 24 }}>
              {shoppingList.map((note: ShoppingListItem, idx: number) => (
                <StickyNote noteRefs={noteRefs} note={note} idx={idx} styles={styles} key={note.id + "-" + idx} />
              ))}
              <AddShoppinglistModal isOpen={addModalOpen} setIsOpen={setAddModalOpen} />
              <TouchableHighlight
                style={{
                  backgroundColor: "#B3E5FC",
                  ...styles.stickyNote,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setAddModalOpen(true);
                }}
                underlayColor="#B3E5FC"
              >
                <ThemedText style={{ fontWeight: "900", color: "#01579B", fontFamily: Fonts.bold }}>
                  <MaterialCommunityIcons size={50} name="plus" />
                </ThemedText>
              </TouchableHighlight>
            </SafeAreaView>
          </SafeAreaProvider>
        </ScrollView>
      </ThemedView>
    </>
  );
}

const deleteAlert = ({
  t,
  note,
  deleteItem,
}: {
  t: TFunction<"translation", undefined>;
  note: ShoppingListItem;
  deleteItem: (params: { id: number; amount: number }) => Promise<void>;
}) => {
  Alert.prompt(
    t('shoppinglist.deleteItem.title'),
    `${t('shoppinglist.deleteItem.message')}${note.name}?`,
    [
      {
        text: t('shoppinglist.deleteItem.cancel'),
        style: "cancel"
      },
      {
        text: t('shoppinglist.deleteItem.submit'),
        style: "default",
        onPress: async (text: any) => {
          try {
            await deleteItem({ id: Number(note.id), amount: Number(text) });
          } catch (error: any) {
            console.error(error);
          }
        }
      }
    ],
    "plain-text"
  );
}