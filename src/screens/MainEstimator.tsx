import React, { useEffect, useState, useMemo } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import * as FileSystem from "expo-file-system";
import i18n from "../i18n/translations";
import {
  MATERIAL_FACTORS,
  computeEstimate,
  computeGrandTotal,
  LineItemResult,
} from "../utils/estimator";
import { DEFAULT_RATES } from "../utils/constants";

const { width } = Dimensions.get("window");

interface NavProps {
  navigation: any;
}

export default function MainEstimator({ navigation }: NavProps) {
  const [length, setLength] = useState("10");
  const [breadth, setBreadth] = useState("10");
  const [floors, setFloors] = useState("1");
  const [contingency, setContingency] = useState("10");
  const [rates, setRates] = useState<Record<string, string>>(() =>
    DEFAULT_RATES.reduce((acc, r) => {
      acc[r.key] = String(r.rate);
      return acc;
    }, {} as Record<string, string>)
  );
  const [language, setLanguage] = useState<"en" | "hi">("en");
  const [results, setResults] = useState<LineItemResult[] | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const parsedRates = useMemo(() => {
    const out: Record<string, number> = {};
    for (const key in rates) {
      const v = parseFloat(rates[key]);
      out[key] = isNaN(v) ? 0 : v;
    }
    return out;
  }, [rates]);

  // Load persisted state
  useEffect(() => {
    (async () => {
      try {
        const savedRates = await AsyncStorage.getItem("rates");
        const savedLang = await AsyncStorage.getItem("lang");
        const savedInputs = await AsyncStorage.getItem("inputs");
        if (savedRates) setRates(JSON.parse(savedRates));
        if (savedLang) setLanguage(savedLang as "en" | "hi");
        if (savedInputs) {
          const inp = JSON.parse(savedInputs);
          setLength(inp.length);
          setBreadth(inp.breadth);
          setFloors(inp.floors);
          setContingency(inp.contingency);
        }
      } catch (e) {
        console.log("Failed to load data", e);
      }
    })();
  }, []);

  // Persist state
  useEffect(() => {
    AsyncStorage.setItem("rates", JSON.stringify(rates));
    AsyncStorage.setItem("lang", language);
    AsyncStorage.setItem(
      "inputs",
      JSON.stringify({ length, breadth, floors, contingency })
    );
  }, [rates, language, length, breadth, floors, contingency]);

  const handleCalc = async () => {
    const l = parseFloat(length);
    const b = parseFloat(breadth);
    const f = parseFloat(floors);
    if (isNaN(l) || isNaN(b) || isNaN(f) || l <= 0 || b <= 0 || f <= 0) {
      Alert.alert(
        i18n.t("error", { locale: language }) || "Error",
        i18n.t("invalidDimensions", { locale: language }) ||
          "Please enter valid dimensions."
      );
      return;
    }

    setIsCalculating(true);

    // Add slight delay for better UX
    setTimeout(() => {
      const area = l * b * f;
      let lines = computeEstimate(area, parsedRates);

      const cont = parseFloat(contingency) / 100;
      if (!isNaN(cont) && cont > 0) {
        lines = lines.map((line) => ({
          ...line,
          qty: line.qty * (1 + cont),
          cost: line.cost * (1 + cont),
          altUnits: line.altUnits?.map((au) => ({
            ...au,
            qty: au.qty * (1 + cont),
          })),
        }));
      }

      setResults(lines);
      setIsCalculating(false);

      saveToHistory({
        timestamp: new Date().toISOString(),
        length,
        breadth,
        floors,
        contingency,
        results: lines,
        total: computeGrandTotal(lines),
      });
    }, 500);
  };

  const total = useMemo(
    () => (results ? computeGrandTotal(results) : 0),
    [results]
  );

  const toggleLang = () => setLanguage((prev) => (prev === "en" ? "hi" : "en"));

  const saveToHistory = async (record: any) => {
    try {
      const historyData = await AsyncStorage.getItem("history");
      let history = historyData ? JSON.parse(historyData) : [];
      history.unshift(record);
      if (history.length > 50) history = history.slice(0, 50); // keep last 50
      await AsyncStorage.setItem("history", JSON.stringify(history));
    } catch (err) {
      console.log("Failed to save history", err);
    }
  };

  const handleExportPDF = async () => {
    if (!results) return;
    setIsExporting(true);

    try {
      let html = `
        <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
          <h1 style="text-align: center; color: #1a365d; margin-bottom: 30px;">${i18n.t(
            "title",
            { locale: language }
          )}</h1>
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2d3748; margin-top: 0;">Project Details</h2>
            <p><strong>Dimensions:</strong> ${length} × ${breadth} × ${floors} ft</p>
            <p><strong>Total Area:</strong> ${(
              parseFloat(length) *
              parseFloat(breadth) *
              parseFloat(floors)
            ).toFixed(2)} sq ft</p>
            <p><strong>Contingency:</strong> ${contingency}%</p>
          </div>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <thead>
              <tr style="background: #edf2f7;">
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: left;">${i18n.t(
                  "material",
                  { locale: language }
                )}</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">${i18n.t(
                  "qty",
                  { locale: language }
                )}</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">Rate</th>
                <th style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">${i18n.t(
                  "cost",
                  { locale: language }
                )}</th>
              </tr>
            </thead>
            <tbody>
      `;

      results.forEach((r) => {
        html += `
          <tr>
            <td style="border: 1px solid #e2e8f0; padding: 12px;">${
              language === "en" ? r.label : r.labelHi
            }</td>
            <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">${r.qty.toFixed(
              2
            )} ${r.unit}</td>
            <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">₹${r.rate.toFixed(
              2
            )}</td>
            <td style="border: 1px solid #e2e8f0; padding: 12px; text-align: right;">₹${r.cost.toFixed(
              2
            )}</td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
          <div style="background: #1a365d; color: white; padding: 20px; border-radius: 8px; text-align: center;">
            <h2 style="margin: 0; font-size: 24px;">${i18n.t("totalCost", {
              locale: language,
            })}: ₹${total.toLocaleString("en-IN", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}</h2>
          </div>
          <p style="text-align: center; color: #718096; margin-top: 20px; font-size: 12px;">Generated on ${new Date().toLocaleDateString()}</p>
        </div>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, {
        dialogTitle: "Share Construction Estimate",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to export PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = async () => {
    if (!results) return;
    setIsExporting(true);

    try {
      let csv = `Material,Quantity,Unit,Rate,Cost\n`;
      results.forEach((r) => {
        csv += `"${language === "en" ? r.label : r.labelHi}",${r.qty.toFixed(
          2
        )},${r.unit},${r.rate.toFixed(2)},${r.cost.toFixed(2)}\n`;
      });
      csv += `"Total",,,,"${total.toFixed(2)}"`;

      const fileUri =
        FileSystem.cacheDirectory + `construction_estimate_${Date.now()}.csv`;
      await FileSystem.writeAsStringAsync(fileUri, csv, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri, {
        dialogTitle: "Share Construction Estimate CSV",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to export CSV. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            {i18n.t("title", { locale: language })}
          </Text>
          <TouchableOpacity style={styles.langToggle} onPress={toggleLang}>
            <Text style={styles.langToggleText}>
              {language === "en" ? "हिन्दी" : "English"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Project Details Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Project Details</Text>

          <View style={styles.inputGrid}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {i18n.t("length", { locale: language })}
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={length}
                onChangeText={setLength}
                placeholder="10"
                placeholderTextColor="#a0aec0"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {i18n.t("breadth", { locale: language })}
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={breadth}
                onChangeText={setBreadth}
                placeholder="10"
                placeholderTextColor="#a0aec0"
              />
            </View>
          </View>

          <View style={styles.inputGrid}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {i18n.t("floors", { locale: language })}
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={floors}
                onChangeText={setFloors}
                placeholder="1"
                placeholderTextColor="#a0aec0"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>
                {i18n.t("contingency", { locale: language })}
              </Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={contingency}
                onChangeText={setContingency}
                placeholder="10"
                placeholderTextColor="#a0aec0"
              />
            </View>
          </View>

          {/* Area Display */}
          <View style={styles.areaDisplay}>
            <Text style={styles.areaLabel}>Total Area</Text>
            <Text style={styles.areaValue}>
              {(
                parseFloat(length || "0") *
                parseFloat(breadth || "0") *
                parseFloat(floors || "0")
              ).toFixed(2)}{" "}
              sq ft
            </Text>
          </View>
        </View>

        {/* Material Rates Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {i18n.t("rates", { locale: language })}
          </Text>

          {MATERIAL_FACTORS.map((m) => (
            <View key={m.key} style={styles.rateRow}>
              <View style={styles.rateLabelContainer}>
                <Text style={styles.rateLabel}>
                  {language === "en" ? m.label : m.labelHi}
                </Text>
                <Text style={styles.rateUnit}>per {m.defaultUnit}</Text>
              </View>
              <View style={styles.rateInputContainer}>
                <Text style={styles.currencySymbol}>₹</Text>
                <TextInput
                  style={styles.rateInput}
                  keyboardType="numeric"
                  value={rates[m.key]}
                  onChangeText={(v) => setRates((r) => ({ ...r, [m.key]: v }))}
                  placeholder="0"
                  placeholderTextColor="#a0aec0"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[
              styles.primaryButton,
              isCalculating && styles.disabledButton,
            ]}
            onPress={handleCalc}
            disabled={isCalculating}
          >
            <Text style={styles.primaryButtonText}>
              {isCalculating
                ? "Calculating..."
                : i18n.t("calculate", { locale: language })}
            </Text>
          </TouchableOpacity>

          {results && (
            <View style={styles.exportContainer}>
              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  isExporting && styles.disabledButton,
                ]}
                onPress={handleExportPDF}
                disabled={isExporting}
              >
                <Text style={styles.secondaryButtonText}>
                  📄 {i18n.t("exportPDF", { locale: language })}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.secondaryButton,
                  isExporting && styles.disabledButton,
                ]}
                onPress={handleExportCSV}
                disabled={isExporting}
              >
                <Text style={styles.secondaryButtonText}>
                  📊 {i18n.t("exportCSV", { locale: language })}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => navigation.navigate("History")}
          >
            <Text style={styles.historyButtonText}>
              📋 {i18n.t("history", { locale: language })}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Results Card */}
        {results && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {i18n.t("estimate", { locale: language })}
            </Text>

            {results.map((item) => (
              <View style={styles.resultRow} key={item.key}>
                <View style={styles.resultLeft}>
                  <Text style={styles.resultLabel}>
                    {language === "en" ? item.label : item.labelHi}
                  </Text>
                  <Text style={styles.resultQty}>
                    {item.qty.toFixed(2)} {item.unit}
                  </Text>
                </View>
                <Text style={styles.resultCost}>
                  ₹
                  {item.cost.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            ))}

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>
                {i18n.t("totalCost", { locale: language })}
              </Text>
              <Text style={styles.totalAmount}>
                ₹
                {total.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a365d",
    flex: 1,
  },
  langToggle: {
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  langToggleText: {
    color: "#2d3748",
    fontWeight: "600",
    fontSize: 14,
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
  inputGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4a5568",
    marginBottom: 8,
  },
  input: {
    borderWidth: 2,
    borderColor: "#e2e8f0",
    backgroundColor: "#f7fafc",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: "#2d3748",
    fontWeight: "500",
  },
  areaDisplay: {
    backgroundColor: "#edf2f7",
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  areaLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a5568",
  },
  areaValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a365d",
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    paddingVertical: 8,
  },
  rateLabelContainer: {
    flex: 1,
  },
  rateLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
  },
  rateUnit: {
    fontSize: 12,
    color: "#718096",
    fontWeight: "500",
  },
  rateInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7fafc",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderRadius: 10,
    paddingHorizontal: 12,
    minWidth: 100,
  },
  currencySymbol: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4a5568",
    marginRight: 4,
  },
  rateInput: {
    flex: 1,
    padding: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#2d3748",
    textAlign: "right",
  },
  actionContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: "#3182ce",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#3182ce",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
  exportContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  secondaryButton: {
    backgroundColor: "#48bb78",
    padding: 14,
    borderRadius: 12,
    flex: 1,
    alignItems: "center",
    shadowColor: "#48bb78",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  historyButton: {
    backgroundColor: "#ed8936",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#ed8936",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  historyButtonText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
  disabledButton: {
    opacity: 0.6,
  },
  resultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  resultLeft: {
    flex: 1,
  },
  resultLabel: {
    fontWeight: "600",
    fontSize: 16,
    color: "#2d3748",
    marginBottom: 2,
  },
  resultQty: {
    fontSize: 14,
    color: "#718096",
    fontWeight: "500",
  },
  resultCost: {
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
