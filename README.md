# 🏗️ Construction Cost Estimator

A comprehensive **React Native** mobile application built with **Expo** for estimating construction material costs and quantities using industry-standard thumb rules. The app provides accurate cost calculations for residential and commercial construction projects with a modern, production-ready user interface.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React Native](https://img.shields.io/badge/React%20Native-0.76.3-green.svg)
![Expo](https://img.shields.io/badge/Expo-~52.0.0-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue.svg)

## 📋 Table of Contents

- [Features](#features)
- [Screenshots](#screenshots)
- [Technical Stack](#technical-stack)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Material Calculation Logic](#material-calculation-logic)
- [Localization](#localization)
- [Data Persistence](#data-persistence)
- [Export Features](#export-features)
- [UI/UX Design](#uiux-design)
- [Usage Guide](#usage-guide)
- [API Reference](#api-reference)
- [Contributing](#contributing)
- [License](#license)

## ✨ Features

### 🧮 **Core Calculation Features**

- **Multi-dimensional Input**: Calculate for Length × Breadth × Floors
- **Real-time Area Calculation**: Instant total area display as you type
- **7 Essential Materials**: Cement, Steel, Sand, Aggregate, Brick, Tile, Paint
- **Industry-standard Thumb Rules**: Based on per-square-foot calculations
- **Contingency Planning**: Configurable percentage uplift for unexpected costs
- **Unit Rate Customization**: Editable rates for all materials with local currency

### 🌍 **Localization & Accessibility**

- **Bilingual Support**: Complete English/Hindi interface toggle
- **Localized Material Names**: Native language material descriptions
- **Currency Formatting**: Indian Rupee with proper number formatting
- **Date/Time Localization**: Regional date and time formats

### 📊 **Data Management**

- **Persistent Storage**: Local data storage using AsyncStorage
- **Calculation History**: Stores last 50 estimates with complete details
- **State Management**: Automatic saving of user preferences and rates
- **Data Export**: Professional PDF and CSV export capabilities

### 📱 **Modern User Experience**

- **Material Design**: Card-based layout with proper shadows and elevation
- **Responsive Interface**: Optimized for various screen sizes
- **Loading States**: Visual feedback during calculations and exports
- **Error Handling**: Comprehensive error messages with user guidance
- **Smooth Animations**: Subtle transitions for better user experience

### 🔄 **Export & Sharing**

- **Professional PDF Export**: Formatted reports with project details
- **CSV Data Export**: Spreadsheet-compatible data for further analysis
- **Native Sharing**: Integration with device sharing capabilities
- **Print Support**: Direct printing functionality via Expo Print

## 📱 Screenshots

```
🏠 Main Estimator Screen
├── Project Details Card
│   ├── Dimension Inputs (Length, Breadth, Floors)
│   ├── Contingency Percentage
│   └── Real-time Area Display
├── Material Rates Card
│   ├── Customizable Unit Rates
│   ├── Currency Input with ₹ Symbol
│   └── Unit Type Display
├── Action Buttons
│   ├── Calculate Button (Primary CTA)
│   ├── Export PDF/CSV (Secondary)
│   └── History Access
└── Results Display
    ├── Material Breakdown
    ├── Quantity & Cost per Material
    └── Total Project Cost

📋 History Screen
├── Calculation History List
├── Date/Time Stamps
├── Project Dimensions
├── Total Cost Summary
└── Empty State Handling

📄 History Detail Screen
├── Complete Project Information
├── Material-wise Breakdown
├── Formatted Cost Display
└── Professional Layout
```

## 🛠️ Technical Stack

### **Frontend Framework**

- **React Native**: 0.76.3 - Cross-platform mobile development
- **Expo**: ~52.0.0 - Development platform and build tools
- **TypeScript**: 5.5.4 - Type-safe JavaScript development

### **Navigation & UI**

- **React Navigation**: 7.0.0 - Screen navigation and routing
- **Native Stack Navigator**: Platform-native navigation experience
- **Safe Area Context**: Proper handling of device safe areas

### **Data & Storage**

- **AsyncStorage**: 2.0.0 - Local data persistence
- **i18n-js**: 4.4.3 - Internationalization and localization

### **Export & Sharing**

- **Expo Print**: 14.0.0 - PDF generation and printing
- **Expo Sharing**: 12.0.0 - Native sharing capabilities
- **Expo FileSystem**: 18.0.1 - File operations and management

### **Development Tools**

- **Babel**: Preset configuration for Expo
- **ESLint**: Code linting and quality assurance
- **TypeScript**: Static type checking

## 🚀 Installation

### **Prerequisites**

```bash
# Install Node.js (18.x or higher)
node --version

# Install Expo CLI globally
npm install -g @expo/cli

# For iOS development (macOS only)
xcode-select --install

# For Android development
# Install Android Studio and set up Android SDK
```

### **Project Setup**

```bash
# Clone the repository
git clone <repository-url>
cd construction-estimator

# Install dependencies
npm install

# Start development server
npm start
# or
expo start

# Run on specific platforms
npm run ios     # iOS Simulator
npm run android # Android Emulator
npm run web     # Web browser
```

### **Building for Production**

```bash
# Create production builds
expo build:android  # Android APK/AAB
expo build:ios      # iOS IPA

# Using EAS Build (recommended)
eas build --platform android
eas build --platform ios
```

## 📁 Project Structure

```
construction-estimator/
├── src/
│   ├── screens/
│   │   ├── MainEstimator.tsx          # Primary calculation interface
│   │   ├── HistoryScreen.tsx          # Calculation history listing
│   │   └── HistoryDetailScreen.tsx    # Detailed history view
│   ├── utils/
│   │   ├── estimator.ts               # Core calculation logic
│   │   └── constants.ts               # Default rates and configuration
│   └── i18n/
│       └── translations.ts            # Localization strings
├── assets/                            # App icons and images
├── ios/                              # iOS-specific configuration
├── App.tsx                           # Root application component
├── app.json                          # Expo configuration
├── package.json                      # Dependencies and scripts
└── README.md                         # This documentation
```

## 🧮 Material Calculation Logic

### **Thumb Rule Formulas**

The app uses industry-standard thumb rules for material estimation:

```typescript
// Material factors per square foot
const MATERIAL_FACTORS = [
  { cement:    0.4     bags/sqft },     // 40 bags per 100 sqft
  { steel:     0.004   tons/sqft },     // 4 kg per sqft
  { sand:      0.0816  tons/sqft },     // ~81 kg per sqft
  { aggregate: 0.0608  tons/sqft },     // ~61 kg per sqft
  { brick:     8       pieces/sqft },   // 8 bricks per sqft
  { tile:      1.3     pieces/sqft },   // 1.3 tiles per sqft
  { paint:     0.018   litres/sqft }    // 18ml per sqft
];
```

### **Calculation Process**

1. **Area Calculation**: `Total Area = Length × Breadth × Floors`
2. **Material Quantity**: `Quantity = Total Area × Material Factor`
3. **Base Cost**: `Cost = Quantity × Unit Rate`
4. **Contingency**: `Final Cost = Base Cost × (1 + Contingency%)`

### **Unit Conversions**

The app supports multiple units for certain materials:

- **Sand**: Tons ↔ Cubic Meters (m³)
- **Aggregate**: Tons ↔ Cubic Meters (m³)

```typescript
// Conversion formulas
Sand: m³ = tons × (51/81.6)
Aggregate: m³ = tons × (25.3/60.8)
```

## 🌍 Localization

### **Supported Languages**

- **English**: Default interface language
- **Hindi**: Complete translation including material names

### **Translation Structure**

```typescript
const translations = {
  en: {
    title: "Construction Cost Estimator",
    length: "Length (ft)",
    // ... other translations
  },
  hi: {
    title: "निर्माण लागत कैलकुलेटर",
    length: "लंबाई (फीट)",
    // ... other translations
  },
};
```

### **Material Name Translations**

- Cement → सीमेंट
- Steel → सरिया
- Sand → रेत
- Aggregate → ऐग्रीगेट
- Brick → ईंट
- Tile → टाइल
- Paint → पेंट

## 💾 Data Persistence

### **AsyncStorage Implementation**

The app uses AsyncStorage for local data persistence:

```typescript
// Stored Data Types
{
  rates: Record<string, string>,        // Material unit rates
  lang: "en" | "hi",                   // Selected language
  inputs: {                            // Last used inputs
    length: string,
    breadth: string,
    floors: string,
    contingency: string
  },
  history: Array<{                     // Calculation history
    timestamp: string,
    length: string,
    breadth: string,
    floors: string,
    contingency: string,
    results: LineItemResult[],
    total: number
  }>
}
```

### **Data Management Features**

- **Automatic Saving**: All inputs and preferences saved automatically
- **History Limitation**: Maintains last 50 calculations only
- **State Restoration**: Restores user session on app restart
- **Error Handling**: Graceful fallback to default values

## 📄 Export Features

### **PDF Export**

Professional PDF reports include:

- **Project Header**: App title and generation date
- **Project Details**: Dimensions, area, contingency percentage
- **Material Table**: Complete breakdown with quantities and costs
- **Total Cost**: Prominently displayed final amount
- **Formatting**: Professional styling with proper typography

```html
<!-- PDF Structure -->
<div class="report">
  <header>Project Details</header>
  <table class="materials">
    <thead>
      Material | Quantity | Rate | Cost
    </thead>
    <tbody>
      <!-- Material rows -->
    </tbody>
  </table>
  <footer class="total">Total: ₹XX,XXX.XX</footer>
</div>
```

### **CSV Export**

Spreadsheet-compatible format:

```csv
Material,Quantity,Unit,Rate,Cost
"Cement",40.00,bag,380.00,15200.00
"Steel (Saria)",0.40,ton,65000.00,26000.00
...
"Total",,,,"108500.00"
```

## 🎨 UI/UX Design

### **Design System**

**Color Palette:**

```css
Primary Colors:
- Deep Blue: #1a365d (Headers, totals)
- Ocean Blue: #3182ce (Primary buttons)

Secondary Colors:
- Success Green: #48bb78 (Export buttons)
- Warning Orange: #ed8936 (History button)

Neutral Colors:
- Background: #f8fafc (App background)
- Card White: #ffffff (Card backgrounds)
- Text Dark: #2d3748 (Primary text)
- Text Light: #718096 (Secondary text)
- Border: #e2e8f0 (Input borders)
```

**Typography:**

```css
Headings: 700-800 weight, 20-28px size
Body Text: 500-600 weight, 14-16px size
Labels: 600 weight, 14-16px size
Secondary: 500 weight, 12-14px size
```

### **Component Design**

**Cards:**

- 16px border radius
- Subtle shadows for elevation
- 20px internal padding
- Clean separation between sections

**Buttons:**

- Primary: Blue background, white text
- Secondary: Green/Orange backgrounds
- Disabled states with opacity
- Loading states with text changes

**Inputs:**

- 2px borders with focus states
- 14px padding for touch targets
- Placeholder text for guidance
- Currency symbol integration

### **User Experience Features**

1. **Progressive Disclosure**: Information revealed as needed
2. **Immediate Feedback**: Real-time calculations and validations
3. **Error Prevention**: Input validation and user guidance
4. **Consistency**: Uniform design patterns throughout
5. **Accessibility**: Proper contrast ratios and touch targets

## 📖 Usage Guide

### **Basic Workflow**

1. **Project Setup**

   - Enter building dimensions (Length, Breadth, Floors)
   - Set contingency percentage for buffer costs
   - Review automatically calculated total area

2. **Rate Configuration**

   - Customize material rates based on local market prices
   - Rates are automatically saved for future use
   - Currency input with proper formatting

3. **Calculation**

   - Tap "Calculate" to generate estimate
   - View detailed material breakdown
   - See total project cost with contingency

4. **Export & Sharing**

   - Generate professional PDF reports
   - Export data to CSV for spreadsheet analysis
   - Share via device's native sharing options

5. **History Management**
   - Access previous calculations
   - View detailed breakdowns of past estimates
   - Compare different project scenarios

### **Advanced Features**

**Language Switching:**

- Toggle between English and Hindi
- Material names automatically translated
- All interface elements localized

**Rate Management:**

- Customize rates per material
- Rates persist between sessions
- Reset to default values if needed

**History Analysis:**

- View calculation timestamps
- Compare project costs
- Analyze material usage patterns

## 🔧 API Reference

### **Core Functions**

```typescript
// Calculate material quantities and costs
computeEstimate(
  areaSqft: number,
  rates: Record<string, number>
): LineItemResult[]

// Calculate total project cost
computeGrandTotal(
  lines: LineItemResult[]
): number

// Export calculation to PDF
handleExportPDF(): Promise<void>

// Export calculation to CSV
handleExportCSV(): Promise<void>
```

### **Data Types**

```typescript
interface LineItemResult {
  key: string; // Material identifier
  label: string; // English material name
  labelHi: string; // Hindi material name
  qty: number; // Calculated quantity
  unit: Unit; // Measurement unit
  rate: number; // Unit rate
  cost: number; // Total cost
  altUnits?: {
    // Alternative units
    unit: Unit;
    qty: number;
  }[];
}

type Unit = "bag" | "ton" | "m3" | "brick" | "tile" | "litre";
```

## 🤝 Contributing

### **Development Setup**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with proper TypeScript types
4. Test on both iOS and Android platforms
5. Ensure proper localization for new strings
6. Submit a pull request with detailed description

### **Code Standards**

- **TypeScript**: Use proper type annotations
- **ESLint**: Follow configured linting rules
- **Naming**: Use descriptive variable and function names
- **Comments**: Document complex calculations and business logic
- **Testing**: Test calculations with various input scenarios

### **Adding New Materials**

To add new construction materials:

1. Update `MATERIAL_FACTORS` in `src/utils/estimator.ts`
2. Add translations in `src/i18n/translations.ts`
3. Add default rates in `src/utils/constants.ts`
4. Test calculations with new material

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏷️ Version History

### v1.0.0 (Current)

- ✅ Complete UI/UX redesign with modern Material Design
- ✅ Production-ready interface with professional styling
- ✅ Enhanced PDF export with formatted layouts
- ✅ Improved CSV export with proper formatting
- ✅ Better error handling and user feedback
- ✅ Loading states and smooth animations
- ✅ Responsive design for various screen sizes

### Previous Features

- ✅ Basic thumb-rule calculations
- ✅ Multi-material support (7 materials)
- ✅ Bilingual interface (English/Hindi)
- ✅ Local data persistence
- ✅ Basic PDF/CSV export
- ✅ Calculation history

---

## 🆘 Support

For support, feature requests, or bug reports:

- Create an issue in the repository
- Provide detailed steps to reproduce problems
- Include device and platform information
- Attach screenshots for UI-related issues

---

**Built with ❤️ for the Construction Industry**

_Accurate estimates • Professional reports • User-friendly interface_
