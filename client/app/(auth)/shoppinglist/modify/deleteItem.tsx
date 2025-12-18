import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/theme-context";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getInventoryModifyStyles } from "@/styles/inventory/modify";
import Button from "@/components/button";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/theme";
import { useLanguage } from "@/contexts/language-context";
import { useShoppingList } from "@/contexts/shoppinglist-context";
import { ShoppingListItem } from "@/types/shoppinglist/noteClass";

//TODO: Loadingok megcsinálása, ezenfelül refaktorálás stb.
interface ItemType extends ShoppingListItem {
    customproductname?: string;
    quantityuniten: string;
    quantityunithu: string;
}

export default function DeleteItemScreen() {
    const [selectedItemsId, setSelectedItemsId] = useState<string[]>([]);
    const [items, setItems] = useState<ItemType[]>([]);
    const { scheme } = useTheme();
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const { getItemByCode, deleteItem } = useShoppingList();

    const { Language } = useLanguage();
    const disabledButton = selectedItemsId?.length === 0;

    const styles = getInventoryModifyStyles({ scheme, disabledButton });

    useFocusEffect(() => {
        async function getItem() {
            const code = params.id as any;
            const items = await getItemByCode(code)
            if (items.data) {
                setItems(items.data);
            }
        }

        getItem();
    });

    function selectItem({
        productId
    }: { productId: string }) {
        if (selectedItemsId.includes(productId))
            setSelectedItemsId([...selectedItemsId.filter((selectedItem) => selectedItem !== productId)]);
        else setSelectedItemsId([...selectedItemsId, productId]);
    }

    return (
        <ThemedView style={styles.mainContainer}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={{ textTransform: "uppercase" }}>
                    {items[0]?.name} {t("shoppinglist.deleteItem.title")}
                </ThemedText>
                <View style={{ flex: 1, height: "100%", gap: 16, marginTop: 16, }}>
                    <View style={{ gap: 16, flexDirection: "row", width: "100%" }}>
                        {selectedItemsId.length < items.length && <TouchableOpacity style={{
                            paddingStart: 8, paddingEnd: 8, paddingTop: 4, paddingBottom: 4, backgroundColor: Colors[scheme ?? "light"].border, borderRadius: 12, justifyContent: "center", alignItems: "center", width: "45%"
                        }} onPress={() => {
                            setSelectedItemsId(items.map((item: ItemType) => item.id));
                        }}>
                            <Text>{t("delete.selectAll")}</Text>
                        </TouchableOpacity>
                        }
                        {
                            selectedItemsId.length > 0 && <TouchableOpacity style={{
                                paddingStart: 8, paddingEnd: 8, paddingTop: 4, paddingBottom: 4, backgroundColor: Colors[scheme ?? "light"].border, borderRadius: 12, width: "45%", justifyContent: "center", alignItems: "center"
                            }} onPress={() => {
                                setSelectedItemsId([])
                            }}>
                                <Text>{t("delete.unSelectAll")}</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <ScrollView style={{ flex: 1, height: "100%", marginTop: 16 }} scrollToOverflowEnabled showsVerticalScrollIndicator={false}>
                        {items?.map((product: ItemType, idx) => (
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row", width: "100%", marginTop: 16, justifyContent: "space-between", padding: 16, alignItems: "center", borderRadius: 24, borderWidth: 1, borderColor: selectedItemsId.includes(product.id)
                                        ? Colors[scheme ?? "light"].primary : Colors[scheme ?? "light"].border, backgroundColor: selectedItemsId.includes(product.id)
                                            ? Colors[scheme ?? "light"].primary : Colors[scheme ?? "light"].border
                                }}
                                onPress={() => selectItem({
                                    productId: product.id
                                })}
                                key={idx}
                            >
                                <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                                    <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between", alignItems: "center" }}>
                                        <View>
                                            <ThemedText>{new Date(product.day).toLocaleDateString()}</ThemedText>
                                        </View>
                                        <View>
                                            <ThemedText>{product.quantity} {Language === "en" ? product.quantityuniten : product.quantityunithu}</ThemedText>
                                        </View>
                                    </View>
                                    <Ionicons
                                        name={
                                            selectedItemsId.includes(product.id)
                                                ? "checkmark-circle-outline"
                                                : "ellipse-outline"
                                        }
                                        size={24}
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </ThemedView>
            <ThemedView style={{
                gap: 12,
            }}>
                {
                    selectedItemsId.length > 0 && <Button disabled={selectedItemsId.length === 0} label={selectedItemsId.length + " " + t("shoppinglist.deleteItem.cta")} icon="trash" action={async () => {
                        if (selectedItemsId.length > 0) {
                            try {
                                await deleteItem({ ids: selectedItemsId });
                                if (router.canGoBack()) router.back();
                                router.replace("/shoppinglist");
                            } catch {
                                console.log("Hiba történt a törlés közben!");
                            }
                        }
                    }} />
                }
            </ThemedView>
        </ThemedView>
    );
}
