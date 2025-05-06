import React, { useContext, useState, useCallback } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { router } from "expo-router";
import { createProduct } from "../api/products";
import { themeContext } from "../theme/themeContext";
import { selectAuth } from "@/redux/slice";
import { useSelector } from "react-redux";

const categories = [
  { label: "Food", value: 1 },
  { label: "Clothing", value: 2 },
  { label: "Electronics", value: 3 },
  { label: "Furniture", value: 4 },
  { label: "Toys", value: 5 },
];

export default function AddProducts() {
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    barcode: "",
    category_id: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext);
  const { token } = useSelector(selectAuth);

  // const handleAdd = () => {
  //   setIsLoading(true);
  //   console.log(productData);
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 1000);
  //   createProduct(productData)
  //     .then((res) => {
  //       if (res) {
  //         Alert.alert("Product Added Successfully");
  //         router.replace("/inventory");
  //       }
  //     })
  //     .catch(() => {
  //       Alert.alert("Something went wrong");
  //     });
  // };

  const handleAdd = useCallback(() => {
    if (
      !productData.name ||
      !productData.description ||
      !productData.price ||
      !productData.barcode ||
      !productData.category_id
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setIsLoading(true);
    console.log("Submitting product data:", productData);

    if (token) {
      createProduct(token, productData)
        .then((res) => {
          setIsLoading(false);
          if (res) {
            Alert.alert("Success", "Transaction added successfully");
            // clear form
            setProductData({
              name: "",
              description: "",
              price: "",
              barcode: "",
              category_id: null,
            });
          }
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Product creation error:", error);
          Alert.alert(
            "Error",
            error.message || "Something went wrong with creating the product"
          );
        });
      router.push("/(drawer)/inventory");
    } else {
      setIsLoading(false);
      console.warn("Authentication token not found");
      Alert.alert(
        "Authentication Required",
        "Please log in to create a product"
      );
      router.replace("/");
    }
  }, [token, productData]);

  return (
    <View style={[styles.container, { backgroundColor: theme.pageBackground }]}>
      <View style={styles.main}>
        <Text style={[styles.label, { color: theme.button.profileText }]}>
          NAME OF PRODUCT:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#FFF"
          value={productData.name}
          onChangeText={(text) =>
            setProductData({ ...productData, name: text })
          }
        />
        <Text style={[styles.label, { color: theme.button.profileText }]}>
          DESCRIPTION:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#FFF"
          value={productData.description}
          onChangeText={(text) =>
            setProductData({ ...productData, description: text })
          }
        />
        <Text style={[styles.label, { color: theme.button.profileText }]}>
          PRODUCT PRICE:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Price"
          placeholderTextColor="#FFF"
          value={productData.price}
          onChangeText={(text) =>
            setProductData({ ...productData, price: text })
          }
        />
        <Text style={[styles.label, { color: theme.button.profileText }]}>
          BARCODE:
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Barcode"
          placeholderTextColor="#FFF"
          value={productData.barcode}
          onChangeText={(text) =>
            setProductData({ ...productData, barcode: text })
          }
        />
        <Text style={[styles.label, { color: theme.button.profileText }]}>
          CATEGORY:
        </Text>
        <Dropdown
          style={styles.input}
          data={categories}
          labelField="label"
          valueField="value"
          placeholder="Select Category"
          placeholderStyle={{ color: "#FFF" }}
          value={productData.category_id}
          onChange={(item) =>
            setProductData({ ...productData, category_id: item.value })
          }
        />
      </View>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#Cbd5e1" }]}
        onPress={handleAdd}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={theme.button.profileIcon} />
        ) : (
          <Text
            style={[styles.buttonText, { color: theme.button.profileIcon }]}
          >
            ADD PRODUCT
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
  input: {
    width: "98%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#Cbd5e1",
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
