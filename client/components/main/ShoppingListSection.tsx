import { Colors } from "@/constants/theme";
import getAuthenticatedIndexStyles from "@/styles/authenticatedIndex";
import { useTheme } from "@/contexts/theme-context";
import { useCallback, useDeferredValue, useState } from "react";
import { View, ScrollView, TextInput } from "react-native";
import { ThemedText } from "../themed-text";
import { ThemedView } from "../themed-view";
import { useTranslation } from "react-i18next";
import { useShoppingList } from "@/contexts/shoppinglist-context";
import { useFocusEffect } from "expo-router";
import { ShoppingListItem } from "@/types/noteClass";

export const ShoppingListSection = () => {
    const { scheme: colorScheme } = useTheme();
    const { getNowList } = useShoppingList();

    const { t } = useTranslation();

    const [lists, setLists] = useState<any[]>([]);
    const [search, setSearch] = useState<string>("");
    const deferredQuery = useDeferredValue(search);
    const styles = getAuthenticatedIndexStyles({ colorScheme });

    useFocusEffect(
        useCallback(() => {
            (async () => {
                const response = await getNowList({ q: search });
                console.log(response);
                if (!response.message) {
                    const items = response.map((data: { customproductname: string; product_quantity_metric: string | null; product_product_name: string | null; shoppinglist_amount: number; shoppinglist_day: Date; shoppinglist_id: number }) => {
                        const name = data.product_product_name !== null ? data.product_product_name : data.customproductname;
                        return new ShoppingListItem(data.shoppinglist_id, name, data.shoppinglist_amount, data.product_quantity_metric || "", data.shoppinglist_day);
                    });
                    setLists(items);
                } else setLists([]);
            })();
        }, [search])
    );

    const filteredLists = deferredQuery.length > 0
        ? lists.filter((value) =>
            value.name.toLowerCase().includes(deferredQuery.toLowerCase())
        )
        : lists;

    return (
        <ThemedView style={styles.shoppingListContainer}>
            <ThemedText type="defaultSemiBold" style={{
                color: Colors[colorScheme ?? "light"].background
            }}>{t("shoppinglist.title")}</ThemedText>
            <View>
                <TextInput clearButtonMode="while-editing" autoComplete="off" returnKeyType="search" keyboardType="web-search" cursorColor={Colors[colorScheme ?? "light"].primary} style={styles.input} autoCapitalize="none" placeholder={t("shoppinglist.search.cta")} value={search} onChangeText={(text: string) => {
                    setSearch(text);
                }} />
            </View>
            <ThemedView style={styles.topBar}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {
                        filteredLists.length === 0 && <ThemedText style={{
                            paddingHorizontal: 12,
                            paddingVertical: 24
                        }}>{t("shoppinglist.search.notHave")}</ThemedText>

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