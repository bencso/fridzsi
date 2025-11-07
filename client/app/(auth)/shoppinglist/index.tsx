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
import { Note } from "@/constants/note.interface";
import { TFunction } from "i18next";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Fonts } from "@/constants/theme";
import AddShoppinglistModal from "@/components/inventory/AddShoppinglistModal";
import api from "@/interceptor/api";

type getItemDto = {
  amount: number;
  createdAt: string;
  customProductName: string | null;
  day: string;
  id: number;
}

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
  const [items, setItems] = useState<getItemDto[]>([]);
  useEffect(() => {
    async function getItemByDate() {
      const response = await api.get(`/shoppinglist/items/date/${selectedDay.date}`, { withCredentials: true });
      setItems(response.data);
    }
    getItemByDate()
  }, [selectedDay]);

  useFocusEffect(
    useCallback(() => {
      loadPantry();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );


  //TODO: Bekötni az APIt!
  useFocusEffect(
    useCallback(() => {
      function getRandomPosition() {
        const MAX = 3;
        const random = Math.random();
        const maximumFive = Math.floor(random * MAX);
        return `${random < 0.5 ? "-" : "+"}${maximumFive}deg`;
      }

      if(items){
        items.map((item: any)=>{
          console.log(item);
        })
      }

      setNotes([
        { id: 1, text: "Egész csirke", color: "#FFF9C4", textColor: "#795548", amount: 4, type: "db", rotate: getRandomPosition(), date: new Date() },
        { id: 2, text: "Krumpli", color: "#FFECB3", textColor: "#6D4C41", amount: .85, type: "kg", rotate: getRandomPosition(), date: new Date() },
        { id: 3, text: "Coca Cola", color: "#B3E5FC", textColor: "#01579B", amount: 1, type: "liter", rotate: getRandomPosition(), date: new Date() },
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
    `${t('shoppinglist.deleteItem.message')}${note.text}?`,
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