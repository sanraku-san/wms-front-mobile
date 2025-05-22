import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import React, { useCallback, useContext } from "react";
import { themeContext } from "../../theme/themeContext";
import { useDispatch, useSelector } from "react-redux";
import { logout as logoutAction } from "../../../redux/slice";
import { logout as logoutAPI } from "../../api/auth";
import { router, useFocusEffect } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { selectAuth } from "@/redux/slice";
import { useState } from "react";

import { getProfile } from "@/app/api/accounts";
import { URL } from "../../api/configuration";

import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile() {
  const [userProfile, setUserProfile] = useState([]);
  const theme = useContext(themeContext);
  const dispatch = useDispatch();
  const { token } = useSelector(selectAuth);

  const handleLogout = async () => {
    try {
      const res = await logoutAPI(token);
      if (res.success) {
        dispatch(logoutAction());
        router.back(); 
      } else {
        console.error("Logout failed:", res.message);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const refreshData = useCallback(() => {
    if (token) {
      getProfile(token)
        .then((res) => {
          if (res && res.data) {
            setUserProfile(res.data);
            console.log("Res:", res.data);
            console.log("User Profile:", userProfile);
          } else {
            console.error("Error fetching users:", res);
            Alert.alert("Error", "Failed to fetch users.");
          }
        })
        .catch((error) => {
          console.error("Error fetching users:", error);
          Alert.alert("Error", "Something went wrong while fetching users.");
        });
    } else {
      console.warn("Authentication token not found. Cannot fetch users.");
      Alert.alert("Authentication Required", "Please log in to view users.");
      router.replace("/login");
    }
  }, [token]);

  useFocusEffect(refreshData);

  const getProfileImageSource = () => {
    if (userProfile.profile?.image) {
      if (userProfile.profile.image.startsWith('http')) {
        return { uri: userProfile.profile.image };
      } else {
        return { uri: `${URL}/${userProfile.profile.image}` };
      }
    }
    return require("@/assets/images/profile.jpg");
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
          <View style={[styles.imgView, { backgroundColor: "#0e1111" }]}>
            <ImageBackground
              source={require("@/assets/images/warehouse.jpg")}
              style={styles.imgBg}
              imageStyle={{ opacity: 0.2 }}
            >
              <Image
                source={getProfileImageSource()}
                style={{
                  width: 150,
                  height: 150,
                  borderRadius: 500,
                  margin: 10,
                }}
                onError={(e) => {
                  console.log("Profile image failed to load:", e.nativeEvent.error);
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
                {userProfile.profile?.first_name} {userProfile.profile?.last_name}
              </Text>
            </ImageBackground>
          </View>
          <View style={styles.infoView}>
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
                {userProfile.username}
                </Text>
              </View>
            </View>
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
                {userProfile.email}
                </Text>
              </View>
            </View>
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
                {userProfile.profile?.contact_number}
                </Text>
              </View>
            </View>
          </View>
        </View>
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
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <Icon name="exit-to-app" size={20} color="#C90076" />
              <Text style={{ fontSize: 20, color: "#C90076", marginLeft: 10 }}>
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