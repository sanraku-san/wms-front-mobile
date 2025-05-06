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
import React, { useCallback, useState, useContext, useEffect } from "react";
import { useFocusEffect, router } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { getTransactions, deleteTransaction } from "../api/transactions";
import Icon2 from "react-native-vector-icons/Ionicons";
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
  const [sortedBy, setSortedBy] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const theme = useContext(themeContext);
  const { token } = useSelector(selectAuth);

  console.log("History Data:", historydata);
  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this Transaction?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteTransaction(id)
              .then((res) => {
                if (res) {
                  Alert.alert("Transaction deleted successfully");
                  refreshData();
                }
              })
              .catch(() => {
                Alert.alert(
                  "Something went wrong while deleting the Transaction"
                );
              });
          },
        },
      ]
    );
  };
  // const refreshData = () => {
  //   getTransactions().then((res) => {
  //     setHistoryData(res.data);
  //     console.log(res.data);
  //   });
  // };
  // useFocusEffect(
  //   useCallback(() => {
  //     refreshData();
  //   }, [])
  // );

  const refreshData = useCallback(() => {
    if (token) {
      // Ensure you have a token before making the API call
      getTransactions(token) // Pass the token here
        .then((res) => {
          if (res && res.data) {
            setHistoryData(res.data);
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
      router.replace("");
    }
  }, [token]); // Add token to the dependency array of useCallback

  useFocusEffect(refreshData);

  const renderDropdown = (item) => {
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
  };

  useEffect(() => {
    let filteredData = [...historydata];
    if (filter) {
      switch (filter) {
        case 1: // All Items
          // No filtering needed
          break;
        case 2: // Incoming
          filteredData = filteredData.filter(
            (item) => item.transaction_type.name.toLowerCase() === "inbound"
          );
          break;
        case 3: // Outgoing
          filteredData = filteredData.filter(
            (item) => item.transaction_type.name.toLowerCase() === "outbound"
          );
          break;
        default:
          break;
      }
    }

    // Apply sorting (your existing sorting logic)
    if (sortBy) {
      switch (sortBy) {
        case 1: //date asc
          filteredData.sort((a, b) => b.created_at.localeCompare(a.created_at));
          break;
        case 2: //date asc
          filteredData.sort((a, b) => a.created_at.localeCompare(b.created_at));
          break;
        case 3: //name asc
          filteredData.sort((a, b) =>
            a.product?.name?.localeCompare(b.product?.name)
          );
          break;
        case 4: //name desc
          filteredData.sort((a, b) =>
            b.product?.name?.localeCompare(a.product?.name)
          );
          break;
          break;
        case 5: //store asc
          filteredData.sort((a, b) =>
            a.store?.name.localeCompare(b.store?.name)
          );
          break;
        case 6: //store desc
          filteredData.sort((a, b) =>
            b.store?.name.localeCompare(a.store?.name)
          );
          break;
        default:
          break;
      }
    }

    setSortedBy(filteredData);
  }, [
    historydata,
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

  return (
    <>
      <View style={[{ backgroundColor: theme.pageBackground }, { flex: 1 }]}>
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
                  placeholder="Search Transactions History"
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
                  theme={{ roundness: 10 }}
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
                    labelField="label"
                    valueField="value"
                    placeholder="Filter"
                    placeholderStyle={{
                      color: theme.color,
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
                      color: theme.color,
                    }}
                    selectedTextStyle={{ color: theme.dropdown.color }}
                    value={sortBy}
                    onChange={(item) => setSortBy(item.value)}
                    renderItem={renderDropdown}
                  />
                </View>
              </View>
            </View>
          )}
          data={sortedBy}
          refreshControl={
            <RefreshControl refreshing={refresh} onRefresh={refreshData} />
          }
          //wala akong dinark mode beyond this part bcs walang example item

          renderItem={({ item }) => (
            <Pressable
              onPress={() =>
                router.push({
                  pathname: "transactionView",
                  params: { id: item.id },
                })
              }
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
                    { borderColor: theme.card.borderColor },
                  ]}
                >
                  <View style={styles.card2}>
                    <View>
                      {/* <Text style={{ fontSize: 10, color: "#666" }}>
                        date and time
                      </Text> */}
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
                        {/* <Text style={styles.type1}>-</Text> */}
                        {/* <Text style={styles.type1}>{item.products?.map((product)=>product.name).join(", ")}</Text> */}
                      </View>
                      {/* <View>
                        <Text style={styles.type1}>₱ {item.total_price}</Text>
                      </View> */}
                      <View style={{ flexDirection: "column", gap: 10 }}>
                        {item.products?.map((product) => (
                          <View key={product.id}>
                            <Text style={styles.type1}>
                              Product Name: {product.name}
                            </Text>
                            {product.pivot && (
                              <View style={{ marginBottom: 5 }}>
                                <Text style={styles.type1}>
                                  Qty: {Math.floor(product.pivot.quantity)}
                                </Text>
                              </View>
                            )}
                          </View>
                        ))}
                      </View>

                      <View style={{ flexDirection: "column", gap: 10 }}>
                        <Text style={styles.type1}>para sa total price</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id.toString()}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          )}
          // ListFooterComponent={() => ()}
        />
      </View>
    </>
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
    // marginBottom: 5,
  },
  type1: {
    fontSize: 10,
    color: "#666",
    // marginBottom: 3,
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
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
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

// import {
//   FlatList,
//   Text,
//   View,
//   RefreshControl,
//   StyleSheet,
//   Alert,
//   TouchableOpacity,
// } from "react-native";
// import React, { useCallback, useState, useContext } from "react";
// import { useFocusEffect } from "expo-router";
// import Icon from "react-native-vector-icons/FontAwesome";
// import { TextInput } from "react-native-paper";
// import { Dropdown } from "react-native-element-dropdown";
// import { getTransactions, deleteTransaction } from "../api/transactions";
// import Icon2 from "react-native-vector-icons/Ionicons";
// import { themeContext } from "../theme/themeContext";
// import { selectAuth } from "@/redux/slice";
// import { useSelector } from "react-redux";

// const forFilter = [
//   { label: "All Transactions", value: 1 },
//   { label: "Incoming", value: 2 },
//   { label: "Outgoing", value: 3 },
// ];

// const forSortBy = [
//   { label: "Date", value: 1 },
//   { label: "Store", value: 2 },
//   { label: "Product", value: 3 },
// ];

// function TransactionsHistory() {
//   const [historydata, setHistoryData] = useState([]);
//   const [filter, setFilter] = useState("");
//   const [sortBy, setSortBy] = useState("");
//   const [refresh, setRefresh] = useState(false);
//   const theme = useContext(themeContext);
//   const {token} = useSelector(selectAuth)

//   const handleDelete = (id) => {
//     Alert.alert(
//       "Confirm Delete",
//       "Are you sure you want to delete this Transaction?",
//       [
//         {
//           text: "Cancel",
//           style: "cancel",
//         },
//         {
//           text: "Delete",
//           style: "destructive",
//           onPress: () => {
//             deleteTransaction(id)
//               .then((res) => {
//                 if (res) {
//                   Alert.alert("Transaction deleted successfully");
//                   refreshData();
//                 }
//               })
//               .catch(() => {
//                 Alert.alert(
//                   "Something went wrong while deleting the Transaction"
//                 );
//               });
//           },
//         },
//       ]
//     );
//   };
//   // const refreshData = () => {
//   //   getTransactions().then((res) => {
//   //     setHistoryData(res.data);
//   //     console.log(res.data);
//   //   });
//   // };
//   // useFocusEffect(
//   //   useCallback(() => {
//   //     refreshData();
//   //   }, [])
//   // );

//   const refreshData = useCallback(() => {
//         if (token) { // Ensure you have a token before making the API call
//           getTransactions(token) // Pass the token here
//             .then((res) => {
//               if (res && res.data) {
//                 setHistoryData(res.data);
//               } else {
//                 console.error("Error fetching products:", res);
//                 Alert.alert("Error", "Failed to fetch products.");
//               }
//             })
//             .catch((error) => {
//               console.error("Error fetching products:", error);
//               Alert.alert("Error", "Something went wrong while fetching products.");
//             });
//         } else {
//           console.warn("Authentication token not found. Cannot fetch products.");
//           Alert.alert("Authentication Required", "Please log in to view products.");
//           // Optionally, redirect the user to the login screen
//           router.replace("/login");
//         }
//       }, [token]); // Add token to the dependency array of useCallback

//       useFocusEffect(refreshData);

//   const renderDropdown = (item) => {
//     return (
//       <View
//         style={{
//           padding: 10,
//           backgroundColor: theme.background,
//         }}
//       >
//         <Text style={{ fontSize: 15, color: theme.dropdown.color }}>
//           {item.label}
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <>
//       <View style={[{ backgroundColor: theme.pageBackground }, { flex: 1 }]}>
//         <FlatList
//           ListHeaderComponent={() => (
//             <View>
//               <View>
//                 <TextInput
//                   outlineColor="#c4d0e3"
//                   activeOutlineColor="#fff"
//                   style={{
//                     margin: 15,
//                     marginBottom: 5,
//                     backgroundColor: theme.search.backgroundColor,
//                   }}
//                   mode="outlined"
//                   placeholder="Search Transactions History"
//                   placeholderTextColor={theme.search.placeholderColor}
//                   textColor={theme.search.color} //color kapag nagtype
//                   left={
//                     <TextInput.Icon
//                       icon={() => (
//                         <Icon
//                           name="search"
//                           size={20}
//                           color={theme.search.iconPlaceholderColor}
//                         />
//                       )}
//                     />
//                   }
//                   theme={{ roundness: 10 }}
//                 />
//               </View>
//               <View
//                 style={{
//                   flex: 1,
//                   flexDirection: "row",
//                   justifyContent: "space-between",
//                   gap: 0,
//                   marginHorizontal: 5,
//                 }}
//               >
//                 <View style={{ width: "50%", marginBottom: 20 }}>
//                   <Dropdown
//                     style={[
//                       styles.dropdown,
//                       { backgroundColor: theme.dropdown.backgroundColor },
//                     ]}
//                     data={forFilter}
//                     labelField="label"
//                     valueField="value"
//                     placeholder="Filter"
//                     placeholderStyle={{
//                       color: theme.dropdown.placeholderColor,
//                     }}
//                     value={filter}
//                     onChange={(item) => setFilter(item.value)}
//                     renderItem={renderDropdown}
//                   />
//                 </View>
//                 <View style={{ width: "50%" }}>
//                   <Dropdown
//                     style={[
//                       styles.dropdown,
//                       { backgroundColor: theme.dropdown.backgroundColor },
//                     ]}
//                     data={forSortBy}
//                     maxHeight={300}
//                     labelField="label"
//                     valueField="value"
//                     placeholder="Sort By"
//                     placeholderStyle={{
//                       color: theme.dropdown.placeholderColor,
//                     }}
//                     value={sortBy}
//                     onChange={(item) => setSortBy(item.value)}
//                     renderItem={renderDropdown}
//                   />
//                 </View>
//               </View>
//             </View>
//           )}
//           data={historydata}
//           refreshControl={
//             <RefreshControl refreshing={refresh} onRefresh={refreshData} />
//           }

//           //wala akong dinark mode beyond this part bcs walang example item

//           renderItem={({ item }) => (
//             <View style={styles.main}>
//               <View style={styles.card}>
//                 <View style={{ flexDirection: "row", flex: 1 }}>
//                   <View style={styles.card2}>
//                     <Text style={styles.text}>{item.product_name}</Text>
//                     <Text
//                       style={[
//                         styles.text,
//                         {
//                           color:
//                             item.transaction_type?.name === "Inbound"
//                               ? "#4F7900"
//                               : "#904F00",
//                         },
//                       ]}
//                     >
//                       {item.transaction_type?.name}
//                     </Text>
//                     <Text style={styles.type1}>
//                       Transaction number: {item.id}
//                     </Text>
//                     <Text style={styles.type1}>{item.store?.name}</Text>
//                     <Text style={styles.type1}>{item.product?.name}</Text>
//                     <Text style={styles.type1}>
//                       ₱ {item.product?.price ? item.product?.price : "0.00"}
//                     </Text>
//                     <Text style={styles.type1}>{item.user?.username}</Text>{" "}
//                   </View>
//                 </View>
//                 <TouchableOpacity
//                   onPress={() => handleDelete(item.id)}
//                   style={styles.btn}
//                 >
//                   <Icon2 name="trash-sharp" size={20} color="gray" />
//                 </TouchableOpacity>
//               </View>
//             </View>
//           )}
//           keyExtractor={(item) => item.id.toString()}
//           ListEmptyComponent={() => (
//             <View style={styles.emptyContainer}>
//               <Text style={styles.emptyText}>No transactions found</Text>
//             </View>
//           )}
//           ListFooterComponent={() => (
//             <View
//               style={{
//                 flex: 1,
//                 justifyContent: "center",
//                 alignItems: "center",
//                 paddingVertical: 100,
//               }}
//             >
//               <Text style={{ fontSize: 30 }}>This is</Text>
//               <Text style={{ fontSize: 30 }}>TRANSACTIONS HISTORY</Text>
//             </View>
//           )}
//         />
//       </View>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   main: {
//     padding: 10,
//   },
//   card: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#Cbd5e1",
//     borderRadius: 10,
//     padding: 15,
//     marginHorizontal: 5,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   card2: {
//     padding: 5,
//     flex: 1,
//     gap: 10,
//     marginLeft: 18,
//     marginTop: 30,
//   },
//   text: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 5,
//   },
//   type1: {
//     fontSize: 14,
//     color: "#666",
//     marginBottom: 3,
//   },
//   dropdown: {
//     height: 50,
//     borderColor: "#c4d0e3",
//     borderWidth: 0.5,
//     borderRadius: 8,
//     paddingHorizontal: 8,
//     margin: 10,
//     backgroundColor: "#Cbd5e1",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   emptyText: {
//     fontSize: 16,
//     color: "#666",
//   },
//   btn: {
//     border: 3,
//     borderColor: "black",
//     borderRadius: 5,
//     marginBottom: 10,
//     backgroundColor: "#DDD",
//     padding: 5,
//   },
// });

// export default TransactionsHistory;
