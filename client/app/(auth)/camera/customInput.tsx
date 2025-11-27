import {
    Alert,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView
} from "react-native";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";
import { Fragment, useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import DateTimePicker from "@react-native-community/datetimepicker";
import { usePantry } from "@/contexts/pantry-context";
import { router, useFocusEffect } from "expo-router";
import { getCustomInputStyles } from "@/styles/camera/customInput";
import { Product } from "@/constants/product.interface";
import { ModalQuantityType } from "@/components/shoppinglist/modalAmountType";
import { quantityTypeProp } from "@/types/shoppinglist/quantityTypeProp";

//TODO: Csak a jó quantityUnits-ot kiirni, pl egy szilárd ételnél ne lehessen litert megadni :)
// Van kategória adva a quantityUnitsnak - ezt majd valahogy ki szürni
export default function CustomInputScreen() {
    const [productName, setProductName] = useState<string>("");
    const [productCode, setProductCode] = useState<string>("");
    const [filtered, setFiltered] = useState<Product[]>([]);
    const [expired, setExpired] = useState<Date>(new Date());
    const [focusedInput, setFocusedInput] = useState<boolean>(false);
    const [quantity, setquantity] = useState<number>(1);
    const { scheme } = useTheme();
    const { addPantryItem, product, setProduct, loadPantry, setScanned, searchProductByKeyword, loadQuantityTypes } = usePantry();
    const { t } = useTranslation();
    const [quantityTypes] = useState<quantityTypeProp[]>([]);
    const [quantityType, setQuantityType] = useState<quantityTypeProp | null>(null);

    useFocusEffect(useCallback(() => {
        loadQuantityTypes();
        setQuantityType(quantityTypes[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []));
    const showSearch = (filtered
        && filtered.length > 0
        && !!focusedInput)
        && !(productCode.length && productName.length);

    useEffect(() => {
        if (product?.code) setProductCode(product.code);
        if (product?.name) setProductName(product.name);
    }, [product])

    const disabledButton = productName?.length === 0;

    function productNameOnChange(text: string) {
        setProductName(text);
    }

    useEffect(() => {
        if (quantity && quantity <= 1) setquantity(1);
    }, [quantity]);

    async function onSubmit() {
        try {
            if (productCode && productName && quantity)
                await addPantryItem({
                    code: productCode,
                    product_name: productName,
                    quantity: quantity,
                    quantityUnit: quantityType,
                    expiredAt: expired
                });
            else throw new Error(t("alerts.addPantryItemError"));
            router.dismiss();
            router.navigate("/(auth)/inventory");
            loadPantry();
        } catch {
            Alert.alert(t("alerts.addPantryItemErrorTitle"), t("alerts.addPantryItemError"));
        }
        finally {
            setProduct(null);
            setScanned(false);
        }
    }

    const styles = getCustomInputStyles({ scheme, disabledButton });

    return (
        <ThemedView style={styles.mainContainer}>
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title" style={{ textTransform: "uppercase" }}>
                    {t("customInput.cta")}
                </ThemedText>
            </ThemedView>
            <ThemedView>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={{ ...styles.input, color: (product?.name === null || product?.name === undefined) ? Colors[scheme ?? "light"].text : `${Colors[scheme ?? "light"].text}80` }}
                        placeholderTextColor={`${Colors[scheme ?? "light"].text}80`}
                        value={productName}
                        maxLength={150}
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        keyboardType="default"
                        autoCapitalize="none"
                        returnKeyType="next"
                        editable={product?.name === null || product?.name === undefined}
                        returnKeyLabel={t("buttons.next")}
                        onChangeText={async (text) => {
                            productNameOnChange(text);
                            setFiltered(await searchProductByKeyword(text.toLowerCase()));
                        }}
                        onFocus={() => {
                            setFocusedInput(true);
                        }}
                        onBlur={() => {
                            setFocusedInput(false);
                        }}
                        placeholder={t("customInput.productName")}
                    />
                    {showSearch && (
                        <Fragment>
                            <Text>{t("customInput.searchLabel")}</Text><ScrollView
                                showsVerticalScrollIndicator={true}
                                style={{
                                    maxHeight: 50,
                                }}
                                contentContainerStyle={{
                                    gap: 8,
                                }}
                            >
                                {filtered.map((filteredItem: Product, idx: number) => (
                                    <TouchableOpacity
                                        key={idx}
                                        style={{
                                            backgroundColor: Colors[scheme ?? "light"].border,
                                            borderRadius: 12,
                                            paddingLeft: 12,
                                            paddingRight: 12,
                                            paddingTop: 6,
                                            paddingBottom: 6
                                        }}
                                        onPress={() => {
                                            setProductName(filteredItem?.name || "");
                                            setProductCode(filteredItem?.code || "");
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "black"
                                            }}
                                        >
                                            {filteredItem?.name}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </Fragment>
                    )}
                    <TextInput
                        style={{ ...styles.input, color: (product?.code === null || product?.code === undefined) ? Colors[scheme ?? "light"].text : `${Colors[scheme ?? "light"].text}80` }}
                        value={productCode}
                        maxLength={150}
                        placeholderTextColor={`${Colors[scheme ?? "light"].text}80`}
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        keyboardType="number-pad"
                        returnKeyType="next"
                        editable={product?.code === null || product?.code === undefined}
                        returnKeyLabel={t("buttons.next")}
                        autoCapitalize="none"
                        placeholder={t("customInput.productCode")}
                        onChangeText={async (text) => {
                            setProductCode(text);
                            setFiltered(await searchProductByKeyword(text.toLowerCase()));
                        }}
                    />
                    <View style={styles.quantityInput}>
                        <TextInput
                            style={{ ...styles.input, flex: 1 }}
                            placeholderTextColor={`${Colors[scheme ?? "light"].text}80`}
                            value={quantity.toString()}
                            maxLength={3}
                            autoCorrect={false}
                            clearButtonMode="while-editing"
                            keyboardType="number-pad"
                            returnKeyType="done"
                            returnKeyLabel={t("buttons.done")}
                            autoCapitalize="none"
                            onChangeText={(text) => {
                                const parsed = parseInt(text, 10);
                                setquantity(Number.isNaN(parsed) ? 1 : parsed);
                            }}
                            placeholder={t("customInput.quantity")}
                        />
                        <View>
                            <ModalQuantityType setQuantityType={setQuantityType} quantityType={quantityType} />
                        </View>
                    </View>
                    <DateTimePicker
                        mode="date"
                        display="default"
                        value={expired}
                        onChange={(_, selectedDate) => {
                            const currentDate = selectedDate || expired;
                            setExpired(currentDate);
                        }}
                        maximumDate={new Date(new Date().getFullYear() + 10, 0, 1)}
                    />
                    <TouchableOpacity
                        disabled={disabledButton}
                        onPress={onSubmit}
                        style={styles.button}
                    >
                        <Text
                            style={{
                                textTransform: "uppercase",
                            }}
                        >
                            {t("customInput.send")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </ThemedView>
        </ThemedView>
    );
}
