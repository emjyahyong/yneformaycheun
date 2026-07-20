import { Link } from 'react-router-dom'
import { dateCourte } from '../utils/format'
import Corners from './Corners'
import { Bookmark, ExternalLink } from './Icons'

// Carte résumée d'un article dans le fil (titre, source, date, tags).
export default function ArticleCard({ article, onRetirerALire, retraitEnCours }) {
  return (
    <div className="relative border border-divider shadow-sm p-4 flex flex-col gap-2">
      <Corners />
      <div className="flex justify-between text-[10px] tracking-[0.1em] uppercase text-accent-600">
        <span>{article.sourceNom || 'Source'}</span>
        <span>{dateCourte(article.datePublication)}</span>
      </div>
      <div className="font-heading font-semibold text-[17px] leading-[1.2]">
        {article.titre}
      </div>
      {article.resume && (
        <p className="text-[13px] opacity-80 flex-1 m-0 line-clamp-3">{article.resume}</p>
      )}
      {article.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {article.tags.map((t) => (
            <span
              key={t.id}
              className="inline-flex items-center text-[11px] px-2.5 py-[3px] bg-accent-100 text-accent-800"
            >
              {t.nom}
            </span>
          ))}
        </div>
      )}
      <div className="flex justify-between items-center mt-auto pt-1">
        <Link
          to={`/article/${article.id}`}
          className="inline-flex items-center gap-1.5 text-accent-600 font-heading font-semibold text-[13px] px-1"
        >
          Lire l&apos;article
          <ExternalLink size={12} />
        </Link>
        {onRetirerALire && (
          <button
            type="button"
            onClick={() => onRetirerALire(article)}
            disabled={retraitEnCours}
            title="Retirer de la liste à lire plus tard"
            aria-label="Retirer de la liste à lire plus tard"
            className="inline-flex items-center gap-1 text-ink/55 hover:text-accent-600 text-[12px] disabled:opacity-40"
          >
            <Bookmark size={13} filled />
            Retirer
          </button>
        )}
      </div>
    </div>
  )
}
