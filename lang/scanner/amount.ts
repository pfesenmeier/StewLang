export type Amount = {
  amount: number;
  unit: UnitType;
};

export function parseAmount(str: string): Amount {
  const chars = str.split("")
  let unitIndex = -1 
  for (const [index, char] of chars.entries()) {
    if (char.match(/[a-zA-Z]/)) {
      unitIndex = index
      break
    }
  }

  return {
    amount: parseAmountNumber(str.slice(0, unitIndex)),
    unit: parseUnit(str.slice(unitIndex))
  }
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

  if (unitInput.startsWith("-")) {
    unitInput = unitInput.slice(1);
  }

  const originalUnitInput = unitInput;
  unitInput = unitInput.toLowerCase();

  if (["g", "gram", "grams"].includes(unitInput)) {
    return "GRAM";
  }

  if (["oz"].includes(unitInput)) {
    return "OZ";
  }

  if (originalUnitInput === "t") {
    return "TSP";
  } else if (originalUnitInput === "T") {
    return "TBSP";
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
