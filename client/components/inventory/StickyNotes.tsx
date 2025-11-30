import { RefObject } from "react";
import { Animated, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text";
import { t } from "i18next";
import { Colors, Fonts } from "@/constants/theme";
import { ShoppingListItem } from "@/types/shoppinglist/noteClass";
import { useLanguage } from "@/contexts/language-context";
import { ThemedView } from "../themed-view";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "@/contexts/theme-context";
import { useShoppingList } from "@/contexts/shoppinglist-context";
import { deleteAlert } from "../shoppinglist/deleteAlert";

export default function StickyNote({ note, idx, noteRefs, styles, editMode }: {
    noteRefs: RefObject<{
        pan: Animated.ValueXY;
        panResponder: any;
    }[]>,
    note: ShoppingListItem,
    idx: number,
    styles: any,
    editMode: any
}) {
    const { Language } = useLanguage();
    const { scheme } = useTheme();
    const { deleteItem } = useShoppingList();

    return (
        <Animated.View
            key={note.id + "-" + idx}
            style={{
                transform: [
                    { translateX: noteRefs.current[idx].pan.x },
                    { translateY: noteRefs.current[idx].pan.y },
                    { rotate: note.getPosition() }
                ],
                backgroundColor: note.getColors().bg,
                ...styles.stickyNote
            }}
            {...noteRefs.current[idx].panResponder.panHandlers}
        >
            {
                editMode !== note.id && <><ThemedText style={{ fontSize: 18, fontWeight: "900", color: note.getColors().text, fontFamily: Fonts.bold, textOverflow: "clip", overflow: "hidden", maxWidth: 200 }}>
                    {note.name}
                </ThemedText><ThemedText style={{ fontSize: 15, marginTop: 8, color: note.getColors().text, fontFamily: Fonts.rounded }}>
                        {note.quantity} {Language === "en" ? note.quantityUnitEn : note.quantityUnitHu}{t("shoppinglist.stickyNote")}
                    </ThemedText></>
            }
            {
                editMode === note.id && <ThemedView style={{
                    ...styles.noteContainer
                }}><ThemedText style={{ fontSize: 14, fontWeight: "900", color: note.getColors().text, fontFamily: Fonts.bold, textOverflow: "clip", overflow: "hidden", maxWidth: 200 }}>
                        {note.name}
                    </ThemedText>
                    <ThemedView style={{
                        ...styles.buttonsContainer
                    }}>
                        <TouchableOpacity style={{
                            ...styles.noteManipulationBtn
                        }} onPress={() => { }}>
                            <MaterialCommunityIcons name="pen" size={20} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                            ...styles.noteManipulationBtn,
                            backgroundColor: Colors[scheme ?? "light"].uncorrect
                        }} onPress={() => {
                            deleteAlert({ t, note, deleteItem });
                        }}>
                            <MaterialCommunityIcons name="trash-can" color={Colors[scheme ?? "light"].background} size={20} />
                        </TouchableOpacity>
                    </ThemedView>
                </ThemedView>
            }
        </Animated.View>
    )
}