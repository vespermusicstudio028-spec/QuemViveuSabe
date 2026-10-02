import React from 'react';
import { PublicationItem } from '../types/publication';
import { AlertTriangle, Trash2, Eraser, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  item: PublicationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onClearContent: (id: number) => void;
  onDeleteCompletely: (id: number) => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  item,
  isOpen,
  onClose,
  onClearContent,
  onDeleteCompletely,
}) => {
  if (!isOpen || !item) return null;

  const isFilled = item.title && item.title.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-rose-900/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 bg-rose-950/40 border-b border-rose-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-400">
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Excluir Publicação #{item.id}</h3>
              <p className="text-[11px] text-rose-300/80">Escolha como deseja proceder</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-sm text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
            <div className="text-[11px] font-semibold uppercase text-slate-400">Item Selecionado:</div>
            <div className="text-white font-bold mt-0.5 line-clamp-2">
              #{item.id} — {item.title || '(Slot Vago)'}
            </div>
            {item.status && (
              <div className="text-[11px] text-slate-400 mt-1">
                Status atual: <span className="capitalize text-slate-300">{item.status}</span>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Você pode <strong className="text-slate-200">limpar o conteúdo</strong> mantendo o número #{item.id} na fila como vago, ou <strong className="text-rose-300">remover o slot por completo</strong>.
          </p>

          <div className="space-y-2.5 pt-1">
            {/* Option 1: Clear content but keep slot number */}
            {isFilled && (
              <button
                onClick={() => {
                  onClearContent(item.id);
                  onClose();
                }}
                className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-amber-500/60 hover:bg-amber-950/15 transition flex items-center gap-3 text-left group cursor-pointer"
              >
                <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                  <Eraser className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                    Limpar Conteúdo (Tornar Vago)
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Apaga o título e dados, mas mantém o #{item.id} na fila de 1 a 100
                  </div>
                </div>
              </button>
            )}

            {/* Option 2: Completely delete slot from sequence */}
            <button
              onClick={() => {
                onDeleteCompletely(item.id);
                onClose();
              }}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-rose-500/60 hover:bg-rose-950/20 transition flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Trash2 className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-rose-300 group-hover:text-rose-200 transition-colors">
                  Excluir Slot Definitivamente
                </div>
                <div className="text-[11px] text-slate-400">
                  Remove totalmente o número #{item.id} da sua lista de publicações
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
