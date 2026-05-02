import { api } from './client'
import type { PaginatedResponse, Recipe } from '../types/recipe'

export interface RecipeListParams {
  page?: number
  search?: string
  ordering?: string
}

export async function listRecipes(
  params: RecipeListParams,
): Promise<PaginatedResponse<Recipe>> {
  const { data } = await api.get<PaginatedResponse<Recipe>>('/api/recipe/recipes/', {
    params,
  })

  return data
}
