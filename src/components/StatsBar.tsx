import React from 'react';
import { PublicationItem } from '../types/publication';
import { CheckCircle2, Clock, Film, FileEdit, HelpCircle, Layers } from 'lucide-react';

interface StatsBarProps {
  items: PublicationItem[];
  onSelectFilter: (filter: string) => void;
  activeFilter: string;
}

export const StatsBar: React.FC<StatsBarProps> = ({
  items,
  onSelectFilter,
  activeFilter,
}) => {
  const total = items.length;
  const filled = items.filter(i => i.title.trim().length > 0).length;
  const empty = total - filled;
  const published = items.filter(i => i.status === 'published').length;
  const scheduled = items.filter(i => i.status === 'scheduled').length;
  const ready = items.filter(i => i.status === 'ready').length;
  const draft = items.filter(i => i.status === 'draft' && i.title.trim().length > 0).length;

  const filledPercentage = total > 0 ? Math.round((filled / total) * 100) : 0;
  const publishedPercentage = filled > 0 ? Math.round((published / filled) * 100) : 0;

  const statCards = [
    {
      id: 'all',
      label: 'Total de Slots',
      value: total,
      sub: `${filled} preenchidos`,
      icon: Layers,
      color: 'from-blue-500/20 to-blue-600/10 border-blue-500/30 text-blue-400',
      activeRing: 'ring-2 ring-blue-500',
    },
    {
      id: 'published',
      label: 'Publicados',
      value: published,
      sub: `${publishedPercentage}% dos preenchidos`,
      icon: CheckCircle2,
      color: 'from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-400',
      activeRing: 'ring-2 ring-emerald-500',
    },
    {
      id: 'scheduled',
      label: 'Agendados',
      value: scheduled,
      sub: 'Programados',
      icon: Clock,
      color: 'from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-400',
      activeRing: 'ring-2 ring-amber-500',
    },
    {
      id: 'ready',
      label: 'Vídeos Prontos',
      value: ready,
      sub: 'Aguardando agendar',
      icon: Film,
      color: 'from-cyan-500/20 to-cyan-600/10 border-cyan-500/30 text-cyan-400',
      activeRing: 'ring-2 ring-cyan-500',
    },
    {
      id: 'draft',
      label: 'Rascunhos / Fila',
      value: draft,
      sub: 'A produzir',
      icon: FileEdit,
      color: 'from-purple-500/20 to-purple-600/10 border-purple-500/30 text-purple-400',
      activeRing: 'ring-2 ring-purple-500',
    },
    {
      id: 'empty',
      label: 'Vagos (a preencher)',
      value: empty,
      sub: 'Sem título ainda',
      icon: HelpCircle,
      color: 'from-slate-700/30 to-slate-800/20 border-slate-700 text-slate-400',
      activeRing: 'ring-2 ring-slate-400',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Progress Bar strip */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shadow-md backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Progresso da Fila:</span>
            <span className="text-amber-400 font-bold">{filled} de {total} slots com título</span>
            <span className="text-slate-500">({filledPercentage}%)</span>
          </div>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              {published} no ar
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              {scheduled} agendados
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-600 inline-block" />
              {empty} vagos
            </span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${(published / total) * 100}%` }}
            title={`${published} Publicados`}
          />
          <div
            className="bg-amber-500 h-full transition-all duration-500"
            style={{ width: `${(scheduled / total) * 100}%` }}
            title={`${scheduled} Agendados`}
          />
          <div
            className="bg-cyan-500 h-full transition-all duration-500"
            style={{ width: `${(ready / total) * 100}%` }}
            title={`${ready} Prontos`}
          />
          <div
            className="bg-purple-600 h-full transition-all duration-500"
            style={{ width: `${(draft / total) * 100}%` }}
            title={`${draft} Rascunhos preenchidos`}
          />
          <div
            className="bg-slate-700 h-full transition-all duration-500 opacity-40"
            style={{ width: `${(empty / total) * 100}%` }}
            title={`${empty} Vagos`}
          />
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {statCards.map((card) => {
          const Icon = card.icon;
          const isActive = activeFilter === card.id;

          return (
            <button
              key={card.id}
              onClick={() => onSelectFilter(card.id)}
              className={`text-left p-3 rounded-xl border bg-gradient-to-br transition-all hover:scale-[1.02] cursor-pointer ${
                card.color
              } ${isActive ? `${card.activeRing} shadow-lg shadow-black/40` : 'hover:border-slate-500'}`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium text-slate-300 truncate">{card.label}</span>
                <Icon className="w-4 h-4 flex-shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">{card.value}</div>
              <div className="text-[10px] text-slate-400 truncate mt-0.5">{card.sub}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
