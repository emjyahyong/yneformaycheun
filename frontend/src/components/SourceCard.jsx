import { dateCourte, tempsRelatif } from '../utils/format'
import Corners from './Corners'
import { AlertCircle, Clock, Rss, Trash } from './Icons'

function statut(source) {
  switch (source.statutFetch) {
    case 'succes':
      return { label: 'Actif', cls: 'bg-accent-100 text-accent-800', erreur: false }
    case 'echec':
      return { label: 'Erreur', cls: 'bg-neutral-100 text-neutral-800', erreur: true }
    default:
      return { label: 'En attente', cls: 'bg-neutral-100 text-neutral-700', erreur: false }
  }
}

// Carte d'une source RSS de l'utilisateur (titre, URL, statut, suppression).
export default function SourceCard({ source, onDelete, suppression }) {
  const s = statut(source)
  return (
    <div className="relative border border-divider shadow-sm p-4 flex flex-col gap-2">
      <Corners />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-accent-600 flex-none">
            <Rss size={14} />
          </span>
          <span className="font-heading font-semibold text-[17px] truncate">
            {source.titre || 'Sans titre'}
          </span>
        </div>
        <span className={`inline-flex items-center text-[11px] px-2.5 py-[3px] ${s.cls}`}>
          {s.erreur && <AlertCircle size={11} className="mr-1" />}
          {s.label}
        </span>
      </div>
      <p className="font-mono text-xs opacity-65 m-0 break-all">{source.urlRss}</p>
      <div className="flex items-center gap-1.5 text-[11px] text-ink/50">
        <Clock size={13} />
        <span>
          {source.dateDernierFetch
            ? `récupéré ${tempsRelatif(source.dateDernierFetch)} (${dateCourte(source.dateDernierFetch)})`
            : 'jamais récupéré'}
        </span>
      </div>
      <div className="flex gap-2 mt-1">
        <button
          type="button"
          onClick={() => onDelete(source)}
          disabled={suppression}
          className="inline-flex items-center gap-1.5 text-accent-600 font-heading font-semibold text-[13px] px-1 disabled:opacity-50"
        >
          <Trash size={13} />
          Supprimer
        </button>
      </div>
    </div>
  )
}
