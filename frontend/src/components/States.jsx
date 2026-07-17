import Corners from './Corners'
import { AlertCircle, Loader } from './Icons'

export function Loading({ label = 'Chargement…' }) {
  return (
    <div className="flex items-center justify-center gap-2 text-ink/55 py-16">
      <Loader size={18} />
      <span className="text-sm">{label}</span>
    </div>
  )
}

export function EmptyState({ title, children }) {
  return (
    <div className="relative border border-divider border-dashed p-10 text-center text-ink/60">
      <div className="font-heading font-semibold text-lg text-ink mb-1">{title}</div>
      {children}
    </div>
  )
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="relative border border-divider p-6 flex items-start gap-3">
      <Corners />
      <AlertCircle size={18} className="text-neutral-700 mt-0.5 flex-none" />
      <div>
        <p className="text-sm m-0">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="text-accent-600 font-heading font-semibold text-[13px] mt-2"
          >
            Réessayer
          </button>
        )}
      </div>
    </div>
  )
}
