import { Colors } from "@/constants/theme";
import { Modal, Text, TextInput, View, TouchableOpacity, Alert, Pressable } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/theme-context";
import { Dispatch, SetStateAction, useState } from "react";
import { ThemedText } from "../themed-text";
import { getShoppingListModalStyle } from "@/styles/shoppinglist/modal";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useShoppingList } from "@/contexts/shoppinglist-context";
import { Picker } from '@react-native-picker/picker';
import { AmountTypeProp } from "@/types/shoppinglist/amountTypeProp";
import { ModalProp } from "@/types/shoppinglist/addShoppingListProp";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Button from "../button";

//TODO: Késöbbiekben kellene a kódos felvétel, kamerával!
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
    const [amountType, setAmountType] = useState<AmountTypeProp>({ id: 1, en: "kilogram", hu: "kilogramm" });
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
                        <View style={styles.amountInput}>
                            <TextInput
                                style={{ ...styles.input, flex: 1 }}
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
                            <View>
                                <ModalAmountType setAmountType={setAmountType} amountType={amountType} />
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
                                amount: formState?.amount != null ? Number(formState.amount) : 1,
                                code: null,
                            });
                            setFormState({
                                product_name: "",
                                amount: 1,
                                code: ""
                            });
                            setDay(new Date());
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

function ModalAmountType({
    amountType,
    setAmountType
}: {
    amountType: AmountTypeProp,
    setAmountType: Dispatch<SetStateAction<AmountTypeProp>>
}) {
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    //TODO: Késöbb DB-ből jön ugyis ez az adat is, csak még ott is fel kéne vinni ezeket :DDD
    const amountTypes = [
        { id: 1, en: "kilogram", hu: "kilogramm" },
        { id: 2, en: "gram", hu: "gramm" },
        { id: 3, en: "piece", hu: "darab" },
        { id: 4, en: "liter", hu: "liter" },
        { id: 5, en: "deciliter", hu: "deciliter" },
        { id: 6, en: "milliliter", hu: "milliliter" },
        { id: 7, en: "package", hu: "csomag" },
        { id: 8, en: "bottle", hu: "üveg" },
        { id: 9, en: "can", hu: "doboz" },
        { id: 10, en: "bag", hu: "zacskó" },
        { id: 11, en: "box", hu: "karton" },
        { id: 12, en: "bunch", hu: "csokor" },
        { id: 13, en: "slice", hu: "szelet" },
    ];

    return (
        <SafeAreaProvider>
            <SafeAreaView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(!modalVisible);
                    }}>
                    <View style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: "white",
                        padding: 16,
                        paddingTop: 16,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30
                    }}>
                        <Picker
                            selectedValue={amountType}
                            onValueChange={(value: AmountTypeProp) => {
                                setAmountType(value);
                            }}
                            mode="dropdown"
                        >
                            {
                                amountTypes.map((amountType: AmountTypeProp, idx: number) => {
                                    return (
                                        <Picker.Item label={amountType.hu} key={idx} value={amountType.id} />
                                    )
                                })
                            }
                        </Picker>
                        <Button label="Kész" icon="check-circle" action={() => {
                            setModalVisible(!modalVisible);
                        }} />
                    </View>
                </Modal>
                <Button action={() => setModalVisible(!modalVisible)} chevron={false} label={amountType.hu} />
            </SafeAreaView>
        </SafeAreaProvider>
    )
}