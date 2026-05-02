import { api } from './client'
import type {
  AuthTokenResponse,
  LoginPayload,
  RegisterPayload,
  UserProfile,
} from '../types/auth'

export async function createUser(payload: RegisterPayload): Promise<UserProfile> {
  const { data } = await api.post<UserProfile>('/api/user/create/', payload)
  return data
}

export async function obtainToken(payload: LoginPayload): Promise<AuthTokenResponse> {
  const { data } = await api.post<AuthTokenResponse>('/api/user/token/', payload)
  return data
}

export async function getProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/api/user/me/')
  return data
}

export async function updateProfile(payload: Partial<RegisterPayload>): Promise<UserProfile> {
  const { data } = await api.patch<UserProfile>('/api/user/me/', payload)
  return data
}
