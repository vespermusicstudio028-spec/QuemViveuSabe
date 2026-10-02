import React, { useState, useEffect } from 'react';
import { PublicationItem, PublicationStatus, PublicationCategory } from '../types/publication';
import { X, Save, Calendar, Clock, Film, Facebook, Video, FileText, CheckCircle2, Sparkles, Trash2 } from 'lucide-react';
import { generateFacebookCopy } from '../utils/facebookCopy';

interface EditModalProps {
  item: PublicationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: PublicationItem) => void;
  onRequestDelete?: (item: PublicationItem) => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  onRequestDelete,
}) => {
  if (!isOpen || !item) return null;

  const [title, setTitle] = useState(item.title);
  const [status, setStatus] = useState<PublicationStatus>(item.status);
  const [category, setCategory] = useState<PublicationCategory>(item.category);
  const [scheduledDate, setScheduledDate] = useState(item.scheduledDate || '');
  const [scheduledTime, setScheduledTime] = useState(item.scheduledTime || '');
  const [publishedDate, setPublishedDate] = useState(item.publishedDate || '');
  const [videoUrl, setVideoUrl] = useState(item.videoUrl || '');
  const [facebookUrl, setFacebookUrl] = useState(item.facebookUrl || '');
  const [caption, setCaption] = useState(item.caption || '');
  const [notes, setNotes] = useState(item.notes || '');

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setStatus(item.status);
      setCategory(item.category);
      setScheduledDate(item.scheduledDate || '');
      setScheduledTime(item.scheduledTime || '');
      setPublishedDate(item.publishedDate || '');
      setVideoUrl(item.videoUrl || '');
      setFacebookUrl(item.facebookUrl || '');
      setCaption(item.caption || '');
      setNotes(item.notes || '');
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...item,
      title: title.trim(),
      status,
      category,
      scheduledDate,
      scheduledTime,
      publishedDate,
      videoUrl: videoUrl.trim(),
      facebookUrl: facebookUrl.trim(),
      caption: caption.trim(),
      notes: notes.trim(),
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  // Listen for F1 key shortcut to save alterations
  useEffect(() => {
    if (!isOpen || !item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F1' || e.code === 'F1') {
        e.preventDefault();
        e.stopPropagation();
        onSave({
          ...item,
          title: title.trim(),
          status,
          category,
          scheduledDate,
          scheduledTime,
          publishedDate,
          videoUrl: videoUrl.trim(),
          facebookUrl: facebookUrl.trim(),
          caption: caption.trim(),
          notes: notes.trim(),
          updatedAt: new Date().toISOString(),
        });
        onClose();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, item, title, status, category, scheduledDate, scheduledTime, publishedDate, videoUrl, facebookUrl, caption, notes, onSave, onClose]);

  const handleGenerateTemplateCaption = () => {
    const generated = generateFacebookCopy({ ...item, title }, 'nostalgia_padrao');
    setCaption(generated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-blue-900/40">
              #{item.id}
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Editar Publicação #{item.id}
              </h2>
              <p className="text-xs text-slate-400">Página "QUEM VIVEU, SABE!" no Facebook</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Título da Publicação (Exato como sairá no post)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título real da publicação..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Status and Category in 2 columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Status Atual
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PublicationStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="draft">📝 Rascunho / Na Fila</option>
                <option value="ready">🎬 Vídeo Pronto para Postar</option>
                <option value="scheduled">⏰ Agendado no Meta/Facebook</option>
                <option value="published">✅ Publicado no Facebook</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Categoria
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PublicationCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="desenho">📺 Desenho Animado</option>
                <option value="filme">🎬 Filme</option>
                <option value="maratona">⚡ Maratona Especial</option>
                <option value="serie">📼 Série / Live-Action</option>
                <option value="anime">🎌 Anime / Animação Japonesa</option>
                <option value="outro">📌 Outro / Geral</option>
              </select>
            </div>
          </div>

          {/* Dates row */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Datas e Horários
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Data Agendada</label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Horário Agendado</label>
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Data que foi Publicado</label>
                <input
                  type="date"
                  value={publishedDate}
                  onChange={(e) => setPublishedDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* URLs row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Video className="w-3.5 h-3.5 text-cyan-400" /> Link do Vídeo (Drive / Arquivo)
              </label>
              <input
                type="url"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="https://drive.google.com/..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Facebook className="w-3.5 h-3.5 text-blue-400" /> Link do Post no Facebook
              </label>
              <input
                type="url"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Custom Caption */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" /> Legenda para o Facebook
              </label>
              <button
                type="button"
                onClick={handleGenerateTemplateCaption}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium transition"
              >
                <Sparkles className="w-3 h-3" />
                <span>Preencher com Modelo Nostálgico</span>
              </button>
            </div>
            <textarea
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Deixe em branco para usar o modelo automático da página ou escreva uma legenda personalizada..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          {/* Internal Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Notas e Observações Internas
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Dublagem clássica da Cinevídeo, cortar primeiros 15s de vinheta..."
              className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Buttons Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            {onRequestDelete ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onRequestDelete(item);
                }}
                className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-900/60 text-rose-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                title="Excluir ou limpar esta publicação"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Excluir / Limpar</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-sm font-semibold text-slate-300 transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                title="Salvar Alterações (Atalho: Pressione F1 no teclado)"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-600/30 flex items-center gap-2 transition hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Alterações</span>
                <kbd className="ml-1.5 px-2 py-0.5 rounded-md bg-blue-700/90 border border-blue-400/50 text-[11px] font-mono font-bold text-white shadow-inner group-hover:bg-blue-800 transition">
                  F1
                </kbd>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
