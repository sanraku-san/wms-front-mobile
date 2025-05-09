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
            router.push("/transactionsHistory")
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