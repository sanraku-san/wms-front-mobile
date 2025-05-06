// // // import React, { useContext, useState, useEffect } from "react";
// // // import {
// // //   TextInput,
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   Alert,
// // // } from "react-native";
// // // import { Dropdown } from "react-native-element-dropdown";
// // // import { router } from "expo-router";

// // // import { themeContext } from "../theme/themeContext";
// // // import { selectAuth } from "@/redux/slice";
// // // import { useSelector } from "react-redux";

// // // const transactionTypes = [
// // //   { label: "Inbound", value: "inbound" },
// // //   { label: "Outbound", value: "outbound" },
// // // ];

// // // const categories = [
// // //   { label: "Food", value: "food" },
// // //   { label: "Clothing", value: "clothing" },
// // // ];

// // // export default function Transaction() {
// // //   const [transactionData, setTransactionData] = useState({
// // //     date: "",
// // //     summary: "",
// // //     category: "",
// // //     transactionType: "",
// // //     amount: "",
// // //   });
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const theme = useContext(themeContext);
// // //   const { token } = useSelector(selectAuth);

// // //   useEffect(() => {
// // //     const today = new Date();
// // //     const year = today.getFullYear();
// // //     const month = String(today.getMonth() + 1).padStart(2, '0');
// // //     const day = String(today.getDate()).padStart(2, '0');
// // //     const formattedDate = `${year}-${month}-${day}`;
// // //     setTransactionData(prevState => ({ ...prevState, date: formattedDate }));
// // //   }, []);

// // //   const handleCreateTransaction = () => {
// // //     setIsLoading(true);
// // //     console.log(transactionData);
// // //     // Simulate API call
// // //     setTimeout(() => {
// // //       setIsLoading(false);
// // //       Alert.alert("Transaction Created Successfully");
// // //     }, 1000);
// // //   };

// // //   return (
// // //     <View style={[styles.container, { backgroundColor: theme.pageBackground }]}>
// // //       <View style={styles.main}>
// // //         <Text style={[styles.header, { color: theme.button.profileText }]}>
// // //           Create Transaction
// // //         </Text>

// // //         <Text style={[styles.label, { color: theme.button.profileText }]}>
// // //           Date
// // //         </Text>
// // //         <View style={styles.dateContainer}>
// // //           <Text style={[{ color: theme.card.date }]}>
// // //             {transactionData.date}
// // //           </Text>
// // //         </View>

// // //         <Text style={[styles.label, { color: theme.button.profileText }]}>
// // //           Summary
// // //         </Text>
// // //         <TextInput
// // //           style={[styles.input, {backgroundColor: theme.card.backgroundColor, color: theme.card.color}]}
// // //           placeholder="Summary"
// // //           placeholderTextColor={theme.dropdown.placeholderColor}
// // //           value={transactionData.summary}
// // //           onChangeText={(text) =>
// // //             setTransactionData({ ...transactionData, summary: text })
// // //           }
// // //         />

// // //         <Text style={[styles.label, { color: theme.button.profileText, } ]}>
// // //           Category
// // //         </Text>
// // //         <Dropdown
// // //           style={[
// // //             styles.dropdown,
// // //             { backgroundColor: theme.dropdown.backgroundColor },
// // //           ]}
// // //           data={categories}
// // //           labelField="label"
// // //           valueField="value"
// // //           placeholder="Select Category"
// // //           placeholderStyle={[styles.placeholderStyle, {color: theme.dropdown.placeholderColor}]}
// // //           selectedTextStyle={{ color: theme.card.color }}

// // //           value={transactionData.category}
// // //           onChange={(item) =>
// // //             setTransactionData({ ...transactionData, category: item.value })
// // //           }
// // //           dropdownStyle={{ backgroundColor: theme.pageBackground, borderRadius: 10 }}
// // //         />

// // //         <Text style={[styles.label, { color: theme.button.profileText }]}>
// // //           Transaction Type
// // //         </Text>
// // //         <Dropdown
// // //           style={[
// // //             styles.dropdown,
// // //             { backgroundColor: theme.dropdown.backgroundColor },
// // //           ]}
// // //           data={transactionTypes}
// // //           maxHeight={300}
// // //           labelField="label"
// // //           valueField="value"
// // //           placeholder="Select Transaction Type"
// // //           placeholderStyle={[styles.placeholderStyle, {color: theme.dropdown.placeholderColor}]}

