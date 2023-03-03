interface HashCompare {
  compare(value: string, hash: string): Promise<boolean>
}

export { HashCompare }
