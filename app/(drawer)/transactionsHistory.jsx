import {
  FlatList,
  Text,
  View,
  RefreshControl,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Pressable,
} from "react-native";
import React, {
  useCallback,
  useState,
  useContext,
  useEffect,
  useRef,
  useMemo,
} from "react";
import { useFocusEffect, router } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { getTransactions, deleteTransaction } from "../api/transactions";
import { themeContext } from "../theme/themeContext";
import { selectAuth } from "@/redux/slice";
import { useSelector } from "react-redux";

const forFilter = [
  { label: "All Transactions", value: 1 },
  { label: "Incoming", value: 2 },
  { label: "Outgoing", value: 3 },
];

const forSortBy = [
  { label: "Date (New)", value: 1 },
  { label: "Date (Old)", value: 2 },
  { label: "Name (A-Z)", value: 3 },
  { label: "Name (Z-A)", value: 4 },
  { label: "Store (A-Z)", value: 5 },
  { label: "Store (Z-A)", value: 6 },
];

function TransactionsHistory() {
  const [historydata, setHistoryData] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortBy, setSortBy] = useState(1);
  const [searchText, setSearchText] = useState("");
  const [refresh, setRefresh] = useState(false);
  const theme = useContext(themeContext);
  const { token } = useSelector(selectAuth);
  const searchInputRef = useRef(null);
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  console.log("History Data:", historydata);

  const refreshData = useCallback(() => {
    if (token) {
      getTransactions(token)
        .then((res) => {
          if (res && res.data) {
            setHistoryData(res.data);
          } else {
            console.error("Error fetching transactions:", res);
            Alert.alert("Error", "Failed to fetch transactions.");
          }
        })
        .catch((error) => {
          console.error("Error fetching transactions:", error);
          Alert.alert(
            "Error",
            "Something went wrong while fetching transactions."
          );
        });
    } else {
      console.warn(
        "Authentication token not found. Cannot fetch transactions."
      );
      Alert.alert(
        "Authentication Required",
        "Please log in to view transactions."
      );
      router.replace("");
    }
  }, [token]);

  useFocusEffect(refreshData);
  const sortedBy = useMemo(() => {
    let filteredData = [...historydata];
    if (debouncedSearchText) {
      const searchLower = debouncedSearchText.toLowerCase().trim();
      filteredData = filteredData.filter((item) => {
        const searchableFields = [
          item.transaction_type?.name,
          item.store?.name,
          item.product?.name,
          item.total_transaction_price?.toString(),
          item.description,
          item.notes,
          ...(item.products
            ? item.products.map((product) => product.name)
            : []),
        ].filter(Boolean);

        return searchableFields.some((field) =>
          field.toLowerCase().includes(searchLower)
        );
      });
    }

    if (filter) {
      switch (filter) {
        case 1:
          break;
        case 2:
          filteredData = filteredData.filter(
            (item) => item.transaction_type?.name?.toLowerCase() === "inbound"
          );
          break;
        case 3:
          filteredData = filteredData.filter(
            (item) => item.transaction_type?.name?.toLowerCase() === "outbound"
          );
          break;
        default:
          break;
      }
    }

    if (sortBy) {
      switch (sortBy) {
        case 1:
          filteredData.sort(
            (a, b) => new Date(b.created_at) - new Date(a.created_at)
          );
          break;
        case 2:
          filteredData.sort(
            (a, b) => new Date(a.created_at) - new Date(b.created_at)
          );
          break;
        case 3:
          filteredData.sort((a, b) =>
            (a.product?.name || "").localeCompare(b.product?.name || "")
          );
          break;
        case 4:
          filteredData.sort((a, b) =>
            (b.product?.name || "").localeCompare(a.product?.name || "")
          );
          break;
        case 5:
          filteredData.sort((a, b) =>
            (a.store?.name || "").localeCompare(b.store?.name || "")
          );
          break;
        case 6:
          filteredData.sort((a, b) =>
            (b.store?.name || "").localeCompare(a.store?.name || "")
          );
          break;
        default:
          break;
      }
    }

    return filteredData;
  }, [historydata, sortBy, filter, debouncedSearchText]);
  const resetFilters = useCallback(() => {
    setSearchText("");
    setFilter("");
    setSortBy(1);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  }, []);
  const SearchInput = useMemo(
    () => (
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
        placeholder="Search transactions, stores, products..."
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
        theme={{ roundness: 10 }}
        selectTextOnFocus={true}
        blurOnSubmit={false}
        autoCorrect={false}
        autoCapitalize="none"
        keyboardType="default"
      />
    ),
    [searchText, theme, setSearchText]
  );

  const renderDropdown = useCallback(
    (item) => {
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
    },
    [theme]
  );