// // //           selectedTextStyle={{ color: theme.card.color }}
// // //           value={transactionData.transactionType}
// // //           onChange={(item) =>
// // //             setTransactionData({ ...transactionData, transactionType: item.value })
// // //           }
// // //           dropdownStyle={{ backgroundColor: theme.pageBackground, borderRadius: 10 }}
// // //         />

// // //         <Text style={[styles.label, { color: theme.button.profileText }]}>
// // //           Amount
// // //         </Text>
// // //         <TextInput
// // //           style={[styles.input, {backgroundColor: theme.card.backgroundColor, color: theme.card.color}]}
// // //           placeholder="Amount"
// // //           placeholderTextColor={theme.dropdown.placeholderColor}
// // //           keyboardType="numeric"
// // //           value={transactionData.amount}
// // //           onChangeText={(text) =>
// // //             setTransactionData({ ...transactionData, amount: text })
// // //           }
// // //         />
// // //       </View>

// // //       <View style={styles.buttonContainer}>
// // //         <TouchableOpacity
// // //           style={[styles.createButton, { backgroundColor: theme.card.backgroundColor, borderColor: "#ccc", borderWidth: 1 }]}
// // //           onPress={handleCreateTransaction}
// // //           disabled={isLoading}
// // //         >
// // //           <Text style={[styles.createButtonText, { color: theme.color }]}>
// // //             {isLoading ? "Creating..." : "CREATE TRANSACTION"}
// // //           </Text>
// // //         </TouchableOpacity>
// // //       </View>
// // //     </View>
// // //   );
// // // }

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     paddingTop: 60,
// // //     paddingHorizontal: 15,
// // //     backgroundColor: "#f9f9f9"
// // //   },
// // //   header: {
// // //     fontSize: 22,
// // //     fontWeight: "bold",
// // //     marginBottom: 25,
// // //     textAlign: "center",
// // //   },
// // //   main: {
// // //     flex: 1,
// // //   },
// // //   label: {
// // //     fontSize: 16,
// // //     fontWeight: "bold",
// // //     marginBottom: 8,
// // //   },
// // //   input: {
// // //     height: 50,
// // //     borderColor: "#ccc",
// // //     borderWidth: 1,
// // //     borderRadius: 8,
// // //     paddingHorizontal: 12,
// // //     marginBottom: 20,
// // //     fontSize: 16,
// // //     backgroundColor: "#Cbd5e1",
// // //     color: "#FFF",
// // //   },
// // //   dropdown: {
// // //     height: 50,
// // //     borderColor: "#ccc",
// // //     borderWidth: 1,
// // //     borderRadius: 8,
// // //     paddingHorizontal: 12,
// // //     marginBottom: 20,
// // //     backgroundColor: "#Cbd5e1",
// // //     justifyContent: "center",
// // //   },
// // //   placeholderStyle: {
// // //     fontSize: 16,
// // //   },
// // //   dateContainer: {
// // //     height: 50,
// // //     backgroundColor: "#e0e0e0",
// // //     borderRadius: 8,
// // //     paddingHorizontal: 12,
// // //     marginBottom: 20,
// // //     justifyContent: "center",
// // //   },
// // //   dateText: {
// // //     fontSize: 16,
// // //   },
// // //   buttonContainer: {
// // //     paddingHorizontal: 15,
// // //     paddingBottom: 20,
// // //   },
// // //   createButton: {
// // //     paddingVertical: 14,
// // //     borderRadius: 8,
// // //     alignItems: "center",
// // //     justifyContent: "center",
// // //     marginTop: 25,
// // //   },
// // //   createButtonText: {
// // //     fontSize: 18,
// // //     fontWeight: "bold",
// // //   },
// // // });

