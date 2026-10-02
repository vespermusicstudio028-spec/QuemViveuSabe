import React, { useState } from 'react';
import { PublicationItem } from '../types/publication';
import { X, Copy, Check, Facebook, ExternalLink, Sparkles, Tv } from 'lucide-react';
import { generateFacebookCopy, copyToClipboard, CopyStyle } from '../utils/facebookCopy';

interface FacebookCopyModalProps {
  item: PublicationItem | null;
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const FacebookCopyModal: React.FC<FacebookCopyModalProps> = ({
  item,
  isOpen,
  onClose,
  onShowToast,
}) => {
  if (!isOpen || !item) return null;

  const [style, setStyle] = useState<CopyStyle>('nostalgia_padrao');
  const [copied, setCopied] = useState(false);

  const textToCopy = generateFacebookCopy(item, style);

  const handleCopy = async () => {
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopied(true);
      onShowToast(`Texto do post #${item.id} copiado para a área de transferência!`);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyOnlyTitle = async () => {
    const ok = await copyToClipboard(item.title);
    if (ok) {
      onShowToast(`Título #${item.id} copiado!`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <Facebook className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Publicação #{item.id} para Facebook
              </h2>
              <p className="text-xs text-slate-400">Página: QUEM VIVEU, SABE!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Template Style Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Escolha o Estilo do Texto:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setStyle('nostalgia_padrao')}
                className={`p-2 rounded-xl text-xs font-semibold border transition ${
                  style === 'nostalgia_padrao'
                    ? 'bg-blue-600/25 border-blue-500 text-blue-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                ✨ Nostalgia Padrão
              </button>
              <button
                type="button"
                onClick={() => setStyle('filme_cine')}
                className={`p-2 rounded-xl text-xs font-semibold border transition ${
                  style === 'filme_cine'
                    ? 'bg-blue-600/25 border-blue-500 text-blue-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                🍿 Cine Nostalgia
              </button>
              <button
                type="button"
                onClick={() => setStyle('desenho_infancia')}
                className={`p-2 rounded-xl text-xs font-semibold border transition ${
                  style === 'desenho_infancia'
                    ? 'bg-blue-600/25 border-blue-500 text-blue-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                📺 Hora do Desenho
              </button>
              <button
                type="button"
                onClick={() => setStyle('curto_direto')}
                className={`p-2 rounded-xl text-xs font-semibold border transition ${
                  style === 'curto_direto'
                    ? 'bg-blue-600/25 border-blue-500 text-blue-300 shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                ⚡ Curto & Direto
              </button>
            </div>
          </div>

          {/* Facebook Post Preview Mockup */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 shadow-inner space-y-3">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-800/80">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white border-2 border-amber-400">
                <Tv className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="font-bold text-sm text-white flex items-center gap-1.5">
                  QUEM VIVEU, SABE!
                  <span className="w-3.5 h-3.5 rounded-full bg-blue-500 flex items-center justify-center text-[9px] text-white">✓</span>
                </div>
                <div className="text-[11px] text-slate-400">Página de Nostalgia • Agora mesmo 🌐</div>
              </div>
            </div>

            <div className="text-xs text-slate-200 whitespace-pre-wrap font-sans leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800/50">
              {textToCopy}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
            <button
              onClick={handleCopyOnlyTitle}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 hover:text-white transition flex items-center justify-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copiar Somente Título</span>
            </button>

            <div className="flex items-center gap-2">
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-blue-300 hover:text-blue-200 transition flex items-center justify-center gap-1.5"
              >
                <span>Ir para Facebook</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={handleCopy}
                className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98]'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado com Sucesso!' : 'Copiar Texto Completo'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
