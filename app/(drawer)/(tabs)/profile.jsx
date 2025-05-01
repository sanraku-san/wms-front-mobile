import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useContext } from "react";
import { themeContext } from "../../theme/themeContext";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch and useSelector
import { logout as logoutAction } from "../../../redux/slice"; // Import your logout action
import { logout as logoutAPI } from "../../api/auth"; // Import your API logout function
import { router } from "expo-router"; // Import useRouter for navigation
import { ScrollView } from "react-native-gesture-handler";

import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const theme = useContext(themeContext);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token); // Get the token from Redux

  const handleLogout = async () => {
    try {
      const res = await logoutAPI(token);
      if (res.success) {
        dispatch(logoutAction()); // Clear Redux state
        router.back(); // Navigate to login screen
        // Optionally, show a success message
      } else {
        console.error("Logout failed:", res.message);
        // Optionally, show an error message
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally, show an error message
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.pageBackground }}
      edges={["bottom"]}
    >
      <StatusBar translucent backgroundColor="transparent" />
      <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
        <View
          style={{
            flex: 1,
            position: "relative",
            backgroundColor: theme.pageBackground,
            alignItems: "center",
          }}
        >
          {/* image and name */}
          <View style={[styles.imgView, { backgroundColor: "#0e1111" }]}>
            <ImageBackground
              source={require("@/assets/images/warehouse.jpg")}
              style={styles.imgBg}
              imageStyle={{ opacity: 0.2 }}
            >
              <Image
                source={require("@/assets/images/profile.jpg")}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 500,
                  margin: 10,
                  shadowColor: "#fff",
                  shadowOpacity: 1,
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 500,
                  elevation: 5,
                }}
              />
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                }}
              >
                Employee Name
              </Text>
            </ImageBackground>
          </View>

          {/* edit button */}
          <View style={styles.edit}>
            <View
              style={{
                backgroundColor: theme.button.profileButtonBg,
                borderRadius: 10,
                padding: 10,
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  gap: 8,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name="account-edit"
                  size={20}
                  color={theme.button.profileIcon}
                />
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: "bold",
                    color: theme.button.profileIcon,
                  }}
                >
                  EDIT PROFILE
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* other info */}
          <View style={styles.infoView}>
            {/* username */}
            <View style={styles.perInfoView}>
              <View style={styles.InfoIconView}>
                <Icon
                  name="at"
                  size={20}
                  color={theme.color}
                  style={{ marginRight: 20 }}
                />
                <Text style={[styles.infoTitle, { color: theme.color }]}>
                  Username
                </Text>
              </View>
              <View style={styles.infoTextView}>
                <Text style={[styles.infoText, { color: theme.color }]}>
                  employeeusername
                </Text>
              </View>
            </View>
            {/* email */}
            <View style={styles.perInfoView}>
              <View style={styles.InfoIconView}>
                <Icon
                  name="email"
                  size={20}
                  color={theme.color}
                  style={{ marginRight: 20 }}
                />
                <Text style={[styles.infoTitle, { color: theme.color }]}>
                  Email
                </Text>
              </View>
              <View style={styles.infoTextView}>
                <Text style={[styles.infoText, { color: theme.color }]}>
                  admin@email.com
                </Text>
              </View>
            </View>
            {/* contact number */}
            <View style={styles.perInfoView}>
              <View style={styles.InfoIconView}>
                <Icon
                  name="cellphone"
                  size={20}
                  color={theme.color}
                  style={{ marginRight: 20 }}
                />
                <Text style={[styles.infoTitle, { color: theme.color }]}>
                  Contact Number
                </Text>
              </View>
              <View style={styles.infoTextView}>
                <Text style={[styles.infoText, { color: theme.color }]}>
                  +63 999-999-9999
                </Text>
              </View>
            </View>
          </View>

         
        
        
          
        </View>
         {/* logout */}
         <View
            style={{
              alignContent: "center",
              justifyContent: "center",
              width: "95%",
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                // flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                backgroundColor: "#E0DEDE",
                borderRadius: 20,
                padding: 15,
                margin: 10,
                width: "100%",
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", width: "100%", justifyContent: "center" }}>
                <Icon name="exit-to-app" size={20} color="#C90076" />
                <Text
                  style={{ fontSize: 20, color: "#C90076", marginLeft: 10 }}
                >
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    width: "100%",
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#272e50",
    width: 100,
    height: 100,
    borderRadius: 100,
  },
  line: {
    backgroundColor: "black",
    height: 0.5,
    marginTop: 10,
    marginHorizontal: 0,
    width: "30%",
  },
  edit: {
    padding: 1,
    marginTop: 10,
  },
  log: {
    borderRadius: 9,
    padding: 8,
    marginBottom: 10,
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  imgView: {
    width: "100%",
    height: 300,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  imgBg: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  infoView: {
    alignItems: "flex-start",
    marginTop: 30,
    width: "100%",
    padding: 10,
  },
  perInfoView: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#bec0ca",
    paddingBottom: 20,
    marginBottom: 20,
  },
  InfoIconView: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  infoTextView: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    justifyContent: "space-between",
    paddingLeft: 20,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 18,
    marginLeft: 30,
  },
});
