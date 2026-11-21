export type AuthUser = {
  id: string
  name: string
  username: string
  createdAt: string
  updatedAt: string
}

export type LoginResponse = AuthUser & {
  accessToken: string
  expiresIn: number
}
