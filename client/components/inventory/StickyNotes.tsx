import { RefObject } from "react";
import { Animated } from "react-native";
import { ThemedText } from "../themed-text";
import { t } from "i18next";
import { Fonts } from "@/constants/theme";
import { ShoppingListItem } from "@/types/shoppinglist/noteClass";
import { useLanguage } from "@/contexts/language-context";

export default function StickyNote({ note, idx, noteRefs, styles }: {
    noteRefs: RefObject<{
        pan: Animated.ValueXY;
        panResponder: any;
    }[]>,
    note: ShoppingListItem,
    idx: number, styles: any
}) {
    const { Language } = useLanguage();

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
            <ThemedText style={{ fontSize: 18, fontWeight: "900", color: note.getColors().text, fontFamily: Fonts.bold, textOverflow: "clip", overflow: "hidden", maxWidth: 200 }}>
                {note.name}
            </ThemedText>
            <ThemedText style={{ fontSize: 15, marginTop: 8, color: note.getColors().text, fontFamily: Fonts.rounded }}>
                {note.quantity} {Language === "en" ? note.quantityUnitEn : note.quantityUnitHu}{t("shoppinglist.stickyNote")}
            </ThemedText>
        </Animated.View>
    )
}