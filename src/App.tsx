import React, { useState, useEffect, useMemo } from 'react';
import { PublicationItem, PublicationStatus, PublicationCategory, ViewMode, FilterStatus } from './types/publication';
import { loadPublications, savePublications, resetToInitial } from './utils/storage';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { FiltersBar } from './components/FiltersBar';
import { PublicationTable } from './components/PublicationTable';
import { PublicationCard } from './components/PublicationCard';
import { EditModal } from './components/EditModal';
import { FacebookCopyModal } from './components/FacebookCopyModal';
import { BackupModal } from './components/BackupModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { FloatingAddButton } from './components/FloatingAddButton';
import { Plus, Check, ArrowUp, Sparkles, Tv, Facebook } from 'lucide-react';

export default function App() {
  const [items, setItems] = useState<PublicationItem[]>(() => loadPublications());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | PublicationCategory>('all');
  const [rangeFilter, setRangeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  // Modals state
  const [editingItem, setEditingItem] = useState<PublicationItem | null>(null);
  const [facebookItem, setFacebookItem] = useState<PublicationItem | null>(null);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PublicationItem | null>(null);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Next slot number
  const nextSlotNumber = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;

  // Auto-save whenever items change
  useEffect(() => {
    savePublications(items);
  }, [items]);

  // Global F1 key shortcut to save alterations anywhere in the app
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1' || e.code === 'F1') {
        e.preventDefault();
        e.stopPropagation();
        // If modal is not currently open, ensure data is safely persisted and notify user
        if (!editingItem) {
          savePublications(items);
          showToast('💾 Todas as alterações estão salvas! (Atalho F1)');
        }
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [items, editingItem]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3200);
  };

  // Status change handler
  const handleStatusChange = (id: number, newStatus: PublicationStatus) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated: PublicationItem = {
            ...item,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          };
          if (newStatus === 'published' && !item.publishedDate) {
            updated.publishedDate = new Date().toISOString().slice(0, 10);
          }
          return updated;
        }
        return item;
      })
    );
    showToast(`Status do slot #${id} atualizado!`);
  };

  // Save edited item
  const handleSaveItem = (updated: PublicationItem) => {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    showToast(`Slot #${updated.id} salvo com sucesso!`);
  };

  // Add new slot (e.g., 101, 102...)
  const handleAddNewSlot = () => {
    const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;
    const newSlot: PublicationItem = {
      id: nextId,
      title: '',
      status: 'draft',
      category: 'outro',
      scheduledDate: '',
      scheduledTime: '',
      publishedDate: '',
      videoUrl: '',
      facebookUrl: '',
      caption: '',
      notes: '',
      tags: [],
      updatedAt: new Date().toISOString(),
    };
    setItems((prev) => [...prev, newSlot]);
    showToast(`Novo slot #${nextId} adicionado à fila!`);
    setEditingItem(newSlot);
  };

  // Clear publication slot content (turn into empty slot)
  const handleClearContent = (id: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            title: '',
            status: 'draft',
            category: 'outro',
            scheduledDate: '',
            scheduledTime: '',
            publishedDate: '',
            videoUrl: '',
            facebookUrl: '',
            caption: '',
            notes: '',
            tags: [],
            updatedAt: new Date().toISOString(),
          };
        }
        return item;
      })
    );
    showToast(`Conteúdo do slot #${id} limpo! O slot agora está vago na fila.`);
  };

  // Delete slot completely from array
  const handleDeleteCompletely = (id: number) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast(`Slot #${id} excluído definitivamente!`);
  };

  // Import backup
  const handleImportBackup = (newItems: PublicationItem[]) => {
    setItems(newItems);
  };

  // Reset to initial
  const handleReset = () => {
    const initial = resetToInitial();
    setItems(initial);
  };

  // Filtered publications
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Search filter (number or title)
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.trim().toLowerCase();
        const matchesId = item.id.toString() === query || `#${item.id}` === query;
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesNotes = item.notes?.toLowerCase().includes(query);
        if (!matchesId && !matchesTitle && !matchesNotes) {
          return false;
        }
      }

      // Status filter
      if (statusFilter === 'filled' && !item.title.trim()) return false;
      if (statusFilter === 'empty' && item.title.trim()) return false;
      if (statusFilter === 'published' && item.status !== 'published') return false;
      if (statusFilter === 'scheduled' && item.status !== 'scheduled') return false;
      if (statusFilter === 'ready' && item.status !== 'ready') return false;
      if (statusFilter === 'draft' && (item.status !== 'draft' || !item.title.trim())) return false;

      // Category filter
      if (categoryFilter !== 'all' && item.category !== categoryFilter) {
        return false;
      }

      // Range filter
      if (rangeFilter === '1-25' && (item.id < 1 || item.id > 25)) return false;
      if (rangeFilter === '26-50' && (item.id < 26 || item.id > 50)) return false;
      if (rangeFilter === '51-75' && (item.id < 51 || item.id > 75)) return false;
      if (rangeFilter === '76-100' && (item.id < 76 || item.id > 100)) return false;

      return true;
    });
  }, [items, searchQuery, statusFilter, categoryFilter, rangeFilter]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative pb-20">
      {/* App Header */}
      <Header
        onOpenBackupModal={() => setIsBackupOpen(true)}
        onAddNewSlot={handleAddNewSlot}
        totalSlots={items.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Page Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/20 p-5 sm:p-7 shadow-2xl backdrop-blur-md">
          <div className="absolute -right-8 -bottom-8 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-8 -top-8 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
                <Tv className="w-3.5 h-3.5 text-amber-400" />
                <span>Página Oficial: QUEM VIVEU, SABE!</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight">
                Fila de Publicações Nostálgicas
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Cada número corresponde a uma publicação real. Gerencie títulos de 1 a 100, acompanhe agendamentos, copie textos prontos com emojis e hashtags e nunca perca o controle das suas postagens no Facebook.
              </p>
            </div>

            {/* Action buttons in Hero */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Eye-catching Add publication button */}
              <button
                onClick={handleAddNewSlot}
                className="group relative flex items-center gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-sm shadow-xl shadow-amber-500/30 border-2 border-white/60 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                title="Adicionar uma nova publicação à fila"
              >
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-950 text-amber-300 shadow-md group-hover:rotate-90 transition-transform">
                  <Plus className="w-5 h-5 stroke-[3.5]" />
                </span>
                <div className="flex flex-col text-left">
                  <span className="uppercase tracking-wider font-black text-xs leading-tight">+ Nova Publicação</span>
                  <span className="text-[11px] font-bold text-amber-950/80">Criar Slot #{nextSlotNumber}</span>
                </div>
              </button>

              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-2xl bg-blue-600/30 hover:bg-blue-600/40 border border-blue-500/40 text-blue-200 hover:text-white text-xs font-bold transition flex items-center gap-2"
              >
                <Facebook className="w-4 h-4 text-blue-400" />
                <span>Abrir Facebook</span>
              </a>
            </div>
          </div>
        </div>

        {/* Real-time Statistics and Queue Progress */}
        <StatsBar
          items={items}
          activeFilter={statusFilter}
          onSelectFilter={(f) => setStatusFilter(f as FilterStatus)}
        />

        {/* Search and Filters Controls */}
        <FiltersBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          rangeFilter={rangeFilter}
          onRangeFilterChange={setRangeFilter}
          totalItems={items.length}
          filteredCount={filteredItems.length}
          onAddNewSlot={handleAddNewSlot}
        />

        {/* Publications Display (Grid or Table) */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 px-4 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
            <Tv className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">Nenhuma publicação encontrada</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Nenhum slot corresponde aos filtros aplicados. Tente limpar os termos de busca ou filtros de status.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                  setRangeFilter('all');
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Resetar Filtros
              </button>
              <button
                onClick={handleAddNewSlot}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Criar Publicação #{nextSlotNumber}</span>
              </button>
            </div>
          </div>
        ) : viewMode === 'cards' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Eye-catching Add Card right at the start of cards view */}
            <button
              onClick={handleAddNewSlot}
              className="group relative rounded-2xl border-2 border-dashed border-amber-500/70 hover:border-amber-400 bg-gradient-to-br from-amber-500/10 via-slate-900/90 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 p-6 flex flex-col items-center justify-center gap-3 text-center transition-all duration-300 min-h-[220px] shadow-lg shadow-amber-500/5 hover:scale-[1.02] cursor-pointer"
            >
              <div className="relative">
                <div className="absolute -inset-1 bg-amber-400 rounded-full blur-md opacity-40 group-hover:opacity-80 animate-pulse" />
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-110 group-hover:rotate-90 transition-all duration-300 border-2 border-white/60">
                  <Plus className="w-8 h-8 stroke-[3.5]" />
                </div>
              </div>
              <div>
                <div className="text-sm font-black uppercase tracking-wider text-amber-300 flex items-center justify-center gap-1.5">
                  <span>+ Adicionar Publicação</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  Clique para criar o novo <strong className="text-amber-400">Slot #{nextSlotNumber}</strong>
                </div>
              </div>
            </button>

            {filteredItems.map((item) => (
              <PublicationCard
                key={item.id}
                item={item}
                onEdit={(it) => setEditingItem(it)}
                onStatusChange={handleStatusChange}
                onOpenFacebookModal={(it) => setFacebookItem(it)}
                onShowToast={showToast}
                onRequestDelete={(it) => setItemToDelete(it)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Eye-catching Add Bar above table */}
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-slate-900 to-orange-500/15 border border-amber-500/30">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-400 text-slate-950 font-black">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </span>
                <span>
                  Quer adicionar mais títulos à fila? Próximo slot disponível: <strong className="text-amber-400">Slot #{nextSlotNumber}</strong>
                </span>
              </div>
              <button
                onClick={handleAddNewSlot}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md shadow-amber-500/25 border border-amber-300 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3.5]" />
                <span>+ Adicionar Publicação #{nextSlotNumber}</span>
              </button>
            </div>

            <PublicationTable
              items={filteredItems}
              onEdit={(it) => setEditingItem(it)}
              onStatusChange={handleStatusChange}
              onOpenFacebookModal={(it) => setFacebookItem(it)}
              onShowToast={showToast}
              onRequestDelete={(it) => setItemToDelete(it)}
            />
          </div>
        )}
      </main>

      {/* Floating Eye-Catching Add Button */}
      <FloatingAddButton
        onAddNewSlot={handleAddNewSlot}
        nextSlotNumber={nextSlotNumber}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/90 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">QUEM VIVEU, SABE!</span>
            <span>• Gerenciador de Publicações PWA para Facebook</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="inline-flex items-center gap-1.5">
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-amber-300 font-bold">
                F1
              </kbd>
              <span>Salvar Alterações</span>
            </span>
            <span className="hidden md:inline">•</span>
            <span>Offline-Ready • Auto-Save</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-blue-400 hover:text-blue-300 transition"
            >
              <span>Topo</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EditModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveItem}
        onRequestDelete={(it) => setItemToDelete(it)}
      />

      <FacebookCopyModal
        item={facebookItem}
        isOpen={!!facebookItem}
        onClose={() => setFacebookItem(null)}
        onShowToast={showToast}
      />

      <DeleteConfirmModal
        item={itemToDelete}
        isOpen={!!itemToDelete}
        onClose={() => setItemToDelete(null)}
        onClearContent={handleClearContent}
        onDeleteCompletely={handleDeleteCompletely}
      />

      <BackupModal
        items={items}
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        onImport={handleImportBackup}
        onReset={handleReset}
        onShowToast={showToast}
      />

      {/* Toast Notification (centered at bottom to avoid overlapping floating button) */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 border border-blue-500/60 text-white text-xs font-semibold shadow-2xl shadow-black/90 animate-in fade-in slide-in-from-bottom-3 backdrop-blur-md">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* PWA Offline indicator */}
      <OfflineIndicator />
    </div>
  );
}
