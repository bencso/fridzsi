import { Colors } from "@/constants/theme";
import { Modal, TextInput, View, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/theme-context";
import { useCallback, useState } from "react";
import { useShoppingList } from "@/contexts/shoppinglist-context";
import { quantityTypeProp } from "@/types/shoppinglist/quantityTypeProp";
import { ModalProp } from "@/types/shoppinglist/addShoppingListProp";
import { ModalQuantityType } from "../shoppinglist/modalAmountType";
import { ProductParams } from "@/types/product/productClass";
import { useFocusEffect } from "expo-router";
import { usePantry } from "@/contexts/pantry-context";
import Button from "../button";
import { getModifyModalStyle } from "@/styles/shoppinglist/modals/modify";


export default function EditShoppingListItem({ isOpen, setIsOpen }: ModalProp) {
    const { t } = useTranslation();
    const { scheme: colorScheme } = useTheme();
    const styles = getModifyModalStyle({ colorScheme });
    const [formState, setFormState] = useState<ProductParams>();
    const [day, setDay] = useState<Date>(new Date());
    const [quantityTypes] = useState<quantityTypeProp[]>([]);
    const [quantityType, setQuantityType] = useState<quantityTypeProp | null>(null);
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
                                    Alert.alert(quantityType ? quantityType?.hu : "");
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
            </View>
        </Modal>
    )
}