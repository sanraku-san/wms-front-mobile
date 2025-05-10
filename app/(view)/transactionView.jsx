import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { getTransactionById } from "../api/transactions";
import { router } from "expo-router";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";
import { selectAuth } from "@/redux/slice";
import { useSelector } from "react-redux";
import { themeContext } from "../theme/themeContext";

function TransactionView() {
  const { id } = useLocalSearchParams();
  const [transactionData, setTransactionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { token } = useSelector(selectAuth);
  const theme = useContext(themeContext);

  const refreshData = useCallback(() => {
    if (token) {
      setIsLoading(true);
      getTransactionById(id, token)
        .then((res) => {
          if (res && res.data) {
            console.log("Transaction data received:", res.data);
            setTransactionData(res.data);
          } else {
            console.error("Error fetching transaction:", res);
            Alert.alert("Error", "Failed to fetch transaction details.");
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching transaction:", error);
          Alert.alert("Error", "Something went wrong while fetching transaction details.");
          setIsLoading(false);
        });
    } else {
      console.warn("Authentication token not found.");
      Alert.alert("Authentication Required", "Please log in to view transaction details.");
      router.replace("/login");
    }
  }, [id, token]);

  useFocusEffect(refreshData);

  return (
    <>
      {/* Header */}
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
            onPress={() => router.push("transactionsHistory")}
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
        </View>
      </View>

      {/* Body */}
      <ScrollView
        style={{ backgroundColor: theme.pageBackground || theme.background }}
        contentContainerStyle={{ flexGrow: 1 }}
      >
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text style={{ color: theme.color, marginTop: 10 }}>
              Loading transaction details...
            </Text>
          </View>
        ) : !transactionData ? (
          <View style={styles.errorContainer}>
            <Text style={{ color: theme.color }}>Transaction not found</Text>
          </View>
        ) : (
          <>
            {/* Transaction Header */}
            <View style={styles.headerCard}>
              <View
                style={{
                  backgroundColor:
                    transactionData.transaction_type_id === 1
                      ? "#e7f3db"
                      : "#f9e5f1",
                  padding: 15,
                  borderRadius: 10,
                  width: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: "bold",
                    color:
                      transactionData.transaction_type_id === 1
                        ? "#4F7900"
                        : "#C90076",
                    textAlign: "center",
                  }}
                >
                  {transactionData.transaction_type_id === 1 ? "Inbound" : "Outbound"} Transaction
                </Text>
                <Text style={{ textAlign: "center", color: "#666" }}>
                  Transaction #{transactionData.id}
                </Text>
              </View>
            </View>
            
            {/* Transaction Details */}
            <View
              style={[
                styles.detailsCard,
                { backgroundColor: theme.card?.backgroundColor || "#f5f5f5" },
              ]}
            >
              <Text style={[styles.sectionTitle, { color: theme.color }]}>
                TRANSACTION DETAILS
              </Text>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.color }]}>
                  Products
                </Text>
                <Text style={[styles.detailValue, { color: theme.color }]}>
                  {transactionData.products && transactionData.products.length > 0
                    ? transactionData.products[0].name
                    : "N/A"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.color }]}>
                  Store ID
                </Text>
                <Text style={[styles.detailValue, { color: theme.color }]}>
                  {transactionData.store_id || "N/A"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.color }]}>
                  Total Price
                </Text>
                <Text style={[styles.detailValue, { color: theme.color }]}>
                  ₱ {transactionData.total_transaction_price || "0.00"}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.color }]}>
                  User ID
                </Text>
                <Text style={[styles.detailValue, { color: theme.color }]}>
                  {transactionData.user_id || "N/A"}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={[styles.detailLabel, { color: theme.color }]}>
                  Date
                </Text>
                <Text style={[styles.detailValue, { color: theme.color }]}>
                  {new Date(transactionData.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>

            {/* Product Details Section */}
            {transactionData.products && transactionData.products.length > 0 && (
              <View
                style={[
                  styles.detailsCard,
                  { backgroundColor: theme.card?.backgroundColor || "#f5f5f5" },
                ]}
              >
                <Text style={[styles.sectionTitle, { color: theme.color }]}>
                  PRODUCT DETAILS
                </Text>
                
                {transactionData.products.map((product, index) => (
                  <View key={index} style={styles.productCard}>
                    <Text style={[styles.productTitle, { color: theme.color }]}>
                      {product.name}
                    </Text>
                    
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.color }]}>
                        Barcode
                      </Text>
                      <Text style={[styles.detailValue, { color: theme.color }]}>
                        {product.barcode}
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.color }]}>
                        Price
                      </Text>
                      <Text style={[styles.detailValue, { color: theme.color }]}>
                        ₱ {product.price}
                      </Text>
                    </View>
                    
                    <View style={styles.detailRow}>
                      <Text style={[styles.detailLabel, { color: theme.color }]}>
                        Quantity
                      </Text>
                      <Text style={[styles.detailValue, { color: theme.color }]}>
                        {product.pivot?.quantity || 1}
                      </Text>
                    </View>
                    
                    {product.description && (
                      <View style={styles.descriptionBox}>
                        <Text style={[styles.descriptionText, { color: theme.color }]}>
                          {product.description}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  headerCard: {
    alignItems: "center",
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 20,
  },
  detailsCard: {
    margin: 20,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  detailValue: {
    fontSize: 16,
  },
  productCard: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  productTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  descriptionBox: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 6,
    marginTop: 10,
  },
  descriptionText: {
    fontSize: 14,
    fontStyle: "italic",
  }
});

export default TransactionView;