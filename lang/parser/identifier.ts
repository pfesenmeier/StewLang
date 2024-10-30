export class Identifier {
    readonly __brand = "Identifier";
    private _ingredientId: string | undefined;

    public get ingredientId(): string | undefined {
        return this._ingredientId;
    }
    private set ingredientId(value: string | undefined) {
        this._ingredientId = value;
    }
    constructor(
        public name: string,
    ) {}

    public resolve(ingredientId: string) {
        this.ingredientId = ingredientId
    }
}

