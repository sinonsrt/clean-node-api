interface Encrypter {
  encrypt(value: string): Promise<string>
}

export { Encrypter }
