interface UpdateAccessTokenRepository {
  update(id: string, token: string): Promise<void>
}

export { UpdateAccessTokenRepository }
