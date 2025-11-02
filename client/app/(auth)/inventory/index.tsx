import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/theme-context";
import { useTranslation } from "react-i18next";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, {
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { usePantry } from "@/contexts/pantry-context";
import { Fragment, useCallback } from "react";
import getNavbarStyles from "@/styles/navbar";
import { getInventoryStyle } from "@/styles/inventory";
import { router, useFocusEffect } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import { PantryType } from "@/types/pantryType";

export default function InventoryScreen() {
  const { scheme: colorScheme } = useTheme();
  const { t } = useTranslation();
  const { pantry, loadPantry } = usePantry();

  useFocusEffect(
    useCallback(() => {
      loadPantry();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );


  const styles = getInventoryStyle({ colorScheme });
  const navbarStyle = getNavbarStyles({ colorScheme });

  return (
    <><View style={navbarStyle.navbar}>
      <ThemedText type="title" style={navbarStyle.title}>
        {t("inventory.title")}
      </ThemedText>
    </View>
      <ThemedView style={styles.container}>
        {
          (pantry !== null) && <ThemedView style={styles.content}>
            <ScrollView showsVerticalScrollIndicator={false} scrollToOverflowEnabled style={{ height: "100%", overflow: "hidden", width: "100%" }}>
              <GestureHandlerRootView style={{ gap: 12 }}>
                {
                  pantry && pantry.map((item: PantryType, idx: number) => {
                    return <Fragment key={idx}>
                      <ThemedText type="defaultSemiBold" style={{ marginBottom: 10, marginTop: 10 }}>{item.name}</ThemedText>
                      <InventoryItem key={idx} product={item} idx={idx} /></Fragment>
                  })
                }
              </GestureHandlerRootView>
            </ScrollView>
          </ThemedView>
        }
        {
          (pantry === null) && <ThemedText>{t("inventory.empty")}</ThemedText>
        }
      </ThemedView>
    </>)
}

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
            <MaterialCommunityIcons name="pen" size={24} />
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={async () => {
          if (code) {
            router.navigate({ pathname: "/inventory/modify/deleteItem", params: { code } });
          }
        }} >
          <ThemedText style={styles.deleteButtonText}><MaterialCommunityIcons name="trash-can" size={24} /></ThemedText>
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  return (
    product.amount.map((_, index) => {
      return <ReanimatedSwipeable
        containerStyle={{
          padding: 20, paddingTop: 0, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: Colors[colorScheme ?? "light"].border,
          borderRadius: 12,
        }}
        key={idx + "-" + index}
        friction={1}
        enableTrackpadTwoFingerGesture
        rightThreshold={80}
        renderRightActions={(progress, dragX, _) => (
          <RightAction progress={progress} dragX={dragX} key={idx + "-" + index} code={product.code} />
        )}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
            <View style={styles.productIcon} >
              <ThemedText type="subtitle" style={{ color: "white" }}>{
                product.name?.at(0)?.toUpperCase()
              }</ThemedText>
            </View>
            <ThemedText numberOfLines={1} type="defaultSemiBold" style={styles.productTitle}>
              {product.name}
            </ThemedText>
          </View>
          <ThemedText style={styles.productSecond}>
            {product.amount[index]} x
          </ThemedText>
        </View>
      </ReanimatedSwipeable>
    })
  )
}