// // import React, { useContext, useState, useCallback } from "react";
// // import {
// //   TextInput,
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Alert,
// // } from "react-native";
// // import { Dropdown } from "react-native-element-dropdown";
// // import { router } from "expo-router";
// // import { createTransactions } from "../api/transactions";
// // import { themeContext } from "../theme/themeContext";
// // import { selectAuth } from "@/redux/slice";
// // import { useSelector } from "react-redux";
// // import { useFocusEffect } from "expo-router";

// // const categories = [
// //   { label: "Food", value: 1 },
// //   { label: "Clothing", value: 2 },
// //   { label: "Electronics", value: 3 },
// //   { label: "Furniture", value: 4 },
// //   { label: "Toys", value: 5 },
// // ];

// // export default function Transactions() {
// //   const [transactionData, setTransactionData] = useState({
// //     store_id: "",
// //     transaction_type_id: "",
// //     products: [
// //       {
// //         product_id: "",
// //         quantity: "",
// //       }
// //     ],
// //   });
// //   const [isLoading, setIsLoading] = useState(false);
// //   const theme = useContext(themeContext);
// //   const { token } = useSelector(selectAuth);
// //   console.log("Token:", token);

// //   // const refreshData = useCallback(() => {
// //   //       if (token) { // Ensure you have a token before making the API call
// //   //         getUser(token) // Pass the token here
// //   //           .then((res) => {
// //   //             if (res && res.data) {
// //   //               setUserData(res.data);
// //   //             } else {
// //   //               console.error("Error fetching products:", res);
// //   //               Alert.alert("Error", "Failed to fetch products.");
// //   //             }
// //   //           })
// //   //           .catch((error) => {
// //   //             console.error("Error fetching products:", error);
// //   //             Alert.alert("Error", "Something went wrong while fetching products.");
// //   //           });
// //   //       } else {
// //   //         console.warn("Authentication token not found. Cannot fetch products.");
// //   //         Alert.alert("Authentication Required", "Please log in to view products.");
// //   //         // Optionally, redirect the user to the login screen
// //   //         router.replace("/login");
// //   //       }
// //   //     }, [token]); // Add token to the dependency array of useCallback

// //   //     useFocusEffect(refreshData);

// //   const handleAdd = useCallback(() => {
// //     setIsLoading(true);
// //     console.log(transactionData);
// //     setTimeout(() => {
// //       setIsLoading(false);
// //     }, 1000);
// //     if (token) {
// //       createTransactions(token, transactionData)
// //         .then((res) => {
// //           if (res) {
// //             Alert.alert("Product Added Successfully");
// //             router.replace("/transactions");
// //           }
// //         })
// //         .catch(() => {
// //           Alert.alert("Something went wrong");
// //         });
// //     } else {
// //       console.warn("Authentication token not found. Cannot fetch products.");
// //       Alert.alert("Authentication Required", "Please log in to view products.");
// //       // Optionally, redirect the user to the login screen
// //       router.replace("/login");
// //     }
// //   }, [token, transactionData]); // Add token to the dependency array of useCallback

// //   // useFocusEffect(refreshData);;

// //   // const refreshData = useCallback(() => {
// //   //     if (token) { // Ensure you have a token before making the API call
// //   //       getProducts(token) // Pass the token here
// //   //         .then((res) => {
// //   //           if (res && res.data) {
// //   //             setProductData(res.data);
// //   //           } else {
// //   //             console.error("Error fetching products:", res);
// //   //             Alert.alert("Error", "Failed to fetch products.");
// //   //           }
// //   //         })
// //   //         .catch((error) => {
// //   //           console.error("Error fetching products:", error);
// //   //           Alert.alert("Error", "Something went wrong while fetching products.");
// //   //         });
// //   //     } else {
// //   //       console.warn("Authentication token not found. Cannot fetch products.");
// //   //       Alert.alert("Authentication Required", "Please log in to view products.");
// //   //       // Optionally, redirect the user to the login screen
// //   //       router.replace("/login");
// //   //     }
// //   //   }, [token]); // Add token to the dependency array of useCallback

// //   //   useFocusEffect(refreshData);

// //   // 'user_id','store_id','transaction_type_id','total_transaction_price'

