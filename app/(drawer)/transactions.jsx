import React, { useContext, useState, useEffect } from "react";
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { router } from "expo-router";

import { themeContext } from "../theme/themeContext";

const transactionTypes = [
  { label: "Inbound", value: "inbound" },
  { label: "Outbound", value: "outbound" },
];

const categories = [
  { label: "Food", value: "food" },
  { label: "Clothing", value: "clothing" },
];

export default function Transaction() {
  const [transactionData, setTransactionData] = useState({
    date: "",
    summary: "",
    category: "",
    transactionType: "",
    amount: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const theme = useContext(themeContext);

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    setTransactionData(prevState => ({ ...prevState, date: formattedDate }));
  }, []);

  const handleCreateTransaction = () => {
    setIsLoading(true);
    console.log(transactionData);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert("Transaction Created Successfully");
    }, 1000);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.pageBackground }]}>
      <View style={styles.main}>
        <Text style={[styles.header, { color: theme.button.profileText }]}>
          Create Transaction
        </Text>

        <Text style={[styles.label, { color: theme.button.profileText }]}>
          Date
        </Text>
        <View style={styles.dateContainer}>
          <Text style={[{ color: theme.card.date }]}>
            {transactionData.date}
          </Text>
        </View>

        <Text style={[styles.label, { color: theme.button.profileText }]}>
          Summary
        </Text>
        <TextInput
          style={[styles.input, {backgroundColor: theme.card.backgroundColor, color: theme.card.color}]}
          placeholder="Summary"
          placeholderTextColor={theme.dropdown.placeholderColor}
          value={transactionData.summary}
          onChangeText={(text) =>
            setTransactionData({ ...transactionData, summary: text })
          }
        />

        <Text style={[styles.label, { color: theme.button.profileText, } ]}>
          Category
        </Text>
        <Dropdown
          style={[
            styles.dropdown,
            { backgroundColor: theme.dropdown.backgroundColor },
          ]}
          data={categories}
          labelField="label"
          valueField="value"
          placeholder="Select Category"
          placeholderStyle={[styles.placeholderStyle, {color: theme.dropdown.placeholderColor}]}
          selectedTextStyle={{ color: theme.card.color }}

          value={transactionData.category}
          onChange={(item) =>
            setTransactionData({ ...transactionData, category: item.value })
          }
          dropdownStyle={{ backgroundColor: theme.pageBackground, borderRadius: 10 }}
        />

        <Text style={[styles.label, { color: theme.button.profileText }]}>
          Transaction Type
        </Text>
        <Dropdown
          style={[
            styles.dropdown,
            { backgroundColor: theme.dropdown.backgroundColor },
          ]}
          data={transactionTypes}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select Transaction Type"
          placeholderStyle={[styles.placeholderStyle, {color: theme.dropdown.placeholderColor}]}

          selectedTextStyle={{ color: theme.card.color }}
          value={transactionData.transactionType}
          onChange={(item) =>
            setTransactionData({ ...transactionData, transactionType: item.value })
          }
          dropdownStyle={{ backgroundColor: theme.pageBackground, borderRadius: 10 }}
        />

        <Text style={[styles.label, { color: theme.button.profileText }]}>
          Amount
        </Text>
        <TextInput
          style={[styles.input, {backgroundColor: theme.card.backgroundColor, color: theme.card.color}]}
          placeholder="Amount"
          placeholderTextColor={theme.dropdown.placeholderColor}
          keyboardType="numeric"
          value={transactionData.amount}
          onChangeText={(text) =>
            setTransactionData({ ...transactionData, amount: text })
          }
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.createButton, { backgroundColor: theme.card.backgroundColor, borderColor: "#ccc", borderWidth: 1 }]}
          onPress={handleCreateTransaction}
          disabled={isLoading}
        >
          <Text style={[styles.createButtonText, { color: theme.color }]}>
            {isLoading ? "Creating..." : "CREATE TRANSACTION"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9"
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 25,
    textAlign: "center",
  },
  main: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#Cbd5e1",
    color: "#FFF",
  },
  dropdown: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: "#Cbd5e1", 
    justifyContent: "center",
  },
  placeholderStyle: {
    fontSize: 16,
  },
  dateContainer: {
    height: 50,
    backgroundColor: "#e0e0e0", 
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  createButton: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
  },
  createButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});