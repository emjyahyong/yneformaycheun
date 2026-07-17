import Corners from './Corners'

// Mise en page centrée commune aux écrans de connexion / inscription.
export default function AuthLayout({ titre, sousTitre, children, bas }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-[380px]">
        <div className="text-center mb-6">
          <div className="font-heading font-semibold text-2xl">Yneformaycheun</div>
          <p className="text-ink/50 text-sm mt-1">Votre veille technologique, centralisée</p>
        </div>
        <div className="relative border border-divider shadow-sm bg-canvas p-6">
          <Corners />
          <h1 className="font-heading font-semibold text-[26px] leading-tight mb-1">{titre}</h1>
          {sousTitre && <p className="text-ink/55 text-sm mb-5">{sousTitre}</p>}
          {children}
        </div>
        {bas && <div className="text-center text-sm text-ink/60 mt-4">{bas}</div>}
      </div>
    </div>
  )
}
