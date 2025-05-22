import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
  StyleSheet,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { getProducts, deleteProduct } from "../api/products";
import { router } from "expo-router";
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";
import { getUserById } from "../api/accounts";
import { selectAuth } from "@/redux/slice";
import { useSelector } from "react-redux";
import { themeContext } from "../theme/themeContext";

import Icon from "react-native-vector-icons/MaterialCommunityIcons";

function AccountView() {
  const [refresh, setRefresh] = useState(false);
  const { id } = useLocalSearchParams();
  const { token } = useSelector(selectAuth);
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext);

  const refreshData = useCallback(() => {
      if (token) {
        getUserById(id, token)
          .then((res) => {
            if (res && res.data) {
              setUserData(res.data);
            } else {
              console.error("Error fetching products:", res);
              Alert.alert("Error", "Failed to fetch products.");
            }
          })
          .catch((error) => {
            console.error("Error fetching products:", error);
            Alert.alert("Error", "Something went wrong while fetching products.");
          });
      } else {
        console.warn("Authentication token not found. Cannot fetch products.");
        Alert.alert("Authentication Required", "Please log in to view products.");
        router.replace("/login");
      }
    }, [id, token]);
  
    useFocusEffect(refreshData);

    
  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this User?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteUser(id)
              .then((res) => {
                if (res) {
                  Alert.alert("User deleted successfully");
                  refreshData();
                }
              })
              .catch(() => {
                Alert.alert("Something went wrong while deleting the User");
              });
          },
        },
      ]
    );
  };
  const pushToEdit = (id) => {
    router.replace({ pathname: "/(update)/editAccount", params: { id } });
  };

  return (
    <>
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 8,
          backgroundColor: theme.background,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 30,
          }}
        >
          <TouchableOpacity
            onPress={() => router.push("accounts")}
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity
              onPress={() => pushToEdit(id)}
              style={{
                border: 3,
                borderColor: "black",
                borderRadius: 5,
                backgroundColor: "#DDD",
                padding: 5,
              }}
            >
              <Icon3 name="account-edit" size={18} color={theme.button.edit} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(id)}
              style={{
                border: 3,
                borderColor: "black",
                borderRadius: 5,
                backgroundColor: "#DDD",
                padding: 5,
              }}
            >
              <Icon2 name="trash-sharp" size={18} color={theme.button.delete} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      >

        
        <View
          style={{
            alignItems: "center",
            padding: 10,
            width: "100%",
            marginTop: 20,
          }}
        >
          <Image
            source={require("@/assets/images/profile.jpg")}
            style={{ width: "85%", height: 300, borderRadius: 8, margin: 10 }}
          />
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            padding: 20,
            paddingTop: 0,
            width: "100%",
            gap: 10,
          }}
        >
          <Text
            style={{ fontWeight: "bold", fontSize: 30, color: theme.color }}
          >
            {userData.profile?.first_name} {userData.profile?.last_name}
          </Text>
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
                {userData.username}
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
                {userData.email}
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
                {userData.profile?.contact_number}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
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

export default AccountView;
