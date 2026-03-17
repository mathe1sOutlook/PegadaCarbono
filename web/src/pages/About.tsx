import { BookOpen, Users, Building, Calendar, MapPin, Award, ExternalLink, Heart } from 'lucide-react';

const contributors = [
  'Alex Neves Junior',
  'Alvaro Barbosa',
  'Angel Ibañez',
  'Claudio Sbrighi',
  'Diana Nascimento Lins',
  'Edna Possan',
  'Emilio Takagi',
  'Ercio Thomaz',
  'Hugo S. Armelin',
  'Íria Lícia Oliva Doniak',
  'Jairo José de Oliveira Andrade',
  'Jorge Batlouni Neto',
  'Jorge Luiz Christofolli',
  'José Marques Filho',
  'Luiz Aurélio Fortes da Silva',
  'Marcio Joaquim Estefano de Oliveira',
  'Matheus Oliveira de Azevedo',
  'Mauricio Bianchini',
  'Patricia Falcão Bauer',
  'Paulo Helene',
  'Ricardo Couceiro Bento',
  'Roberto Dakuzaku',
  'Rodrigo Nurnberg',
  'Seiiti Suzuki',
  'Vanderley John',
];

const institutions = [
  {
    acronym: 'IBRACON',
    name: 'Instituto Brasileiro do Concreto',
    description: 'Fundado em 23 de junho de 1972. Missão: "Ciência e Tecnologia para o Desenvolvimento do Concreto e da Construção Civil".',
    role: 'Editora e organizadora do Boletim Técnico',
  },
  {
    acronym: 'ABECE',
    name: 'Associação Brasileira de Engenharia e Consultoria Estrutural',
    description: 'Associação que congrega empresas e profissionais de engenharia estrutural no Brasil.',
    role: 'Coautoria e revisão técnica',
  },
  {
    acronym: 'ABCIC',
    name: 'Associação Brasileira da Construção Industrializada de Concreto',
    description: 'Entidade que representa a indústria de pré-fabricados de concreto no Brasil.',
    role: 'Coautoria e contribuição técnica via CT 304',
  },
];

const committees = [
  {
    code: 'CT 101',
    name: 'Sustentabilidade do Concreto',
    org: 'IBRACON/ABECE/ABCIC',
    role: 'Comitê Técnico responsável pela elaboração do Boletim',
  },
  {
    code: 'CT 304',
    name: 'Pré-Fabricados de Concreto',
    org: 'IBRACON/ABCIC',
    role: 'Comitê Técnico contribuinte',
  },
];

