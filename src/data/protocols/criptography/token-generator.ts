interface Encrypter {
  encrypt(id: string): Promise<string>
}

export { Encrypter }
