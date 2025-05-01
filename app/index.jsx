import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import withoutAuth from "./components/high-order-component/withoutAuth";
import { useState } from "react";
import { loginUser } from "./api/auth";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { login } from "../redux/slice";

const Index = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await loginUser(loginData);
      if (res.success) {
        dispatch(login(res.data));

        router.push("/(drawer)/(tabs)");
        Alert.alert("wahhh");
        console.log("success");

      } else {
        Alert.alert(res.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <View style={styles.loginData}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          value={loginData.email}
          autoCapitalize="none"
          onChangeText={(text) => setLoginData({ ...loginData, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={true}
          autoCapitalize="none"
          value={loginData.password}
          onChangeText={(text) =>
            setLoginData({ ...loginData, password: text })
          }
        />
        <TouchableOpacity
          style={[styles.click, loading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.Box}>Log ako</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default withoutAuth(Index);

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  text: {
    fontSize: 30,
    padding: 5,
    fontWeight: "bold",
  },
  Box: {
    fontSize: 20,
    padding: 5,
    color: "#fff",
  },
  register: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  click: {
    backgroundColor: "lightblue",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    width: "100%",
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: "#a0c4ff",
  },
  loginData: {
    width: "80%",
    marginTop: 20,
    alignItems: "center"
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    width: "100%"
    
  },
});
