import { Colors } from "@/constants/theme";
import { useTheme } from "@/contexts/theme-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import { ThemedText } from "./themed-text";
import { getButtonStyles } from "@/styles/button";

export default function Button({
  label,
  action,
  chevron,
  icon,
  coloredIcon,
  disabled
}: {
  label: string;
  action: Promise<void> | void | Function | any;
  chevron?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  coloredIcon?: boolean;
  disabled?: boolean;
}) {
  const { scheme } = useTheme();

  let disabledButton = false;
  if (disabled) disabledButton = disabled;

  const styles = getButtonStyles({ scheme, disabled: disabledButton });

  return (
    <TouchableOpacity style={styles.button} disabled={disabledButton} onPress={action} >
        <View style={styles.row}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={Colors["light"].buttomText}
            style={label ? styles.icon : null}
          />
        )}
        {label && (<ThemedText style={
          {
            color: Colors["light"].buttomText,
            height: "auto",
            display: "flex",
            alignItems: "center"
          }
        }>{label}</ThemedText>)}
        </View>
      {
        chevron ?? (
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={coloredIcon ? Colors[scheme ?? "light"].neutral : Colors[scheme ?? "light"].buttomText}
            style={styles.chevron}
          />
        )
      }
    </TouchableOpacity >
  );
}
