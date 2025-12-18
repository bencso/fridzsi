import { Colors } from "@/constants/theme";
import { getInventoryStyle } from "@/styles/inventory";
import { PantryType } from "@/types/pantry/pantryType";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "../themed-text";
import { useTheme } from "@/contexts/theme-context";
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
    SharedValue,
    useAnimatedStyle,
} from 'react-native-reanimated';

export
    function InventoryItem({ product, idx }: {
        product: PantryType;
        idx: number
    }) {

    const { scheme: colorScheme } = useTheme();
    const styles = getInventoryStyle({ colorScheme });

    const RightAction = ({ progress, dragX, code }: { progress: SharedValue<number>; dragX: SharedValue<number>; code?: string }) => {
        const animatedStyle = useAnimatedStyle(() => {
            const translateX = Math.max(0, dragX.value);
            return {
                transform: [{ translateX }],
                opacity: progress.value,
                display: "flex",
                flexDirection: "row",
                gap: 12,
                paddingRight: 6,
                paddingBottom: 6,
                paddingTop: 6,
            };
        });

        return (
            <Reanimated.View style={{ ...animatedStyle }}>
                <TouchableOpacity style={styles.editButton} onPress={async () => {
                    if (code) {
                        router.navigate({ pathname: "/inventory/modify/editItem", params: { code } });
                    }
                }} >
                    <ThemedText style={styles.deleteButtonText}>
                        <Ionicons name="create-outline" size={24} />
                    </ThemedText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.deleteButton} onPress={async () => {
                    if (code) {
                        router.navigate({ pathname: "/inventory/modify/deleteItem", params: { code } });
                    }
                }} >
                    <ThemedText style={styles.deleteButtonText}><Ionicons name="trash" size={24} /></ThemedText>
                </TouchableOpacity>
            </Reanimated.View>
        );
    };


    //! Lehetett volna szebben és jobban ez az expiredAt mondjuk Date-ben visszadni, késöbb lehet ezt megcsinálni :)
    //TODO: Az expiredAt késöbbiekben Date-ben jöjjön vissza, könnyebb kezelhetőség
    return (
        product.quantity.map((quantity, i) => ({
            quantity,
            quantityUnit : product.quantityUnit[i],
            expiredAt: product.expiredAt[i],
        }))
            .sort((a, b) => {
                const [ayear, amonth, aday] = a.expiredAt?.split(".").map(Number) || [];
                const [byear, bmonth, bday] = b.expiredAt?.split(".").map(Number) || [];
                const aDate = new Date(ayear, amonth - 1, aday);
                const bDate = new Date(byear, bmonth - 1, bday);
                return aDate.getTime() - bDate.getTime();
            }).map((item, index) => {
                function expirationColoring() {
                    const [year, month, day] = item.expiredAt?.split(".").map(s => Number(s.trim())).filter(Boolean) || [];
                    return new Date(year, month - 1, day).toLocaleDateString() === new Date().toLocaleDateString()
                        ? Colors[colorScheme ?? "light"].uncorrect
                        : Colors[colorScheme ?? "light"].text;
                }

                return (
                    <ReanimatedSwipeable
                        containerStyle={{
                            padding: 20,
                            paddingTop: 12,
                            paddingBottom: 12,
                            borderBottomWidth: 1,
                            borderBottomColor: Colors[colorScheme ?? "light"].border,
                        }}
                        key={idx + "-" + index}
                        friction={1}
                        enableTrackpadTwoFingerGesture
                        rightThreshold={80}
                        renderRightActions={(progress, dragX, _) => (
                            <RightAction progress={progress} dragX={dragX} key={idx + "-" + index} code={product.code} />
                        )}
                    >
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
                                <View
                                    style={{
                                        ...styles.productIcon,
                                        backgroundColor: expirationColoring(),
                                    }}
                                >
                                    <ThemedText style={{ color: Colors[colorScheme ?? "light"].background, fontWeight: "900", fontSize: 20 }}>
                                        {product.name?.at(0)?.toUpperCase()}
                                    </ThemedText>
                                </View>
                                <ThemedText numberOfLines={1} type="defaultSemiBold" style={styles.productTitle}>
                                    {product.name}
                                </ThemedText>
                            </View>
                            <ThemedText style={styles.productSecond}>
                                {item.quantity} {item.quantityUnit}
                            </ThemedText>
                        </View>
                    </ReanimatedSwipeable>
                );
            })
    );
}