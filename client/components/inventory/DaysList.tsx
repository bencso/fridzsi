import { Colors } from "@/constants/theme";
import getAuthenticatedIndexStyles from "@/styles/authenticatedIndex";
import { useTheme } from "@/contexts/theme-context";
import { useState, useCallback, useEffect, Dispatch, SetStateAction } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text";
import { usePantry } from "@/contexts/pantry-context";
import { useFocusEffect } from "expo-router";
import api from "@/interceptor/api";

export const DaysNextTwoMonth = ({ selectedDay, setSelectedDay }: {
    selectedDay: { date: Date }; setSelectedDay: Dispatch<SetStateAction<{
        date: Date;
    }>>
}) => {
    const { pantry, loadPantry } = usePantry();
    const { scheme: colorScheme } = useTheme();
    const styles = getAuthenticatedIndexStyles({ colorScheme });

    const [days, setDays] = useState<{ date: Date; }[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadPantry();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
    );

    useEffect(() => {
        const generatedItems: { date: Date }[] = [];

        async function getItem() {
            const response = await api.get("/shoppinglist/items/dates", { withCredentials: true });
            response.data.map((value: string) => {
                const date = new Date(value);
                generatedItems.push({
                    date: date
                });
                setDays(generatedItems);
                setSelectedDay(generatedItems[0]);
            })
        }

        getItem();
    }, [pantry]);

    return (
        <View style={{
            paddingLeft: 12,
            paddingRight: 12
        }}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {days && days.map(({ date }, index: number) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            setSelectedDay({
                                date: date
                            });
                        }}>
                        <View style={selectedDay.date === date ? styles.activeCard : styles.card}>
                            <View style={styles.cardTop}>
                                <ThemedText style={{
                                    color: Colors[colorScheme ?? "light"].text,
                                    fontSize: 12,
                                    marginBottom: 3
                                }}>{date.toLocaleDateString("en-us", { month: "short" })}</ThemedText>
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
                                        backgroundColor: selectedDay.date === date ? Colors[colorScheme ?? "light"].text : Colors[colorScheme ?? "light"].primary
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            fontSize: 18,
                                            textAlign: "center",
                                            padding: 0,
                                            color: selectedDay.date === date ? Colors[colorScheme ?? "light"].primary : Colors[colorScheme ?? "light"].text
                                        }}
                                    >
                                        {date.getDate()}
                                    </ThemedText>
                                </View>
                                <ThemedText style={{
                                    marginTop: 2,
                                }} type="defaultSemiBold">{date.toLocaleDateString("en-us", { weekday: "short" })}</ThemedText>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}
