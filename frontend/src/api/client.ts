import axios from 'axios'
import { clearToken, getToken } from './auth'

const baseURL = import.meta.env.VITE_API_BASE_URL

if (!baseURL) {
  throw new Error('VITE_API_BASE_URL is not defined')
}

export const api = axios.create({
  baseURL,
})

api.interceptors.request.use((config) => {
  const token = getToken()

  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Token ${token}`
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && window.location.pathname !== '/login') {
      clearToken()
      window.location.assign('/login')
    }

    return Promise.reject(error)
  },
)
