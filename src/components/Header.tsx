import React from 'react';
import { Tv, ExternalLink, Database, Plus, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  onOpenBackupModal: () => void;
  onAddNewSlot: () => void;
  totalSlots: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBackupModal,
  onAddNewSlot,
  totalSlots,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3.5 w-full md:w-auto justify-between md:justify-start">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 shadow-lg shadow-blue-500/25 p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-amber-400/20 opacity-80" />
              <Tv className="w-6 h-6 text-amber-400 relative z-10 transition-transform group-hover:scale-110" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-1.5 font-sans">
                QUEM VIVEU, SABE!
                <span className="text-amber-400 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 uppercase tracking-widest font-semibold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" /> Facebook
                </span>
              </h1>
            </div>
            <p className="text-xs text-slate-400">
              Controle e fila oficial de publicações • 1 a {totalSlots}
            </p>
          </div>

          {/* Mobile Install button */}
          <div className="md:hidden flex items-center gap-2">
            <PWAInstallButton />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
          <a
            href="https://business.facebook.com/creatorstudio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 border border-blue-500/30 text-blue-300 hover:text-blue-200 text-xs font-medium transition"
            title="Abrir Meta Business Suite / Creator Studio do Facebook"
          >
            <span>Meta Creator Studio</span>
            <ExternalLink className="w-3 h-3 text-blue-400" />
          </a>

          <button
            onClick={onOpenBackupModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium transition"
            title="Backup, Exportar Excel/JSON ou Importar"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Backup /</span> Exportar
          </button>

          <button
            onClick={onAddNewSlot}
            className="relative group flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/30 border border-amber-300 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            title="Adicionar mais um número na fila de publicações"
          >
            <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-950 text-amber-300 group-hover:rotate-90 transition-transform">
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
            </span>
            <span className="tracking-wide uppercase font-black">+ Nova Publicação</span>
          </button>

          <div className="hidden md:flex items-center pl-1">
            <PWAInstallButton />
          </div>
        </div>
      </div>
    </header>
  );
};
