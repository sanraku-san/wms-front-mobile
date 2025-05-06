// import {
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Image,
//   StyleSheet,
//   ActivityIndicator,
// } from "react-native";
// import React, { useCallback, useContext, useState } from "react";
// import { useFocusEffect, useLocalSearchParams } from "expo-router";
// import { router } from "expo-router";
// import Icon2 from "react-native-vector-icons/Ionicons";
// import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";
// import { Barcode } from "expo-barcode-generator";
// import { getTransactionsById, deleteTransaction } from "../api/transactions";
// import { themeContext } from "../theme/themeContext";

// function TransactionView() {
//   const { id } = useLocalSearchParams();
//   const [transactionData, setTransactionData] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const theme = useContext(themeContext);

//   const refreshData = useCallback(() => {
//     setIsLoading(true);
//     getTransactionsById(id)
//       .then((res) => {
//         setTransactionData(res.data);
//         console.log("Transaction Data:", res.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching transaction:", error);
//         Alert.alert("Error", "Failed to load transaction details");
//       })
//       .finally(() => {
//         setIsLoading(false);
//       });
//   }, [id]);

//   useFocusEffect(
//     useCallback(() => {
//       refreshData();
//     }, [refreshData])
//   );

//   return (
//     <>
//       {/* Header */}
//       <View
//         style={{
//           paddingHorizontal: 16,
//           paddingTop: 12,
//           paddingBottom: 8,
//           backgroundColor: theme.background,
//         }}
//       >
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginTop: 30,
//           }}
//         >
//           <TouchableOpacity
//             onPress={() => router.push("transactionsHistory")}
//             style={{
//               padding: 8,
//               alignItems: "center",
//               flexDirection: "row",
//               justifyContent: "center",
//               gap: 10,
//             }}
//           >
//             <Icon3 name="arrow-left" size={18} color={theme.color} />
//             <Text style={{ color: theme.color, fontSize: 16 }}>Back</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Body */}
//       <ScrollView
//         style={{ backgroundColor: theme.pageBackground }}
//         contentContainerStyle={{ flexGrow: 1 }}
//       >
//         {isLoading ? (
//           <View style={styles.loadingContainer}>
//             <ActivityIndicator size="large" color="#0000ff" />
//             <Text style={{ color: theme.color, marginTop: 10 }}>
//               Loading transaction details...
//             </Text>
//           </View>
//         ) : !transactionData ? (
//           <View style={styles.errorContainer}>
//             <Text style={{ color: theme.color }}>Transaction not found</Text>
//           </View>
//         ) : (
//           <>
//             {/* Transaction Header */}
//             <View style={styles.headerCard}>
//               <View
//                 style={{
//                   backgroundColor:
//                     transactionData.transaction_type?.name === "Inbound"
//                       ? "#e7f3db"
//                       : "#f9e5f1",
//                   padding: 15,
//                   borderRadius: 10,
//                   width: "100%",
//                 }}
//               >
//                 <Text
//                   style={{
//                     fontSize: 22,
//                     fontWeight: "bold",
//                     color:
//                       transactionData.transaction_type?.name === "Inbound"
//                         ? "#4F7900"
//                         : "#C90076",
//                     textAlign: "center",
//                   }}
//                 >
//                   {transactionData.transaction_type?.name} Transaction
//                 </Text>
//                 <Text style={{ textAlign: "center", color: "#666" }}>
//                   Transaction #{transactionData.id}
//                 </Text>
//               </View>
//             </View>
//             <View
//               style={[
//                 styles.detailsCard,
//                 { backgroundColor: theme.card.backgroundColor },
//               ]}
//             >
//               <Text style={[styles.sectionTitle, { color: theme.color }]}>
//                 TRANSACTION DETAILS
//               </Text>

//               <View style={styles.detailRow}>
//                 <Text style={[styles.detailLabel, { color: theme.color }]}>
//                   Product
//                 </Text>
//                 <Text style={[styles.detailValue, { color: theme.color }]}>
//                   {transactionData.product?.name || "N/A"}
//                 </Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={[styles.detailLabel, { color: theme.color }]}>
//                   Store
//                 </Text>
//                 <Text style={[styles.detailValue, { color: theme.color }]}>
//                   {transactionData.store?.name || "N/A"}
//                 </Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={[styles.detailLabel, { color: theme.color }]}>
//                   Amount
//                 </Text>
//                 <Text style={[styles.detailValue, { color: theme.color }]}>
//                   ₱ {transactionData.total_price || "0.00"}
//                 </Text>
//               </View>

//               <View style={styles.detailRow}>
//                 <Text style={[styles.detailLabel, { color: theme.color }]}>
//                   User
//                 </Text>
//                 <Text style={[styles.detailValue, { color: theme.color }]}>
//                   {transactionData.user?.username || "N/A"}
//                 </Text>
//               </View>
//             </View>

//             {/* Additional Info (if needed) */}
//             {transactionData.product?.description && (
//               <View style={[styles.descriptionCard, { backgroundColor: theme.card.backgroundColor}]}>
//                 <Text style={[styles.sectionTitle, { color: theme.color }]}>
//                   NOTES
//                 </Text>
//                 <Text style={{ color: theme.color }}>
//                   {transactionData.product?.description}
//                 </Text>
//               </View>
//             )}
//           </>
//         )}
//       </ScrollView>
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   headerCard: {
//     alignItems: "center",
//     padding: 15,
//     marginVertical: 10,
//     marginHorizontal: 20,
//   },
//   imageContainer: {
//     alignItems: "center",
//     padding: 10,
//     width: "100%",
//   },
//   productImage: {
//     width: "85%",
//     height: 200,
//     borderRadius: 8,
//     margin: 10,
//   },
//   barcodeContainer: {
//     width: "85%",
//     padding: 10,
//     alignItems: "center",
//     backgroundColor: "#c4d0e3",
//     borderRadius: 10,
//   },
//   detailsCard: {
//     margin: 20,
//     padding: 15,
//     borderRadius: 10,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   detailRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     borderBottomWidth: 1,
//     borderBottomColor: "#ddd",
//     paddingVertical: 12,
//   },
//   detailLabel: {
//     fontSize: 16,
//     fontWeight: "500",
//   },
//   detailValue: {
//     fontSize: 16,
//   },
//   descriptionCard: {
//     margin: 20,
//     padding: 15,
//     backgroundColor: "#Cbd5e1",
//     borderRadius: 10,
//   },
// });

// export default TransactionView;




import { View, Text } from 'react-native'
import React from 'react'

const transactionView = () => {
  return (
    <View>
      <Text>transactionView</Text>
    </View>
  )
}

export default transactionView