// //   return (
// //     // dropdown:
// //     // transaction type : inbound, outbound
// //     // name ng products
// //     // name ng store
// //     // price ba or quantity??? if quantity, need i-change sa back end
// //     // sino nag-create ng transaction - dapat matic kung sino nakalogin pero 'di ko alam pano 'yon...
// //     <View style={[styles.container, { backgroundColor: theme.pageBackground }]}>
// //       <View style={styles.main}>
// //         {/* <Text style={[styles.label, { color: theme.button.profileText }]}>
// //           User ID:
// //         </Text>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="User ID"
// //           placeholderTextColor="#FFF"
// //           value={transactionData.user_id}
// //           onChangeText={(text) =>
// //             setTransactionData({ ...transactionData, user_id: text })
// //           }
// //            keyboardType="numeric"
// //         /> */}
// //         <Text style={[styles.label, { color: theme.button.profileText }]}>
// //           Store ID:
// //         </Text>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Store ID"
// //           placeholderTextColor="#FFF"
// //           value={transactionData.store_id}
// //           onChangeText={(text) =>
// //             setTransactionData({ ...transactionData, store_id: text })
// //           }
// //           keyboardType="numeric"
// //         />
// //         {/* <Text style={[styles.label, { color: theme.button.profileText }]}>
// //           Product ID:
// //         </Text>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Product ID"
// //           placeholderTextColor="#FFF"
// //           value={transactionData.product_id}
// //           onChangeText={(text) =>
// //             setTransactionData({ ...transactionData, product_id: text })
// //           }
// //            keyboardType="numeric"
// //         /> */}
// //         <Text style={[styles.label, { color: theme.button.profileText }]}>
// //           Transaction Type ID:
// //         </Text>
// //         <TextInput
// //           style={styles.input}
// //           placeholder="Transaction Type ID"
// //           placeholderTextColor="#FFF"
// //           value={transactionData.transaction_type_id}
// //           onChangeText={(text) =>
// //             setTransactionData({
// //               ...transactionData,
// //               transaction_type_id: text,
// //             })
// //           }
// //           keyboardType="numeric"
// //         />
// //         <View>
// //           <Text style={[styles.label, { color: theme.button.profileText }]}>
// //             Product:
// //           </Text>
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Product ID"
// //             placeholderTextColor="#FFF"
// //             value={transactionData.total_price}
// //             onChangeText={(text) =>
// //               setTransactionData({
// //                 ...transactionData,
// //                 total_transaction_price: text,
// //               })
// //             }
// //             keyboardType="decimal-pad"
// //           />
// //           <TextInput
// //             style={styles.input}
// //             placeholder="Quantity"
// //             placeholderTextColor="#FFF"
// //             value={transactionData.total_price}
// //             onChangeText={(text) =>
// //               setTransactionData({
// //                 ...transactionData,
// //                 total_transaction_price: text,
// //               })
// //             }
// //             keyboardType="decimal-pad"
// //           />
// //         </View>
// //       </View>
// //       <TouchableOpacity
// //         style={[styles.button, { backgroundColor: "#Cbd5e1" }]}
// //         onPress={handleAdd}
// //       >
// //         <Text style={[styles.buttonText, { color: theme.button.profileIcon }]}>
// //           ADD
// //         </Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // }

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     paddingTop: 30,
// //     padding: 10,
// //     flexDirection: "column",
// //   },
// //   main: {
// //     flex: 1,
// //   },
// //   label: {
// //     fontWeight: "bold",
// //     color: "white",
// //     marginBottom: 3,
// //   },
// //   input: {
// //     width: "98%",
// //     height: 50,
// //     borderWidth: 1,
// //     borderRadius: 10,
// //     padding: 10,
// //     marginBottom: 20,
// //     backgroundColor: "#Cbd5e1",
// //   },
// //   button: {
// //     backgroundColor: "#020817",
// //     padding: 10,
// //     width: "98%",
// //     height: 50,
// //     borderWidth: 1,
// //     borderRadius: 10,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     marginTop: 20,
// //     alignSelf: "center",
// //   },
// //   buttonText: {
// //     color: "white",
// //     fontWeight: "bold",
// //   },
// // });



// // // 


