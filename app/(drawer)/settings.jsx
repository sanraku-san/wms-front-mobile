import { View, Text, Switch, TouchableOpacity } from "react-native";
import React, { useState, useContext } from "react";
import { EventRegister } from "react-native-event-listeners";
import { themeContext } from "../theme/themeContext";
import { FontAwesome } from "@expo/vector-icons";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
function Settings() {
  const theme = useContext(themeContext);
  const [darkMode, setDarkMode] = useState(false);
  return (
    <View
      style={{
        flex: 1,
        // alignItems: "center",
        padding: 10,
        backgroundColor: theme.background,
      }}
    >
      {/* about us */}
      <TouchableOpacity onPress={() => router.push("/aboutUs")}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 30,
            width: "100%",
            padding: 10,
            justifyContent: "space-between",
            borderBottomWidth: 1,
            borderBottomColor: "#bec0ca",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              width: "95%",
              paddingHorizontal: 10,
            }}
          >
            <FontAwesome
              name="info"
              size={20}
              color={theme.color}
              style={{ marginRight: 20 }}
            />
            <Text
              style={{ fontSize: 20, color: theme.color, fontWeight: "bold" }}
            >
              About Us
            </Text>
          </View>
          <FontAwesome
            name="angle-right"
            size={18}
            color={theme.color}
            style={{ marginRight: 20 }}
          />
        </View>
      </TouchableOpacity>
      {/* account */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          width: "100%",
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#bec0ca",
        }}
      >
        <FontAwesome
          name="user-o"
          size={15}
          color={theme.color}
          style={{ marginRight: 20 }}
        />
        <Text style={{ fontSize: 20, color: theme.color, fontWeight: "bold" }}>
          Account
        </Text>
      </View>
      <View
        style={{
          alignItems: "flex-start",
          marginTop: 30,
          width: "100%",
          gap: 20,
          paddingLeft: 10,
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text style={{ fontSize: 18, color: theme.color }}>Edit Profile</Text>
          <FontAwesome
            name="angle-right"
            size={18}
            color={theme.color}
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Text style={{ fontSize: 18, color: theme.color }}>
            Change Password???
          </Text>
          <FontAwesome
            name="angle-right"
            size={18}
            color={theme.color}
            style={{ marginRight: 20 }}
          />
        </TouchableOpacity>
      </View>
      {/* dark mode */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 50,
          width: "95%",
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#bec0ca",
        }}
      >
        <FontAwesome
          name="moon-o"
          size={15}
          color={theme.color}
          style={{ marginRight: 20 }}
        />
        <Text style={{ fontSize: 20, color: theme.color, fontWeight: "bold" }}>
          Dark Mode
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
          justifyContent: "space-between",
          width: "90%",
          paddingLeft: 10,
        }}
      >
        <Text style={{ fontSize: 18, color: theme.color }}>
          Enable Dark Mode
        </Text>
        <Switch
          value={darkMode}
          onValueChange={(value) => {
            setDarkMode(value);
            EventRegister.emit("ChangeTheme", value);
          }}
        />
      </View>
      {/* logout */}
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            backgroundColor: "#E0DEDE",
            borderRadius: 20,
            padding: 15,
            margin: 10,
            marginTop: 50,
            width: "95%",
          }}
        >
          <Icon name="exit-to-app" size={18} color="#C90076" />
          <Text style={{ fontSize: 20, color: "#C90076" }}>logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default Settings;
