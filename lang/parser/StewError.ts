export class StewError extends Error {
  public hint: string;
  public line: number;

  constructor(message: string, line: number, hint: string) {
    super(message);
    this.name = "StewlangError";
    this.hint = hint;
    this.line = line;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
