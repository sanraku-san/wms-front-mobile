import React, { useContext, useState, useCallback } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { createStore } from "../api/stores";
import { themeContext } from "../theme/themeContext";
import { selectAuth } from "@/redux/slice";
import { useSelector } from "react-redux";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";

export default function addStore() {
  const [storeData, setStoreData] = useState({
    name: "",
    address: "",
    contact_number: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext);
  const { token } = useSelector(selectAuth);

  const handleAdd = useCallback(() => {
    if (!storeData.name || !storeData.address || !storeData.contact_number) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // ph num
    if (storeData.contact_number.length === 11) {
      if (!storeData.contact_number.startsWith("09")) {
        Alert.alert("Error", "Please enter a valid Philippine mobile number");
        alert("Error", "Please enter a valid Philippine mobile number");
        console.log("Please enter a valid Philippine mobile number / 09");
        return;
      }
    } else if (storeData.contact_number.length === 12) {
      if (!storeData.contact_number.startsWith("+63")) {
        Alert.alert("Error", "Please enter a valid Philippine mobile number");
        alert("Error", "Please enter a valid Philippine mobile number");
        console.log("Please enter a valid Philippine mobile number / +63");
        return;
      }
    } else if (storeData.contact_number.length === 13) {
      if (!storeData.contact_number.startsWith("0063")) {
        Alert.alert("Error", "Please enter a valid Philippine mobile number");
        alert("Error", "Please enter a valid Philippine mobile number");
        console.log("Please enter a valid Philippine mobile number / ");
        return;
      }
    } else {
      Alert.alert("Error", "Please enter a valid Philippine mobile number");
      alert("Error", "Please enter a valid Philippine mobile number");
      console.log("Please enter a valid Philippine mobile number");
      return;
    }

    setIsLoading(true);
    console.log("Submitting store data:", storeData);

    if (token) {
      createStore(token, storeData)
        .then((res) => {
          setIsLoading(false);
          if (res) {
            Alert.alert("Success", "Transaction added successfully");
            setStoreData({
              name: "",
              address: "",
              contact_number: "",
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Store creation error:", error);
          Alert.alert(
            "Error",
            error.message || "Something went wrong with creating the store"
          );
        });
      router.push("/(drawer)/stores");
    } else {
      setIsLoading(false);
      console.warn("Authentication token not found");
      Alert.alert("Authentication Required", "Please log in to create a store");
      router.replace("/");
    }
  }, [token, storeData]);

  const handlePhoneChange = (text) => {
    setStoreData({ ...storeData, contact_number: text });
  };

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
          onPress={() => router.push("stores")}
          style={{
            padding: 8,
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <Icon3 name="arrow-left" size={18} color={theme.color} />
          <Text style={{ color: theme.color, fontSize: 16 }}>Back</Text>
        </TouchableOpacity>
      </View>
      <View
        style={[styles.container, { backgroundColor: theme.pageBackground }]}
      >
        <View style={styles.main}>
          <Text style={[styles.label, { color: theme.button.profileText }]}>
            NAME OF STORE:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#FFF"
            value={storeData.name}
            onChangeText={(text) => setStoreData({ ...storeData, name: text })}
          />
          <Text style={[styles.label, { color: theme.button.profileText }]}>
            ADDRESS:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#FFF"
            value={storeData.address}
            onChangeText={(text) =>
              setStoreData({ ...storeData, address: text })
            }
          />
          <Text style={[styles.label, { color: theme.button.profileText }]}>
            CONTACT NUMBER:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="09XXXXXXXXX or +63XXXXXXXXX"
            placeholderTextColor="#FFF"
            value={storeData.contact_number}
            onChangeText={handlePhoneChange}
            maxLength={13}
            keyboardType="phone-pad"
          />
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#Cbd5e1" }]}
          onPress={handleAdd}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.button.profileIcon} />
          ) : (
            <Text
              style={[styles.buttonText, { color: theme.button.profileIcon }]}
            >
              ADD
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    padding: 10,
    flexDirection: "column",
  },
  main: {
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    color: "white",
    marginBottom: 3,
  },
  input: {
    width: "98%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#Cbd5e1",
  },
  button: {
    backgroundColor: "#020817",
    padding: 10,
    width: "98%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});
