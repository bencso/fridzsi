import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/theme-context";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { usePantry } from "@/contexts/pantry-context";
import { getInventoryModifyStyles } from "@/styles/inventory/modify";
import Button from "@/components/button";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { Alert, TouchableOpacity, View } from "react-native";
import { Colors } from "@/constants/theme";

type ItemType = {
    index: number;
    name: string;
    quantity: number;
    expiredat: string;
    code: string;
}

//TODO: Loadingok megcsinálása, ezenfelül refaktorálás stb.
export default function DeleteItemScreen() {
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [products, setProducts] = useState([]);
    const { scheme } = useTheme();
    const { editPantryItem } = usePantry();
    const { t } = useTranslation();
    const params = useLocalSearchParams();
    const { getItemsById } = usePantry();

    const disabledButton = !!selectedItemId;

    const styles = getInventoryModifyStyles({ scheme, disabledButton });

    useFocusEffect(() => {
        async function getItem() {
            const code = params.code as any;
            const items = await getItemsById(code)
            setProducts(items.products);
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
                    {t("inventory.editItem.title")}
                </ThemedText>
                <View style={{ flex: 1, height: "100%", gap: 16, marginTop: 16 }}>
                    {products?.map((product: ItemType, idx) => (
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
                                        <ThemedText>{product.quantity}x</ThemedText>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </ThemedView>
            <ThemedView style={{
                gap: 12,
            }}>
                {
                    selectedItemId && <Button disabled={!selectedItemId} label={t("inventory.editItem.cta")} icon="pen" action={async () => {
                        if (selectedItemId) {
                            try {
                                Alert.prompt(
                                    t('inventory.editItem.quantityInput.title'),
                                    t('inventory.editItem.quantityInput.message'),
                                    [
                                        {
                                            text: t('inventory.editItem.quantityInput.cancel'),
                                            style: "cancel"
                                        },
                                        {
                                            text: t('inventory.editItem.quantityInput.submit'),
                                            style: "default",
                                            onPress: async (quantity?: string) => {
                                                await editPantryItem({
                                                    id: selectedItemId,
                                                    quantity: Number(quantity)
                                                });
                                                router.back();
                                            }
                                        }
                                    ],
                                    "plain-text"
                                );
                            } catch {
                                console.log("Hiba történt a módosítás közben!");
                            }
                        }
                    }} />
                }
            </ThemedView>
        </ThemedView>
    );
}
