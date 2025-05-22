import { View, Text, Switch, TouchableOpacity } from "react-native";
import React, { useState, useContext } from "react";
import { themeContext } from "../theme/themeContext";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";

export default function tryAgain() {
  
  const theme = useContext(themeContext);
  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 30,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("(tabs)")}
          style={{
            padding: 8,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Icon name="arrow-left" size={18} color={theme.color} />
          <Text style={{ color: theme.color, fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 30 }}>dapat wala 'tong page sa drawer..</Text>
      </View>
    </>
  );
}
