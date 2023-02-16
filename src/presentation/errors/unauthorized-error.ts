class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorize Error")
    this.name = "Unauthorize Error"
  }
}

export { UnauthorizedError }
