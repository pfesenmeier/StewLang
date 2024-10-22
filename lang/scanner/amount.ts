export class Amount {
    constructor(
        public readonly amount: number,
        public readonly unit: Unit,
    ) {
    }

    public static fromString(input: string) {
        const { amount, unit } = this.parseInput(input);
        return new Amount(amount, unit);
    }

    private static parseInput(input: string): { amount: number; unit: Unit } {
        let amountEnd = 0;

        while (
            !this.isWordCharacter(input, amountEnd + 1)) amountEnd++;

        const amountInput = input.slice(0, amountEnd + 1);
        const amount = this.parseAmount(amountInput);

        const unitInput = input.slice(amountEnd + 1);
        const unit = this.parseUnit(unitInput);

        return { amount, unit };
    }

    private static parseUnit(unitInput: string): Unit {
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

        if (
            ["tbsp", "tbsps", "tablespoon", "tablespoons"].includes(unitInput)
        ) {
            return "TBSP";
        }

        if (["lb", "pound", "lbs"].includes(unitInput)) {
            return "OZ";
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

        throw new Error("unable to determine unit: " + unitInput);
    }

    private static parseAmount(amountInput: string): number {
        // TODO how does it parse '1/2/3c'
        if (amountInput.includes("/")) {
            const slashIndex = amountInput.indexOf("/");
            const numerator = parseInt(amountInput.slice(0, slashIndex));
            const denominator = parseInt(amountInput.slice(slashIndex + 1));
            return numerator / denominator;
        }
        return parseFloat(amountInput);
    }

    private static isWordCharacter(input: string, index: number) {
        const char = input.at(index)
        if (char === undefined) return false
        return char.match(/[A-Za-z\-_]/) !== null;
    }
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

type Unit = keyof typeof Unit;
