import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/theme-context";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { usePantry } from "@/contexts/pantry-context";
import { Fragment, useCallback } from "react";
import getNavbarStyles from "@/styles/navbar";
import { getInventoryStyle } from "@/styles/inventory";
import { useFocusEffect } from "expo-router";
import { PantryType } from "@/types/pantryType";
import { InventoryItem } from "@/components/inventory/InventoryItem";

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
