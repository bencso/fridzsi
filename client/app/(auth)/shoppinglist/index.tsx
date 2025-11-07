import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/theme-context";
import { useTranslation } from "react-i18next";
import { Alert, Animated, PanResponder, TouchableHighlight, View } from "react-native";
import { usePantry } from "@/contexts/pantry-context";
import { useCallback, useEffect, useRef, useState } from "react";
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
import api from "@/interceptor/api";
import { Note } from "@/types/noteClass";

export default function ShoppingListScreen() {
  const { scheme: colorScheme } = useTheme();
  const { t } = useTranslation();
  const { loadPantry } = usePantry();
  const [notes, setNotes] = useState<Note[]>([]);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const styles = getShoppingListStyle({ colorScheme });
  const navbarStyle = getNavbarStyles({ colorScheme });

  const noteRefs = useRef<{ pan: Animated.ValueXY; panResponder: any }[]>([]);

  const [selectedDay, setSelectedDay] = useState<{
    date: Date
  }>({
    date: new Date()
  });

  async function getItemByDate() {
    const response = await api.get(`/shoppinglist/items/date/${selectedDay.date}`, { withCredentials: true });
    const responseData = response.data;
    if (Array.isArray(responseData)) {
      const newItems = responseData.map((data: { customproductname: string; product_quantity_metric: string | null; product_product_name: string | null; shoppinglist_amount: number; shoppinglist_day: Date; shoppinglist_id: number }) => {
        const name = data.product_product_name !== null ? data.product_product_name : data.customproductname;
        return new Note(data.shoppinglist_id, name, data.shoppinglist_amount, data.product_quantity_metric || "x", data.shoppinglist_day);
      });
      setNotes(newItems);
    }
  }

  useEffect(() => {
    getItemByDate()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDay]);

  useFocusEffect(
    useCallback(() => {
      loadPantry();
       getItemByDate();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

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
        <DaysNextTwoMonth selectedDay={selectedDay} setSelectedDay={setSelectedDay} />
        <SafeAreaProvider>
          <SafeAreaView style={{ flexDirection: "row", justifyContent: "center", gap: 24, flexWrap: "wrap", marginTop: 24 }}>
            {notes.map((note: Note, idx: number) => (
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
      </ThemedView>
    </>
  );
}

function deleteAlert({ t, note }: { t: TFunction<"translation", undefined>, note: Note }) {
  return Alert.alert(
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
        onPress: async () => {

        }
      }
    ]
  );
}