// import React, { useContext, useState, useCallback } from "react";
// import {
//   TextInput,
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { Dropdown } from "react-native-element-dropdown";
// import { router } from "expo-router";
// import { createTransactions } from "../api/transactions";
// import { themeContext } from "../theme/themeContext";
// import { selectAuth } from "@/redux/slice";
// import { useSelector } from "react-redux";
// import { useFocusEffect } from "expo-router";

// const transactionTypes = [
//   { label: "Inbound", value: "1" },
//   { label: "Outbound", value: "2" },
// ];

// export default function Transactions() {
//   const [transactionData, setTransactionData] = useState({
//     store_id: "",
//     transaction_type_id: "",
//     products: [
//       {
//         product_id: "",
//         quantity: ""
//       }
//     ]
//   });
//   const [isLoading, setIsLoading] = useState(false);
//   const theme = useContext(themeContext);
//   const { token } = useSelector(selectAuth);
  
//   // For dropdown state
//   const [selectedTransactionType, setSelectedTransactionType] = useState(null);
  
//   const handleAdd = useCallback(() => {
//     if (!transactionData.store_id || !transactionData.transaction_type_id || 
//         !transactionData.products[0].product_id || !transactionData.products[0].quantity) {
//       Alert.alert("Error", "Please fill in all fields");
//       return;
//     }
    
//     setIsLoading(true);
//     console.log("Submitting transaction data:", transactionData);
    
//     if (token) {
//       createTransactions(token, transactionData)
//         .then((res) => {
//           setIsLoading(false);
//           if (res) {
//             Alert.alert("Success", "Transaction added successfully");
//             // Reset form
//             setTransactionData({
//               store_id: "",
//               transaction_type_id: "",
//               products: [
//                 {
//                   product_id: "",
//                   quantity: ""
//                 }
//               ]
//             });
//             setSelectedTransactionType(null);
//           }
//         })
//         .catch((error) => {
//           setIsLoading(false);
//           console.error("Transaction creation error:", error);
//           Alert.alert("Error", error.message || "Something went wrong creating the transaction");
//         });
//     } else {
//       setIsLoading(false);
//       console.warn("Authentication token not found");
//       Alert.alert("Authentication Required", "Please log in to create transactions");
//       router.replace("/login");
//     }
//   }, [token, transactionData]);

//   // Handle product field changes
//   const updateProductField = (field, value) => {
//     const updatedProducts = [...transactionData.products];
//     updatedProducts[0] = { ...updatedProducts[0], [field]: value };
    
//     setTransactionData({
//       ...transactionData,
//       products: updatedProducts
//     });
//   };

//   return (
//     <View style={[styles.container, { backgroundColor: theme.pageBackground }]}>
//       <View style={styles.main}>
//         <Text style={[styles.label, { color: theme.button.profileText }]}>
//           Store ID:
//         </Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Store ID"
//           placeholderTextColor="#888"
//           value={transactionData.store_id}
//           onChangeText={(text) =>
//             setTransactionData({ ...transactionData, store_id: text })
//           }
//           keyboardType="numeric"
//         />
        
//         <Text style={[styles.label, { color: theme.button.profileText }]}>
//           Transaction Type:
//         </Text>
//         <Dropdown
//           style={styles.dropdown}
//           placeholderStyle={styles.placeholderStyle}
//           selectedTextStyle={styles.selectedTextStyle}
//           data={transactionTypes}
//           maxHeight={300}
//           labelField="label"
//           valueField="value"
//           placeholder="Select transaction type"
//           value={selectedTransactionType}
//           onChange={item => {
//             setSelectedTransactionType(item.value);
//             setTransactionData({ ...transactionData, transaction_type_id: item.value });
//           }}
//         />
        
//         <Text style={[styles.title, { color: theme.button.profileText }]}>
//           Product Details
//         </Text>
        
//         <Text style={[styles.label, { color: theme.button.profileText }]}>
//           Product ID:
//         </Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Product ID"
//           placeholderTextColor="#888"
//           value={transactionData.products[0].product_id}
//           onChangeText={(text) => updateProductField("product_id", text)}
//           keyboardType="numeric"
//         />
        
