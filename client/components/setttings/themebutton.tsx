"use client";

import { useTheme } from "@/contexts/theme-context";
import { t } from "i18next";
import { useEffect, useState } from "react";
import { ColorSchemeName, View } from "react-native";
import { RadioButtons } from "../radiobutton";
import { ThemedText } from "../themed-text";
import { getThemeButtonStyle } from "@/styles/themeButton";

export default function ThemeButton() {
  const [selectedTheme, setSelectedTheme] = useState<ColorSchemeName>();
  const { scheme, setScheme } = useTheme();
  const styles = getThemeButtonStyle(scheme);

  useEffect(() => {
    if (selectedTheme !== scheme) setSelectedTheme(scheme);
  }, [scheme, selectedTheme]);

  const handleChange = (value: ColorSchemeName): void => {
    setSelectedTheme(value);
    setScheme(value ?? "light");
  };

  return (
    <View style={styles.group}>
      <View style={styles.groupLeft}>
        <ThemedText type="defaultSemiBold">{t("settings.colortheme.cta")}</ThemedText>
      </View>
      <RadioButtons
        options={[
          {
            label: t("settings.colortheme.light"),
            icon: "white-balance-sunny",
            value: "light",
          },
          {
            label: t("settings.colortheme.dark"),
            icon: "moon-outline",
            value: "dark",
          },
        ]}
        checkedValue={selectedTheme}
        onChange={handleChange}
        colorScheme={scheme}
      />
    </View>
  );
}
