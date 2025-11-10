import { Colors } from "@/constants/theme";
import { Modal, Text, TextInput, View, TouchableOpacity, Alert } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/theme-context";
import { Dispatch, SetStateAction, useState } from "react";
import { ThemedText } from "../themed-text";
import { getShoppingListModalStyle } from "@/styles/shoppinglist/modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useShoppingList } from "@/contexts/shoppinglist-context";

type ModalProp = {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

//TODO: Késöbbiekben kellene a kódos felvétel!
export default function AddShoppinglistModal({ isOpen, setIsOpen }: ModalProp) {
    const { t } = useTranslation();
    const { scheme: colorScheme } = useTheme();
    const styles = getShoppingListModalStyle({ colorScheme });
    const [formState, setFormState] = useState<{
        product_name?: string | null;
        amount?: number | null;
        code?: string | null;
    }>();
    const [day, setDay] = useState<Date>(new Date());
    const { addNewShoppingItem } = useShoppingList();

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
                    textAlign: "center"
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

                        <TextInput
                            style={{ ...styles.input }}
                            placeholderTextColor={`${Colors[colorScheme ?? "light"].text}80`}
                            maxLength={10}
                            autoCorrect={false}
                            value={formState?.amount != null ? String(formState.amount) : "1"}
                            clearButtonMode="while-editing"
                            keyboardType="decimal-pad"
                            autoCapitalize="none"
                            onChangeText={(text: string) => {
                                setFormState({
                                    ...formState,
                                    amount: Number(text)
                                })
                            }}
                            returnKeyType="next"
                            returnKeyLabel={t("buttons.next")}
                            placeholder={t("shoppinglist.amount")}
                        />
                        <DateTimePicker
                            mode="date"
                            display="default"
                            themeVariant="light"
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
                                amount: formState?.amount != null ? Number(formState.amount) : 1,
                                code: null,
                            });
                        }
                        catch {
                            //TODO: Magyarosítás
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