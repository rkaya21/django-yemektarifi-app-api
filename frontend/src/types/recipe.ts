export interface Tag {
  id: number
  name: string
}

export interface Recipe {
  id: number
  title: string
  time_minutes: number
  price: string
  link: string
  description: string
  tags: Tag[]
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
