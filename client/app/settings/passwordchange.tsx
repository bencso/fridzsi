import Button from "@/components/button";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Colors } from "@/constants/theme";
import { useAuth } from "@/contexts/auth-context";
import { useTheme } from "@/contexts/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";

export default function PasswordChangeScreen() {
  const { scheme } = useTheme();
  const { isAuthenticated, passwordChange } = useAuth();
  const { t } = useTranslation();
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rePassword, setRePassword] = useState<string>("");
  const [showRepassword, setShowRepassword] = useState<boolean>(false);

  const disabledButton = password.length < 0 || rePassword.length < 0;

  useEffect(() => {
    if (!isAuthenticated) router.replace("/settings");
  }, [isAuthenticated]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      height: "100%",
      paddingTop: 70
    },
    content: {
      flex: 1,
      padding: 16,
      gap: 12,
    },
    group: {
      flexDirection: "column",
      gap: 12,
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: Colors[scheme ?? "light"].neutral + "CC",
      borderRadius: 12,
      backgroundColor: `${Colors[scheme ?? "light"].primary}10`,
    },
    input: {
      color: Colors[scheme ?? "light"].text,
      paddingTop: 16,
      paddingBottom: 16,
      paddingStart: 10,
      borderWidth: 1,
      borderColor: Colors[scheme ?? "light"].border,
      borderRadius: 12,
      fontSize: 16,
      backgroundColor: Colors[scheme ?? "light"].border,
    },
    inputContainer: {
      display: "flex",
      gap: 16,
      justifyContent: "center",
    },
    button: {
      alignItems: "center",
      backgroundColor: Colors[scheme ?? "light"].button,
      borderRadius: 12,
      padding: 15,
      paddingTop: 18,
      paddingBottom: 18,
      fontWeight: "bold",
      width: "100%",
      fontSize: 20,
      opacity: !disabledButton ? 1 : 0.5,
    },
    icon: {
      color: `${Colors[scheme ?? "light"].buttomText}80`
    }
  });

  async function onSubmit() {
    if (rePassword.length !== password.length || password.length === 0 || rePassword.length === 0) {
      let message = t("alerts.authPasswordMatchMessage");

      if (password.length === 0) message = t("alerts.authMissingPassword");
      else if (rePassword.length === 0) message = t("alerts.authMissingRePassword");

      Alert.alert(t("alerts.authErrorMessage"), message);
      return;
    } else await passwordChange({
      password: password,
      repassword: rePassword
    })
  }

  return (
    <>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.content}>
          <View style={styles.inputContainer}>
            <ThemedText type="default">
              {t("auth.password")}:
            </ThemedText>
            <View style={{ position: "relative", justifyContent: "center" }}>
              <TextInput
                style={styles.input}
                value={password}
                maxLength={150}
                placeholderTextColor={`${Colors[scheme ?? "light"].text}80`}
                autoComplete="current-password"
                autoCorrect={false}
                keyboardType="default"
                textContentType="password"
                autoCapitalize="none"
                enablesReturnKeyAutomatically
                secureTextEntry={!showPassword}
                placeholder={t("forms.password")}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  top: 0,
                  bottom: 0,
                  justifyContent: "center",
                  height: "100%",
                }}
                onPress={() => {
                  setShowPassword((prev) => !prev);
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <ThemedText type="default">
              {t("auth.repassword")}:
            </ThemedText>
            <View style={{ position: "relative", justifyContent: "center" }}>
              <TextInput
                style={styles.input}
                value={rePassword}
                maxLength={150}
                placeholderTextColor={`${Colors[scheme ?? "light"].text}80`}
                autoComplete="current-password"
                autoCorrect={false}
                keyboardType="default"
                textContentType="password"
                autoCapitalize="none"
                enablesReturnKeyAutomatically
                secureTextEntry={!showRepassword}
                placeholder={t("forms.repassword")}
                onChangeText={setRePassword}
              />
              <TouchableOpacity
                style={{
                  position: "absolute",
                  right: 10,
                  top: 0,
                  bottom: 0,
                  justifyContent: "center",
                  height: "100%",
                }}
                onPress={() => {
                  setShowRepassword((prev) => !prev);
                }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={24}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <Button
              label={t("auth.passwordChange")}
              action={onSubmit}
            />
          </View>
        </ThemedView>
      </ThemedView>
    </>
  );
}