//         <Text style={[styles.label, { color: theme.button.profileText }]}>
//           Quantity:
//         </Text>
//         <TextInput
//           style={styles.input}
//           placeholder="Quantity"
//           placeholderTextColor="#888"
//           value={transactionData.products[0].quantity}
//           onChangeText={(text) => updateProductField("quantity", text)}
//           keyboardType="numeric"
//         />
//       </View>
      
//       <TouchableOpacity
//         style={[styles.button, { backgroundColor: "#Cbd5e1" }]}
//         onPress={handleAdd}
//         disabled={isLoading}
//       >
//         {isLoading ? (
//           <ActivityIndicator color={theme.button.profileIcon} />
//         ) : (
//           <Text style={[styles.buttonText, { color: theme.button.profileIcon }]}>
//             ADD TRANSACTION
//           </Text>
//         )}
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 30,
//     padding: 10,
//     flexDirection: "column",
//   },
//   main: {
//     flex: 1,
//   },
//   label: {
//     fontWeight: "bold",
//     color: "white",
//     marginBottom: 3,
//   },
//   title: {
//     fontWeight: "bold",
//     fontSize: 18,
//     marginTop: 10,
//     marginBottom: 10,
//   },
//   input: {
//     width: "98%",
//     height: 50,
//     borderWidth: 1,
//     borderRadius: 10,
//     padding: 10,
//     marginBottom: 20,
//     backgroundColor: "#Cbd5e1",
//   },
//   dropdown: {
//     height: 50,
//     width: "98%",
//     borderColor: "#555",
//     borderWidth: 1,
//     borderRadius: 10,
//     paddingHorizontal: 10,
//     marginBottom: 20,
//     backgroundColor: "#Cbd5e1",
//   },
//   placeholderStyle: {
//     fontSize: 16,
//     color: "#888",
//   },
//   selectedTextStyle: {
//     fontSize: 16,
//     color: "#000",
//   },
//   button: {
//     backgroundColor: "#020817",
//     padding: 10,
//     width: "98%",
//     height: 50,
//     borderWidth: 1,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//     alignSelf: "center",
//   },
//   buttonText: {
//     color: "white",
//     fontWeight: "bold",
//   },
// });


import React, { useContext, useState, useCallback } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { router } from "expo-router";
import { createTransactions } from "../api/transactions";
import { themeContext } from "../theme/themeContext";
import { selectAuth } from "@/redux/slice";
import { useSelector } from "react-redux";
import { useFocusEffect } from "expo-router";

const transactionTypes = [
  { label: "Inbound", value: "1" },
  { label: "Outbound", value: "2" },
];

