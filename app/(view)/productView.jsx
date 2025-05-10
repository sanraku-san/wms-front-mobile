import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useCallback, useContext, useState } from "react";
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

function ProductView() {
  const [refresh, setRefresh] = useState(false);
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
  const { token } = useSelector(selectAuth);

  const refreshData = useCallback(() => {
    if (token) {
      // Ensure you have a token before making the API call
      getProductById(id, token) // Pass the token here
        .then((res) => {
          if (res && res.data) {
            setProductData(res.data);
          } else {
            console.error("Error fetching products:", res);
            Alert.alert("Error", "Failed to fetch products.");
          }
        })
        .catch((error) => {
          console.error("Error fetching products:", error);
          Alert.alert("Error", "Something went wrong while fetching products.");
        });
    } else {
      console.warn("Authentication token not found. Cannot fetch products.");
      Alert.alert("Authentication Required", "Please log in to view products.");
      // Optionally, redirect the user to the login screen
      router.replace("/login");
    }
  }, [id, token]); // Add token to the dependency array of useCallback

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
              .catch(() => {
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
                backgroundColor: "#DDD",
                padding: 5,
              }}
            >
              <Icon3 name="store-edit" size={18} color="gray" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleDelete(id)}
              style={{
                border: 3,
                borderColor: "black",
                borderRadius: 5,
                backgroundColor: "#DDD",
                padding: 5,
              }}
            >
              <Icon2 name="trash-sharp" size={18} color="gray" />
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
          }}
        >
          <Image
            source={require("@/assets/images/box.jpg")}
            style={{ width: "85%", height: 300, borderRadius: 8, margin: 10 }}
          />
          <View
            style={{
              width: "85%",
              padding: 10,
              alignItems: "center",
              backgroundColor: "#c4d0e3",
              borderRadius: 10,
            }}
          >
            {/* <Barcode
              value={productData.barcode || "123456789012"}
              options={{
                format: "CODE128",
                height: 30,
                width: 2.5,
                fontSize: 15,
              }}
            /> */}
          </View>
        </View>
        <View
          style={{
            flexDirection: "column",
            alignItems: "flex-start",
            padding: 20,
            width: "100%",
            // backgroundColor: theme.viewCard,
            gap: 10,
          }}
        >
          <Text
            style={{ fontWeight: "bold", fontSize: 30, color: theme.color }}
          >
            {productData.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View style={{ flexDirection: "column", gap: 10 }}>
              <Text style={{ color: theme.color }}>Category</Text>
              {/*howww?? di makita ang category name*/}
              <Text style={{ fontSize: 20, color: theme.color }}>
                {productData.category?.name}
              </Text>
            </View>
            <View style={{ flexDirection: "column", gap: 10 }}>
              <Text style={{ color: theme.color }}>Price</Text>
              <Text style={{ fontSize: 20, color: theme.color }}>
                ₱ {productData.price}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ padding: 20, width: "100%", margin: 10, gap: 10 }}>
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
