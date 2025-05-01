import React, { useState, useEffect, useContext } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { useRouter, useLocalSearchParams } from "expo-router";
import { updateProduct, getProductById } from "../api/products";
import { themeContext } from "../theme/themeContext";

const categories = [
  { label: "Food", value: 1 },
  { label: "Clothing", value: 2 },
  { label: "Electronics", value: 3 },
  { label: "Furniture", value: 4 },
  { label: "Toys", value: 5 },
];

export default function EditProducts() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    barcode: "",
    category_id: null,
  });
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext);

  useEffect(() => {
    getProductById(id).then((res) => {
      setProductData(res.data);
    });
  }, [id]);

  const handleUpdate = () => {
    console.log("Payload being sent:", productData); // Debugging payload
    setIsLoading(true);
    updateProduct(id, productData)
      .then(() => {
        Alert.alert("Product Updated Successfully");
        router.replace("/inventory");
      })
      .catch((error) => {
        console.error("Update failed:", error); // Log errors
        Alert.alert("Something went wrong");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.pageBackground }]}>
      <View style={styles.main}>
        <Text style={[styles.label, { color: theme.button.profileText }]}>
          NAME OF PRODUCT:
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#fff"
          value={productData.name}
          onChangeText={(text) =>
            setProductData({ ...productData, name: text })
          }
        />
        <Text style={[styles.label, { color: theme.button.profileText }]}>
          PRODUCT DESCRIPTION:
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Description"
          placeholderTextColor="#fff"
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
          placeholderTextColor="#fff"
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
          placeholderTextColor="#fff"
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
          placeholderTextColor="#fff"
          value={productData.category_id}
          onChange={(item, itemValue) =>
            setProductData({ ...productData, category_id: itemValue })
          }
        />
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: "#Cbd5e1" },
        ]}
        onPress={handleUpdate}
      >
        <Text style={[styles.buttonText, { color: theme.button.profileIcon }]}>
          UPDATE
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
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
    borderColor:"#Cbd5e1"
  },
  buttonText: {
    fontWeight: "bold",
  },
});
