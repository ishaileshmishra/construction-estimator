import { UnitRate } from "./estimator";

export const DEFAULT_RATES: UnitRate[] = [
  { key: "cement", unit: "bag", rate: 380 },
  { key: "steel", unit: "ton", rate: 65000 },
  { key: "sand", unit: "ton", rate: 1500 },
  { key: "aggregate", unit: "ton", rate: 1300 },
  { key: "brick", unit: "brick", rate: 8 },
  { key: "tile", unit: "tile", rate: 35 },
  { key: "paint", unit: "litre", rate: 250 },
];
