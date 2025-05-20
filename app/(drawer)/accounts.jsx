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
import React, { useCallback, useState, useContext, useEffect, useRef, useMemo } from "react";
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
  const [searchText, setSearchText] = useState("");
  const [refresh, setRefresh] = useState(false);
  const theme = useContext(themeContext);
  const { token } = useSelector(selectAuth);

  // Add ref for TextInput to maintain focus
  const searchInputRef = useRef(null);

  // Enhanced search function with debouncing
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleAdd = useCallback(() => {
    router.push("/(create)/createAccount");
  }, []);

  const handleDelete = useCallback((id) => {
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
            deleteUser(id, token)
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
  }, [token]);

  const refreshData = useCallback(() => {
    if (token) {
      getUser(token)
        .then((res) => {
          if (res && res.data) {
            setUserData(res.data);
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

  // Memoize filtered and sorted data to prevent unnecessary re-renders
  const sortedBy = useMemo(() => {
    let filteredData = [...userdata];

    // Apply search filtering first - enhanced search
    if (debouncedSearchText) {
      const searchLower = debouncedSearchText.toLowerCase().trim();
      filteredData = filteredData.filter((item) => {
        const searchableFields = [
          item.profile?.first_name,
          item.profile?.last_name,
          item.username,
          item.email,
          // Add more fields if available
          // item.role,
          // item.id?.toString(),
        ].filter(Boolean); // Remove null/undefined values

        return searchableFields.some(field => 
          field.toLowerCase().includes(searchLower)
        );
      });
    }

    // Apply role filtering
    if (filter) {
      switch (filter) {
        case 1: // All Accounts
          break;
        case 2: // Manager
          filteredData = filteredData.filter((item) => 
            item.role?.toLowerCase() === "manager"
          );
          break;
        case 3: // Staff
          filteredData = filteredData.filter((item) => 
            item.role?.toLowerCase() === "staff"
          );
          break;
        default:
          break;
      }
    }

    // Apply sorting
    if (sortBy) {
      switch (sortBy) {
        case 1: // first name asc
          filteredData.sort((a, b) => 
            (a.profile?.first_name || "").localeCompare(b.profile?.first_name || "")
          );
          break;
        case 2: // first name desc
          filteredData.sort((a, b) => 
            (b.profile?.first_name || "").localeCompare(a.profile?.first_name || "")
          );
          break;
        case 3: // last name asc
          filteredData.sort((a, b) => 
            (a.profile?.last_name || "").localeCompare(b.profile?.last_name || "")
          );
          break;
        case 4: // last name desc
          filteredData.sort((a, b) => 
            (b.profile?.last_name || "").localeCompare(a.profile?.last_name || "")
          );
          break;
        default:
          break;
      }
    }

    return filteredData;
  }, [userdata, sortBy, filter, debouncedSearchText]);

  const pushToEdit = useCallback((id) => {
    router.push({ pathname: "/(update)/editAccount", params: { id } });
  }, []);

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
      placeholder="Search by name, username, email..."
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
        router.push({ pathname: "accountView", params: { id: item.id } })
      }
      style={{ width: "100%" }}
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
              <Text style={[styles.type1, { color: theme.item.address }]}>
                {item.username}
              </Text>
              <Text style={[styles.type1, { color: theme.item.contact }]}>
                {item.email}
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
  ), [theme, pushToEdit, handleDelete]);

  const ListHeaderComponent = useMemo(() => (
    <View>
      <View>
        {SearchInput}
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
  ), [SearchInput, filter, sortBy, theme, renderDropdown]);

  const ListEmptyComponent = useMemo(() => (
    <View style={styles.emptyContainer}>
      <Icon name="search" size={50} color="#6B7280" style={{ marginBottom: 10 }} />
      <Text style={[styles.emptyText, { color: theme.text?.secondary || "#666" }]}>
        {searchText || filter || sortBy 
          ? "No accounts match your search criteria" 
          : "No accounts found"}
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
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={ListEmptyComponent}
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 80 }}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
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
    alignItems: "center",
  },
  card2: {
    padding: 5,
    flex: 1,
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
    padding: 40,
    minHeight: 300,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 10,
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

export default Accounts;