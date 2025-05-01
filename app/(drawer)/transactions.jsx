import { View, Text, Pressable } from "react-native";
import React, {useContext} from "react";
import { router } from "expo-router";
import { themeContext } from "../theme/themeContext";

function Transactions() {
  const handleTry = () => {
    // console.log("try")
    router.push("try");
  };
  const theme = useContext(themeContext);
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: theme.pageBackground,
      }}
    >
      <Pressable
        style={{
          padding: 10,
          margin: 10,
          width: "100%",
          height: 50,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.button.transaction,
          borderRadius: 10,
        }}
        onPress={handleTry}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", color: theme.color }}>
          to try
        </Text>
      </Pressable>
      <Text style={{ fontSize: 30, color: theme.color }}>This is TRANSACTIONS</Text>
    </View>
  );
}

export default Transactions;
