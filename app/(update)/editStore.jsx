import React, { useEffect, useState, useContext } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getStoresById, updateStore } from "../api/stores";
import { themeContext } from "../theme/themeContext";

export default function editStore() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [storeData, setStoreData] = useState({
    name: "",
    address: "",
    contact_number: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext);

  useEffect(() => {
    getStoresById(id).then((res) => {
      setStoreData(res.data);
    });
  }, [id]);

  const handleUpdate = () => {
    console.log("Payload being sent:", storeData);
    setIsLoading(true);
    updateStore(id, storeData)
      .then(() => {
        Alert.alert("Store Updated Successfully");
        router.replace('/stores');
      })
      .catch((error) => {
        console.error("Update failed:", error);
        Alert.alert("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.pageBackground }]}>
      <View style={[styles.main]}>
        <Text style={[styles.label, { color: theme.button.profileText }]}>
          NAME OF STORE:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={storeData.name}
          onChangeText={(text) => setStoreData({ ...storeData, name: text })}
        />
        <Text style={[styles.label, { color: theme.button.profileText }]}>ADDRESS:</Text>
        <TextInput
          style={styles.input}
          placeholder="Address"
          value={storeData.address}
          onChangeText={(text) => setStoreData({ ...storeData, address: text })}
        />
        <Text style={[styles.label, { color: theme.button.profileText }]}>
          CONTACT NUMBER:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={storeData.contact_number}
          onChangeText={(text) =>
            setStoreData({ ...storeData, contact_number: text })
          }
        />
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor:"#Cbd5e1" },
        ]}
        onPress={handleUpdate}
      >
        <Text style={[styles.buttonText, {color: theme.button.profileIcon}]}>UPDATE</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
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
