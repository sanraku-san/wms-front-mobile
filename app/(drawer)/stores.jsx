import {
  FlatList,
  Text,
  View,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useCallback, useState, useContext, useEffect } from "react";
import { useFocusEffect, router } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { deleteStore, getStores } from "../api/stores";
import { FAB } from "react-native-paper";
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";
import { themeContext } from "../theme/themeContext";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/slice";

const forFilter = [
  { label: "All Stores", value: 1 },
  { label: "ewan", value: 2 },
  { label: "etu", value: 3 },
  { label: "etri", value: 4 },
];

const forSortBy = [
  { label: "Name (A-Z)", value: 1 },
  { label: "Name (Z-A)", value: 2 },
  { label: "Address (A-Z)", value: 3 },
  { label: "Address (Z-A)", value: 4 },
];

function Stores() {
  const [storesdata, setStoresData] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortedBy, setSortedBy] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const theme = useContext(themeContext);
  const { token } = useSelector(selectAuth);

  const handleAdd = () => {
    router.push("/(create)/addStore");
  };
  const pushToEdit = (id) => {
    router.push({ pathname: "/(update)/editStore", params: { id } });
  };
  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this Store?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteStore(id, token)
              .then((res) => {
                if (res) {
                  Alert.alert("Store deleted successfully");
                  refreshData();
                }
              })
              .catch(() => {
                Alert.alert("Something went wrong while deleting the store");
              });
          },
        },
      ]
    );
  };

  const refreshData = useCallback(() => {
      if (token) { // Ensure you have a token before making the API call
        getStores(token) // Pass the token here
          .then((res) => {
            if (res && res.data) {
              setStoresData(res.data);
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
    let forSort = [...storesdata];

    if (sortBy) {
      switch (sortBy) {
        case 1: //name asc
          forSort.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 2: //name desc
          forSort.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 3: //address asc
          forSort.sort((a, b) => a.address.localeCompare(b.address));
          break;
        case 4: //address desc
          forSort.sort((a, b) => b.address.localeCompare(a.address));
          break;
        default:
          break;
      }
    }

    setSortedBy(forSort);
  }, [storesdata, sortBy]);

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
                placeholder="Search Store"
                placeholderTextColor={theme.search.placeholderColor}
                textColor={theme.search.color}
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
        data={sortedBy.length > 0 ? sortedBy : storesdata}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={refreshData} />
        }
        renderItem={({ item }) => (
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
                    {item.name}
                  </Text>
                  <Text style={[styles.type1, { color: theme.item.address }]}>
                    {item.address}
                  </Text>
                  <Text style={[styles.type1, { color: theme.item.contact }]}>
                    {item.contact_number}
                  </Text>
                </View>
              </View>
              <View style={{ gap: 10 }}>
                <TouchableOpacity
                  onPress={() => pushToEdit(item.id)}
                  style={[
                    styles.btn,
                    { backgroundColor: theme.button.backgroundColor },
                  ]}
                >
                  <Icon3
                    name="store-edit"
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
        )}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No stores found</Text>
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
    padding: 10, // Changed paddingTop to padding for consistent spacing
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#Cbd5e1",
    borderRadius: 4,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center", // Added to vertically align items
  },
  card2: {
    padding: 2,
    flex: 1, // Added to allow text to take up available space
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  type1: {
    fontSize: 14,
    marginBottom: 3,
  },
  dropdown: {
    height: 50,
    borderColor: "#c4d0e3",
    borderWidth: 0.5,
    borderRadius: 4,
    paddingHorizontal: 8,
    margin: 10,
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
    borderColor: "black",
    borderRadius: 5,
    marginBottom: 10,
    padding: 5,
  },
});

export default Stores;
