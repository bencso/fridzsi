import { RadioButtons } from "@/components/radiobutton";
import { ThemedView } from "@/components/themed-view";
import { useTheme } from "@/contexts/theme-context";
import { getThemeStyles } from "@/styles/settings/theme";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

export default function ThemeScreen() {
    const { scheme, setScheme } = useTheme();
    const [selectedTheme, setSelectedTheme] = useState<string>();
    const { t } = useTranslation();

    useEffect(() => {
        if (selectedTheme !== scheme) setSelectedTheme(scheme);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheme]);

    const handleChange = (value: any) => {
        setSelectedTheme(value);
        setScheme(value ?? "light");
    };

    const styles = getThemeStyles({ scheme });

    return (
        <ThemedView style={styles.container}>
            <ThemedView style={styles.content}>
                <View style={styles.group}>
                    <RadioButtons
                        options={[
                            {
                                label: t("settings.colortheme.light"),
                                value: "light",
                                icon: "sunny-outline",
                            },
                            {
                                label: t("settings.colortheme.dark"),
                                value: "dark",
                                icon: "moon-outline",
                            },
                        ]}
                        checkedValue={selectedTheme}
                        onChange={handleChange}
                        colorScheme={scheme}
                    />
                </View>
            </ThemedView>
        </ThemedView>
    );
}
