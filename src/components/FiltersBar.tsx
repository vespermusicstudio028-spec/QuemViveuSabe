import React from 'react';
import { Search, LayoutGrid, List, X, Filter, Plus } from 'lucide-react';
import { ViewMode, FilterStatus, PublicationCategory } from '../types/publication';

interface FiltersBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: FilterStatus;
  onStatusFilterChange: (status: FilterStatus) => void;
  categoryFilter: 'all' | PublicationCategory;
  onCategoryFilterChange: (cat: 'all' | PublicationCategory) => void;
  viewMode: ViewMode;
  onViewModeChange: (m: ViewMode) => void;
  rangeFilter: string;
  onRangeFilterChange: (r: string) => void;
  totalItems: number;
  filteredCount: number;
  onAddNewSlot: () => void;
}

export const FiltersBar: React.FC<FiltersBarProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  viewMode,
  onViewModeChange,
  rangeFilter,
  onRangeFilterChange,
  totalItems,
  filteredCount,
  onAddNewSlot,
}) => {
  const categories: { id: 'all' | PublicationCategory; label: string }[] = [
    { id: 'all', label: 'Todas Categorias' },
    { id: 'desenho', label: '📺 Desenhos' },
    { id: 'filme', label: '🎬 Filmes' },
    { id: 'maratona', label: '⚡ Maratonas' },
    { id: 'serie', label: '📼 Séries / TV' },
    { id: 'outro', label: '📌 Outros' },
  ];

  const ranges = [
    { id: 'all', label: 'Todos (1-100+)' },
    { id: '1-25', label: '#1 a #25' },
    { id: '26-50', label: '#26 a #50' },
    { id: '51-75', label: '#51 a #75' },
    { id: '76-100', label: '#76 a #100' },
  ];

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    statusFilter !== 'all' ||
    categoryFilter !== 'all' ||
    rangeFilter !== 'all';

  const clearFilters = () => {
    onSearchChange('');
    onStatusFilterChange('all');
    onCategoryFilterChange('all');
    onRangeFilterChange('all');
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-md space-y-3.5">
      {/* Search and View Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar por número (ex: 22) ou título (ex: X-Men, Popeye, Rambo)..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-950/80 border border-slate-700/80 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View mode toggle, counter, and eye-catching add button */}
        <div className="flex flex-wrap items-center justify-between md:justify-end gap-2.5">
          <div className="text-xs text-slate-400 font-medium hidden sm:block">
            Exibindo <span className="text-white font-bold">{filteredCount}</span> de {totalItems}
          </div>

          <div className="flex items-center bg-slate-950/80 border border-slate-700/80 rounded-xl p-1">
            <button
              onClick={() => onViewModeChange('table')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === 'table'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualização em Lista / Tabela"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Tabela</span>
            </button>
            <button
              onClick={() => onViewModeChange('cards')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                viewMode === 'cards'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Visualização em Cartões / Cards"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Cartões</span>
            </button>
          </div>

          {/* Eye-catching Add button */}
          <button
            onClick={onAddNewSlot}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/25 border border-amber-300 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            title="Adicionar mais uma publicação à fila"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-950 text-amber-300">
              <Plus className="w-3.5 h-3.5 stroke-[3.5]" />
            </span>
            <span className="uppercase font-black tracking-wide">+ Nova Publicação</span>
          </button>
        </div>
      </div>

      {/* Filter Pills row */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
        <div className="flex items-center gap-1 text-xs text-slate-400 font-medium mr-1">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Filtros:</span>
        </div>

        {/* Range picker buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {ranges.map((r) => (
            <button
              key={r.id}
              onClick={() => onRangeFilterChange(r.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                rangeFilter === r.id
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/50'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-slate-800 hidden sm:block mx-1" />

        {/* Category selector */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => onCategoryFilterChange(c.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                categoryFilter === c.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 underline underline-offset-2 py-1"
          >
            <X className="w-3.5 h-3.5" />
            Limpar Filtros
          </button>
        )}
      </div>
    </div>
  );
};
