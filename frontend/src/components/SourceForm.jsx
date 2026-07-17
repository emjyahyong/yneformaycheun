import { useState } from 'react'
import { api } from '../api/client'
import Corners from './Corners'
import { ErrorBanner } from './Form'

// Formulaire d'ajout d'une source (POST /api/sources).
export default function SourceForm({ onCreated, onCancel }) {
  const [urlRss, setUrlRss] = useState('')
  const [titre, setTitre] = useState('')
  const [erreur, setErreur] = useState('')
  const [loading, setLoading] = useState(false)

  const soumettre = async (e) => {
    e.preventDefault()
    setErreur('')
    setLoading(true)
    try {
      const creee = await api.addSource({ urlRss, titre: titre || null })
      setUrlRss('')
      setTitre('')
      onCreated(creee)
    } catch (err) {
      setErreur(err.code === 'URL_INVALIDE' ? "L'URL du flux RSS n'est pas valide." : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={soumettre} className="relative border border-divider shadow-sm p-4 mb-6">
      <Corners />
      <ErrorBanner message={erreur} />
      <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] items-end">
        <label className="block">
          <span className="block text-[13px] font-semibold mb-1.5">URL du flux RSS</span>
          <input
            type="url"
            required
            value={urlRss}
            onChange={(e) => setUrlRss(e.target.value)}
            placeholder="https://exemple.com/feed"
            className="w-full min-h-10 px-3 py-2 text-sm bg-surface border border-divider outline-none focus:border-accent"
          />
        </label>
        <label className="block">
          <span className="block text-[13px] font-semibold mb-1.5">Titre (optionnel)</span>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Ex. Baeldung"
            className="w-full min-h-10 px-3 py-2 text-sm bg-surface border border-divider outline-none focus:border-accent"
          />
        </label>
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="relative inline-flex items-center justify-center border border-accent bg-accent text-canvas font-heading font-semibold text-[13px] px-4 py-2.5 disabled:opacity-60"
          >
            <Corners />
            {loading ? 'Ajout…' : 'Ajouter'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center border border-divider font-heading font-semibold text-[13px] px-3 py-2.5"
          >
            Annuler
          </button>
        </div>
      </div>
    </form>
  )
}
