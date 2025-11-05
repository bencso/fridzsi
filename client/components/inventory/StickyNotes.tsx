import { RefObject } from "react";
import { Animated } from "react-native";
import { ThemedText } from "../themed-text";
import { t } from "i18next";
import { Fonts } from "@/constants/theme";
import { Note } from "@/constants/note.interface";

export default function StickyNote({ note, idx, noteRefs, styles }: {
    noteRefs: RefObject<{
        pan: Animated.ValueXY;
        panResponder: any;
    }[]>,
    note: Note,
    idx: number, styles: any
}) {
    return (
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
    )
}