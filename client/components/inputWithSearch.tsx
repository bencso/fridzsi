import { Product } from "@/constants/product.interface";
import { Colors } from "@/constants/theme";
import { usePantry } from "@/contexts/pantry-context";
import { useTheme } from "@/contexts/theme-context";
import { getCustomInputStyles } from "@/styles/customInput";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TextInput, TouchableOpacity } from "react-native";

//TODO: Anyket kicserélni
export const SearchWithInput = ({ filtered, productCode, setProductCode, productName, setProductName, setFiltered, styles }: { filtered: any; productCode: any; setProductCode: any; productName: any; setProductName: any; setFiltered: any; styles?: any }) => {
    const { scheme } = useTheme();
    const inputStyles = styles || getCustomInputStyles({ scheme });

    const { t } = useTranslation();

    const { product, searchProductByKeyword } = usePantry();

    const [focusedInput, setFocusedInput] = useState<boolean>(false);
    const showSearch = filtered
        && filtered.length > 0
        && focusedInput
        && (productCode || productName);

    function productNameOnChange(text: string) {
        setProductName(text);
    }

    return (
        <>
            <TextInput
                style={{ ...inputStyles.input, color: (product?.name === null || product?.name === undefined) ? Colors[scheme ?? "light"].text : `${Colors[scheme ?? "light"].text}80` }}
                placeholderTextColor={`${Colors[scheme ?? "light"].text}80`}
                value={productName ? productName : ""}
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
            {
                showSearch && (
                    <Fragment>
                        <Text>{t("customInput.searchLabel")}</Text>
                        <ScrollView
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
                )
            }
        </>
    )
}