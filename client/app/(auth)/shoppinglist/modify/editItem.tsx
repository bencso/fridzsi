import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/theme-context";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getInventoryModifyStyles } from "@/styles/inventory/modify";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/theme";
import EditShoppingListItem from "@/components/inventory/EditShoppinglistItemModal";
import Button from "@/components/button";
import { useLanguage } from "@/contexts/language-context";
import { useShoppingList } from "@/contexts/shoppinglist-context";
import { ShoppingListItem } from "@/types/shoppinglist/noteClass";

// Elszaparálni
interface ItemType extends ShoppingListItem {
    customproductname?: string;
    quantityuniten: string;
    quantityunithu: string;
}

//TODO: Loadingok megcsinálása, ezenfelül refaktorálás stb.
export default function EditItemScreen() {
    const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
    const [items, setItems] = useState<ItemType[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { scheme } = useTheme();
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const { getItemByCode } = useShoppingList();

    const { Language } = useLanguage();
    const disabledButton = !!selectedItemId;

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
    })


    function selectItem({
        productId
    }: { productId: string }) {
        if (selectedItemId === productId)
            setSelectedItemId(null)
        else setSelectedItemId(productId);
    }

    return (
        <ThemedView style={styles.mainContainer}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={{ textTransform: "uppercase" }}>
                    {items.length > 0
                        ? items[0]?.name
                            ? items[0].name + " " + t("shoppinglist.editItem.title")
                            : items[0].customproductname + " " + t("shoppinglist.editItem.title")
                        : t("shoppinglist.search.notHave")}
                </ThemedText>
                <ScrollView style={{ flex: 1, height: "100%", marginTop: 16 }} scrollToOverflowEnabled showsVerticalScrollIndicator={false}>
                    {(items && items.length > 0) && items?.map((product: ItemType, idx: number) => (
                        <TouchableOpacity
                            style={{
                                flexDirection: "row", width: "100%", justifyContent: "space-between", padding: 16, marginTop: 16, alignItems: "center", borderRadius: 24, borderWidth: 1, borderColor: selectedItemId === product.id
                                    ? Colors[scheme ?? "light"].primary : Colors[scheme ?? "light"].border, backgroundColor: selectedItemId&&selectedItemId === product.id
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
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </ThemedView>
            <ThemedView style={{
                gap: 12,
                marginBottom: 40
            }}>
                {
                    selectedItemId && <>
                        <Button label={t("shoppinglist.editItem.cta")} action={() => {
                            setIsOpen(!isOpen);
                        }} />
                        <EditShoppingListItem id={selectedItemId} isOpen={isOpen} setIsOpen={setIsOpen} type={"shoppinglist"} /></>
                }
            </ThemedView>
        </ThemedView>
    );
}
