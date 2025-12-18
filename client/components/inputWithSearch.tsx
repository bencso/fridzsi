import { Product } from "@/constants/product.interface";
import { Colors } from "@/constants/theme";
import { usePantry } from "@/contexts/pantry-context";
import { useTheme } from "@/contexts/theme-context";
import { getCustomInputStyles } from "@/styles/customInput";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TextInput, TouchableOpacity, View, Animated } from "react-native";
import { ThemedView } from "./themed-view";
import { Ionicons } from '@expo/vector-icons';

//TODO: Anyket kicserélni
export const SearchWithInput = ({ filtered, productCode, setProductCode, productName, setProductName, setFiltered, styles, inInput }: { filtered: any; productCode: any; setProductCode: any; productName: any; setProductName: any; setFiltered: any; styles?: any, inInput?: boolean }) => {
    const { scheme } = useTheme();
    const inputStyles = styles || getCustomInputStyles({ scheme });

    const { t } = useTranslation();

    const { product, searchProductByKeyword } = usePantry();

    const [focusedInput, setFocusedInput] = useState<boolean>(false);
    const [fadeAnim] = useState(new Animated.Value(0));
    const showSearch = focusedInput && (productCode || productName) && filtered;

    function productNameOnChange(text: string) {
        setProductName(text);
    }

    function highlightMatch(text: string, query: string) {
        if (!query) return text;
        const idx = text.toLowerCase().indexOf(query.toLowerCase());
        if (idx === -1) return text;
        return <Text>
            {text.substring(0, idx)}
            <Text style={{ fontWeight: 'bold', color: Colors[scheme ?? "light"].text }}>{text.substring(idx, idx + query.length)}</Text>
            {text.substring(idx + query.length)}
        </Text>;
    }

    return (
        <ThemedView style={{ ...inputStyles.input, padding: 0, paddingLeft: 0, paddingRight: 12, position: 'relative' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="pricetag-outline" size={20} color={Colors[scheme ?? "light"].text} style={{ marginLeft: 4, marginRight: 12 }} />
                <TextInput
                    style={{ flex: 1, color: (product?.name === null || product?.name === undefined) ? Colors[scheme ?? "light"].text : `${Colors[scheme ?? "light"].text}80` }}
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
                        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
                    }}
                    onBlur={() => {
                        setFocusedInput(false);
                        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
                    }}
                    placeholder={t("customInput.productName")}
                />
            </View>
            {showSearch && (
                <Animated.View style={{
                    opacity: fadeAnim,
                    position: 'absolute',
                    top: 48,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{
                            maxHeight: 200,
                            marginTop: 4,
                            borderRadius: 14,
                            backgroundColor: Colors[scheme ?? "light"].background,
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.13,
                            shadowRadius: 8,
                            elevation: 5,
                            borderWidth: 1,
                            borderColor: `${Colors[scheme ?? "light"].text}15`,
                        }}
                        contentContainerStyle={{
                            gap: 2,
                            paddingVertical: 6,
                        }}
                    >
                        {filtered && filtered.length === 0 && (
                            <View style={{ alignItems: 'center', padding: 16 }}>
                                <Ionicons name="alert-circle-outline" size={22} color={Colors[scheme ?? "light"].text} style={{ marginBottom: 4 }} />
                                <Text style={{ color: Colors[scheme ?? "light"].text, fontSize: 15, opacity: 0.7 }}>{t('customInput.noResults') || 'Nincs találat'}</Text>
                            </View>
                        )}
                        {filtered && filtered.map((filteredItem: Product, idx: number) => (
                            <TouchableOpacity
                                key={idx}
                                style={{
                                    backgroundColor: idx % 2 === 0
                                        ? `${Colors[scheme ?? "light"].text}08`
                                        : `${Colors[scheme ?? "light"].text}12`,
                                    borderRadius: 10,
                                    paddingVertical: 12,
                                    paddingHorizontal: 16,
                                    marginHorizontal: 4,
                                    marginVertical: 1,
                                    flexDirection: "row",
                                    alignItems: "center",
                                }}
                                activeOpacity={0.8}
                                onPress={() => {
                                    setFiltered(false);
                                    setProductName(filteredItem?.name || "");
                                    setProductCode(filteredItem?.code || "");
                                }}
                            >
                                <Text
                                    style={{
                                        color: Colors[scheme ?? "light"].text,
                                        fontWeight: "600",
                                        fontSize: 16,
                                        flex: 1,
                                    }}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {highlightMatch(filteredItem?.name || '', productName)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>
            )}
        </ThemedView>
    );
}