import { Colors } from "@/constants/theme";
import { Modal, TextInput, View, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/theme-context";
import { useEffect, useState } from "react";
import { quantityTypeProp } from "@/types/shoppinglist/quantityTypeProp";
import { ModalProp } from "@/types/shoppinglist/addShoppingListProp";
import { ModalQuantityType } from "../shoppinglist/modalAmountType";
import { router } from "expo-router";
import { usePantry } from "@/contexts/pantry-context";
import Button from "../button";
import { getModifyModalStyle } from "@/styles/shoppinglist/modals/modify";
import { useShoppingList } from "@/contexts/shoppinglist-context";


export default function EditShoppingListItem({ id, isOpen, setIsOpen, type }: ModalProp) {
    const { t } = useTranslation();
    const { scheme: colorScheme } = useTheme();
    const styles = getModifyModalStyle({ colorScheme });
    const [quantity, setQuantity] = useState<number>(1);
    const [quantityCategory, setQuantityCategory] = useState<string>("");
    const [quantityType, setQuantityType] = useState<quantityTypeProp | null>(null);
    const { quantityTypes, loadQuantityTypes, editPantryItem, getItemById: getPantryById } = usePantry();
    const { getItemById, editItem, setEditModeId } = useShoppingList();

    useEffect(() => {
        const fetchData = async () => {
            loadQuantityTypes();
            setQuantityType(quantityTypes[0]);
        };

        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const fetchItemData = async () => {
            const fetchItem = type !== "pantry" ? getItemById : getPantryById;
            const item = await fetchItem(String(id));
            if (item.data) {
                setQuantity(item.data.quantity);
                const unitIndex = quantityTypes.findIndex((q: quantityTypeProp) => q.id === item.data.quantityunitid);
                setQuantityCategory(item.data.category);
                setQuantityType(quantityTypes[unitIndex >= 0 ? unitIndex : 0]);
            } else {
                setQuantity(1);
                setQuantityType(quantityTypes[0]);
            }
        }

        fetchItemData();
    }, [getItemById, getPantryById, id, quantityTypes, type]);



    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={{
                ...styles.modalContainer
            }}>
                <View style={{
                    ...styles.modal
                }}>
                    <View style={{
                        display: "flex",
                        gap: 12
                    }}>
                        <View style={styles.quantityInput}>
                            <TextInput
                                style={{ ...styles.input }}
                                placeholderTextColor={`${Colors[colorScheme ?? "light"].text}80`}
                                maxLength={150}
                                value={quantity === undefined || Number.isNaN(quantity) ? "1" : String(quantity)}
                                autoCorrect={false}
                                onChangeText={(text: string) => {
                                    setQuantity(Number(text));
                                }}
                                clearButtonMode="while-editing"
                                keyboardType="numeric"
                                autoCapitalize="none"
                                returnKeyType="next"
                                returnKeyLabel={t("buttons.next")}
                                placeholder={t("shoppinglist.quantity")}
                            />
                            <View>
                                <ModalQuantityType setQuantityType={setQuantityType} quantityType={quantityType} quantityCategory={quantityCategory} />
                            </View>
                        </View>
                        <View style={{
                            gap: 12
                        }}>
                            <Button label={t("inventory.editItem.cta")} action={async () => {
                                try {
                                    if (type === "pantry") {
                                        await editPantryItem({
                                            id,
                                            quantity,
                                            quantityType: quantityType?.id
                                        });
                                    } else {
                                        await editItem({
                                            id: Number(id),
                                            quantity,
                                            quantityUnitId: Number(quantityType?.id)
                                        });
                                        setEditModeId("-1");
                                    }
                                    setQuantity(1);
                                    if (quantityTypes.length > 0) {
                                        setQuantityType(quantityTypes[0]);
                                    }
                                    router.back();
                                }
                                catch {
                                    //TODO: Fordítás
                                    Alert.alert("HIBA!");
                                }
                                setIsOpen(false);
                            }} />
                            <Button label={t("shoppinglist.cancel")} action={() => {
                                setIsOpen(false);
                            }} />
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    )
}