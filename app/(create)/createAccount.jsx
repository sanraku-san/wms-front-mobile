import { useContext, useState, useCallback } from "react";
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
import { createUser } from "../api/accounts";
import { themeContext } from "../theme/themeContext";
import { selectAuth } from "@/redux/slice";
import { useSelector } from "react-redux";

export default function createAccount() {
  const [userData, setUserData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    password: "",
    contact_number: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext);
  const { token } = useSelector(selectAuth);

  const handleAdd = useCallback(() => {
    if (
      !userData.first_name ||
      !userData.last_name ||
      !userData.username ||
      !userData.email ||
      !userData.password ||
      !userData.contact_number
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setIsLoading(true);
    console.log("Submitting new account data:", userData);

    if (token) {
      createUser(token, userData)
        .then((res) => {
          setIsLoading(false);
          if (res) {
            Alert.alert("Success", "Account added successfully");
            // clear form
            setUserData({
              first_name: "",
              last_name: "",
              username: "",
              email: "",
              password: "",
              contact_number: null,
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Account creation error:", error);
          Alert.alert(
            "Error",
            error.message || "Something went wrong with creating the account"
          );
        });
      router.push("/(drawer)/accounts");
    } else {
      setIsLoading(false);
      console.warn("Authentication token not found");
      Alert.alert(
        "Authentication Required",
        "Please log in to create a account"
      );
      router.replace("/");
    }
  }, [token, userData]);

  return (
    <View style={[styles.container, { backgroundColor: theme.pageBackground }]}>
      <View style={styles.main}>
        <Text
          style={[
            styles.label,
            { fontWeight: "bold" },
            { color: theme.button.profileText },
            { marginBottom: 3 },
          ]}
        >
          FIRST NAME:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="First Name"
          placeholderTextColor="#FFF"
          value={userData.first_name}
          onChangeText={(text) =>
            setUserData({ ...userData, first_name: text })
          }
        />
        <Text
          style={[
            styles.label,
            { fontWeight: "bold" },
            { color: theme.button.profileText },
            { marginBottom: 3 },
          ]}
        >
          LAST NAME:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Last Name"
          placeholderTextColor="#FFF"
          value={userData.last_name}
          onChangeText={(text) => setUserData({ ...userData, last_name: text })}
        />
        <Text
          style={[
            { fontWeight: "bold" },
            { marginBottom: 3 },
            { color: theme.button.profileText },
          ]}
        >
          USERNAME:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#FFF"
          value={userData.username}
          onChangeText={(text) => setUserData({ ...userData, username: text })}
        />
        <Text
          style={[
            styles.label,
            { fontWeight: "bold" },
            { color: theme.button.profileText },
            { marginBottom: 3 },
          ]}
        >
          PASSWORD:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#FFF"
          value={userData.password}
          onChangeText={(text) => setUserData({ ...userData, password: text })}
        />
        {/* lagay tayo ng confirm password flis */}
        <Text
          style={[
            styles.label,
            { fontWeight: "bold" },
            { color: theme.button.profileText },
            { marginBottom: 3 },
          ]}
        >
          EMAIL:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#FFF"
          value={userData.email}
          onChangeText={(text) => setUserData({ ...userData, email: text })}
        />
        <Text
          style={[
            styles.label,
            { fontWeight: "bold" },
            { color: theme.button.profileText },
            { marginBottom: 3 },
          ]}
        >
          CONTACT NUMBER:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Contact_Number"
          placeholderTextColor="#FFF"
          value={userData.contact_number}
          onChangeText={(text) =>
            setUserData({ ...userData, contact_number: text })
          }
        />

        <TouchableOpacity
          style={[
            { backgroundColor: "#c4d0e3" },
            { padding: 10 },
            { width: "98%" },
            { height: 50 },
            { borderWidth: 1 },
            { borderRadius: 4 },
            { justifyContent: "center" },
            { alignItems: "center" },
            { marginTop: 90 },
          ]}
          onPress={handleAdd}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={theme.button.profileIcon} />
          ) : (
            <Text
              style={[styles.buttonText, { color: theme.button.profileIcon }]}
            >
              CREATE
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    paddingTop: 30,
    padding: 10,
  },
  input: {
    width: "98%",
    height: 50,
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#Cbd5e1",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 3,
  },
});
