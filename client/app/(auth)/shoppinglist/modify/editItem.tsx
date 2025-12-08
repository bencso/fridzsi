import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/theme-context";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getInventoryModifyStyles } from "@/styles/inventory/modify";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/theme";
import EditShoppingListItem from "@/components/inventory/EditShoppinglistItemModal";
import Button from "@/components/button";
import { useLanguage } from "@/contexts/language-context";
import { ItemType } from "@/types/pantry/itemType";
import { useShoppingList } from "@/contexts/shoppinglist-context";


//TODO: Loadingok megcsinálása, ezenfelül refaktorálás stb.
export default function EditItemScreen() {
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { scheme } = useTheme();
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const { getItemById } = useShoppingList();

    const { Language } = useLanguage();
    const disabledButton = !!selectedItemId;

    const styles = getInventoryModifyStyles({ scheme, disabledButton });

    useFocusEffect(() => {
        async function getItem() {
            const id = params.id as any;
            const items = await getItemById(id)
            if (items) {
                setItems(items);
            }
        }

        getItem();
    })


    function selectItem({
        productId
    }: { productId: number }) {
        if (selectedItemId === productId)
            setSelectedItemId(null)
        else setSelectedItemId(productId);
    }

    return (
        <ThemedView style={styles.mainContainer}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={{ textTransform: "uppercase" }}>
                    {t("shoppinglist.editItem.title")}
                </ThemedText>
                <View style={{ flex: 1, height: "100%", gap: 16, marginTop: 16 }}>
                    {items.length > 0 && items?.map((product: ItemType, idx: number) => (
                        <TouchableOpacity
                            style={{
                                flexDirection: "row", width: "100%", justifyContent: "space-between", padding: 16, alignItems: "center", borderRadius: 24, borderWidth: 1, borderColor: selectedItemId === product.index
                                    ? Colors[scheme ?? "light"].primary : Colors[scheme ?? "light"].border, backgroundColor: selectedItemId === product.index
                                        ? Colors[scheme ?? "light"].primary : Colors[scheme ?? "light"].border
                            }}
                            onPress={() => selectItem({
                                productId: product.index
                            })}
                            key={idx}
                        >
                            <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                                <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between", alignItems: "center" }}>
                                    <View>
                                        <ThemedText>{new Date(product.expiredat).toLocaleDateString()}</ThemedText>
                                    </View>
                                    <View>
                                        <ThemedText>{product.quantity} {Language === "en" ? product.quantityuniten : product.quantityunithu}</ThemedText>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
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
