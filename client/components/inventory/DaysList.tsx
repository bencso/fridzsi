import { Colors } from "@/constants/theme";
import getAuthenticatedIndexStyles from "@/styles/authenticatedIndex";
import { useTheme } from "@/contexts/theme-context";
import { useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text";
import { usePantry } from "@/contexts/pantry-context";
import { useLanguage } from "@/contexts/language-context";
import { useShoppingList } from "@/contexts/shoppinglist-context";

export const DaysNextTwoMonth = () => {
    const { Language } = useLanguage();
    const { pantry } = usePantry();
    const { scheme: colorScheme } = useTheme();
    const styles = getAuthenticatedIndexStyles({ colorScheme });
    const { selectedDay, changeDateItem, getItemDates, shoppingListDays } = useShoppingList();


    useEffect(() => {
        getItemDates();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pantry]);

    return (
        <View style={{
            marginTop: 24,
            paddingLeft: 12,
            paddingRight: 12
        }}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {shoppingListDays && shoppingListDays.map(({ date }, index: number) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            changeDateItem({ date });
                        }}>
                        <View style={selectedDay?.date.getDate() === date.getDate() ? styles.activeCard : styles.card}>
                            <View style={styles.cardTop}>
                                <ThemedText style={{
                                    color: Colors[colorScheme ?? "light"].text,
                                    fontSize: 12,
                                    marginBottom: 3
                                }}>{date.toLocaleDateString(Language === "en" ? "en-us" : "hu-hu", { month: "short" })}</ThemedText>
                                <View
                                    style={{
                                        width: 30,
                                        height: 30,
                                        borderRadius: 15,
                                        borderWidth: 1,
                                        borderColor: Colors[colorScheme ?? "light"].text,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginTop: 3,
                                        alignSelf: "center",
                                        backgroundColor: selectedDay?.date.getDate() === date.getDate() ? Colors[colorScheme ?? "light"].text : Colors[colorScheme ?? "light"].primary
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            fontSize: 18,
                                            textAlign: "center",
                                            padding: 0,
                                            color: selectedDay?.date.getDate() === date.getDate() ? Colors[colorScheme ?? "light"].primary : Colors[colorScheme ?? "light"].text
                                        }}
                                    >
                                        {date.getDate()}
                                    </ThemedText>
                                </View>
                                <ThemedText style={{
                                    marginTop: 2,
                                }} type="defaultSemiBold">
                                    {date.toLocaleDateString(Language === "en" ? "en-us" : "hu-hu", { weekday: "short" })}</ThemedText>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}
