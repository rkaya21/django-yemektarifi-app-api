export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload extends LoginPayload {
  name: string
}

export interface AuthTokenResponse {
  token: string
}

export interface UserProfile {
  email: string
  name: string
}
