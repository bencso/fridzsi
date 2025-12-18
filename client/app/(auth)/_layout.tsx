import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { PantryProvider } from "@/contexts/pantry-context";
import { useTheme } from "@/contexts/theme-context";
import { tabBar } from "@/styles/tabBar";
import { Tabs } from "expo-router";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { t } from "i18next";
import React from "react";
import { Platform } from "react-native";

export default function AuthenticatedLayout() {
  const { scheme } = useTheme();

  if (Platform.OS === "ios") {
    return (
      <PantryProvider>
        <NativeTabs
          minimizeBehavior="onScrollDown"
          shadowColor={Colors[scheme ?? "light"].button}
        >
          <NativeTabs.Trigger name="index">
            <Icon
              selectedColor={Colors[scheme ?? "light"].tabIconSelected}
              sf="house"
              drawable="custom_house_drawable"
            />
            <Label>{t("tabs.home")}</Label>
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="inventory">
            <Icon
              selectedColor={Colors[scheme ?? "light"].tabIconSelected}
              sf="box.truck"
              drawable="custom_house_drawable"
            />
            <Label>{t("inventory.cta")}</Label>
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="shoppinglist">
            <Icon
              selectedColor={Colors[scheme ?? "light"].tabIconSelected}
              sf="list.bullet"
              drawable="custom_listbullet_drawable"
            />
            <Label>{t("shoppinglist.cta")}</Label>
          </NativeTabs.Trigger>
          <NativeTabs.Trigger name="camera" role="search">
            <Icon
              selectedColor={Colors[scheme ?? "light"].tabIconSelected}
              sf="plus"
              drawable="custom_camera_drawable"
            />
            <Label>{t("inventory.camera.create")}</Label>
          </NativeTabs.Trigger>
        </NativeTabs>
      </PantryProvider>
    );
  }

  const screenOptions = tabBar({ scheme, HapticTab });

  return (
    <PantryProvider>
      <Tabs
        screenOptions={{
          ...screenOptions,
          headerShown: false,
          animation: "shift",
           sceneStyle: {
            backgroundColor: Colors[scheme ?? "light"].background,
          }
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: t("tabs.login"),
            tabBarIcon: () => (
              <Icon sf="door.left.hand.open" drawable="custom_door_open_drawable" />
            ),
          }}
        />
        <Tabs.Screen
          name="inventory"
          options={{
            title: t("tabs.inventory.create"),
            tabBarIcon: () => (
              <Icon sf="scanner" drawable="custom_scanner_drawable" />
            ),
            tabBarAccessibilityLabel: t("tabs.inventory.create"),
          }}
        />
        <Tabs.Screen
          name="shoppinglist"
          options={{
            title: t("shoppinglist.cta"),
            tabBarIcon: () => (
              <Icon sf="list.bullet" drawable="custom_listbullet_drawable" />
            ),
            tabBarAccessibilityLabel: t("shoppinglist.cta"),
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            title: t("inventory.camera.create"),
            tabBarIcon: () => (
              <Icon sf="plus" drawable="custom_camera_drawable" />
            ),
            tabBarAccessibilityLabel: t("inventory.camera.create"),
          }}
        />
      </Tabs>
    </PantryProvider>
  );
}
