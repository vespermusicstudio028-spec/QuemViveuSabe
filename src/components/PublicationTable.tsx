import React from 'react';
import { PublicationItem, PublicationStatus } from '../types/publication';
import { StatusBadge } from './StatusBadge';
import { Copy, Facebook, Edit3, ExternalLink, Calendar, Video, Plus, Trash2 } from 'lucide-react';
import { copyToClipboard, generateFacebookCopy } from '../utils/facebookCopy';

interface PublicationTableProps {
  items: PublicationItem[];
  onEdit: (item: PublicationItem) => void;
  onStatusChange: (id: number, status: PublicationStatus) => void;
  onOpenFacebookModal: (item: PublicationItem) => void;
  onShowToast: (message: string) => void;
  onRequestDelete: (item: PublicationItem) => void;
}

export const PublicationTable: React.FC<PublicationTableProps> = ({
  items,
  onEdit,
  onStatusChange,
  onOpenFacebookModal,
  onShowToast,
  onRequestDelete,
}) => {
  const handleCopyTitle = async (title: string, id: number) => {
    if (!title) return;
    const ok = await copyToClipboard(title);
    if (ok) {
      onShowToast(`Título #${id} copiado!`);
    }
  };

  const handleCopyFacebook = async (item: PublicationItem) => {
    const text = generateFacebookCopy(item, 'nostalgia_padrao');
    const ok = await copyToClipboard(text);
    if (ok) {
      onShowToast(`Post #${item.id} pronto para Facebook copiado!`);
    }
  };

  const categoryLabels: Record<string, string> = {
    desenho: '📺 Desenho',
    filme: '🎬 Filme',
    maratona: '⚡ Maratona',
    serie: '📼 Série',
    anime: '🎌 Anime',
    outro: '📌 Geral',
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-4 w-16 text-center">#</th>
              <th className="py-3 px-4">Título da Publicação</th>
              <th className="py-3 px-4 w-36">Categoria</th>
              <th className="py-3 px-4 w-40">Status</th>
              <th className="py-3 px-4 w-44">Agendamento</th>
              <th className="py-3 px-4 w-28 text-center">Links</th>
              <th className="py-3 px-4 w-48 text-right">Ações Rápidas</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {items.map((item) => {
              const isFilled = item.title.trim().length > 0;

              return (
                <tr
                  key={item.id}
                  className={`transition-colors hover:bg-slate-800/40 group ${
                    !isFilled ? 'bg-slate-950/30' : ''
                  }`}
                >
                  {/* Number # */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-blue-400 font-bold text-xs border border-slate-700/80 group-hover:border-blue-500/50 group-hover:bg-blue-600/10 transition">
                      {item.id}
                    </span>
                  </td>

                  {/* Title */}
                  <td className="py-3.5 px-4">
                    {isFilled ? (
                      <div className="flex items-center gap-2">
                        <span
                          onClick={() => onEdit(item)}
                          className="font-medium text-slate-100 hover:text-blue-400 cursor-pointer transition"
                        >
                          {item.title}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => onEdit(item)}
                        className="text-xs text-slate-400 hover:text-amber-400 flex items-center gap-1.5 font-medium italic transition py-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Slot livre — Clique para adicionar título real</span>
                      </button>
                    )}
                    {item.notes && (
                      <div className="text-[11px] text-slate-400 truncate max-w-md mt-0.5">
                        Nota: {item.notes}
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="text-xs text-slate-400 font-medium bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700/60">
                      {categoryLabels[item.category] || 'Outro'}
                    </span>
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge
                      status={item.status}
                      onChangeStatus={(s) => onStatusChange(item.id, s)}
                    />
                  </td>

                  {/* Scheduling / Published info */}
                  <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                    {item.scheduledDate ? (
                      <div className="text-amber-400 flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{item.scheduledDate} {item.scheduledTime || ''}</span>
                      </div>
                    ) : item.publishedDate ? (
                      <div className="text-emerald-400 font-medium">
                        Publicado: {item.publishedDate}
                      </div>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>

                  {/* External Links */}
                  <td className="py-3.5 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5">
                      {item.facebookUrl ? (
                        <a
                          href={item.facebookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-md bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 transition"
                          title="Abrir no Facebook"
                        >
                          <Facebook className="w-3.5 h-3.5" />
                        </a>
                      ) : null}
                      {item.videoUrl ? (
                        <a
                          href={item.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1 rounded-md bg-cyan-600/20 text-cyan-400 hover:bg-cyan-600/40 transition"
                          title="Abrir link do vídeo"
                        >
                          <Video className="w-3.5 h-3.5" />
                        </a>
                      ) : null}
                      {!item.facebookUrl && !item.videoUrl && (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </div>
                  </td>

                  {/* Action buttons */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {isFilled && (
                        <>
                          <button
                            onClick={() => handleCopyTitle(item.title, item.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Copiar Título"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onOpenFacebookModal(item)}
                            className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition"
                            title="Gerar Post Facebook"
                          >
                            <Facebook className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => onEdit(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition"
                        title="Editar Detalhes"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onRequestDelete(item)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/50 text-slate-400 hover:text-rose-400 transition"
                        title="Excluir ou limpar esta publicação"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
