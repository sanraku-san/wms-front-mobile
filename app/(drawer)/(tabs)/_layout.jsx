import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router/tabs";
import React, { useContext } from "react";
import { themeContext } from "../../theme/themeContext";

export default function TabsLayout() {
  const theme = useContext(themeContext);

 
  console.log("success");
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tabBar.active,
        tabBarActiveBackgroundColor: theme.tabBar.backgroundColor,
        tabBarInactiveTintColor: theme.tabBar.inactive,
        tabBarStyle: { backgroundColor: theme.tabBar.backgroundColor },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="th-list" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarLabel: "My Profile",
          tabBarIcon: ({ color }) => (
            <FontAwesome size={20} name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
