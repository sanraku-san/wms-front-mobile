import {
  FlatList,
  Text,
  View,
  RefreshControl,
  StyleSheet,
  Alert,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useCallback, useState, useContext, useEffect } from "react";
import { useFocusEffect, router } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { getUser, deleteUser } from "../api/accounts";
import { FAB } from "react-native-paper";
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";
import { themeContext } from "../theme/themeContext";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/slice";

// not working pa ang filter and search
const forFilter = [
  { label: "All Accounts", value: 1 },
  { label: "Manager", value: 2 },
  { label: "Staff", value: 3 },
];

const forSortBy = [
  { label: "First Name (A-Z)", value: 1 },
  { label: "First Name (Z-A)", value: 2 },
  { label: "Last Name (A-Z)", value: 3 },
  { label: "Last Name (Z-A)", value: 4 },
];

function Accounts() {
  const [userdata, setUserData] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortedBy, setSortedBy] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const theme = useContext(themeContext);
  const { token } = useSelector(selectAuth);

  const handleAdd = () => {
    router.push("/(create)/createAccount");
  };

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

  // const refreshData = () => {
  //   getUser().then((res) => {
  //     setUserData(res.data);
  //     console.log(res.data);
  //   });
  // };
  // useFocusEffect(
  //   useCallback(() => {
  //     refreshData();
  //   }, [])
  // );

  const refreshData = useCallback(() => {
      if (token) { // Ensure you have a token before making the API call
        getUser(token) // Pass the token here
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
        // Optionally, redirect the user to the login screen
        router.replace("/login");
      }
    }, [token]); // Add token to the dependency array of useCallback
  
    useFocusEffect(refreshData);

  useEffect(() => {
    let forSort = [...userdata];

    if (sortBy) {
      switch (sortBy) {
        case 1:
          forSort.sort((a, b) =>
            a.profile.first_name.localeCompare(b.profile.first_name)
          );
          break;
        case 2:
          forSort.sort((a, b) =>
            b.profile.first_name.localeCompare(a.profile.first_name)
          );
          break;
        case 3:
          forSort.sort((a, b) =>
            a.profile.last_name.localeCompare(b.profile.last_name)
          );
          break;
        case 4:
          forSort.sort((a, b) =>
            b.profile.last_name.localeCompare(a.profile.last_name)
          );
          break;
        default:
          break;
      }
    }

    setSortedBy(forSort);
  },[userdata, sortBy]);

  const pushToEdit = (id) => {
    router.push({ pathname: "/(update)/editAccount", params: { id } });
  };

  const renderDropdown = (item) => {
    return (
      <View
        style={{
          padding: 10,
          backgroundColor: theme.background, // Apply theme background
        }}
      >
        <Text style={{ fontSize: 15, color: theme.dropdown.color }}>
          {item.label}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.pageBackground }}>
      <FlatList
        ListHeaderComponent={() => (
          <View>
            <View>
              <TextInput
                outlineColor="#c4d0e3"
                activeOutlineColor="#fff"
                style={{
                  margin: 15,
                  marginBottom: 5,
                  backgroundColor: theme.search.backgroundColor,
                }}
                mode="outlined"
                placeholder="Search Account"
                placeholderTextColor={theme.search.placeholderColor}
                textColor={theme.search.color} //color kapag nagtype
                left={
                  <TextInput.Icon
                    icon={() => (
                      <Icon
                        name="search"
                        size={20}
                        color={theme.search.iconPlaceholderColor}
                      />
                    )}
                  />
                }
                theme={{ roundness: 4 }}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 0,
                marginHorizontal: 5,
              }}
            >
              <View style={{ width: "50%", marginBottom: 20 }}>
                <Dropdown
                  style={[
                    styles.dropdown,
                    { backgroundColor: theme.dropdown.backgroundColor },
                  ]}
                  data={forFilter}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Filter"
                  placeholderStyle={{ color: theme.dropdown.placeholderColor }}
                  value={filter}
                  onChange={(item) => setFilter(item.value)}
                  renderItem={renderDropdown}
                />
              </View>
              <View style={{ width: "50%" }}>
                <Dropdown
                  style={[
                    styles.dropdown,
                    { backgroundColor: theme.dropdown.backgroundColor },
                  ]}
                  data={forSortBy}
                  maxHeight={300}
                  labelField="label"
                  valueField="value"
                  placeholder="Sort By"
                  placeholderStyle={{ color: theme.dropdown.placeholderColor }}
                  value={sortBy}
                  onChange={(item) => setSortBy(item.value)}
                  renderItem={renderDropdown}
                />
              </View>
            </View>
          </View>
        )}
        data={sortedBy.length > 0 ? sortedBy : userdata}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={refreshData} />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({ pathname: "accountView", params: { id: item.id } })
            }
            style={{width: "100%"}}
          >
            <View style={styles.main}>
              <View
                style={[
                  styles.card,
                  { backgroundColor: theme.card.backgroundColor },
                ]}
              >
                <View style={{ flexDirection: "row", flex: 1 }}>
                  <View style={styles.card2}>
                    <Text style={[styles.text, { color: theme.item.title }]}>
                      {item.profile?.first_name} {item.profile?.last_name}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: "center", gap: 10, flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => pushToEdit(item.id)}
                    style={[
                      styles.btn,
                      { backgroundColor: theme.button.backgroundColor },
                    ]}
                  >
                    <Icon3
                      name="account-edit"
                      size={20}
                      color={theme.button.color}
                      backgroundColor={theme.button.backgroundColor}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.id)}
                    style={[
                      styles.btn,
                      { backgroundColor: theme.button.backgroundColor },
                    ]}
                  >
                    <Icon2
                      name="trash-sharp"
                      size={20}
                      color={theme.button.color}
                      backgroundColor={theme.button.backgroundColor}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Pressable>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No accounts found</Text>
          </View>
        )}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
      <FAB
        style={[styles.fab, { backgroundColor: theme.fabBackground }]}
        icon="plus"
        mode="elevated"
        color={theme.fabIcon}
        onPress={handleAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: 10,
    alignItems: "center",
    width: "100%",
    justifyContent: "center"
  },
  card: {
    width: "100%",
    flexDirection: "row",
    backgroundColor: "#Cbd5e1",
    borderRadius: 4,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center", // Added for vertical alignment
    // justifyContent: "space-between", // Added for space between content and buttons
  },
  card2: {
    padding: 5,
    flex: 1, // Added to allow text to take up available space
    justifyContent: "space-between",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  type1: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  dropdown: {
    height: 50,
    borderColor: "#c4d0e3",
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    margin: 10,
    backgroundColor: "#Cbd5e1",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    zIndex: 1000,
    backgroundColor: "#c4d0e3",
    borderRadius: 50,
  },
  btn: {
    border: 3,
    borderRadius: 5,
    backgroundColor: "#DDD",
    padding: 5,
  },
});

export default Accounts;
