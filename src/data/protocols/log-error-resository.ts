class LogErrorRepository {
  async log(stack: string): Promise<void> {
    console.log(stack)
  }
}

export { LogErrorRepository }
