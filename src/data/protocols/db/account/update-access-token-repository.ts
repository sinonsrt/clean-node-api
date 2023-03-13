interface UpdateAccessTokenRepository {
  updateAccessToken(id: string, token: string): Promise<void>
}

export { UpdateAccessTokenRepository }
