import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface FloatingAddButtonProps {
  onAddNewSlot: () => void;
  nextSlotNumber: number;
}

export const FloatingAddButton: React.FC<FloatingAddButtonProps> = ({
  onAddNewSlot,
  nextSlotNumber,
}) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center">
      {/* Outer pulsing neon aura */}
      <div className="relative group">
        {/* Animated glowing backdrop ring */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-400 via-rose-500 to-cyan-400 rounded-full blur-md opacity-85 group-hover:opacity-100 animate-pulse transition duration-500" />

        {/* Main prominent button */}
        <button
          onClick={onAddNewSlot}
          className="relative flex items-center gap-3 bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 font-extrabold px-5 py-3.5 sm:px-6 sm:py-4 rounded-full shadow-2xl shadow-amber-500/50 hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-white/60 cursor-pointer"
          title={`Adicionar publicação no Slot #${nextSlotNumber}`}
        >
          {/* Eye-catching big circular + icon badge */}
          <span className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-950 text-amber-300 shadow-md transform group-hover:rotate-90 transition-transform duration-300">
            <Plus className="w-6 h-6 sm:w-7 sm:h-7 stroke-[3.5]" />
          </span>

          {/* Button label */}
          <div className="text-left flex flex-col">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black uppercase tracking-wider text-slate-950">
              <span>Nova Publicação</span>
              <Sparkles className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
            </div>
            <span className="text-[10px] sm:text-[11px] font-bold text-amber-950/80">
              Adicionar Slot #{nextSlotNumber}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};
