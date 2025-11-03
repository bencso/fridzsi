import { Colors } from "@/constants/theme";
import getAuthenticatedIndexStyles from "@/styles/authenticatedIndex";
import { useTheme } from "@/contexts/theme-context";
import { useState, useCallback } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { ThemedText } from "../themed-text";
import { usePantry } from "@/contexts/pantry-context";
import { useFocusEffect } from "expo-router";
import { PantryType } from "@/types/pantryType";

export const DaysNextTwoMonth = () => {
    const [selectedDay, setSelectedDay] = useState<{
        month: string;
        numberDay: number;
    }>({
        month: "",
        numberDay: 0
    });
    const { pantry, loadPantry } = usePantry();
    const { scheme: colorScheme } = useTheme();
    const styles = getAuthenticatedIndexStyles({ colorScheme });

    const [days, setDays] = useState<{ nameDay: string; numberDay: number; month: string; }[]>([]);

    // const nowYear = new Date().getFullYear();
    // const nowMonth = new Date().getMonth();
    // const nextMonth = new Date().getMonth() + 1;
    // const nowDay = new Date().getDate();
    // const nowDays = new Date(nowYear, nowMonth, 0).getDate();
    // const nextMonthDays = new Date(nowYear, nextMonth, 0).getDate();

    useFocusEffect(
        useCallback(() => {
            const generatedItems: { nameDay: string; numberDay: number; month: string; }[] = [];

            loadPantry();
            pantry.flatMap((pantryItem: PantryType) => {
                pantryItem.expiredAt.map((value: string) => {
                    const [year, month, day] = value.split('.')
                        .map(s => s.trim())
                        .filter(Boolean);
                    const date = new Date(Number(year), Number(month) - 1, Number(day));
                    generatedItems.push({
                        month: date.toLocaleDateString("en-us", { month: "short" }),
                        nameDay: date.toLocaleDateString("en-us", { weekday: "short" }),
                        numberDay: date.getDate(),
                    });

                    setDays(generatedItems);
                });
            });
            setSelectedDay(generatedItems[0]);
        }, [loadPantry, pantry])
    );

    // useEffect(() => {
    //     const generatedItems = [];
    //     setSelectedDay({
    //         numberDay: nowDay,
    //         month: new Date(nowYear, nowMonth, nowDay).toLocaleDateString("en-us", { month: "short" }),
    //     });

    //     for (let day = nowDay; day < nowDays; day++) {
    //         generatedItems.push(
    //             {
    //                 month: new Date(nowYear, nowMonth, day).toLocaleDateString("en-us", { month: "short" }),
    //                 nameDay: new Date(nowYear, nowMonth, day).toLocaleDateString("en-us", { weekday: "short" }),
    //                 numberDay: day,
    //             }
    //         );
    //     }

    //     for (let day = 1; day < nextMonthDays; day++) {
    //         generatedItems.push(
    //             {
    //                 month: new Date(nowYear, nextMonth, day).toLocaleDateString("en-us", { month: "short" }),
    //                 nameDay: new Date(nowYear, nextMonth, day).toLocaleDateString("en-us", { weekday: "short" }),
    //                 numberDay: day,
    //             }
    //         );
    //     }

    //     setDays(generatedItems);
    // }, [nextMonth, nextMonthDays, nowDay, nowDays, nowMonth, nowYear])

    return (
        <View style={{
            paddingLeft: 12,
            paddingRight: 12
        }}>
            <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            >
                {days && days.map(({ nameDay, numberDay, month }: { nameDay: string, numberDay: number, month: string }, index: number) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => {
                            setSelectedDay({
                                month: month,
                                numberDay: numberDay
                            });
                        }}>
                        <View style={selectedDay && selectedDay.numberDay === numberDay && selectedDay.month === month ? styles.activeCard : styles.card}>
                            <View style={styles.cardTop}>
                                <ThemedText style={{
                                    color: Colors[colorScheme ?? "light"].text,
                                    fontSize: 12,
                                    marginBottom: 3
                                }}>{month}</ThemedText>
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
                                        backgroundColor: selectedDay && selectedDay.numberDay === numberDay && selectedDay.month === month ? Colors[colorScheme ?? "light"].text : Colors[colorScheme ?? "light"].primary
                                    }}
                                >
                                    <ThemedText
                                        style={{
                                            fontSize: 18,
                                            textAlign: "center",
                                            padding: 0,
                                            color: selectedDay && selectedDay.numberDay === numberDay && selectedDay.month === month ? Colors[colorScheme ?? "light"].primary : Colors[colorScheme ?? "light"].text
                                        }}
                                    >
                                        {numberDay}
                                    </ThemedText>
                                </View>
                                <ThemedText style={{
                                    marginTop: 2,
                                }} type="defaultSemiBold">{nameDay}</ThemedText>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    )
}
