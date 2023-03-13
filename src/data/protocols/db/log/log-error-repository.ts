interface LogErrorRepository {
  logError(stack: string): Promise<void>
}

export { LogErrorRepository }
