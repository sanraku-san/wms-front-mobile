import { router } from "expo-router";
import {
  TouchableOpacity,
  Text,
  View,
  Alert,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { useContext } from "react";
import { ProgressChart, ContributionGraph } from "react-native-chart-kit";
import { themeContext } from "../../theme/themeContext";

export default function Index() {
  const theme = useContext(themeContext);

  const data = {
    labels: ["Food", "Clothing", "Electronics", "Furniture", "Toys"],
    data: [0.2, 0.1, 0.3, 0.7, 0.3],
  };
  console.log("theme.pageBackground", theme.pageBackground);

  const chartConfig = {
    backgroundGradientFromOpacity: 0,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => {
      const themeBackground = theme.pageBackground.replace(/#/g, "").trim();
      return themeBackground === "bdc2c9"
        ? `rgba(15, 25, 40, ${opacity})`
        : `rgba(220, 220, 220, ${opacity})`;
    },
    strokeWidth: 5,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };
  
  const recentTransactions = [
    {
      id: 1,
      name: "Purchase - Apple iPhone 15",
      date: "2025-04-20",
      amount: 1199.99,
      type: "Electronics",
    },
    {
      id: 2,
      name: "Order - Leather Jacket",
      date: "2025-04-19",
      amount: 250.0,
      type: "Clothing",
    },
    {
      id: 3,
      name: "Sale - Dining Table Set",
      date: "2025-04-18",
      amount: 699.0,
      type: "Furniture",
    },
  ];

  const commitsData = [
    { date: "2025-01-02", count: 1 },
    { date: "2025-01-03", count: 2 },
    { date: "2025-01-04", count: 3 },
    { date: "2025-01-05", count: 4 },
    { date: "2025-01-06", count: 5 },
    { date: "2025-01-30", count: 2 },
    { date: "2025-01-31", count: 3 },
    { date: "2025-02-01", count: 1 },
    { date: "2025-02-15", count: 2 },
    { date: "2025-03-01", count: 2 },
    { date: "2025-03-05", count: 2 },
    { date: "2025-04-01", count: 4 },
    { date: "2025-05-01", count: 3 },
    { date: "2025-06-01", count: 2 },
    { date: "2025-07-01", count: 5 },
    { date: "2025-08-01", count: 1 },
    { date: "2025-09-01", count: 3 },
    { date: "2025-10-01", count: 4 },
    { date: "2025-11-01", count: 2 },
    { date: "2025-12-01", count: 5 },
  ];

  const endDate = new Date("2025-12-31");
  const numDays = 365;
  const graphWidth = 1200;
  const graphHeight = 300;


  return (
    <>
      <StatusBar  />
      <ScrollView
        style={[styles.container, { backgroundColor: theme.indexpageBackground }]}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.color }]}>📦 STOCKS</Text>

        <View style={styles.chartRow}>
          <ProgressChart
            data={data}
            width={180}
            height={180}
            strokeWidth={16}
            radius={32}
            chartConfig={chartConfig}
            hideLegend={true}
          />

          <View>
            {data.labels.map((label, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendColorDot, { backgroundColor: chartConfig.color(data.data[index]) }]}
                />
                <Text style={{ color: theme.color }}>
                  {label}: {(data.data[index] * 100).toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 40 }}>
          <Text style={[styles.sectionTitle, { color: theme.color }]}>📈 SALES COUNT PER DAY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <ContributionGraph
              values={commitsData}
              endDate={endDate}
              numDays={numDays}
              width={graphWidth}
              height={215}
              gutterSize={2}
              chartConfig={chartConfig}
              onDayPress={({ count, date }) =>
                Alert.alert(`Sales Count: ${count}`, `Date ${date}`)
              }
            />
          </ScrollView>
        </View>

        <View style={styles.subTitleRow}>
          <Text style={[styles.sectionTitle, { color: theme.color }]}>💸 RECENT TRANSACTIONS</Text>
          <TouchableOpacity onPress={()=>router.push("/(drawer)/transactionsHistory")}>
            <Text style={{ color: theme.fabBackground, fontWeight: "600" }}>See More...</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollSection}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        >
          {recentTransactions.map((tx) => (
            <TouchableOpacity
              key={tx.id}
              style={[styles.card, { backgroundColor: theme.card.backgroundColor }]}
            >
              <View>
                <Text style={[styles.cardText, { color: theme.color }]}>{tx.name}</Text>
                <Text style={{ color: theme.secondColor, fontSize: 13 }}>{tx.date}</Text>
              </View>
              <Text
                style={{
                  color: tx.amount >= 0 ? "#4CAF50" : "#F44336",
                  fontWeight: "600",
                  fontSize: 16,
                }}
              >
                {tx.amount >= 0 ? `+$${tx.amount.toFixed(2)}` : `-$${Math.abs(tx.amount).toFixed(2)}`}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 10,
  },
  chartRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 30,
    paddingLeft: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  legendColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  subTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems:"center",
    gap:5,
    alignItems: "center",
  },
  scrollSection: {
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
