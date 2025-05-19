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
import { useContext, useState } from "react";
import { loginUser } from "./api/auth";
import { useDispatch } from "react-redux";
import { useRouter } from "expo-router";
import { login } from "../redux/slice";
import { MaterialIcons } from "@expo/vector-icons";
import { themeContext } from "./theme/themeContext";

const Index = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useContext(themeContext);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await loginUser(loginData);
      if (res.success) {
        dispatch(login(res.data));

        router.push("/(drawer)/(tabs)");
        Alert.alert("Welcom to WMS", "You are logged in successfully");
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
      <View style={styles.iconContainer}>
        <MaterialIcons
          style={styles.icon}
          name="warehouse"
          size={40}
          color={theme.color}
        />
      </View>
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
            <Text style={styles.Box}>Log in</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default withoutAuth(Index);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  iconContainer: {
    marginTop: "40%", 
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#c4d0e3",
    borderRadius: 50,
    width: 80,
    height:80,
  },
  icon: {
    color: "#fff",
  },
  Box: {
    padding: 5,
    color: "#fff",
    borderRadius:13
  },
  register: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  click: {
    backgroundColor: "#c4d0e3",
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
    marginTop:"30%",
    flex: 1,
    alignItems: "center",
    width: "80%",
  },
  input: {
    height: 55,
    borderColor:"#c4d0e3",
    borderWidth: 1,
    borderRadius: 13,
    marginBottom: 10,
    paddingHorizontal: 10,
    width:"100%" ,
  },
});
