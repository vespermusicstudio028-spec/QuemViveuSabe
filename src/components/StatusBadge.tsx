import React from 'react';
import { PublicationStatus } from '../types/publication';
import { CheckCircle2, Clock, Film, FileEdit, ChevronDown } from 'lucide-react';

interface StatusBadgeProps {
  status: PublicationStatus;
  onChangeStatus?: (status: PublicationStatus) => void;
  interactive?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  onChangeStatus,
  interactive = true,
}) => {
  const configs: Record<PublicationStatus, { label: string; bg: string; text: string; border: string; icon: React.ComponentType<{ className?: string }> }> = {
    published: {
      label: 'Publicado',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      border: 'border-emerald-500/30',
      icon: CheckCircle2,
    },
    scheduled: {
      label: 'Agendado',
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      border: 'border-amber-500/30',
      icon: Clock,
    },
    ready: {
      label: 'Vídeo Pronto',
      bg: 'bg-cyan-500/15',
      text: 'text-cyan-400',
      border: 'border-cyan-500/30',
      icon: Film,
    },
    draft: {
      label: 'Rascunho / Fila',
      bg: 'bg-slate-700/25',
      text: 'text-slate-300',
      border: 'border-slate-600/40',
      icon: FileEdit,
    },
  };

  const current = configs[status] || configs.draft;
  const Icon = current.icon;

  if (!interactive || !onChangeStatus) {
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${current.bg} ${current.text} ${current.border}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{current.label}</span>
      </span>
    );
  }

  return (
    <div className="relative inline-block group">
      <select
        value={status}
        onChange={(e) => onChangeStatus(e.target.value as PublicationStatus)}
        className={`appearance-none cursor-pointer pl-7 pr-6 py-1 rounded-full text-xs font-semibold border transition-all ${current.bg} ${current.text} ${current.border} focus:outline-none focus:ring-1 focus:ring-blue-500`}
      >
        <option value="draft" className="bg-slate-900 text-slate-200">
          📝 Rascunho / Fila
        </option>
        <option value="ready" className="bg-slate-900 text-cyan-300">
          🎬 Vídeo Pronto
        </option>
        <option value="scheduled" className="bg-slate-900 text-amber-300">
          ⏰ Agendado
        </option>
        <option value="published" className="bg-slate-900 text-emerald-300">
          ✅ Publicado
        </option>
      </select>
      <Icon className={`w-3.5 h-3.5 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none ${current.text}`} />
      <ChevronDown className={`w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 ${current.text}`} />
    </div>
  );
};
