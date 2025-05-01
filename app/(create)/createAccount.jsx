import { useContext, useState } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { router } from "expo-router";
import { createUser } from "../api/accounts";
import { themeContext } from "../theme/themeContext";

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

  const handleAdd = () => {
    setIsLoading(true);
    console.log(userData);
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    createUser(userData)
      .then((res) => {
        if (res) {
          Alert.alert("New Account!");
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
        >
          <Text
            style={[
              styles.buttonText,
              { color: theme.button.profileIcon },
              { fontWeight: "bold" },
            ]}
          >
            CREATE
          </Text>
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
