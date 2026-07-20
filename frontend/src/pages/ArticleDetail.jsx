import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'
import Corners from '../components/Corners'
import { ErrorBanner } from '../components/Form'
import { ArrowLeft, Bookmark, ExternalLink, Rss } from '../components/Icons'
import { ErrorState, Loading } from '../components/States'
import { dateHeure, dateLongue } from '../utils/format'

export default function ArticleDetail() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [notes, setNotes] = useState([])
  const [tags, setTags] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  const [noteTexte, setNoteTexte] = useState('')
  const [noteErreur, setNoteErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [aLire, setALire] = useState(false)
  const [aLireErreur, setALireErreur] = useState('')
  const [aLireEnCours, setALireEnCours] = useState(false)

  const [tagsErreur, setTagsErreur] = useState('')
  const [tagSelection, setTagSelection] = useState('')
  const [ajoutTagEnCours, setAjoutTagEnCours] = useState(false)
  const [suppressionTagId, setSuppressionTagId] = useState(null)
  const [nouveauTagNom, setNouveauTagNom] = useState('')
  const [nouveauTagCouleur, setNouveauTagCouleur] = useState('#5980a6')
  const [creationTagEnCours, setCreationTagEnCours] = useState(false)

  useEffect(() => {
    let actif = true
    setChargement(true)
    setErreur('')
    Promise.all([api.getArticle(id), api.getNotes(id), api.getTags(), api.getALireStatut(id)])
      .then(([a, n, t, statut]) => {
        if (!actif) return
        setArticle(a)
        setNotes(n)
        setTags(t)
        setALire(statut.marque)
      })
      .catch((e) => actif && setErreur(e.message))
      .finally(() => actif && setChargement(false))
    return () => {
      actif = false
    }
  }, [id])

  const tagsDisponibles = tags.filter(
    (t) => !article?.tags?.some((at) => at.id === t.id)
  )

  const ajouterTagExistant = async () => {
    if (!tagSelection) return
    setTagsErreur('')
    setAjoutTagEnCours(true)
    try {
      const maj = await api.addTagToArticle(id, tagSelection)
      setArticle(maj)
      setTagSelection('')
    } catch (err) {
      setTagsErreur(err.message)
    } finally {
      setAjoutTagEnCours(false)
    }
  }

  const creerEtAjouterTag = async (e) => {
    e.preventDefault()
    if (!nouveauTagNom.trim()) {
      setTagsErreur('Le nom du tag ne peut pas être vide.')
      return
    }
    setTagsErreur('')
    setCreationTagEnCours(true)
    try {
      const cree = await api.createTag({ nom: nouveauTagNom.trim(), couleur: nouveauTagCouleur })
      setTags((prev) => [...prev, cree])
      const maj = await api.addTagToArticle(id, cree.id)
      setArticle(maj)
      setNouveauTagNom('')
    } catch (err) {
      setTagsErreur(err.message)
    } finally {
      setCreationTagEnCours(false)
    }
  }

  const retirerTag = async (tagId) => {
    setTagsErreur('')
    setSuppressionTagId(tagId)
    try {
      const maj = await api.removeTagFromArticle(id, tagId)
      setArticle(maj)
    } catch (err) {
      setTagsErreur(err.message)
    } finally {
      setSuppressionTagId(null)
    }
  }

  const toggleALire = async () => {
    setALireErreur('')
    setALireEnCours(true)
    try {
      if (aLire) {
        await api.demarquerALire(id)
        setALire(false)
      } else {
        await api.marquerALire(id)
        setALire(true)
      }
    } catch (err) {
      setALireErreur(err.message)
    } finally {
      setALireEnCours(false)
    }
  }

  const ajouterNote = async (e) => {
    e.preventDefault()
    setNoteErreur('')
    if (!noteTexte.trim()) {
      setNoteErreur('La note ne peut pas être vide.')
      return
    }
    setEnvoi(true)
    try {
      const creee = await api.addNote(id, noteTexte.trim())
      setNotes((prev) => [creee, ...prev])
      setNoteTexte('')
    } catch (err) {
      setNoteErreur(err.message)
    } finally {
      setEnvoi(false)
    }
  }

  if (chargement) return <Loading label="Chargement de l'article…" />
  if (erreur)
    return (
      <div className="px-6 py-8 max-w-[1180px] mx-auto">
        <ErrorState message={erreur} />
        <Link to="/dashboard" className="inline-block mt-4 text-accent-600 font-heading font-semibold text-[13px]">
          Retour au dashboard
        </Link>
      </div>
    )
  if (!article) return null

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start px-6 py-8 max-w-[1180px] mx-auto">
      {/* Contenu article */}
      <div className="flex-1 min-w-0 max-w-[660px]">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-accent-600 font-heading font-semibold text-[13px] mb-4"
        >
          <ArrowLeft size={13} />
          Retour au dashboard
        </Link>
        <div className="flex items-center gap-2 text-[10px] tracking-[0.1em] uppercase text-accent-600 mb-2">
          <Rss size={13} />
          <span>{article.sourceNom || 'Source'}</span>
          {article.datePublication && (
            <>
              <span className="opacity-40 normal-case">·</span>
              <span className="normal-case">{dateLongue(article.datePublication)}</span>
            </>
          )}
        </div>
        <h1 className="font-heading font-semibold text-[42px] leading-[1.12] tracking-[-0.015em] mb-4">
          {article.titre}
        </h1>
        {article.resume ? (
          // Le résumé est déjà nettoyé côté serveur (Jsoup) avant d'être renvoyé.
          <div
            className="mb-4 leading-relaxed [&_p]:mb-3 [&_a]:text-accent-600 [&_a]:underline"
            dangerouslySetInnerHTML={{ __html: article.resume }}
          />
        ) : (
          <p className="mb-4 text-ink/55 italic">Aucun résumé disponible pour cet article.</p>
        )}
        {article.url && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-accent-600 font-heading font-semibold text-[13px]"
          >
            Voir l&apos;article original
            <ExternalLink size={12} />
          </a>
        )}
      </div>

      {/* Panneau latéral */}
      <aside className="w-full md:w-[300px] flex-none flex flex-col gap-4">
        <button
          type="button"
          onClick={toggleALire}
          disabled={aLireEnCours}
          className={`relative w-full inline-flex items-center justify-center gap-1.5 border font-heading font-semibold text-[13px] px-3 py-2 disabled:opacity-60 ${
            aLire ? 'border-accent bg-accent text-canvas' : 'border-divider'
          }`}
        >
          <Corners />
          <Bookmark size={14} filled={aLire} />
          {aLire ? 'Marqué à lire plus tard' : 'À lire plus tard'}
        </button>
        <ErrorBanner message={aLireErreur} />

        <div className="relative border border-divider p-4">
          <Corners />
          <div className="text-[10px] tracking-[0.1em] uppercase text-accent-600 mb-2">Tags</div>
          <ErrorBanner message={tagsErreur} />
          {article.tags?.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {article.tags.map((t) => (
                <span
                  key={t.id}
                  style={t.couleur ? { backgroundColor: `${t.couleur}26`, color: t.couleur } : undefined}
                  className="inline-flex items-center gap-1 text-[11px] px-2.5 py-[3px] bg-accent-100 text-accent-800"
                >
                  {t.nom}
                  <button
                    type="button"
                    onClick={() => retirerTag(t.id)}
                    disabled={suppressionTagId === t.id}
                    aria-label={`Retirer le tag ${t.nom}`}
                    className="leading-none opacity-60 hover:opacity-100 disabled:opacity-30"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-ink/45 mb-3">Aucun tag</p>
          )}

          {tagsDisponibles.length > 0 && (
            <div className="flex gap-1.5 mb-2">
              <select
                value={tagSelection}
                onChange={(e) => setTagSelection(e.target.value)}
                className="flex-1 min-w-0 px-2 py-1.5 text-[12px] bg-surface border border-divider outline-none focus:border-accent"
              >
                <option value="">Ajouter un tag existant…</option>
                {tagsDisponibles.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nom}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={ajouterTagExistant}
                disabled={!tagSelection || ajoutTagEnCours}
                className="shrink-0 px-2.5 py-1.5 text-[12px] border border-accent bg-accent text-canvas font-heading font-semibold disabled:opacity-50"
              >
                Ajouter
              </button>
            </div>
          )}

          <form onSubmit={creerEtAjouterTag} className="flex gap-1.5">
            <input
              type="color"
              value={nouveauTagCouleur}
              onChange={(e) => setNouveauTagCouleur(e.target.value)}
              title="Couleur du tag"
              className="w-8 h-8 shrink-0 border border-divider bg-surface p-0.5"
            />
            <input
              type="text"
              value={nouveauTagNom}
              onChange={(e) => setNouveauTagNom(e.target.value)}
              placeholder="Nouveau tag…"
              className="flex-1 min-w-0 px-2 py-1.5 text-[12px] bg-surface border border-divider outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={creationTagEnCours}
              className="shrink-0 px-2.5 py-1.5 text-[12px] border border-accent bg-accent text-canvas font-heading font-semibold disabled:opacity-50"
            >
              Créer
            </button>
          </form>
        </div>

        <div className="relative border border-divider p-4">
          <Corners />
          <div className="text-[10px] tracking-[0.1em] uppercase text-accent-600 mb-2">
            Notes personnelles
          </div>
          <form onSubmit={ajouterNote}>
            <ErrorBanner message={noteErreur} />
            <textarea
              rows={3}
              value={noteTexte}
              onChange={(e) => setNoteTexte(e.target.value)}
              placeholder="Écrire une note…"
              className="w-full px-2.5 py-1.5 text-sm bg-surface border border-divider mb-2 resize-y outline-none focus:border-accent"
            />
            <button
              type="submit"
              disabled={envoi}
              className="relative w-full inline-flex items-center justify-center gap-1.5 border border-accent bg-accent text-canvas font-heading font-semibold text-[13px] px-3 py-2 mb-3 disabled:opacity-60"
            >
              <Corners />
              {envoi ? 'Enregistrement…' : 'Enregistrer la note'}
            </button>
          </form>
          <hr className="border-divider mb-3" />
          {notes.length === 0 ? (
            <p className="text-[12px] text-ink/45 m-0">Aucune note pour l&apos;instant.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {notes.map((n) => (
                <div key={n.id}>
                  <p className="text-[13px] mb-0.5 whitespace-pre-wrap">{n.contenu}</p>
                  <span className="text-[11px] text-ink/55">{dateHeure(n.timestamp)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </div>
  )
}
