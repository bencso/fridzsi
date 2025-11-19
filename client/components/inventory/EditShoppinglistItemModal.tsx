import { Colors } from "@/constants/theme";
import { Modal, TextInput, View, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/theme-context";
import { useCallback, useState } from "react";
import { getShoppingListModalStyle } from "@/styles/shoppinglist/modal";
import { useShoppingList } from "@/contexts/shoppinglist-context";
import { quantityTypeProp } from "@/types/shoppinglist/quantityTypeProp";
import { ModalProp } from "@/types/shoppinglist/addShoppingListProp";
import { ModalQuantityType } from "../shoppinglist/modalAmountType";
import { ProductParams } from "@/types/product/productClass";
import { useFocusEffect } from "expo-router";
import { usePantry } from "@/contexts/pantry-context";
import Button from "../button";


export default function EditShoppingListItem({ isOpen, setIsOpen }: ModalProp) {
    const { t } = useTranslation();
    const { scheme: colorScheme } = useTheme();
    const styles = getShoppingListModalStyle({ colorScheme });
    const [formState, setFormState] = useState<ProductParams>();
    const [day, setDay] = useState<Date>(new Date());
    const [quantityTypes] = useState<quantityTypeProp[]>([]);
    const [quantityType, setQuantityType] = useState<quantityTypeProp | null>(null);
    const { addNewShoppingItem } = useShoppingList();
    const { loadQuantityTypes } = usePantry();

    useFocusEffect(useCallback(() => {
        loadQuantityTypes();
        setQuantityType(quantityTypes[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []));

    return (
        <Modal
            visible={isOpen}
            transparent
            animationType="fade"
            statusBarTranslucent
        >
            <View style={{
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.7)",
                flex: 1,
                gap: 12
            }}>
                <View style={{
                    justifyContent: "center",
                    paddingHorizontal: 18,
                    paddingVertical: 12,
                    elevation: 2,
                    flexDirection: "column",
                    borderRadius: 0,
                    width: "100%",
                    height: "100%",
                    minHeight: 200,
                    maxHeight: 300,
                    gap: 24,
                    bottom: 0,
                    position: "absolute",
                    left: 0,
                    borderTopLeftRadius: 32,
                    borderTopRightRadius: 32,
                    backgroundColor: "white"
                }}>
                    <View style={{
                        display: "flex",
                        gap: 12
                    }}>

                        <View style={styles.quantityInput}>
                            <TextInput
                                style={{ ...styles.input, flex: 1, backgroundColor: Colors[colorScheme ?? "light"].border, }}
                                placeholderTextColor={`${Colors[colorScheme ?? "light"].text}80`}
                                maxLength={150}
                                value={formState?.quantity === undefined || Number.isNaN(formState.quantity) ? "1" : String(formState.quantity)}
                                autoCorrect={false}
                                onChangeText={(text: string) => {
                                    setFormState({
                                        ...formState,
                                        quantity: Number(text)
                                    })
                                }}
                                clearButtonMode="while-editing"
                                keyboardType="numeric"
                                autoCapitalize="none"
                                returnKeyType="next"
                                returnKeyLabel={t("buttons.next")}
                                placeholder={t("shoppinglist.quantity")}
                            />
                            <View>
                                <ModalQuantityType setQuantityType={setQuantityType} quantityType={quantityType} />
                            </View>
                        </View>
                        <View style={{
                            gap: 12
                        }}>
                            <Button label={t("inventory.edititem.cta")} action={async () => {
                                try {
                                    await addNewShoppingItem({
                                        product_name: formState?.product_name,
                                        day: day,
                                        quantity: formState?.quantity != null ? Number(formState.quantity) : 1,
                                        quantity_unit: quantityType != null ? quantityType.id : 1,
                                        code: null,
                                    });
                                    setFormState({
                                        product_name: "",
                                        quantity: 1,
                                        code: ""
                                    });
                                    setDay(new Date());
                                    setQuantityType(quantityTypes[0]);
                                }
                                catch {
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
                <View style={{ alignItems: "center", marginTop: 16, gap: 16 }}>

                </View>
            </View>
        </Modal>
    )
}