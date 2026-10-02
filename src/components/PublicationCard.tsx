import React from 'react';
import { PublicationItem, PublicationStatus } from '../types/publication';
import { StatusBadge } from './StatusBadge';
import { Copy, Facebook, Edit3, ExternalLink, Calendar, Video, Sparkles, Check, Trash2 } from 'lucide-react';
import { generateFacebookCopy, copyToClipboard } from '../utils/facebookCopy';

interface PublicationCardProps {
  item: PublicationItem;
  onEdit: (item: PublicationItem) => void;
  onStatusChange: (id: number, status: PublicationStatus) => void;
  onOpenFacebookModal: (item: PublicationItem) => void;
  onShowToast: (message: string) => void;
  onRequestDelete: (item: PublicationItem) => void;
}

export const PublicationCard: React.FC<PublicationCardProps> = ({
  item,
  onEdit,
  onStatusChange,
  onOpenFacebookModal,
  onShowToast,
  onRequestDelete,
}) => {
  const isFilled = item.title.trim().length > 0;

  const handleCopyTitle = async () => {
    if (!item.title) return;
    const ok = await copyToClipboard(item.title);
    if (ok) {
      onShowToast(`Título #${item.id} copiado para a área de transferência!`);
    }
  };

  const handleQuickCopyFacebook = async () => {
    const text = generateFacebookCopy(item, 'nostalgia_padrao');
    const ok = await copyToClipboard(text);
    if (ok) {
      onShowToast(`Texto do post #${item.id} pronto para o Facebook copiado!`);
    }
  };

  const categoryLabels: Record<string, string> = {
    desenho: '📺 Desenho Animado',
    filme: '🎬 Filme Clássico',
    maratona: '⚡ Maratona',
    serie: '📼 Série / TV',
    anime: '🎌 Anime',
    outro: '📌 Geral',
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
        isFilled
          ? 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:shadow-xl hover:shadow-black/50'
          : 'bg-slate-950/60 border-dashed border-slate-800 hover:border-slate-600'
      }`}
    >
      {/* Top accent bar based on status */}
      <div
        className={`h-1.5 w-full ${
          item.status === 'published'
            ? 'bg-emerald-500'
            : item.status === 'scheduled'
            ? 'bg-amber-500'
            : item.status === 'ready'
            ? 'bg-cyan-500'
            : isFilled
            ? 'bg-blue-600'
            : 'bg-slate-800'
        }`}
      />

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between gap-4">
        {/* Header row: Number + Category + Status */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center min-w-8 h-8 px-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-black text-sm shadow-md shadow-blue-900/30">
                #{item.id}
              </span>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md border border-slate-700/60">
                {categoryLabels[item.category] || 'Outro'}
              </span>
            </div>

            <StatusBadge
              status={item.status}
              onChangeStatus={(s) => onStatusChange(item.id, s)}
            />
          </div>

          {/* Title */}
          <div className="mt-1">
            {isFilled ? (
              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
                {item.title}
              </h3>
            ) : (
              <button
                onClick={() => onEdit(item)}
                className="w-full py-4 text-center rounded-xl border border-dashed border-slate-700/80 bg-slate-900/40 hover:bg-slate-800/60 text-slate-400 hover:text-amber-400 text-xs font-semibold flex items-center justify-center gap-2 transition"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Slot Vago — Clique para definir o título real</span>
              </button>
            )}
          </div>

          {/* Meta Information (Dates, Notes, Links) */}
          {isFilled && (
            <div className="mt-3 space-y-1.5 text-xs text-slate-400">
              {item.scheduledDate && (
                <div className="flex items-center gap-1.5 text-amber-300/90 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    Agendado para: {item.scheduledDate} {item.scheduledTime ? `às ${item.scheduledTime}` : ''}
                  </span>
                </div>
              )}

              {item.publishedDate && (
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Publicado em: {item.publishedDate}</span>
                </div>
              )}

              {item.notes && (
                <p className="text-[11px] text-slate-400 line-clamp-1 italic bg-slate-950/60 p-1.5 rounded-lg border border-slate-800">
                  Nota: {item.notes}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action Row */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          {/* External links */}
          <div className="flex items-center gap-1.5">
            {item.facebookUrl && (
              <a
                href={item.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition"
                title="Ver postagem no Facebook"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
            )}
            {item.videoUrl && (
              <a
                href={item.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/30 transition"
                title="Link do vídeo (Drive/YouTube/Arquivo)"
              >
                <Video className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Quick buttons */}
          <div className="flex items-center gap-1.5 ml-auto">
            {isFilled && (
              <>
                <button
                  onClick={handleCopyTitle}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1 transition"
                  title="Copiar apenas o título"
                >
                  <Copy className="w-3 h-3 text-slate-400" />
                  <span className="hidden sm:inline">Título</span>
                </button>

                <button
                  onClick={() => onOpenFacebookModal(item)}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-semibold flex items-center gap-1 transition"
                  title="Gerar e copiar post com emojis e hashtags da página"
                >
                  <Facebook className="w-3 h-3 text-blue-400" />
                  <span>Gerar Post</span>
                </button>
              </>
            )}

            <button
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition"
              title="Editar informações do slot"
            >
              <Edit3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => onRequestDelete(item)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 hover:border-rose-900/60 transition"
              title="Excluir ou limpar esta publicação"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
