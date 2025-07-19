export type Unit = "bag" | "ton" | "m3" | "brick" | "tile" | "litre";

export interface MaterialFactor {
  key: string;
  label: string;
  labelHi: string;
  factorPerSqft: number;
  defaultUnit: Unit;
  altUnits?: { unit: Unit; convert: (qtyBase: number) => number }[];
}

// Thumb rules normalized from 1000 sqft reference
export const MATERIAL_FACTORS: MaterialFactor[] = [
  { key: "cement", label: "Cement", labelHi: "सीमेंट", factorPerSqft: 0.4, defaultUnit: "bag" },
  { key: "steel", label: "Steel (Saria)", labelHi: "सरिया", factorPerSqft: 0.004, defaultUnit: "ton" },
  {
    key: "sand",
    label: "Sand",
    labelHi: "रेत",
    factorPerSqft: 0.0816,
    defaultUnit: "ton",
    altUnits: [{ unit: "m3", convert: (ton) => ton * (51 / 81.6) }],
  },
  {
    key: "aggregate",
    label: "Aggregate",
    labelHi: "ऐग्रीगेट",
    factorPerSqft: 0.0608,
    defaultUnit: "ton",
    altUnits: [{ unit: "m3", convert: (ton) => ton * (25.3 / 60.8) }],
  },
  { key: "brick", label: "Brick", labelHi: "ईंट", factorPerSqft: 8, defaultUnit: "brick" },
  { key: "tile", label: "Tile", labelHi: "टाइल", factorPerSqft: 1.3, defaultUnit: "tile" },
  { key: "paint", label: "Paint", labelHi: "पेंट", factorPerSqft: 0.018, defaultUnit: "litre" },
];

export interface UnitRate {
  key: string;
  unit: Unit;
  rate: number;
}

export interface LineItemResult {
  key: string;
  label: string;
  labelHi: string;
  qty: number;
  unit: Unit;
  rate: number;
  cost: number;
  altUnits?: { unit: Unit; qty: number }[];
}

export function computeEstimate(
  areaSqft: number,
  rates: Record<string, number>
): LineItemResult[] {
  return MATERIAL_FACTORS.map((m) => {
    const qty = areaSqft * m.factorPerSqft;
    const rate = rates[m.key] ?? 0;
    const cost = qty * rate;
    const altUnits = m.altUnits?.map((au) => ({
      unit: au.unit,
      qty: au.convert(qty),
    }));
    return {
      key: m.key,
      label: m.label,
      labelHi: m.labelHi,
      qty,
      unit: m.defaultUnit,
      rate,
      cost,
      altUnits,
    };
  });
}

export function computeGrandTotal(lines: LineItemResult[]): number {
  return lines.reduce((s, l) => s + l.cost, 0);
}
