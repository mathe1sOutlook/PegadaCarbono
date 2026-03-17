import { Outlet, NavLink, Link } from 'react-router-dom';
import {
  Calculator,
  Building2,
  Truck,
  Database,
  Recycle,
  BookOpen,
  Leaf,
  Menu,
  X,
  Info,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: Calculator, label: 'Concreto' },
  { to: '/estrutura', icon: Building2, label: 'Estrutura' },
  { to: '/transporte', icon: Truck, label: 'Transporte' },
  { to: '/fatores', icon: Database, label: 'Fatores de Emissão' },
  { to: '/ciclo-vida', icon: Recycle, label: 'Ciclo de Vida' },
  { to: '/referencia', icon: BookOpen, label: 'Referência Técnica' },
  { to: '/sobre', icon: Info, label: 'Sobre' },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-xl p-2">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight tracking-tight">
                Pegada de Carbono
              </h1>
              <p className="text-[10px] text-emerald-100 leading-none">
                IBRACON/ABECE/ABCIC
              </p>
            </div>
          </div>
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/25 text-white shadow-inner'
                      : 'text-emerald-100 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <nav className="lg:hidden border-t border-emerald-500/30 px-4 py-3 space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : 'text-emerald-100 hover:bg-white/10'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                {label}
              </NavLink>
            ))}
          </nav>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 text-xs py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span className="text-white font-semibold text-sm">Pegada de Carbono</span>
              </div>
              <p className="text-gray-500 leading-relaxed">
                Ferramenta de apoio técnico para quantificação das emissões de CO₂
                em estruturas de concreto.
              </p>
            </div>
            <div>
              <h3 className="text-gray-300 font-semibold mb-2">Documento Fonte</h3>
              <p className="text-gray-500 leading-relaxed">
                Boletim Técnico IBRACON/ABECE/ABCIC — Quantificação das emissões de CO₂
                incorporadas em materiais cimentícios e estruturas de concreto.
              </p>
              <p className="text-gray-500 mt-1">1ª Edição — São Paulo, 2024</p>
            </div>
            <div>
              <h3 className="text-gray-300 font-semibold mb-2">Créditos</h3>
              <p className="text-gray-500">
                Autora: Fernanda Belizario Silva
              </p>
              <p className="text-gray-500">
                Editores: K. R. G. Punhagui &amp; C. J. Massucato
              </p>
              <Link
                to="/sobre"
                className="inline-block mt-2 text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Ver todos os créditos →
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-4 text-center text-gray-500">
            <p>
              CT 101 — Sustentabilidade do Concreto &mdash; IBRACON / ABECE / ABCIC
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
