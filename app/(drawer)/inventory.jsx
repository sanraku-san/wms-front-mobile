import {
  FlatList,
  Text,
  View,
  RefreshControl,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Pressable,
} from "react-native";
import React, { useCallback, useState, useContext, useEffect } from "react";
import { useFocusEffect } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { Barcode } from "expo-barcode-generator";
import { getProducts, deleteProduct } from "../api/products";
import { router } from "expo-router";
import { FAB } from "react-native-paper";
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";
import { themeContext } from "../theme/themeContext";
import { selectAuth } from "@/redux/slice";
import { useSelector } from "react-redux";

const forFilter = [
  { label: "All Items", value: 1 },
  { label: "Food", value: 2 },
  { label: "Clothing", value: 3 },
  { label: "Electronics", value: 4 },
  { label: "Furniture", value: 5 },
  { label: "Toys", value: 6 },
];

const forSortBy = [
  { label: "Name (A-Z)", value: 1 },
  { label: "Name (Z-A)", value: 2 },
  { label: "Price (Low-High)", value: 3 },
  { label: "Price (High-Low)", value: 4 },
  { label: "Item Code", value: 5 },
];

function Inventory() {
  const [productdata, setProductData] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortedBy, setSortedBy] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const theme = useContext(themeContext);
  const { token } = useSelector(selectAuth);

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this Product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteProduct(id, token)
              .then((res) => {
                if (res) {
                  Alert.alert("Product deleted successfully");
                  refreshData();
                }
              })
              .catch(() => {
                Alert.alert("Something went wrong while deleting the product");
              });
          },
        },
      ]
    );
  };
  
  const refreshData = useCallback(() => {
    if (token) {
      // Ensure you have a token before making the API call
      getProducts(token) // Pass the token here
        .then((res) => {
          if (res && res.data) {
            setProductData(res.data);
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

  // pang sort dropdown function
  useEffect(() => {
    let filteredData = [...productdata];

    // Apply category filtering
    if (filter) {
      switch (filter) {
        case 1: // All Items
          // No filtering needed
          break;
        case 2: // Food
          filteredData = filteredData.filter(
            (item) => item.category?.name?.toLowerCase() === "food"
          );
          break;
        case 3: // Clothing
          filteredData = filteredData.filter(
            (item) => item.category?.name?.toLowerCase() === "clothing"
          );
          break;
        case 4: // Electronics
          filteredData = filteredData.filter(
            (item) => item.category?.name?.toLowerCase() === "electronics"
          );
          break;
        case 5: // Furniture
          filteredData = filteredData.filter(
            (item) => item.category?.name?.toLowerCase() === "furniture"
          );
          break;
        case 6: // Toys
          filteredData = filteredData.filter(
            (item) => item.category?.name?.toLowerCase() === "toys"
          );
          break;
        default:
          break;
      }
    }

    // Apply sorting (your existing sorting logic)
    if (sortBy) {
      switch (sortBy) {
        case 1: //name asc
          filteredData.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 2: //name desc
          filteredData.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 3: //asc
          filteredData.sort((a, b) => a.price - b.price);
          break;
        case 4: //desc
          filteredData.sort((a, b) => b.price - a.price);
          break;
        case 5: //item code
          filteredData.sort((a, b) => a.barcode.localeCompare(b.barcode));
          break;
        default:
          break;
      }
    }

    setSortedBy(filteredData);
  }, [
    productdata,
    sortBy,
    filter,
    // searchText
  ]); // Add searchText to the dependency array

  // Function to reset all filters and sorting
  const resetFilters = () => {
    // setSearchText("");
    setFilter("");
    setSortBy("");
  };

  const handleAdd = () => {
    router.replace("/(create)/addProducts");
  };
  const pushToEdit = (id) => {
    router.replace({ pathname: "/(update)/editProduct", params: { id } });
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

  const actions = {
    text: "Add",
    name: "bt_accessibility",
    position: 2,
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
                placeholder="Search Inventory"
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
        data={sortedBy.length > 0 ? sortedBy : productdata}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={refreshData} />
        }
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "productView",
                params: { id: item.id },
              })
            }
          >
            <View style={[styles.main]}>
              <View
                style={[
                  styles.card,
                  { backgroundColor: theme.card.backgroundColor },
                  { borderColor: theme.card.borderColor },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      backgroundColor: theme.imageBackground,
                      borderRadius: 4,
                    }}
                  >
                    <Image
                      source={require("../../assets/images/box.jpg")}
                      style={styles.productImage}
                    />
                    <View style={styles.barcodeContainer}>
                      <Barcode
                        value={item.barcode}
                        options={{
                          format: "CODE128",
                          height: 20,
                          width: 1,
                          fontSize: 15,
                          borderWidth: 1,
                          lineColor: theme.button.profileText,
                        }}
                      />
                    </View>
                  </View>
                  <View style={styles.card2}>
                    <Text style={[styles.text, { color: theme.item.title }]}>
                      {item.name}
                    </Text>
                    <Text
                      style={[styles.type1, { color: theme.item.category }]}
                    >
                      {item.category?.name}
                    </Text>
                    <Text style={[styles.type1, { color: theme.item.price }]}>
                      ${item.price}
                    </Text>
                  </View>
                </View>
                <View>
                  <TouchableOpacity
                    onPress={() => pushToEdit(item.id)}
                    style={[styles.btn, { backgroundColor: theme.button.edit }]}
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
                      { backgroundColor: theme.button.delete },
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
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No inventory items found</Text>
          </View>
        )}
        style={{ flex: 1 }} // Add flex:1 to the FlatList
        contentContainerStyle={{ paddingBottom: 80 }} // Add padding to the bottom
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

export default Inventory;

const styles = StyleSheet.create({
  main: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
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
  },
  card2: {
    padding: 5,
    flex: 1,
    gap: 10,
    marginLeft: 18,
    marginTop: 30,
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
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#FFF",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    margin: 10,
    alignSelf: "center",
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    zIndex: 1000,
    borderRadius: 50,
  },
  barcodeContainer: {
    alignItems: "center",
    marginTop: 5,
  },
  btn: {
    border: 3,
    borderRadius: 5,
    marginBottom: 10,
    padding: 5,
  },
});


