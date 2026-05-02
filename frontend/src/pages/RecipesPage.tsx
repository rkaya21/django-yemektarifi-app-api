import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { listRecipes } from '../api/recipes'
import type { Recipe } from '../types/recipe'

export default function RecipesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page') ?? '1')
  const search = searchParams.get('search') ?? ''
  const ordering = searchParams.get('ordering') ?? '-id'

  const recipesQuery = useQuery({
    queryKey: ['recipes', page, search, ordering],
    queryFn: () =>
      listRecipes({
        page,
        search: search || undefined,
        ordering,
      }),
    placeholderData: (previousData) => previousData,
  })

  const totalPages = useMemo(() => {
    if (!recipesQuery.data) {
      return 1
    }

    return Math.max(1, Math.ceil(recipesQuery.data.count / 20))
  }, [recipesQuery.data])

  const updateSearchParams = (nextParams: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(searchParams)

    Object.entries(nextParams).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        params.delete(key)
        return
      }

      params.set(key, String(value))
    })

    setSearchParams(params)
  }

  const renderRecipe = (recipe: Recipe) => (
    <article className="recipe-card" key={recipe.id}>
      <div className="recipe-card__top">
        <div>
          <span className="feature__eyebrow">Tarif</span>
          <h3>{recipe.title}</h3>
        </div>
        <span className="recipe-card__meta">{recipe.time_minutes} dk</span>
      </div>

      <p>{recipe.description || 'Açıklama eklenmemiş.'}</p>

      <div className="recipe-card__chips">
        {recipe.tags.length > 0 ? (
          recipe.tags.map((tag) => (
            <span className="chip chip--soft" key={tag.id}>
              {tag.name}
            </span>
          ))
        ) : (
          <span className="chip chip--soft">Etiket yok</span>
        )}
      </div>

      <div className="recipe-card__footer">
        <span>₺{recipe.price}</span>
        {recipe.link ? (
          <a href={recipe.link} target="_blank" rel="noreferrer">
            Kaynağı aç
          </a>
        ) : null}
      </div>
    </article>
  )

  const recipes = recipesQuery.data?.results ?? []

  return (
    <main className="shell auth-shell">
      <section className="section">
        <div className="section__heading">
          <span className="eyebrow">Tarifler</span>
          <div className="auth-header-actions">
            <Link className="button button--ghost" to="/profile">
              Profil
            </Link>
            <Link className="button button--ghost" to="/">
              Ana sayfa
            </Link>
          </div>
        </div>

        <h1 className="page-title">Tarif listesi</h1>
        <p className="lede">
          Kullanıcıya özel tarifler, arama, sıralama ve sayfalama ile birlikte.
        </p>

        <div className="recipes-toolbar">
          <label className="field field--inline">
            <span>Ara</span>
            <input
              value={search}
              placeholder="küp, çorba, köfte..."
              onChange={(event) => updateSearchParams({ search: event.target.value, page: 1 })}
            />
          </label>

          <label className="field field--inline">
            <span>Sırala</span>
            <select
              value={ordering}
              onChange={(event) => updateSearchParams({ ordering: event.target.value, page: 1 })}
            >
              <option value="-id">Yeni eklenenler</option>
              <option value="id">Eski eklenenler</option>
              <option value="title">Başlık A-Z</option>
              <option value="-time_minutes">Süre fazla-az</option>
              <option value="time_minutes">Süre az-fazla</option>
            </select>
          </label>

          <div className="recipes-toolbar__stats">
            <span className="chip chip--soft">{recipesQuery.data?.count ?? 0} tarif</span>
            <Link className="button button--primary" to="/register">
              Yeni kullanıcı
            </Link>
          </div>
        </div>

        {recipesQuery.isLoading ? (
          <div className="status-card">Tarifler yükleniyor...</div>
        ) : recipesQuery.isError ? (
          <div className="status-card status-card--error">
            Tarifler alınamadı.
          </div>
        ) : recipes.length === 0 ? (
          <div className="status-card">Henüz tarif yok.</div>
        ) : (
          <div className="recipe-grid">{recipes.map(renderRecipe)}</div>
        )}

        <div className="pagination">
          <button
            className="button button--ghost"
            type="button"
            disabled={!recipesQuery.data?.previous}
            onClick={() => updateSearchParams({ page: Math.max(1, page - 1) })}
          >
            Önceki
          </button>
          <span>
            Sayfa {page} / {totalPages}
          </span>
          <button
            className="button button--ghost"
            type="button"
            disabled={!recipesQuery.data?.next}
            onClick={() => updateSearchParams({ page: page + 1 })}
          >
            Sonraki
          </button>
        </div>
      </section>
    </main>
  )
}
