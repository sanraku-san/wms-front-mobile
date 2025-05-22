import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { getTransactionById } from "../api/transactions";
import { router } from "expo-router";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";
import { selectAuth } from "@/redux/slice";
import { useSelector } from "react-redux";
import { themeContext } from "../theme/themeContext";

function TransactionView() {
  const { id, allTransactions } = useLocalSearchParams();
  const [transactionData, setTransactionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactionsData, setAllTransactionsData] = useState([]);
  const { token } = useSelector(selectAuth);
  const theme = useContext(themeContext);

  console.log("transaction data", transactionData);
  useEffect(() => {
    if (allTransactions) {
      try {
        const parsedData = JSON.parse(allTransactions);
        setAllTransactionsData(parsedData);
        const currentTransaction = parsedData.find(
          (transaction) => transaction.id.toString() === id.toString()
        );
        if (currentTransaction) {
          console.log("Found transaction in history data");
          setTransactionData(currentTransaction);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error parsing transaction history data:", error);
      }
    }
  }, [allTransactions, id]);

  const refreshData = useCallback(() => {
    if (transactionData && !isLoading) {
      return;
    }
    
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
          Alert.alert(
            "Error",
            "Something went wrong while fetching transaction details."
          );
          setIsLoading(false);
        });
    } else {
      console.warn("Authentication token not found.");
      Alert.alert(
        "Authentication Required",
        "Please log in to view transaction details."
      );
      router.replace("/login");
    }
  }, [id, token, transactionData, isLoading]);

  useFocusEffect(refreshData);

  const findRelatedTransaction = (type) => {
    if (!allTransactionsData.length || !transactionData) return null;
    
    const sortedTransactions = [...allTransactionsData].sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
    
    const currentIndex = sortedTransactions.findIndex(
      t => t.id.toString() === transactionData.id.toString()
    );
    
    if (currentIndex === -1) return null;
    
    if (type === 'previous' && currentIndex < sortedTransactions.length - 1) {
      return sortedTransactions[currentIndex + 1];
    } else if (type === 'next' && currentIndex > 0) {
      return sortedTransactions[currentIndex - 1];
    }
    
    return null;
  };
  
  const navigateToTransaction = (type) => {
    const transaction = findRelatedTransaction(type);
    if (transaction) {
      router.push({
        pathname: "transactionView",
        params: { 
          id: transaction.id,
          allTransactions: allTransactions
        },
      });
    } else {
      Alert.alert("No more transactions", `No ${type} transaction available.`);
    }
  };

  console.log(JSON.stringify(transactionData, null, 2));
  
  return (
    <>
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
            <View style={styles.headerCard}>
              <View
                style={{
                  backgroundColor:
                    transactionData.transaction_type_id === 1
                      ? "#e7f3db"
                      : "#fdf2f8",
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
                  {transactionData.transaction_type_id === 1
                    ? "Inbound"
                    : "Outbound"}{" "}
                  Transaction
                </Text>
                <Text style={{ textAlign: "center", color: "#666" }}>
                  Transaction #{transactionData.id}
                </Text>
              </View>
            </View>
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
                  Store
                </Text>
                <Text style={[styles.detailValue, { color: theme.color }]}>
                  {transactionData.store?.name || "Unknown Store"}
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
                  Date
                </Text>
                <Text style={[styles.detailValue, { color: theme.color }]}>
                  {new Date(transactionData.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>
            {transactionData.products &&
              transactionData.products.length > 0 && (
                <View
                  style={[
                    styles.detailsCard,
                    {
                      backgroundColor: theme.card?.backgroundColor || "#f5f5f5",
                    },
                  ]}
                >
                  <Text style={[styles.sectionTitle, { color: theme.color }]}>
                    PRODUCT DETAILS
                  </Text>

                  {transactionData.products.map((product, index) => (
                    <View key={index} style={styles.productCard}>
                      <Text
                        style={[styles.productTitle, { color: theme.color }]}
                      >
                        {product.name}
                      </Text>

                      <View style={styles.detailRow}>
                        <Text
                          style={[styles.detailLabel, { color: theme.color }]}
                        >
                          Barcode
                        </Text>
                        <Text
                          style={[styles.detailValue, { color: theme.color }]}
                        >
                          {product.barcode || "N/A"}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text
                          style={[styles.detailLabel, { color: theme.color }]}
                        >
                          Price
                        </Text>
                        <Text
                          style={[styles.detailValue, { color: theme.color }]}
                        >
                          ₱ {product.price}
                        </Text>
                      </View>

                      <View style={styles.detailRow}>
                        <Text
                          style={[styles.detailLabel, { color: theme.color }]}
                        >
                          Quantity
                        </Text>
                        <Text
                          style={[styles.detailValue, { color: theme.color }]}
                        >
                          {Math.floor(product.pivot?.quantity) || 1}
                        </Text>
                      </View>

                      {product.description && (
                        <View style={styles.descriptionBox}>
                          <Text
                            style={[
                              styles.descriptionText,
                              { color: "black" },
                            ]}
                          >
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
    marginHorizontal: 10,
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
  },
});

export default TransactionView;