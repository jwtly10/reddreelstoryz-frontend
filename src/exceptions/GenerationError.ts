class GenerationError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, GenerationError.prototype);
    this.name = "GenerationError";
  }
}

export default GenerationError;
