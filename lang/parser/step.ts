import type { Identifier } from "./identifier.ts";

export type Step = {
  text: StepWord[];
};

export type StepWord = string | Identifier;