export default function Transactions() {
  const [transactionData, setTransactionData] = useState({
    store_id: "",
    transaction_type_id: "",
    products: [
      {
        product_id: "",
        quantity: ""
      }
    ]
  });
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext);
  const { token } = useSelector(selectAuth);
  
  // For dropdown state
  const [selectedTransactionType, setSelectedTransactionType] = useState(null);
  
 const handleAdd = useCallback(() => { 
    // Validate all fields are filled
    if (!transactionData.store_id || !transactionData.transaction_type_id) {
      Alert.alert("Error", "Please fill in store ID and transaction type");
      return;
    }
    
    // Validate all product entries
    const invalidProducts = transactionData.products.some(
      product => !product.product_id || !product.quantity
    );
    
    if (invalidProducts) {
      Alert.alert("Error", "Please fill in all product details");
      return;
    }
    
    setIsLoading(true);
    console.log("Submitting transaction data:", transactionData);
    
    if (token) {
      createTransactions(token, transactionData)
        .then((res) => {
          setIsLoading(false);
          if (res) {
            Alert.alert("Success", "Transaction added successfully");
            // Reset form
            setTransactionData({
              store_id: "",
              transaction_type_id: "",
              products: [
                {
                  product_id: "",
                  quantity: ""
                }
              ]
            });
            setSelectedTransactionType(null);
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Transaction creation error:", error);
          Alert.alert("Error", error.message || "Something went wrong creating the transaction");
        });
    } else {
      setIsLoading(false);
      console.warn("Authentication token not found");
      Alert.alert("Authentication Required", "Please log in to create transactions");
      router.replace("/login");
    }
  }, [token, transactionData]);

  // Add a new product field
  const addProductField = () => {
    setTransactionData({
      ...transactionData,
      products: [
        ...transactionData.products,
        { product_id: "", quantity: "" }
      ]
    });
  };

  // Remove a product field
  const removeProductField = (index) => {
    if (transactionData.products.length > 1) {
      const updatedProducts = [...transactionData.products];
      updatedProducts.splice(index, 1);
      setTransactionData({
        ...transactionData,
        products: updatedProducts
      });
    } else {
      Alert.alert("Cannot Remove", "At least one product is required");
    }
  };

  // Handle product field changes
  const updateProductField = (index, field, value) => {
    const updatedProducts = [...transactionData.products];
    updatedProducts[index] = { ...updatedProducts[index], [field]: value };
    
    setTransactionData({
      ...transactionData,
      products: updatedProducts
    });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.pageBackground }]}>
      <View style={styles.main}>
        <Text style={[styles.label, { color: theme.button.profileText }]}>
          Store ID:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Store ID"
          placeholderTextColor="#888"
          value={transactionData.store_id}
          onChangeText={(text) =>
            setTransactionData({ ...transactionData, store_id: text })
          }
          keyboardType="numeric"
        />
        
        <Text style={[styles.label, { color: theme.button.profileText }]}>
          Transaction Type:
        </Text>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          data={transactionTypes}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select transaction type"
          value={selectedTransactionType}
          onChange={item => {
            setSelectedTransactionType(item.value);
            setTransactionData({ ...transactionData, transaction_type_id: item.value });
          }}
        />
        
        <Text style={[styles.title, { color: theme.button.profileText }]}>
          Product Details
        </Text>
        
        {transactionData.products.map((product, index) => (
          <View key={index} style={styles.productContainer}>
            <View style={styles.productHeader}>
              <Text style={[styles.productTitle, { color: theme.button.profileText }]}>
                Product {index + 1}
              </Text>
              {index > 0 && (
                <TouchableOpacity 
                  onPress={() => removeProductField(index)}
                  style={styles.removeButton}
                >
                  <Text style={styles.removeButtonText}>Remove</Text>
                </TouchableOpacity>
              )}
            </View>
            
            <Text style={[styles.label, { color: theme.button.profileText }]}>
              Product ID:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Product ID"
              placeholderTextColor="#888"
              value={product.product_id}
              onChangeText={(text) => updateProductField(index, "product_id", text)}
              keyboardType="numeric"
            />
            
            <Text style={[styles.label, { color: theme.button.profileText }]}>
              Quantity:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              placeholderTextColor="#888"
              value={product.quantity}
              onChangeText={(text) => updateProductField(index, "quantity", text)}
              keyboardType="numeric"
            />
          </View>
        ))}
        
        <TouchableOpacity
          style={[styles.addProductButton, { backgroundColor: theme.button.profileBackground }]}
          onPress={addProductField}
        >
          <Text style={[styles.addProductButtonText, { color: theme.button.profileText }]}>
            + ADD ANOTHER PRODUCT
          </Text>
        </TouchableOpacity>
      </View>
      
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#Cbd5e1" }]}
        onPress={handleAdd}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.button.profileIcon} />
        ) : (
          <Text style={[styles.buttonText, { color: theme.button.profileIcon }]}>
            ADD TRANSACTION
          </Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    padding: 10,
  },
  main: {
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    color: "white",
    marginBottom: 3,
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    width: "98%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#Cbd5e1",
  },
  dropdown: {
    height: 50,
    width: "98%",
    borderColor: "#555",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#Cbd5e1",
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#888",
  },
  selectedTextStyle: {
    fontSize: 16,
    color: "#000",
  },
  button: {
    backgroundColor: "#020817",
    padding: 10,
    width: "98%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  productContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    backgroundColor: "rgba(203, 213, 225, 0.1)",
  },
  productHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  productTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "#ff4d4f",
    padding: 5,
    borderRadius: 5,
  },
  removeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  addProductButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  addProductButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});