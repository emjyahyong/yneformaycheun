import { useEffect, useMemo, useState } from 'react'
import { api } from '../api/client'
import ArticleCard from '../components/ArticleCard'
import { Search } from '../components/Icons'
import { EmptyState, ErrorState, Loading } from '../components/States'

const TAILLE_PAGE = 12

export default function Dashboard() {
  const [tags, setTags] = useState([])
  const [sources, setSources] = useState([])
  const [pageData, setPageData] = useState(null)
  const [filtreTag, setFiltreTag] = useState(null)
  const [filtreSource, setFiltreSource] = useState(null)
  const [page, setPage] = useState(0)
  const [recherche, setRecherche] = useState('')
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  // Filtres (tags + sources) chargés une seule fois.
  useEffect(() => {
    Promise.all([api.getTags(), api.getSources()])
      .then(([t, s]) => {
        setTags(t)
        setSources(s)
      })
      .catch(() => {
        /* les filtres restent vides si l'appel échoue, sans bloquer le fil */
      })
  }, [])

  // Fil rechargé à chaque changement de filtre ou de page.
  useEffect(() => {
    setChargement(true)
    setErreur('')
    api
      .getArticles({ tag: filtreTag, source: filtreSource, page, size: TAILLE_PAGE })
      .then(setPageData)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }, [filtreTag, filtreSource, page])

  const articles = pageData?.content ?? []
  const articlesFiltres = useMemo(() => {
    const liste = pageData?.content ?? []
    const q = recherche.trim().toLowerCase()
    if (!q) return liste
    return liste.filter(
      (a) => a.titre?.toLowerCase().includes(q) || a.resume?.toLowerCase().includes(q),
    )
  }, [pageData, recherche])

  const changerFiltreTag = (tagId) => {
    setPage(0)
    setFiltreTag((cur) => (cur === tagId ? null : tagId))
  }
  const changerFiltreSource = (sourceId) => {
    setPage(0)
    setFiltreSource((cur) => (cur === sourceId ? null : sourceId))
  }

  const chipBase = 'inline-flex items-center text-[11px] px-2.5 py-[3px] cursor-pointer'

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start px-6 py-6 max-w-[1180px] mx-auto">
      {/* Sidebar de filtres */}
      <aside className="w-full md:w-[200px] flex-none flex flex-col gap-6">
        <div>
          <h6 className="text-[13px] tracking-[0.08em] uppercase opacity-55 mb-2">Filtrer par tag</h6>
          {tags.length === 0 ? (
            <p className="text-[12px] text-ink/45 m-0">Aucun tag</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {tags.map((t) => {
                const actif = filtreTag === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => changerFiltreTag(t.id)}
                    className={`${chipBase} ${
                      actif
                        ? 'bg-accent-100 text-accent-800'
                        : 'border border-accent text-accent-600'
                    }`}
                  >
                    {t.nom}
                  </button>
                )
              })}
            </div>
          )}
        </div>
        <div>
          <h6 className="text-[13px] tracking-[0.08em] uppercase opacity-55 mb-2">Sources</h6>
          <div className="flex flex-col gap-1.5 text-[13px]">
            <button
              type="button"
              onClick={() => {
                setPage(0)
                setFiltreSource(null)
              }}
              className={`flex justify-between text-left ${
                filtreSource === null ? 'text-accent-700 font-semibold' : 'opacity-75'
              }`}
            >
              <span>Toutes les sources</span>
            </button>
            {sources.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => changerFiltreSource(s.id)}
                className={`flex justify-between text-left ${
                  filtreSource === s.id ? 'text-accent-700 font-semibold' : 'opacity-75'
                }`}
              >
                <span className="truncate">{s.titre || s.urlRss}</span>
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 min-w-0 w-full">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1 className="font-heading font-semibold text-[42px] leading-[1.12] tracking-[-0.015em] mb-1">
              Fil d&apos;actualité
            </h1>
            <p className="text-ink/55 m-0">
              {pageData ? `${pageData.totalElements} article${pageData.totalElements > 1 ? 's' : ''}` : '—'} · triés par date
            </p>
          </div>
          <div className="relative">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink/40">
              <Search size={14} />
            </span>
            <input
              type="search"
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              placeholder="Rechercher dans la page…"
              className="w-[240px] min-h-9 pl-8 pr-2.5 py-1.5 text-sm bg-surface border border-divider outline-none focus:border-accent"
            />
          </div>
        </div>

        {chargement ? (
          <Loading label="Chargement du fil…" />
        ) : erreur ? (
          <ErrorState
            message={erreur}
            onRetry={() => {
              setFiltreTag((t) => t)
              setPage((p) => p)
            }}
          />
        ) : articlesFiltres.length === 0 ? (
          <EmptyState title="Aucun article">
            {articles.length === 0
              ? 'Ajoutez des sources et attendez le prochain fetch, ou ajustez vos filtres.'
              : 'Aucun article ne correspond à votre recherche.'}
          </EmptyState>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              {articlesFiltres.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>

            {pageData && pageData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-8 text-sm">
                <button
                  type="button"
                  disabled={pageData.first}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  className="border border-divider px-3 py-1.5 font-heading font-semibold disabled:opacity-40"
                >
                  Précédent
                </button>
                <span className="text-ink/55">
                  Page {pageData.number + 1} / {pageData.totalPages}
                </span>
                <button
                  type="button"
                  disabled={pageData.last}
                  onClick={() => setPage((p) => p + 1)}
                  className="border border-divider px-3 py-1.5 font-heading font-semibold disabled:opacity-40"
                >
                  Suivant
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
