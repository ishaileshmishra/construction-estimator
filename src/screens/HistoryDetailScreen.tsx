import React from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";

interface RouteProps {
  route: { params: { record: any } };
}

export default function HistoryDetailScreen({ route }: RouteProps) {
  const { record } = route.params;

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
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
        {/* Header Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Project Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date</Text>
            <Text style={styles.detailValue}>
              {formatDate(record.timestamp)}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Dimensions</Text>
            <Text style={styles.detailValue}>
              {record.length} × {record.breadth} × {record.floors} ft
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Total Area</Text>
            <Text style={styles.detailValue}>
              {(
                parseFloat(record.length) *
                parseFloat(record.breadth) *
                parseFloat(record.floors)
              ).toFixed(2)}{" "}
              sq ft
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Contingency</Text>
            <Text style={styles.detailValue}>{record.contingency}%</Text>
          </View>
        </View>

        {/* Materials Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Material Breakdown</Text>

          {record.results.map((r: any, idx: number) => (
            <View key={idx} style={styles.materialRow}>
              <View style={styles.materialLeft}>
                <Text style={styles.materialLabel}>{r.label}</Text>
                <Text style={styles.materialQty}>
                  {r.qty.toFixed(2)} {r.unit}
                </Text>
              </View>
              <Text style={styles.materialCost}>
                ₹
                {r.cost.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          ))}

          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Project Cost</Text>
            <Text style={styles.totalAmount}>
              ₹
              {record.total.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>
        </View>
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
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2d3748",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a5568",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#2d3748",
  },
  materialRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  materialLeft: {
    flex: 1,
  },
  materialLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
    marginBottom: 2,
  },
  materialQty: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
  },
  materialCost: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1a365d",
  },
  totalContainer: {
    backgroundColor: "#1a365d",
    marginHorizontal: -20,
    marginBottom: -20,
    marginTop: 16,
    padding: 20,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "800",
    color: "#ffffff",
  },
});
