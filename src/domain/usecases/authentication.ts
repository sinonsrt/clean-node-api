interface AutheticationModel {
  email: string
  password: string
}

interface Authentication {
  auth({ email, password }: AutheticationModel): Promise<string | null>
}

export { Authentication, AutheticationModel }
