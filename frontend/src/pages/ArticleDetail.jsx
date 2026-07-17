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
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState('')

  const [noteTexte, setNoteTexte] = useState('')
  const [noteErreur, setNoteErreur] = useState('')
  const [envoi, setEnvoi] = useState(false)
  const [aLire, setALire] = useState(false)

  useEffect(() => {
    let actif = true
    setChargement(true)
    setErreur('')
    Promise.all([api.getArticle(id), api.getNotes(id)])
      .then(([a, n]) => {
        if (!actif) return
        setArticle(a)
        setNotes(n)
      })
      .catch((e) => actif && setErreur(e.message))
      .finally(() => actif && setChargement(false))
    return () => {
      actif = false
    }
  }, [id])

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
        <Link to="/" className="inline-block mt-4 text-accent-600 font-heading font-semibold text-[13px]">
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
          to="/"
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
          onClick={() => setALire((v) => !v)}
          title="Marque locale (non persistée dans cette version)"
          className={`relative w-full inline-flex items-center justify-center gap-1.5 border font-heading font-semibold text-[13px] px-3 py-2 ${
            aLire ? 'border-accent bg-accent text-canvas' : 'border-divider'
          }`}
        >
          <Corners />
          <Bookmark size={14} filled={aLire} />
          {aLire ? 'Marqué à lire plus tard' : 'À lire plus tard'}
        </button>

        <div className="relative border border-divider p-4">
          <Corners />
          <div className="text-[10px] tracking-[0.1em] uppercase text-accent-600 mb-2">Tags</div>
          {article.tags?.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center text-[11px] px-2.5 py-[3px] bg-accent-100 text-accent-800"
                >
                  {t}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-ink/45 m-0">Aucun tag</p>
          )}
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
