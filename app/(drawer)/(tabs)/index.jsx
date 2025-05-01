import { router } from "expo-router";
import {
  TouchableOpacity,
  Text,
  View,
  Image,
  Alert,
  StyleSheet,
  ScrollView,
  StatusBar,
} from "react-native";
import { useState, useContext } from "react";
import { ProgressChart, ContributionGraph } from "react-native-chart-kit";
import { themeContext } from "../../theme/themeContext";

export default function Index() {
  const theme = useContext(themeContext);

  // Alert.alert("wahhh");
  // console.log("success");

  const data = {
    labels: ["Food", "Clothing", "Electronics", "Furniture", "Toys"],
    data: [0.2, 0.1, 0.3, 0.7, 0.3],
  };

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
  const commitsData = [
    { date: "2025-01-02", count: 1 }, //count ay ang sales count nung day na yun
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
      <StatusBar
        // hidden={true}
        backgroundColor="transparent"
        translucent={true}
        // barStyle="light-content"
      />
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          backgroundColor: theme.pageBackground,
        }}
      >
        <Text
          style={[
            { marginLeft: 90 },
            { marginTop: 20 },
            { fontWeight: "bold" },
            { color: theme.color },
          ]}
        >
          STOCKS
        </Text>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            marginTop: 5,
            gap: 38,
            marginLeft: 10,
          }}
        >
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
              <View
                key={index}
                style={{
                  alignItems: "flex-start",
                  marginBottom: 5,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 6,
                    backgroundColor: chartConfig.color(data.data[index]),
                    marginRight: 8,
                  }}
                />
                <Text
                  style={{
                    color: theme.color,
                  }}
                >
                  {label}: {(data.data[index] * 100).toFixed(1)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "flex-end",
            marginRight: 20,
            marginTop: 130,
          }}
        >
          <Text style={[{ fontWeight: "bold" }, { color: theme.color }]}>
            SALES COUNT PER DAY
          </Text>
          <ScrollView horizontal>
            <ContributionGraph
              values={commitsData}
              endDate={endDate}
              numDays={numDays}
              onDayPress={({ count, date }) =>
                Alert.alert(`Sales Count: ${count}`, `Date ${date}`)
              }
              width={graphWidth}
              height={215}
              gutterSize={2}
              chartConfig={chartConfig}
              tooltipDataAttrs={(data) => {
                console.log({ data });
                return { rx: 9, ry: 9 };
              }}
            />
          </ScrollView>
        </View>
        <View
          style={[
            { flexDirection: "row" },
            { marginLeft: 20 },
            { marginTop: 10 },
            { marginBottom: 10 },
            { gap: 145 },
          ]}
        >
          <Text style={[{ fontWeight: "bold" }, { color: theme.color }]}>
            RECENT TRANSACTIONS
          </Text>
          <TouchableOpacity>
            <Text>See More...</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 200 }}>
          <ScrollView vertical>
            <View style={{ gap: 10 }}>
              <View
                style={[
                  styles.card,
                  { backgroundColor: theme.card.backgroundColor },
                ]}
              >
                <Text style={[styles.text, { color: theme.color }]}>
                  Transaction 1
                </Text>
              </View>
              <View
                style={[
                  styles.card,
                  { backgroundColor: theme.card.backgroundColor },
                ]}
              >
                <Text style={[styles.text, { color: theme.color }]}>
                  Transaction 2
                </Text>
              </View>
              <View
                style={[
                  styles.card,
                  { backgroundColor: theme.card.backgroundColor },
                ]}
              >
                <Text style={[styles.text, { color: theme.color }]}>
                  Transaction 3
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#Cbd5e1",
    borderRadius: 4,
    padding: 20,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    alignItems: "center",
    justifyContent: "center",
  },
});
