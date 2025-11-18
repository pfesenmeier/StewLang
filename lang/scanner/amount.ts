export type Amount = {
  amount?: number;
  unit?: UnitType | string;
};

// Amount string start with a number, ends with a unit
// acceptable: 1_tsp, 1tsp 1_t, 1tsp, 1t

export function parseAmount(str: string): Amount | null {
  const chars = str.split("");
  let unitIndex = 0;

  for (const [index, char] of chars.entries()) {
    if (char.match(/[0-9]/)) {
      unitIndex = index;
    }
  }

  unitIndex++;

  const amountStr = str.slice(0, unitIndex);
  const amount = parseAmountNumber(amountStr);
  const unitStr = str.slice(unitIndex).replaceAll(/_/g, "");
  const unit = parseUnit(unitStr);

  if (!amount && unit === "NOUNIT") {
    return null;
  }

  return {
    amount,
    ...(unit && { unit }),
  };
}

export function parseAmountNumber(amountInput: string): number {
  // TODO how does it parse '1/2/3c'
  if (amountInput.includes("/")) {
    const slashIndex = amountInput.indexOf("/");
    const numerator = parseInt(amountInput.slice(0, slashIndex));
    const denominator = parseInt(amountInput.slice(slashIndex + 1));
    return numerator / denominator;
  }
  return parseFloat(amountInput);
}

export function parseUnit(unitInput: string): UnitType | string | null {
  if (unitInput === "t") {
    return "TSP";
  } else if (unitInput === "T") {
    return UnitType.tablespoon;
  }

  unitInput = unitInput.toLowerCase();

  if (['"', "inch", "in", "inches"].includes(unitInput)) {
    return UnitType.inch;
  }

  if (["g", "gram", "grams"].includes(unitInput)) {
    return UnitType.gram;
  }

  if (["oz"].includes(unitInput)) {
    return UnitType.oz;
  }

  if (["tsp", "teaspoon", "teaspoons", "tsps"].includes(unitInput)) {
    return UnitType.teaspoon;
  }

  if (["tbsp", "tbsps", "tablespoon", "tablespoons"].includes(unitInput)) {
    return UnitType.tablespoon;
  }

  if (["lb", "pound", "lbs"].includes(unitInput)) {
    return UnitType.lb;
  }

  if (["cup", "cups", "c"].includes(unitInput)) {
    return UnitType.cup;
  }

  if (["quart", "quarts", "qt"].includes(unitInput)) {
    return UnitType.quart;
  }

  if (["gallon", "gallons", "gal"].includes(unitInput)) {
    return UnitType.gallon;
  }

  if (["fl_oz", "fluid_ounce", "fluid_ounces"].includes(unitInput)) {
    return UnitType.fl_oz;
  }

  if (unitInput.length > 0) {
    return unitInput;
  }

  return null;
}

export const UnitType = {
  // weight
  gram: "gram",
  oz: "oz",
  lb: "lb",

  // volume
  teaspoon: "teaspoon",
  tablespoon: "tablespoon",
  cup: "cup",
  quart: "quart",
  gallon: "gallon",
  fl_oz: "fl_oz",

  // ginger and bacon
  inch: "inch",
};

export type UnitType = keyof typeof UnitType;
