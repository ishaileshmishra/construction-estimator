import * as Localization from "expo-localization";
import { I18n } from "i18n-js";
// This file contains translations for the application in different languages.
// The translations are structured as key-value pairs where the key is the translation identifier
const translations = {
  en: {
    title: "Construction Cost Estimator",
    length: "Length (ft)",
    breadth: "Breadth (ft)",
    floors: "Floors",
    contingency: "Contingency (%)",
    rates: "Material Rates",
    calculate: "Calculate",
    exportPDF: "Export PDF",
    exportCSV: "Export CSV",
    history: "View History",
    estimate: "Estimate",
    material: "Material",
    qty: "Quantity",
    cost: "Cost",
    totalCost: "Total Cost",
    error: "Error",
    invalidDimensions: "Please enter valid dimensions",
  },
  hi: {
    title: "निर्माण लागत कैलकुलेटर",
    length: "लंबाई (फीट)",
    breadth: "चौड़ाई (फीट)",
    floors: "मंज़िलें",
    contingency: "अतिरिक्त (%)",
    rates: "सामग्री दर",
    calculate: "गणना करें",
    exportPDF: "पीडीएफ निर्यात",
    exportCSV: "CSV निर्यात",
    history: "इतिहास देखें",
    estimate: "अनुमान",
    material: "सामग्री",
    qty: "मात्रा",
    cost: "लागत",
    totalCost: "कुल लागत",
    error: "त्रुटि",
    invalidDimensions: "कृपया मान्य आयाम दर्ज करें",
  },
};

const i18n = new I18n(translations);

// Set the locale based on the device's locale
i18n.locale = Localization.locale;

// Enable fallbacks so if an translation is missing it will fallback to another language
i18n.enableFallback = true;

// Set fallback language
i18n.defaultLocale = "en";

export default i18n;