const renderItem = useCallback(({ item }) => (
  <Pressable
    onPress={() => {
      router.push({
        pathname: "transactionView",
        params: { 
          id: item.id,
          allTransactions: JSON.stringify(historydata)
        },
      });
    }}
  >
    <View style={styles.main}>
      <View
        style={[
          styles.card,
          {
            borderLeftColor:
              item.transaction_type?.name === "Inbound"
                ? "#4F7900"
                : "#C90076",
          },
          { backgroundColor: theme.card.backgroundColor },
        ]}
      >
        <View style={styles.card2}>
          <View>
            <Text style={{ fontSize: 10, color: "#666" }}>
              {new Date(item.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}{" "}
              -{" "}
              {new Date(item.created_at).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
              }}
            >
              <Text
                style={[
                  styles.text,
                  {
                    color:
                      item.transaction_type?.name === "Inbound"
                        ? "#4F7900"
                        : "#C90076",
                  },
                ]}
              >
                {item.transaction_type?.name}
              </Text>
            </View>
            <View style={{ flexDirection: "row", gap: 10, alignItems: "center"}}>
              <Text style={styles.type1}>
                {item.transaction_type?.name === "Inbound" ? "+" : "-"}
              </Text>
              <Text style={styles.type1}>
                ₱ {item.total_transaction_price || "0.00"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  </Pressable>
), [theme, historydata]); 
  const ListHeaderComponent = useMemo(
    () => (
      <View>
        <View>{SearchInput}</View>
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
              labelField="label"
              valueField="value"
              placeholder="Filter"
              placeholderStyle={{
                color: theme.dropdown.placeholderColor || theme.color,
              }}
              selectedTextStyle={{ color: theme.dropdown.color }}
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
              placeholderStyle={{
                color: theme.dropdown.placeholderColor || theme.color,
              }}
              selectedTextStyle={{ color: theme.dropdown.color }}
              value={sortBy}
              onChange={(item) => setSortBy(item.value)}
              renderItem={renderDropdown}
            />
          </View>
        </View>
      </View>
    ),
    [SearchInput, filter, sortBy, theme, renderDropdown]
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <Icon
          name="search"
          size={50}
          color="#6B7280"
          style={{ marginBottom: 10 }}
        />
        <Text
          style={[styles.emptyText, { color: theme.text?.secondary || "#666" }]}
        >
          {searchText || filter || sortBy !== 1
            ? "No transactions match your search criteria"
            : "No transactions found"}
        </Text>
        {(searchText || filter || sortBy !== 1) && (
          <TouchableOpacity
            onPress={resetFilters}
            style={styles.clearFiltersButton}
          >
            <Text style={styles.clearFiltersText}>Clear all filters</Text>
          </TouchableOpacity>
        )}
      </View>
    ),
    [searchText, filter, sortBy, resetFilters, theme]
  );

  return (
    <View style={[{ backgroundColor: theme.pageBackground }, { flex: 1 }]}>
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
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
        removeClippedSubviews={true}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    padding: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#Cbd5e1",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    alignContent: "center",
  },
  card2: {
    flex: 1,
    gap: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
  },
  type1: {
    fontSize: 15,
    color: "#666",
  },
  dropdown: {
    height: 50,
    borderColor: "#c4d0e3",
    borderWidth: 0.5,
    borderRadius: 8,
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
  btn: {
    border: 3,
    borderColor: "black",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#DDD",
    padding: 5,
  },
});

export default TransactionsHistory;
