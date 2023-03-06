interface Hasher {
  hash(value: string): Promise<string>
}

export { Hasher }
