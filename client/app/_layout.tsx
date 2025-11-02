import { Colors } from "@/constants/theme";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { LanguageProvider, useLanguage } from "@/contexts/language-context";
import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import en from "@/translations/en";
import hu from "@/translations/hu";
import { useFonts } from "expo-font";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { router, Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import i18next from "i18next";
import { useEffect } from "react";
import { initReactI18next, useTranslation } from "react-i18next";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import "react-native-reanimated";
import SplashScreenController from "./splash";

export const unstable_settings = {
  anchor: "(tabs)",
};

// eslint-disable-next-line import/no-named-as-default-member
i18next.use(initReactI18next).init({
  resources: {
    hu: { translation: hu },
    en: { translation: en },
  },
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { scheme, isLoading: themeLoading } = useTheme();
  const { isLoading: languageLoading, Language } = useLanguage();
  const { isAuthenticated, loadAuth, isLoading: authLoading } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname();

  useEffect(() => {
    // eslint-disable-next-line import/no-named-as-default-member
    i18next.changeLanguage(Language).catch((e) => {
      console.warn("i18next changeLanguage error:", e);
    });
  }, [Language]);

  const [loaded, error] = useFonts({
    Regular: require("../assets/fonts/DMSans_36pt-Regular.ttf"),
    Bold: require("../assets/fonts/DMSans_36pt-Bold.ttf"),
    Black: require("../assets/fonts/DMSans_36pt-Black.ttf"),
  });

  useEffect(() => {
    async function hideSplash() {
      if (loaded && !error && !languageLoading && !themeLoading && !authLoading) {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.warn("Error hiding splash screen:", e);
        }
      }
    }
    hideSplash();
  }, [loaded, error, languageLoading, themeLoading, authLoading]);

  useEffect(() => {
    async function fetchAuth() {
      await loadAuth();
    }
    fetchAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading]);

  if (authLoading || !loaded || error || languageLoading || themeLoading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator
          size="large"
          color={Colors[scheme ?? "light"].primary}
        />
        <Text style={{ marginTop: 10 }}>{t("alerts.loading")}</Text>
      </View>
    );
  }

  return (
    <NavigationThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack
        screenOptions={{
          headerShown: true,
          headerTransparent: true,
          gestureEnabled: true,
          gestureDirection: "horizontal",
        }}
      >
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen
            name="(notauth)"
            options={{
              title: "",
              animation: "fade",
              headerRight: () => {
                return <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: 6,
                  }}
                  onPress={() => router.navigate("/settings")}
                >
                  <MaterialCommunityIcons
                    name="cog"
                    size={24}
                    color={Colors[scheme ?? "light"].tabIconSelected}
                  />
                </TouchableOpacity>
              }
            }}
          />
        </Stack.Protected>

        <Stack.Protected guard={!!isAuthenticated}>
          <Stack.Screen
            name="(auth)"
            options={{
              title: "",
              animation: "fade",
              headerRight: () => {
                return <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingLeft: 6,
                  }}
                  onPress={() => router.navigate("/settings")}
                >
                  <MaterialCommunityIcons
                    name="cog"
                    color={pathname === "/" ? Colors[scheme === "light" ? "dark" : "light"].tabIconDefault : Colors[scheme ?? "light"].tabIconDefault}
                    size={24}
                  />
                </TouchableOpacity>
              }
            }}
          />
        </Stack.Protected>

        <Stack.Screen
          name="settings"
          options={{
            presentation: "modal",
            animation: "fade_from_bottom",
            title:
              pathname === "/settings"
                ? t("settings.title")
                : pathname === "/settings/language"
                  ? t("settings.languages.cta")
                  : pathname === "/settings/passwordchange"
                    ? t("settings.authenticated.password")
                    : pathname === "/settings/theme" ? t("settings.colortheme.cta") : t("settings.title"),
            headerLeft: () => (
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingLeft: 5,
                }}
                onPress={() => {
                  router.back();
                }}
              >
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={24}
                  color={Colors[scheme ?? "light"].text}
                />
              </TouchableOpacity>
            ),
          }}
        />

      </Stack>
      <StatusBar style="auto" />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {

  return (
    <AuthProvider>
      <LanguageProvider>
        <ThemeProvider>
          <SplashScreenController />
          <AppContent />
        </ThemeProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}
