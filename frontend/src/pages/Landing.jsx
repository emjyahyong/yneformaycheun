import { Link } from 'react-router-dom'
import Corners from '../components/Corners'
import { ArrowRight, Pencil, Rss, Tag } from '../components/Icons'

// Aperçu du fil, statique (contenu marketing).
const apercu = [
  { titre: 'Spring Boot 3.4 : les HTTP Interfaces natives', source: 'Baeldung', date: '13 juil.', tag: 'Spring' },
  { titre: 'OWASP Top 10 2025 : les API REST', source: 'InfoQ', date: '13 juil.', tag: 'Sécurité' },
  { titre: "TestContainers pour les tests d'intégration", source: 'The New Stack', date: '12 juil.', tag: 'Java' },
]

const atouts = [
  { grand: 'RSS / Atom', petit: 'Formats de flux supportés' },
  { grand: 'Auto', petit: 'Récupération planifiée des articles' },
  { grand: '1 clic', petit: 'Ajout d’une source, articles récupérés aussitôt' },
]

const fonctions = [
  {
    Icone: Rss,
    titre: 'Centralise tes sources',
    texte: 'Ajoute n’importe quel flux RSS/Atom et retrouve tous les articles dans un seul fil, trié par date.',
  },
  {
    Icone: Tag,
    titre: 'Organise par tags',
    texte: 'Crée tes propres tags et filtre le fil pour ne voir que Java, Sécurité, DevOps… selon le besoin du moment.',
  },
  {
    Icone: Pencil,
    titre: 'Annote & classe',
    texte: 'Prends des notes sur un article, marque-le « à lire plus tard », retrouve tout au bon endroit.',
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* En-tête */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-divider">
        <span className="font-heading font-semibold text-lg mr-auto">Yneformaycheun</span>
        <Link to="/login" className="text-sm hover:text-accent-600">
          Se connecter
        </Link>
        <Link
          to="/register"
          className="relative inline-flex items-center border border-accent bg-accent text-canvas font-heading font-semibold text-[13px] px-3 py-2"
        >
          <Corners />
          Créer un compte
        </Link>
      </header>

      {/* Hero */}
      <section className="px-6 py-12 md:py-16 max-w-[1180px] mx-auto w-full grid md:grid-cols-2 gap-10 items-center">
        <div>
          <p className="text-[11px] tracking-[0.16em] uppercase text-accent-600 mb-4">
            Veille technologique · Agrégateur RSS
          </p>
          <h1 className="font-heading font-semibold text-[44px] md:text-[54px] leading-[1.05] tracking-[-0.02em] mb-5">
            Toute ta veille technique, centralisée et <span className="text-accent-600">digérée</span>.
          </h1>
          <p className="text-ink/65 text-[15px] leading-relaxed mb-7 max-w-[480px]">
            Agrège tes flux RSS, organise les articles par tags personnalisés, annote et classe
            ce que tu veux lire plus tard. Fini l’information éparpillée entre douze onglets.
          </p>
          <Link
            to="/register"
            className="relative inline-flex items-center gap-2 border border-accent bg-accent text-canvas font-heading font-semibold text-sm px-5 py-3"
          >
            <Corners />
            Commencer gratuitement
            <ArrowRight size={15} />
          </Link>
        </div>

        {/* Carte aperçu du fil */}
        <div className="relative border border-divider shadow-sm p-5 bg-canvas">
          <Corners />
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] tracking-[0.14em] uppercase text-ink/45">Fil d’actualité</span>
            <span className="inline-flex items-center text-[11px] px-2.5 py-[3px] bg-accent-100 text-accent-800">
              6 nouveaux
            </span>
          </div>
          <div className="flex flex-col divide-y divide-divider">
            {apercu.map((a) => (
              <div key={a.titre} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
                <span className="text-accent-600 mt-0.5 flex-none">
                  <Rss size={14} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-heading font-semibold text-[15px] leading-tight m-0">{a.titre}</p>
                  <p className="text-[11px] text-ink/45 mt-0.5 m-0">
                    {a.source} · {a.date}
                  </p>
                </div>
                <span className="inline-flex items-center text-[11px] px-2.5 py-[3px] bg-accent-100 text-accent-800 flex-none">
                  {a.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bande sombre : atouts */}
      <section className="bg-ink text-canvas">
        <div className="max-w-[1180px] mx-auto grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {atouts.map((a) => (
            <div key={a.grand} className="text-center px-6 py-8">
              <div className="font-heading font-semibold text-[30px] leading-none mb-1.5">{a.grand}</div>
              <div className="text-canvas/60 text-[13px]">{a.petit}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Ce que fait Yneformaycheun */}
      <section className="px-6 py-14 max-w-[1180px] mx-auto w-full">
        <h2 className="font-heading font-semibold text-[30px] mb-8">Ce que fait Yneformaycheun</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {fonctions.map(({ Icone, titre, texte }) => (
            <div key={titre} className="relative border border-divider p-5">
              <Corners />
              <span className="text-accent-600 inline-flex mb-3">
                <Icone size={20} />
              </span>
              <h3 className="font-heading font-semibold text-[18px] mb-1.5">{titre}</h3>
              <p className="text-[13px] text-ink/65 leading-relaxed m-0">{texte}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Appel à l'action final */}
      <section className="px-6 py-16 border-t border-divider text-center">
        <h2 className="font-heading font-semibold text-[32px] mb-2">Reprends le contrôle de ta veille.</h2>
        <p className="text-ink/55 mb-6">Crée ton compte en quelques secondes, aucune carte requise.</p>
        <Link
          to="/register"
          className="relative inline-flex items-center gap-2 border border-accent bg-accent text-canvas font-heading font-semibold text-sm px-5 py-3"
        >
          <Corners />
          Créer un compte
          <ArrowRight size={15} />
        </Link>
      </section>

      <footer className="px-6 py-5 border-t border-divider text-center text-[12px] text-ink/40">
        Yneformaycheun — agrégateur de veille technologique
      </footer>
    </div>
  )
}
