import { Drawer } from "expo-router/drawer";
import { View, TouchableOpacity } from "react-native";
import { DrawerToggleButton } from "@react-navigation/drawer";
import React, { useContext } from "react";
import { themeContext } from "../theme/themeContext";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import withAuth from "../components/high-order-component/withAuth";

const goToUserProfile = () => {
  router.push("(drawer)/(tabs)/profile");
};

const DrawerLayout = () => {
  const theme = useContext(themeContext);

  console.log("success");
  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <Drawer
        screenOptions={({ navigation }) => ({
          headerLeft: () => (
            <DrawerToggleButton tintColor={theme.button.color} />
          ),
          headerTintColor: theme.button.color,
          drawerType: "front",
          drawerStyle: {
            width: 250,
            backgroundColor: theme.background,
          },
          drawerLabelStyle: {
            color: theme.secondColor,
          },
        })}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Home",
            title: "WMS",
            headerTitleStyle: { color: theme.header.color },
            headerStyle: { backgroundColor: theme.header.backgroundColor },
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="warehouse"
                size={size}
                color={focused ? theme.color : "#b2b2b2"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="inventory"
          options={{
            drawerLabel: "Inventory",
            title: "Inventory",
            headerTitleStyle: { color: theme.header.color },
            headerStyle: { backgroundColor: theme.header.backgroundColor },
            headerRight: () => (
              <TouchableOpacity onPress={goToUserProfile}>
                <FontAwesome
                  name="user-circle"
                  size={20}
                  color={theme.button.color}
                  style={{ marginRight: 20 }}
                />
              </TouchableOpacity>
            ),
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="inventory"
                size={size}
                color={focused ? theme.color : "#b2b2b2"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="transactions"
          options={{
            drawerLabel: "Transaction",
            title: "Transactions",
            headerTitleStyle: { color: theme.header.color },
            headerStyle: { backgroundColor: theme.header.backgroundColor },
            headerRight: () => (
              <TouchableOpacity onPress={goToUserProfile}>
                <FontAwesome
                  name="user-circle"
                  size={20}
                  color={theme.button.color}
                  style={{ marginRight: 20 }}
                />
              </TouchableOpacity>
            ),
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="playlist-add-check"
                size={size}
                color={focused ? theme.color : "#b2b2b2"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="transactionsHistory"
          options={{
            drawerLabel: "Transactions History",
            title: "Transactions History",
            headerTitleStyle: { color: theme.header.color },
            headerStyle: { backgroundColor: theme.header.backgroundColor },
            headerRight: () => (
              <TouchableOpacity onPress={goToUserProfile}>
                <FontAwesome
                  name="user-circle"
                  size={20}
                  color={theme.button.color}
                  style={{ marginRight: 20 }}
                />
              </TouchableOpacity>
            ),
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="history"
                size={size}
                color={focused ? theme.color : "#b2b2b2"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="stores"
          options={{
            drawerLabel: "Stores",
            title: "Stores",
            headerTitleStyle: { color: theme.header.color },
            headerStyle: { backgroundColor: theme.header.backgroundColor },
            headerRight: () => (
              <TouchableOpacity onPress={goToUserProfile}>
                <FontAwesome
                  name="user-circle"
                  size={20}
                  color={theme.button.color}
                  style={{ marginRight: 20 }}
                />
              </TouchableOpacity>
            ),
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="home-work"
                size={size}
                color={focused ? theme.color : "#b2b2b2"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="accounts"
          options={{
            drawerLabel: "Manage Accounts",
            title: "Manage Accounts",
            headerTitleStyle: { color: theme.header.color },
            headerStyle: { backgroundColor: theme.header.backgroundColor },
            headerRight: () => (
              <TouchableOpacity onPress={goToUserProfile}>
                <FontAwesome
                  name="user-circle"
                  size={20}
                  color={theme.button.color}
                  style={{ marginRight: 20 }}
                />
              </TouchableOpacity>
            ),
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="manage-accounts"
                size={size}
                color={focused ? theme.color : "#b2b2b2"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            title: "Settings",
            headerTitleStyle: { color: theme.header.color },
            headerStyle: { backgroundColor: theme.header.backgroundColor },
            headerRight: () => (
              <TouchableOpacity onPress={goToUserProfile}>
                <FontAwesome
                  name="user-circle"
                  size={20}
                  color={theme.button.color}
                  style={{ marginRight: 20 }}
                />
              </TouchableOpacity>
            ),
            drawerIcon: ({ focused, size }) => (
              <MaterialIcons
                name="settings"
                size={size}
                color={focused ? theme.color : "#b2b2b2"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="try"
          options={{
            title: "Try",
            drawerItemStyle: { display: "none" },
            headerShown: false,
          }}
        />
      </Drawer>
    </View>
  );
};
export default withAuth(DrawerLayout);
