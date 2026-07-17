import Corners from './Corners'
import { AlertCircle, Loader } from './Icons'

export function Field({ label, id, ...props }) {
  return (
    <label className="block mb-4">
      <span className="block text-[13px] font-semibold mb-1.5">{label}</span>
      <input
        id={id}
        className="w-full min-h-10 px-3 py-2 text-sm bg-surface border border-divider outline-none focus:border-accent"
        {...props}
      />
    </label>
  )
}

export function ErrorBanner({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-2 text-[13px] text-neutral-800 bg-neutral-100 border border-divider px-3 py-2 mb-4">
      <AlertCircle size={14} className="mt-0.5 flex-none" />
      <span>{message}</span>
    </div>
  )
}

export function PrimaryButton({ children, loading, ...props }) {
  return (
    <button
      type="submit"
      disabled={loading || props.disabled}
      className="relative w-full inline-flex items-center justify-center gap-2 border border-accent bg-accent text-canvas font-heading font-semibold text-sm px-3 py-2.5 disabled:opacity-60"
      {...props}
    >
      <Corners />
      {loading && <Loader size={15} />}
      {children}
    </button>
  )
}
