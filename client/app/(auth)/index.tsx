import { ShoppingListSection } from "@/components/main/ShoppingListSection";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import getAuthenticatedIndexStyles from "@/styles/authenticatedIndex";
import getNavbarStyles from "@/styles/navbar";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";

export default function AuthenticatedScreen() {
  const { scheme: colorScheme } = useTheme();
  const { userData, loadAuth } = useAuth();
  const { t } = useTranslation();

  const styles = getAuthenticatedIndexStyles({ colorScheme });
  const navbarStyles = getNavbarStyles({ colorScheme });

  useFocusEffect(
    useCallback(() => {
      loadAuth();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );


  return (
    <ThemedView style={[styles.container]}>
      <ScrollView
        bounces={false}
        overScrollMode="never"
        showsVerticalScrollIndicator={false}
      >
        <View style={{ ...navbarStyles.navbar, backgroundColor: `${Colors[colorScheme ?? "light"].tabIconDefault}` }}>
          <ThemedText type="title" style={{ ...navbarStyles.title, color: `${Colors[colorScheme ?? "light"].background}` }}>
            {t("main.title")}
          </ThemedText>
          <ThemedText type="subtitle" style={{ ...navbarStyles.title, color: `${Colors[colorScheme ?? "light"].background}` }}>
            {userData && userData.username}
          </ThemedText>
        </View>
        <ShoppingListSection />
        <ThemedView style={styles.content}>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}
