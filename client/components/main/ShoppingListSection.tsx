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
import { ShoppingListItem } from "@/types/shoppinglist/noteClass";
import { Ionicons } from "@expo/vector-icons";

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
                if (!response.message) {
                    const items = response.map((data: { customproductname: string; product_product_quantity_unit: string | null; product_product_name: string | null; shoppinglist_quantity: number; shoppinglist_day: Date; shoppinglist_id: number; quantityunithu: string; quantityuniten: string; quantityunit: string; }) => {
                        const name = data.product_product_name !== null ? data.product_product_name : data.customproductname;
                        return new ShoppingListItem(data.shoppinglist_id.toString(), name, data.shoppinglist_quantity.toString(), data.shoppinglist_day, data.quantityuniten, data.quantityunithu, data.quantityunit);
                    });
                    setLists(items);
                } else setLists([]);
            })();
            // eslint-disable-next-line react-hooks/exhaustive-deps
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
                <ThemedView style={{ ...styles.input, padding: 0, paddingLeft: 0, paddingRight: 12, position: 'relative' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Ionicons name="search" size={20} color={Colors[colorScheme ?? "light"].text} style={{ marginLeft: 4, marginRight: 12 }} />
                        <TextInput
                            style={{ flex: 1 }}
                            placeholderTextColor={`${Colors[colorScheme ?? "light"].text}80`}
                            value={search ? search : ""}
                            maxLength={150}
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            keyboardType="default"
                            autoCapitalize="none"
                            returnKeyType="next"
                            returnKeyLabel={t("buttons.next")}
                            onChangeText={async (text) => {
                                setSearch(text);
                            }}
                            placeholder={t("customInput.productName")}
                        />
                    </View>
                </ThemedView>
            </View>
            <ThemedView style={styles.topBar}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {
                        filteredLists.length === 0 && <ThemedText style={{
                            paddingHorizontal: 12,
                            paddingVertical: 24
                        }}>{search.length > 0 ? t("shoppinglist.search.notHave") : t("shoppinglist.search.clear")}</ThemedText>

                    }
                    {
                        filteredLists.map(({ name, quantity, quantityUnit }: { name: string; quantity?: number; quantityUnit?: string; }, idx: number) => (
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
                                <ThemedText style={styles.quantityText}>
                                    {quantity ? quantity : 1} {quantityUnit}
                                </ThemedText>
                            </ThemedView>
                        ))
                    }
                </ScrollView>
            </ThemedView>
        </ThemedView>
    )
}