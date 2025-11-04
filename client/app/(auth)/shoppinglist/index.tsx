import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/theme-context";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { usePantry } from "@/contexts/pantry-context";
import { useCallback } from "react";
import getNavbarStyles from "@/styles/navbar";
import { useFocusEffect } from "expo-router";
import { getShoppingListStyle } from "@/styles/shoppinglist";

export default function ShoppingListScreen() {
  const { scheme: colorScheme } = useTheme();
  const { t } = useTranslation();
  const { loadPantry } = usePantry();

  useFocusEffect(
    useCallback(() => {
      loadPantry();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const styles = getShoppingListStyle({ colorScheme });
  const navbarStyle = getNavbarStyles({ colorScheme });

  return (
    <><View style={navbarStyle.navbar}>
      <ThemedText type="title" style={navbarStyle.title}>
        {t("shoppinglist.title")}
      </ThemedText>
    </View>
      <ThemedView style={styles.container}>
        
      </ThemedView>
    </>)
}