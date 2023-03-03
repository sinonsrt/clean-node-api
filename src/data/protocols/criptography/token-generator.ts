interface TokenGenerator {
  generate(id: string): Promise<string>
}

export { TokenGenerator }
