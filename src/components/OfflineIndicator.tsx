import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-full bg-amber-500/95 backdrop-blur-md px-4 py-2 text-xs font-semibold text-slate-950 shadow-2xl border border-amber-300">
      <WifiOff className="w-4 h-4 animate-pulse" />
      <span>Modo Offline — Seus dados salvos localmente continuam disponíveis!</span>
    </div>
  );
};
