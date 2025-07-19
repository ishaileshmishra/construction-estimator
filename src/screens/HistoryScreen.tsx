import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface NavProps {
  navigation: any;
}

export default function HistoryScreen({ navigation }: NavProps) {
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      const data = await AsyncStorage.getItem("history");
      if (data) setHistory(JSON.parse(data));
      else setHistory([]);
    });
    return unsubscribe;
  }, [navigation]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {history.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No History Found</Text>
            <Text style={styles.emptyText}>
              Your calculation history will appear here once you start
              estimating construction costs.
            </Text>
          </View>
        ) : (
          history.map((item, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.card}
              onPress={() =>
                navigation.navigate("HistoryDetail", { record: item })
              }
            >
              <View style={styles.cardHeader}>
                <Text style={styles.cardDate}>
                  {formatDate(item.timestamp)}
                </Text>
                <Text style={styles.cardTotal}>
                  ₹
                  {item.total.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
              <View style={styles.cardDetails}>
                <Text style={styles.cardDimensions}>
                  {item.length} × {item.breadth} × {item.floors} ft
                </Text>
                <Text style={styles.cardArea}>
                  Total:{" "}
                  {(
                    parseFloat(item.length) *
                    parseFloat(item.breadth) *
                    parseFloat(item.floors)
                  ).toFixed(2)}{" "}
                  sq ft
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: "#718096",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardDate: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
  },
  cardTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a365d",
  },
  cardDetails: {
    gap: 4,
  },
  cardDimensions: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
  },
  cardArea: {
    fontSize: 14,
    color: "#4a5568",
    fontWeight: "500",
  },
});
