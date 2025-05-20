import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useCallback, useContext, useState, useEffect } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { getProducts, deleteProduct } from "../api/products";
import { router } from "expo-router";
import Icon2 from "react-native-vector-icons/Ionicons";
import Icon3 from "react-native-vector-icons/MaterialCommunityIcons";
// import { Barcode } from "expo-barcode-generator";
import { getProductById } from "../api/products";
import { themeContext } from "../theme/themeContext";
import { selectAuth } from "@/redux/slice";
import { useSelector } from "react-redux";
import FA from "react-native-vector-icons/FontAwesome6";
import { BASE_URL } from "../api/configuration";

function ProductView() {
  const [refresh, setRefresh] = useState(false);
  const { id } = useLocalSearchParams();
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    barcode: "",
    category_id: null,
    stock: "",
    image: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext);
  const { token } = useSelector(selectAuth);

  // Improved data refreshing function with proper image handling
 // Improved data refreshing function with proper image handling
const refreshData = useCallback(() => {
  if (token) {
    setIsLoading(true);
    getProductById(id, token)
      .then((res) => {
        if (res && res.data) {
          console.log("Product detail data received:", res.data);
          
          // Process the image URL similar to the inventory page
          let processedData = {...res.data};
          
          // Validate and ensure image URL is properly formatted
          if (processedData.image) {
            console.log(`Original image path: ${processedData.image}`);
            
            // Also handle relative paths (similar to inventory page)
            if (!processedData.image.startsWith('http')) {
              processedData.image = `${BASE_URL}/${processedData.image.replace(/^\//, '')}`;
              console.log(`Converted to absolute URL: ${processedData.image}`);
            }
          }
          
          // Log the final image URL for debugging
          if (processedData.image) {
            console.log(`Final image URL for ${processedData.name}: ${processedData.image}`);
          }
          
          setProductData(processedData);
        } else {
          console.error("Error fetching product details:", res);
          Alert.alert("Error", "Failed to fetch product details.");
        }
      })
      .catch((error) => {
        console.error("Error fetching product details:", error);
        Alert.alert("Error", "Something went wrong while fetching product details.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  } else {
    console.warn("Authentication token not found. Cannot fetch product details.");
    Alert.alert("Authentication Required", "Please log in to view product details.");
    router.replace("/login");
  }
}, [id, token]);

  useFocusEffect(refreshData);

  const handleDelete = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this Product?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteProduct(id, token)
              .then((res) => {
                if (res) {
                  Alert.alert("Product deleted successfully");
                  router.push("inventory");
                } else {
                  Alert.alert("Failed to delete product");
                }
              })
              .catch((error) => {
                console.error("Delete error:", error);
                Alert.alert("Something went wrong while deleting the product");
              });
          },
        },
      ]
    );
  };
  const pushToEdit = (id) => {
    router.replace({ pathname: "/(update)/editProduct", params: { id } });
  };

  return (
    <>
      {/* header functions */}
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
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <TouchableOpacity
              onPress={() => pushToEdit(id)}
              style={{
                border: 3,
                borderColor: "black",
                borderRadius: 5,
                backgroundColor: theme.button.bg,
                padding: 5,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                width: 30,
              }}
            >
              <FA name="edit" size={18} color={theme.button.edit} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(id)}
              style={{
                border: 3,
                borderColor: "black",
                borderRadius: 5,
                backgroundColor: theme.button.bg,
                padding: 5,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
                width: 30,
              }}
            >
              <FA name="trash" size={18} color={theme.button.delete} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* body, per product info */}
      <ScrollView
        style={{ backgroundColor: theme.background }}
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      >
        <View
          style={{
            alignItems: "center",
            padding: 10,
            width: "100%",
            marginTop: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <Image
            source={
              productData.image 
              ? { uri: productData.image } 
              : require("../../assets/images/box.jpg")
            }
            style={{ width: "85%", height: 300, borderRadius: 8, margin: 10 }}
            onError={(e) => {
              console.log("Image failed to load:", e.nativeEvent.error);
              // The Image component will automatically use the default source if the URI fails
            }}
          />
          {/* For debugging purposes
          {__DEV__ && productData.image && (
            <Text style={{fontSize: 10, color: theme.text.secondary, textAlign: 'center', padding: 5}}>
              Image URL: {productData.image}
            </Text>
          )} */}
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            padding: 20,
            width: "100%",
            gap: 10,
            marginLeft: 30,
            marginTop: 30
          }}
        >
          <Text
            style={{ fontWeight: "bold", fontSize: 30, color: theme.color }}
          >
            {productData.name}
          </Text>
          <Text
            style={{
              fontSize: 30,
              color: theme.text.price,
              fontWeight: "bold",
            }}
          >
            ₱ {productData.price}
          </Text>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ flexDirection: "column", gap: 10, marginTop: 10 }}>
              <Text style={{ color: theme.color }}>Category</Text>
              <Text style={{ fontSize: 20, color: theme.color }}>
                {productData.category?.name}
              </Text>
            </View>
            <View style={{ flexDirection: "column", gap: 10, marginTop: 10 }}>
              <Text style={{ color: theme.color }}>Stock Quantity</Text>
              <Text style={{ fontSize: 20, color: theme.color }}>
                {productData.stock}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 20, width: "100%", margin: 10, gap: 10, marginLeft: 30 }}>
          <Text
            style={{ fontSize: 18, color: theme.color, fontWeight: "bold" }}
          >
            DESCRIPTION
          </Text>
          <Text style={{ fontSize: 15, color: theme.color }}>
            {productData.description}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

export default ProductView;