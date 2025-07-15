import type { Amount } from "../scanner/amount.ts";
import type { Step } from "./step.ts";

export type Ingredient = {
  name: string[];
  amount?: Amount;
  steps?: Step[];
  ingredients?: Ingredient[];
  parent?: Ingredient;
};
