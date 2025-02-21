export class Environment {
  private env: Record<string, string> = {};
  private parent: Environment | undefined;

  constructor(
    parent?: Environment,
  ) {
    this.parent = parent;
  }

  public define(name: string[], id: string) {
    this.env[name.join("-")] = id;
  }

  public getId(name: string): string | undefined {
    return this.env[name.slice(1)] ?? this.parent?.getId(name);
  }
}
