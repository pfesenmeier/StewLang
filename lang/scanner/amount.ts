export type Amount = {
  amount?: number;
  unit?: UnitType;
};

// Amount string start with a number, ends with a unit
// acceptable: 1_tsp, 1tsp 1_t, 1tsp, 1t

export function parseAmount(str: string): Amount | null {
  const chars = str.split("");
  let unitIndex = -1;
  for (const [index, char] of chars.entries()) {
    if (char.match(/[a-zA-Z_]/)) {
      unitIndex = index;
      break;
    }
  }

  const amountStr = str.slice(0, unitIndex);
  const amount = parseAmountNumber(amountStr);
  const unitStr = str.slice(unitIndex).replaceAll(/_/g, "");
  const unit = parseUnit(unitStr);

  if (!amount && unit === "NOUNIT") {
    return null;
  }

  return {
    amount,
    unit,
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

export function parseUnit(unitInput: string): UnitType {
  if (unitInput === "") {
    return "NOUNIT";
  }

  if (unitInput === "t") {
    return "TSP";
  } else if (unitInput === "T") {
    return "TBSP";
  }

  unitInput = unitInput.toLowerCase();

  if (["g", "gram", "grams"].includes(unitInput)) {
    return "GRAM";
  }

  if (["oz"].includes(unitInput)) {
    return "OZ";
  }

  if (["tsp", "teaspoon", "teaspoons", "tsps"].includes(unitInput)) {
    return "TSP";
  }

  if (["tbsp", "tbsps", "tablespoon", "tablespoons"].includes(unitInput)) {
    return "TBSP";
  }

  if (["lb", "pound", "lbs"].includes(unitInput)) {
    return "LB";
  }

  if (["lb", "pound", "lbs"].includes(unitInput)) {
    return "OZ";
  }

  if (["cup", "cups", "c"].includes(unitInput)) {
    return "CUP";
  }

  if (["quart", "quarts", "qt"].includes(unitInput)) {
    return "CUP";
  }

  if (["gallon", "gallons", "gal"].includes(unitInput)) {
    return "CUP";
  }

  if (["fl_oz", "fluid_ounce", "fluid_ounces"].includes(unitInput)) {
    return "FL_OZ";
  }

  if (["ea"].includes(unitInput)) {
    return "EA";
  }

  if (["pinch"].includes(unitInput)) {
    return "PINCH";
  }

  return "NOUNIT";
}

export const Unit = {
  // weight
  GRAM: 0,
  OZ: 1,
  LB: 2,

  // volume
  TSP: 10,
  TBSP: 11,
  CUP: 3,
  QUART: 4,
  GALLON: 5,
  FL_OZ: 6,

  // ea
  EA: 7,
  PINCH: 8,
  NOUNIT: 9,
};

export type UnitType = keyof typeof Unit;
