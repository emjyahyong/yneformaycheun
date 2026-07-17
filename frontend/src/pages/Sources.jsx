import { useEffect, useState } from 'react'
import { api } from '../api/client'
import Corners from '../components/Corners'
import { Plus } from '../components/Icons'
import SourceCard from '../components/SourceCard'
import SourceForm from '../components/SourceForm'
import { EmptyState, ErrorState, Loading } from '../components/States'

export default function Sources() {
  const [sources, setSources] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')
  const [formOuvert, setFormOuvert] = useState(false)
  const [suppression, setSuppression] = useState(null)

  const charger = () => {
    setChargement(true)
    setErreur('')
    api
      .getSources()
      .then(setSources)
      .catch((e) => setErreur(e.message))
      .finally(() => setChargement(false))
  }

  useEffect(charger, [])

  const onCreated = (source) => {
    setSources((prev) => [source, ...prev])
    setFormOuvert(false)
  }

  const supprimer = async (source) => {
    if (!window.confirm(`Supprimer la source « ${source.titre || source.urlRss} » ?`)) return
    setSuppression(source.id)
    try {
      await api.deleteSource(source.id)
      setSources((prev) => prev.filter((s) => s.id !== source.id))
    } catch (e) {
      setErreur(e.message)
    } finally {
      setSuppression(null)
    }
  }

  return (
    <div className="px-6 py-8 max-w-[1180px] mx-auto">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="font-heading font-semibold text-[42px] leading-[1.12] tracking-[-0.015em] mb-1">
            Mes sources
          </h1>
          <p className="text-ink/55 m-0">
            {sources.length} flux RSS suivi{sources.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormOuvert((v) => !v)}
          className="relative inline-flex items-center gap-1.5 border border-accent bg-accent text-canvas font-heading font-semibold text-[13px] px-3 py-2"
        >
          <Corners />
          <Plus size={14} />
          Ajouter une source
        </button>
      </div>

      {formOuvert && <SourceForm onCreated={onCreated} onCancel={() => setFormOuvert(false)} />}

      {chargement ? (
        <Loading label="Chargement des sources…" />
      ) : erreur ? (
        <ErrorState message={erreur} onRetry={charger} />
      ) : sources.length === 0 ? (
        <EmptyState title="Aucune source pour l'instant">
          Ajoutez votre premier flux RSS pour commencer à agréger des articles.
        </EmptyState>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {sources.map((s) => (
            <SourceCard
              key={s.id}
              source={s}
              onDelete={supprimer}
              suppression={suppression === s.id}
            />
          ))}
        </div>
      )}
    </div>
  )
}
