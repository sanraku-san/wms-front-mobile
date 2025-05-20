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
import React, { useCallback, useState, useContext, useEffect, useRef, useMemo } from "react";
import { useFocusEffect } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import FA from "react-native-vector-icons/FontAwesome6";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { getProducts, deleteProduct } from "../api/products";
import { router } from "expo-router";
import { FAB } from "react-native-paper";
import { themeContext } from "../theme/themeContext";
import { selectAuth } from "@/redux/slice";
import { useSelector } from "react-redux";
import { URL } from "../api/configuration";

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
  const [refresh, setRefresh] = useState(false);
  const [searchText, setSearchText] = useState("");
  const theme = useContext(themeContext);
  const { token } = useSelector(selectAuth);
  

  console.log("product data", productdata)
  // Add ref for TextInput to maintain focus
  const searchInputRef = useRef(null);

  const handleDelete = useCallback((id) => {
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
  }, [token]);

  const refreshData = useCallback(() => {
    if (token) {
      getProducts(token)
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
      router.replace("");
    }
  }, [token]);

  useFocusEffect(refreshData);

  // Enhanced search function with debouncing (optional)
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchText]);

  // Memoize filtered and sorted data to prevent unnecessary re-renders
  const sortedBy = useMemo(() => {
    let filteredData = [...productdata];

    // Apply search filtering first - enhanced search
    if (debouncedSearchText) {
      const searchLower = debouncedSearchText.toLowerCase().trim();
      filteredData = filteredData.filter((item) => {
        const searchableFields = [
          item.name,
          item.barcode,
          item.category?.name,
          item.price?.toString(), // Include price in search
        ].filter(Boolean); // Remove null/undefined values

        return searchableFields.some(field => 
          field.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply category filtering
    if (filter) {
      switch (filter) {
        case 1: // All Items
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

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 1: // name asc
          filteredData.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 2: // name desc
          filteredData.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 3: // price asc
          filteredData.sort((a, b) => a.price - b.price);
          break;
        case 4: // price desc
          filteredData.sort((a, b) => b.price - a.price);
          break;
        case 5: // item code
          filteredData.sort((a, b) => a.barcode.localeCompare(b.barcode));
          break;
        default:
          break;
      }
    }

    return filteredData;
  }, [productdata, sortBy, filter, debouncedSearchText]);

  // Function to reset all filters and sorting
  const resetFilters = useCallback(() => {
    setSearchText("");
    setFilter("");
    setSortBy("");
    // Keep focus on search input after reset
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);

  const handleAdd = useCallback(() => {
    router.replace("/(create)/addProducts");
  }, []);

  const pushToEdit = useCallback((id) => {
    router.replace({ pathname: "/(update)/editProduct", params: { id } });
  }, []);

  // Memoize the search input to prevent re-renders
  const SearchInput = useMemo(() => (
    <TextInput
      ref={searchInputRef}
      outlineColor="#c4d0e3"
      activeOutlineColor="#fff"
      style={{
        margin: 15,
        marginBottom: 5,
        backgroundColor: theme.search.backgroundColor,
      }}
      mode="outlined"
      placeholder="Search by name, barcode, category, price..."
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
      right={
        searchText ? (
          <TextInput.Icon
            icon={() => (
              <Icon
                name="times"
                size={16}
                color={theme.search.iconPlaceholderColor}
              />
            )}
            onPress={() => {
              setSearchText("");
              searchInputRef.current?.focus();
            }}
          />
        ) : null
      }
      value={searchText}
      onChangeText={setSearchText}
      theme={{ roundness: 4 }}
      selectTextOnFocus={true}
      blurOnSubmit={false}
      autoCorrect={false}
      autoCapitalize="none"
      keyboardType="default"
    />
  ), [searchText, theme, setSearchText]);

  const renderDropdown = useCallback((item) => {
    return (
      <View
        style={{
          padding: 10,
          backgroundColor: theme.background,
        }}
      >
        <Text style={{ fontSize: 15, color: theme.dropdown.color }}>
          {item.label}
        </Text>
      </View>
    );
  }, [theme]);

  const renderItem = useCallback(({ item }) => (
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
              source={
                item.image 
                  ? { 
                    uri: item.image.startsWith('http') 
                      ? item.image 
                      : `${URL}/${item.image}`
                  } 
                : require("../../assets/images/box.jpg")
              }
              style={styles.productImage}
              // Add error handling to fall back to default image if the URL fails to load
              onError={(e) => {
                console.log("Image failed to load:", e.nativeEvent.error);
                // The Image component will automatically try the default source if the URI fails
              }}
            />
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
              <Text style={[styles.type1, { color: theme.text.price }]}>
                ₱{item.price}
              </Text>
              <Text style={[styles.barcode, { color: theme.item.barcode }]}>
                Code: {item.barcode}
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity
              onPress={() => pushToEdit(item.id)}
              style={[styles.btn, { backgroundColor: theme.button.bg}]}
            >
              <FA
                name="edit"
                size={10}
                color={theme.button.edit}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={[
                styles.btn,
                { backgroundColor: theme.button.bg},
              ]}
            >
              <FA
                name="trash"
                size={10}
                color={theme.button.delete}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Pressable>
  ), [theme, pushToEdit, handleDelete]);

  const ListHeaderComponent = useMemo(() => (
    <View>
      <View>
        {SearchInput}
        {/* {(searchText || filter || sortBy) && (
          <TouchableOpacity
            onPress={resetFilters}
            style={styles.resetButton}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        )}
        {searchText && sortedBy.length > 0 && (
          <Text style={[styles.searchResults, { color: theme.text.secondary }]}>
            Found {sortedBy.length} result{sortedBy.length !== 1 ? 's' : ''}
          </Text>
        )} */}
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
  ), [SearchInput, searchText, filter, sortBy, resetFilters, sortedBy.length, theme, renderDropdown]);

  const ListEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Icon name="search" size={50} color="#6B7280" style={{ marginBottom: 10 }} />
      <Text style={[styles.emptyText, { color: theme.text.secondary }]}>
        {searchText || filter || sortBy 
          ? "No items match your search criteria" 
          : "No inventory items found"}
      </Text>
      {(searchText || filter || sortBy) && (
        <TouchableOpacity onPress={resetFilters} style={styles.clearFiltersButton}>
          <Text style={styles.clearFiltersText}>Clear all filters</Text>
        </TouchableOpacity>
      )}
    </View>
  ), [searchText, filter, sortBy, resetFilters, theme]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.pageBackground }}>
      <FlatList
        ListHeaderComponent={ListHeaderComponent}
        data={sortedBy}
        refreshControl={
          <RefreshControl refreshing={refresh} onRefresh={refreshData} />
        }
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={ListEmptyComponent}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        getItemLayout={(data, index) => (
          {length: 120, offset: 120 * index, index}
        )}
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
    gap: 5,
    marginLeft: 18,
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
  barcode: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
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
    padding: 40,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
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
    padding: 8,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  resetButton: {
    alignSelf: "flex-end",
    marginRight: 15,
    marginBottom: 5,
    padding: 5,
  },
  resetButtonText: {
    color: "#6B7280",
    fontSize: 12,
  },
  searchResults: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 10,
    fontStyle: "italic",
  },
  clearFiltersButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#6B7280",
    borderRadius: 5,
  },
  clearFiltersText: {
    color: "white",
    fontSize: 14,
  },
});