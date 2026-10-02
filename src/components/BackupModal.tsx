import React, { useRef, useState } from 'react';
import { PublicationItem } from '../types/publication';
import { X, Download, Upload, FileSpreadsheet, RotateCcw, AlertTriangle, CheckCircle, Database } from 'lucide-react';
import { exportToJson, exportToCsv, parseJsonFile } from '../utils/exportImport';

interface BackupModalProps {
  items: PublicationItem[];
  isOpen: boolean;
  onClose: () => void;
  onImport: (newItems: PublicationItem[]) => void;
  onReset: () => void;
  onShowToast: (msg: string) => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  items,
  isOpen,
  onClose,
  onImport,
  onReset,
  onShowToast,
}) => {
  if (!isOpen) return null;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleExportJson = () => {
    exportToJson(items);
    onShowToast('Arquivo de backup JSON gerado com sucesso!');
  };

  const handleExportCsv = () => {
    exportToCsv(items);
    onShowToast('Planilha CSV gerada para download!');
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const parsed = await parseJsonFile(file);
      onImport(parsed);
      onShowToast(`Backup importado com sucesso! (${parsed.length} itens carregados)`);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Erro ao importar backup.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleResetConfirm = () => {
    onReset();
    onShowToast('Lista restaurada com sucesso!');
    setConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Backup e Exportação de Dados
              </h2>
              <p className="text-xs text-slate-400">Garanta a segurança das suas 100+ publicações</p>
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
          {/* Export Options */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Exportar Seus Dados:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleExportJson}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-blue-500 hover:bg-blue-950/20 transition flex items-center gap-3 text-left group"
              >
                <div className="p-2 rounded-lg bg-blue-600/20 text-blue-400 group-hover:scale-110 transition-transform">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Baixar JSON</div>
                  <div className="text-[11px] text-slate-400">Backup completo do app</div>
                </div>
              </button>

              <button
                onClick={handleExportCsv}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 hover:bg-emerald-950/20 transition flex items-center gap-3 text-left group"
              >
                <div className="p-2 rounded-lg bg-emerald-600/20 text-emerald-400 group-hover:scale-110 transition-transform">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Baixar CSV</div>
                  <div className="text-[11px] text-slate-400">Abrir no Excel / Sheets</div>
                </div>
              </button>
            </div>
          </div>

          {/* Import Option */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Restaurar de um Arquivo de Backup:
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-xl bg-slate-950 border border-dashed border-slate-700 hover:border-blue-500 hover:bg-slate-800/50 transition flex items-center justify-center gap-2.5 text-xs font-semibold text-slate-300 hover:text-white"
            >
              <Upload className="w-4 h-4 text-blue-400" />
              <span>Importar arquivo JSON de backup</span>
            </button>
          </div>

          {/* Reset Danger Zone */}
          <div className="pt-3 border-t border-slate-800/80">
            {!confirmReset ? (
              <button
                type="button"
                onClick={() => setConfirmReset(true)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition py-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restaurar lista original padrão (1-100)</span>
              </button>
            ) : (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 space-y-2">
                <div className="flex items-start gap-2 text-rose-300 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 text-rose-400" />
                  <span>Tem certeza? Todas as edições e alterações salvas serão substituídas pela lista padrão original de 1 a 100!</span>
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1 rounded-lg bg-slate-800 text-xs font-medium text-slate-300 hover:bg-slate-700"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleResetConfirm}
                    className="px-3 py-1 rounded-lg bg-rose-600 text-xs font-bold text-white hover:bg-rose-500 shadow"
                  >
                    Sim, restaurar original
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
