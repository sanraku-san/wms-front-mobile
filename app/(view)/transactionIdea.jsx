
import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { router } from "expo-router";
import { createTransactions } from "../api/transactions";
import { themeContext } from "../theme/themeContext";
import { selectAuth } from "@/redux/slice";
import { useSelector } from "react-redux";

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
  
  // Verify token on component mount
  useEffect(() => {
    if (!token) {
      console.warn("Authentication token not found");
      Alert.alert("Authentication Required", "Please log in to add transactions.", [
        { text: "OK", onPress: () => router.replace("") }
      ]);
    }
  }, [token]);

  const updateProductField = (index, field, value) => {
    const updatedProducts = [...transactionData.products];
    updatedProducts[index] = { 
      ...updatedProducts[index], 
      [field]: value 
    };
    
    setTransactionData({
      ...transactionData,
      products: updatedProducts
    });
  };

  const handleAdd = useCallback(() => {
    // Validate inputs
    if (!transactionData.store_id || !transactionData.transaction_type_id) {
      Alert.alert("Missing Information", "Please fill in all required fields");
      return;
    }

    // Validate products
    const hasValidProducts = transactionData.products.some(
      product => product.product_id && product.quantity
    );
    
    if (!hasValidProducts) {
      Alert.alert("Missing Product Information", "Please add at least one product with quantity");
      return;
    }

    setIsLoading(true);
    
    if (token) {
      console.log("Sending transaction data:", JSON.stringify(transactionData));
      console.log("Using token:", token.substring(0, 15) + "...");
      
      createTransactions(token, transactionData)
        .then((res) => {
          setIsLoading(false);
          if (res) {
            Alert.alert("Success", "Transaction added successfully");
            router.replace("/transactions");
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Transaction creation error:", error);
          Alert.alert(
            "Error", 
            `Failed to add transaction: ${error.message || "Unknown error"}`
          );
        });
    } else {
      setIsLoading(false);
      Alert.alert("Authentication Required", "Please log in to add transactions.", [
        { text: "OK", onPress: () => router.replace("/login") }
      ]);
    }
  }, [token, transactionData]);

  return (
    <View style={[styles.container, { backgroundColor: theme.pageBackground }]}>
      <View style={styles.main}>
        <Text style={[styles.label, { color: theme.button.profileText }]}>
          Store ID:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Store ID"
          placeholderTextColor="#999"
          value={transactionData.store_id}
          onChangeText={(text) =>
            setTransactionData({ ...transactionData, store_id: text })
          }
          keyboardType="numeric"
        />
        <Text style={[styles.label, { color: theme.button.profileText }]}>
          Transaction Type ID:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Transaction Type ID"
          placeholderTextColor="#999"
          value={transactionData.transaction_type_id}
          onChangeText={(text) =>
            setTransactionData({
              ...transactionData,
              transaction_type_id: text,
            })
          }
          keyboardType="numeric"
        />
        
        <Text style={[styles.sectionHeader, { color: theme.button.profileText }]}>
          Product Information
        </Text>
        
        {transactionData.products.map((product, index) => (
          <View key={index} style={styles.productContainer}>
            <Text style={[styles.label, { color: theme.button.profileText }]}>
              Product {index + 1}:
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Product ID"
              placeholderTextColor="#999"
              value={product.product_id}
              onChangeText={(text) => updateProductField(index, "product_id", text)}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              placeholderTextColor="#999"
              value={product.quantity}
              onChangeText={(text) => updateProductField(index, "quantity", text)}
              keyboardType="numeric"
            />
          </View>
        ))}
        
        <TouchableOpacity
          style={styles.addProductButton}
          onPress={() => {
            setTransactionData({
              ...transactionData,
              products: [
                ...transactionData.products,
                { product_id: "", quantity: "" }
              ]
            });
          }}
        >
          <Text style={styles.addProductButtonText}>+ Add Another Product</Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    padding: 10,
    flexDirection: "column",
  },
  main: {
    flex: 1,
  },
  label: {
    fontWeight: "bold",
    color: "white",
    marginBottom: 3,
  },
  sectionHeader: {
    fontWeight: "bold",
    fontSize: 16,
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
  productContainer: {
    marginBottom: 10,
  },
  addProductButton: {
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
  },
  addProductButtonText: {
    color: "#3498db",
    fontWeight: "bold",
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
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});