export default function About() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 rounded-2xl p-8 md:p-12 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-64 h-64 border border-white/30 rounded-full" />
          <div className="absolute bottom-4 left-4 w-48 h-48 border border-white/20 rounded-full" />
          <div className="absolute top-1/2 left-1/2 w-96 h-96 -translate-x-1/2 -translate-y-1/2 border border-white/10 rounded-full" />
        </div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 rounded-xl p-3">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <p className="text-emerald-200 text-sm font-medium">Boletim Técnico</p>
              <p className="text-emerald-200 text-sm">IBRACON / ABECE / ABCIC</p>
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold leading-tight mb-4">
            Quantificação das Emissões de CO₂ Incorporadas em Materiais Cimentícios e Estruturas de Concreto
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-emerald-100 mt-6">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              1ª Edição — 2024
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              São Paulo, Brasil
            </span>
            <span className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Comitê Técnico CT 101
            </span>
          </div>
        </div>
      </div>

      {/* About this site */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-amber-900 mb-2">Sobre este site</h2>
        <p className="text-amber-800 text-sm leading-relaxed">
          Este site foi desenvolvido como ferramenta educacional e de apoio técnico, consolidando
          as informações do Boletim Técnico IBRACON/ABECE/ABCIC (2024) em calculadoras interativas,
          gráficos e tabelas de referência. Todo o conteúdo técnico — fatores de emissão, equações,
          procedimentos e dados — é proveniente exclusivamente do documento original citado abaixo.
          O objetivo é facilitar a aplicação prática da metodologia de quantificação das emissões
          de CO₂ em estruturas de concreto.
        </p>
      </div>

      {/* Document details */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Editors */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4">
            <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Editores
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Editor</p>
              <p className="font-semibold text-gray-900">Katia Regina Garcia Punhagui</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Editor</p>
              <p className="font-semibold text-gray-900">Carlos José Massucato</p>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4">
            <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-600" />
              Autora
            </h2>
          </div>
          <div className="p-6">
            <p className="font-semibold text-gray-900 text-lg">Fernanda Belizario Silva</p>
            <p className="text-sm text-gray-500 mt-2">
              Responsável pela redação do conteúdo técnico do Boletim
            </p>
          </div>
        </div>
      </div>

      {/* Institutions */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4">
          <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
            <Building className="w-5 h-5 text-emerald-600" />
            Instituições
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {institutions.map((inst) => (
            <div key={inst.acronym} className="p-6">
              <div className="flex flex-wrap items-start gap-4">
                <span className="bg-emerald-100 text-emerald-800 font-bold px-4 py-2 rounded-lg text-sm shrink-0">
                  {inst.acronym}
                </span>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900">{inst.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{inst.description}</p>
                  <p className="text-xs text-emerald-600 font-medium mt-2">
                    Papel: {inst.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Committees */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4">
          <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
            <ExternalLink className="w-5 h-5 text-emerald-600" />
            Comitês Técnicos
          </h2>
        </div>
        <div className="divide-y divide-gray-100">
          {committees.map((ct) => (
            <div key={ct.code} className="p-6 flex items-start gap-4">
              <span className="bg-teal-100 text-teal-800 font-bold px-3 py-1.5 rounded-lg text-sm shrink-0 font-mono">
                {ct.code}
              </span>
              <div>
                <h3 className="font-semibold text-gray-900">{ct.name}</h3>
                <p className="text-sm text-gray-500">{ct.org}</p>
                <p className="text-xs text-teal-600 font-medium mt-1">{ct.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contributors */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4">
          <h2 className="text-lg font-bold text-emerald-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            Contribuidores
          </h2>
          <p className="text-sm text-emerald-700 mt-1">
            {contributors.length} profissionais contribuíram com o conteúdo do Boletim Técnico
          </p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {contributors.map((name) => (
              <div
                key={name}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold shrink-0">
                  {name.charAt(0)}
                </div>
                <span className="text-sm text-gray-700 truncate">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Publication info */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Informações da Publicação</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Edição</p>
            <p className="font-semibold text-gray-900">1ª Edição</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Ano</p>
            <p className="font-semibold text-gray-900">2024</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Local</p>
            <p className="font-semibold text-gray-900">São Paulo, SP</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Editora</p>
            <p className="font-semibold text-gray-900">IBRACON</p>
          </div>
        </div>
      </div>

      {/* Citation */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-3">Como citar</h2>
        <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm text-gray-700 leading-relaxed border border-gray-200">
          SILVA, F. B. <em>Quantificação das emissões de CO₂ incorporadas em materiais
          cimentícios e estruturas de concreto</em>. Boletim Técnico IBRACON/ABECE/ABCIC.
          Editores: K. R. G. Punhagui; C. J. Massucato. 1ª ed.
          São Paulo: IBRACON, 2024.
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-100 rounded-xl p-6 text-center">
        <p className="text-sm text-gray-600 leading-relaxed max-w-3xl mx-auto">
          Este site é uma ferramenta independente de apoio técnico e divulgação educacional.
          Todos os dados, equações e metodologias apresentados são baseados exclusivamente no
          Boletim Técnico IBRACON/ABECE/ABCIC (2024). Para fins oficiais, consulte sempre o
          documento original. Os direitos autorais do conteúdo técnico pertencem aos respectivos
          autores e instituições.
        </p>
      </div>
    </div>
  );
}
