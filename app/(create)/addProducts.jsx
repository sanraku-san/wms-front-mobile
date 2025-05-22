import React, { useContext, useState, useCallback } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { createProduct } from "../api/products";
import { themeContext } from "../theme/themeContext";
import { selectAuth } from "@/redux/slice";
import { useSelector } from "react-redux";
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";

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
    stock: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext);
  const { token } = useSelector(selectAuth);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Please grant camera roll permissions to upload images"
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleAdd = useCallback(async () => {
    if (
      !productData.name ||
      !productData.description ||
      !productData.price ||
      !productData.barcode ||
      !productData.category_id ||
      !selectedImage
    ) {
      Alert.alert("Error", "Please fill in all fields and select an image");
      return;
    }

    setIsLoading(true);

    try {
      const formData = new FormData();

      Object.keys(productData).forEach((key) => {
        formData.append(key, productData[key]);
      });

      const imageUri = selectedImage.uri;
      const filename = imageUri.split("/").pop();

      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      formData.append("image", {
        uri: imageUri,
        name: filename,
        type,
      });

      if (token) {
        const res = await createProduct(token, formData);

        setIsLoading(false);

        if (res && !res.error) {
          Alert.alert("Success", "Product added successfully");
          setProductData({
            name: "",
            description: "",
            price: "",
            barcode: "",
            category_id: null,
            stock: "",
          });
          setSelectedImage(null);
          router.push("/(drawer)/inventory");
        } else {
          Alert.alert("Error", res.message || "Failed to add product");
        }
      } else {
        setIsLoading(false);
        Alert.alert(
          "Authentication Required",
          "Please log in to create a product"
        );
        router.replace("/");
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Product creation error:", error);
      Alert.alert(
        "Error",
        error.message || "Something went wrong with creating the product"
      );
    }
  }, [token, productData, selectedImage]);

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 30,
        }}
      >
        <TouchableOpacity
          onPress={() => router.push("inventory")}
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
      <ScrollView
        style={[styles.container, { backgroundColor: theme.pageBackground }]}
      >
        <View style={styles.main}>
          <Text style={[styles.title, { color: theme.button.profileText }]}>
            Add New Product
          </Text>

          <Text style={[styles.label, { color: theme.button.profileText }]}>
            Product Name:
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
            Price:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Price"
            placeholderTextColor="#FFF"
            value={productData.price}
            onChangeText={(text) =>
              setProductData({ ...productData, price: text })
            }
            keyboardType="numeric"
          />

          <Text style={[styles.label, { color: theme.button.profileText }]}>
            Barcode:
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
            Category:
          </Text>
          <Dropdown
            style={styles.input}
            data={categories}
            labelField="label"
            valueField="value"
            placeholder="Select Category"
            placeholderStyle={{ color: "#FFF" }}
            selectedTextStyle={{ color: "#000" }}
            value={productData.category_id}
            onChange={(item) =>
              setProductData({ ...productData, category_id: item.value })
            }
          />

          <Text style={[styles.label, { color: theme.button.profileText }]}>
            Stock Quantity:
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Stock Quantity"
            placeholderTextColor="#FFF"
            value={productData.stock}
            onChangeText={(text) =>
              setProductData({ ...productData, stock: text })
            }
            keyboardType="numeric"
          />

          <Text style={[styles.label, { color: theme.button.profileText }]}>
            Description:
          </Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Description"
            placeholderTextColor="#FFF"
            value={productData.description}
            onChangeText={(text) =>
              setProductData({ ...productData, description: text })
            }
            multiline={true}
            numberOfLines={4}
          />
          <Text style={[styles.label, { color: theme.button.profileText }]}>
            Product Image:
          </Text>
          <TouchableOpacity
            style={styles.imagePickerButton}
            onPress={pickImage}
          >
            <Text style={styles.imagePickerText}>
              {selectedImage ? "Change Image" : "Select an Image"}
            </Text>
          </TouchableOpacity>

          {selectedImage && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{ uri: selectedImage.uri }}
                style={styles.imagePreview}
              />
            </View>
          )}
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
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  main: {
    flex: 1,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#Cbd5e1",
  },
  descriptionInput: {
    height: 100,
    textAlignVertical: "top",
  },
  imagePickerButton: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "#Cbd5e1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  imagePickerText: {
    color: "#FFF",
    fontWeight: "bold",
  },
  imagePreviewContainer: {
    width: "100%",
    height: 200,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#Cbd5e1",
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  button: {
    padding: 15,
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  buttonText: {
    fontWeight: "bold",
  },
});
