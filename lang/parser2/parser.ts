type Step = {
  refs?: Ingredient[];
  text: string;
};

type Amt = {
  qty: number | [number, "d" | "f"];
  unit?: string;
};

type Ingredient = {
  name: string;
  amt?: Amt;
  ingredients?: Ingredient[];
  steps?: Step[];
};

const flour: Ingredient = {
  name: "flour",
  amt: {
    qty: 1,
    unit: "cup",
  },
};

const pancake: Ingredient = {
  name: "pancake",
  amt: {
    qty: [2.5, "f"],
    unit: "cup",
  },
  ingredients: [{ name: "milk" }],
  steps: [
    {
      refs: [flour],
      text: "Mix the @flour with the milk",
    },
  ],
};

type Stage = {
  name?: string;
  ingredients: Ingredient[];
};

type Recipe = {
  name: string;
  stages: Stage[];
};

// mutable recipe
const recipe: Recipe = {
  name: "dinner",
  stages: [{ ingredients: [flour] }, { ingredients: [pancake] }],
};

function moveIngredient(
  recipe: Recipe,
  opts: { dir: "up" | "down"; stage: number; ingredient: number },
) {
  const stage = recipe.stages.at(opts.stage);

  if (!stage) {
    console.warn(`stage not found at index ${opts.stage}`);
    return;
  }

  const ingredient = stage.ingredients.at(opts.ingredient)

  if (!ingredient) {
    console.warn(`stage not found at index ${opts.stage}`);
    return;
  }

  stage.ingredients.splice(opts.ingredient, 1)

  const nextStageIndex = opts.dir === 'up' ? opts.stage - 1 : opts.stage + 1
  const nextStage = recipe.stages.at(nextStageIndex)

  if (!nextStage) {
    console.warn(`next stage not found at index ${opts.stage}`);
    return;
  }

  nextStage.ingredients.push(ingredient)
}

console.log('before', recipe)
moveIngredient(recipe, { dir: "down", ingredient: 0, stage: 0})
console.log('after', recipe)


function validateRecipe(recipe: Recipe) {
  const validRefs: Record<string, Ingredient> = {}

  for (const stage of recipe.stages) {
    for (const ingredient of stage.ingredients) {
      // add ingredient to valid Refs
      // check if ingredient has steps
    }
  }
}

// validate... iterate over stages, collect all references, and see if you've seen them before

// idea is that give the app a mutable tree?

