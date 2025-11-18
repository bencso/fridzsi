import { Colors } from "@/constants/theme";
import { Modal, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/theme-context";
import { useCallback, useState } from "react";
import { ThemedText } from "../themed-text";
import { getShoppingListModalStyle } from "@/styles/shoppinglist/modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useShoppingList } from "@/contexts/shoppinglist-context";
import { quantityTypeProp } from "@/types/shoppinglist/quantityTypeProp";
import { ModalProp } from "@/types/shoppinglist/addShoppingListProp";
import { ModalQuantityType } from "../shoppinglist/modalAmountType";
import { ProductParams } from "@/types/product/productClass";
import { useFocusEffect } from "expo-router";
import { usePantry } from "@/contexts/pantry-context";

//TODO: Késöbbiekben kellene a kódos felvétel, kamerával!
//TODO: Tizedes számjegy is engedélyezett legyen!
export default function AddShoppinglistModal({ isOpen, setIsOpen }: ModalProp) {
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
                <ThemedText type="title" style={{
                    color: "white",
                    fontWeight: "bold",
                    textShadowColor: "rgba(0,0,0,0.8)",
                    textShadowOffset: { width: 2, height: 3 },
                    textShadowRadius: 4,
                    textAlign: "center",
                }}>
                    {t("shoppinglist.add")}
                </ThemedText>
                <View style={{
                    ...styles.modal
                }}>
                    <View style={{
                        display: "flex", gap: 12
                    }}>
                        <TextInput
                            style={{ ...styles.input }}
                            placeholderTextColor={`${Colors[colorScheme ?? "light"].text}80`}
                            maxLength={150}
                            value={formState?.product_name ?? ""}
                            autoCorrect={false}
                            onChangeText={(text: string) => {
                                setFormState({
                                    ...formState,
                                    product_name: text
                                })
                            }}
                            clearButtonMode="while-editing"
                            keyboardType="default"
                            autoCapitalize="none"
                            returnKeyType="next"
                            returnKeyLabel={t("buttons.next")}
                            placeholder={t("shoppinglist.name")}
                        />
                        <View style={styles.quantityInput}>
                            <TextInput
                                style={{ ...styles.input, flex: 1 }}
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
                        <DateTimePicker
                            mode="date"
                            display="default"
                            themeVariant="light"
                            minimumDate={new Date()}
                            accentColor={Colors[colorScheme ?? "light"].text}
                            value={day}
                            onChange={(_, selectedDate) => {
                                const currentDate = selectedDate || day;
                                setDay(currentDate);
                            }}
                            maximumDate={new Date(new Date().getFullYear() + 10, 0, 1)}
                        />
                    </View>
                </View>
                <View style={{ alignItems: "center", marginTop: 16, gap: 16 }}>
                    <ModalButton title={t("shoppinglist.add")} action={async () => {
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
                    <ModalButton title={t("shoppinglist.cancel")} action={() => {
                        setIsOpen(false);
                    }} />
                </View>
            </View>
        </Modal>
    )
}

function ModalButton({
    title,
    action
}: { title: string; action: any }) {
    const { scheme: colorScheme } = useTheme();
    const styles = getShoppingListModalStyle({ colorScheme });

    return (
        <TouchableOpacity
            onPress={action}
            style={{
                ...styles.button
            }}
        >
            <Text style={{
                ...styles.buttonText
            }}>
                {title}
            </Text>
        </TouchableOpacity>
    )
}