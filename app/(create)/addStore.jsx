import React, { useContext, useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { createStore } from "../api/stores";
import { themeContext } from "../theme/themeContext";

export default function addStore() {
  const [storeData, setStoreData] = useState({
    name: "",
    address: "",
    contact_number: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext);

  const handleAdd = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    createStore(storeData)
      .then((res) => {
        if (res) {
          Alert.alert("Store Added Successfully");
          router.back();
        }
      })
      .catch(() => {
        Alert.alert("Something went wrong");
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.pageBackground }]}>
      <View style={styles.main}>
        <Text style={[styles.label, { color: theme.button.profileText }]}>NAME OF STORE:</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#FFF"
          value={storeData.name}
          onChangeText={(text) => setStoreData({ ...storeData, name: text })}
        />
        <Text style={[styles.label, { color: theme.button.profileText }]}>ADDRESS:</Text>
        <TextInput
          style={styles.input}
          placeholder="Address"
          placeholderTextColor="#FFF"
          value={storeData.address}
          onChangeText={(text) => setStoreData({ ...storeData, address: text })}
        />
        <Text style={[styles.label, { color: theme.button.profileText }]}>CONTACT NUMBER:</Text>
        <TextInput
          style={styles.input}
          placeholder="contact_number"
          placeholderTextColor="#FFF"
          value={storeData.contact_number}
          onChangeText={(text) =>
            setStoreData({ ...storeData, contact_number: text })
          }
        />
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#Cbd5e1" }]}
        onPress={handleAdd}
      >
        <Text style={[styles.buttonText, { color: theme.button.profileIcon }]}>
          ADD
        </Text>
      </TouchableOpacity>
    </View>
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
