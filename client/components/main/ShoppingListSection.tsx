import { Colors } from "@/constants/theme";
import getAuthenticatedIndexStyles from "@/styles/authenticatedIndex";
import { useTheme } from "@/contexts/theme-context";
import { useDeferredValue, useState } from "react";
import { View, ScrollView, TextInput } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { useTranslation } from "react-i18next";

export const ShoppingListSection = () => {
    const { scheme: colorScheme } = useTheme();
    const styles = getAuthenticatedIndexStyles({ colorScheme });

    const { t } = useTranslation();

    const [search, setSearch] = useState<string>("");
    const deferredQuery = useDeferredValue(search);

    const lists = [
        {
            name: "Krumpli",
            amount: 2
        },
        {
            name: "Coca cola Zero"
        }
    ]

    const filteredLists = deferredQuery.length > 0
        ? lists.filter((value) =>
            value.name.toLowerCase().includes(deferredQuery.toLowerCase())
        )
        : lists;

    return (
        <ThemedView style={styles.shoppingListContainer}>
            <ThemedText type="defaultSemiBold" style={{
                color: Colors[colorScheme ?? "light"].background
            }}>{t("main.listTitle")}</ThemedText>
            <View>
                <TextInput clearButtonMode="while-editing" autoComplete="off" returnKeyType="search" keyboardType="web-search" cursorColor={Colors[colorScheme ?? "light"].primary} style={styles.input} autoCapitalize="none" placeholder={t("main.search")} value={search} onChangeText={(text: string) => {
                    setSearch(text);
                }} />
            </View>
            <ThemedView style={styles.topBar}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {
                        filteredLists.length === 0 && <ThemedText style={{
                            paddingHorizontal: 12,
                            paddingVertical: 24
                        }}>{t("search.notHave")}</ThemedText>

                    }
                    {
                        filteredLists.map(({ name, amount }: { name: string; amount?: number }, idx: number) => (
                            <ThemedView style={styles.topBarItem} key={idx}>
                                <View style={styles.flexRow}>
                                    <View style={styles.topBarItemPicture} >
                                        <ThemedText style={{
                                            color: "white",
                                            fontSize: 30
                                        }}>{name.at(0)}</ThemedText>
                                    </View>
                                    <ThemedText type="defaultSemiBold" style={{ fontSize: 17 }}>
                                        {name}
                                    </ThemedText>
                                </View>
                                <ThemedText style={styles.amountText}>
                                    {amount ? amount : 1}x
                                </ThemedText>
                            </ThemedView>
                        ))

                    }
                </ScrollView>
            </ThemedView>
        </ThemedView>
    )
}