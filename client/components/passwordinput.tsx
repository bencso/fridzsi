import React, { SetStateAction, useRef, useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/theme";
import getLoginStyles from "@/styles/auth/login";

interface PasswordInputTextProps {
    label?: string;
    value: string;
    setValue: React.Dispatch<SetStateAction<string>>;
    scheme: keyof typeof Colors;
}

const PasswordInputText = ({
    label,
    value,
    setValue,
    scheme,
}: PasswordInputTextProps) => {
    const styles = getLoginStyles({
        scheme: scheme,
        disabledButton: false
    });
    const [eyeIcon, setEyeIcon] = useState<any>("eye-off");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const passwordRef = useRef(null);

    const changePwdType = () => {
        setEyeIcon(showPassword ? "eye" : "eye-off");
        setShowPassword((prevState) => !prevState);
    };

    return (
        <View style={{ position: "relative", justifyContent: "center" }}>
            <TextInput
                ref={passwordRef}
                style={styles.input}
                value={value}
                maxLength={150}
                placeholderTextColor={`${Colors[scheme ?? "light"].text}80`}
                autoComplete="current-password"
                autoCorrect={false}
                keyboardType="default"
                autoCapitalize="none"
                secureTextEntry={!showPassword}
                placeholder={label}
                onChangeText={(text: string) => {
                    setValue(text);
                }}
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
                    changePwdType();
                }}
                activeOpacity={0.7}
            >
                <MaterialCommunityIcons
                    name={eyeIcon}
                    size={24}
                    style={styles.icon}
                />
            </TouchableOpacity>
        </View>
    );
};

export default PasswordInputText;