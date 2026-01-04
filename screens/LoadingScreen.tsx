
import React, { useEffect, useState } from 'react';
import { ASSETS } from '../constants';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(onComplete, 500);
    }
  }, [progress, onComplete]);

  return (
    <div className="flex-1 flex flex-col items-center justify-start px-6 pt-4 w-full max-w-md mx-auto">
      <div className="w-full bg-white dark:bg-[#2c281a] rounded-xl p-4 shadow-xl border border-stone-100 dark:border-stone-800 mb-8 relative overflow-hidden">
        <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-900 mb-5">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 opacity-90 grayscale-[20%]"
            style={{ backgroundImage: `url('${ASSETS.abstractArt}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-transparent animate-pulse" />
          <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm animate-spin">sync</span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Processando</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="h-6 w-3/4 shimmer animate-shimmer rounded-md" />
          <div className="flex items-center justify-between">
            <div className="h-4 w-1/3 shimmer animate-shimmer rounded-md opacity-60" />
            <div className="h-4 w-16 shimmer animate-shimmer rounded-md opacity-40" />
          </div>
        </div>
      </div>

      <div className="w-full space-y-4">
        <div className="flex justify-between items-end">
          <p className="text-sm font-medium tracking-tight">Importando dimensões...</p>
          <span className="text-primary text-xs font-bold tracking-widest">{progress}%</span>
        </div>
        <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_10px_rgba(244,192,37,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center gap-3 pt-1">
          <div className="flex -space-x-2 overflow-hidden">
            <div className="w-6 h-6 rounded border border-white dark:border-stone-800 bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[8px]">1</div>
            <div className="w-6 h-6 rounded border border-white dark:border-stone-800 bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-[8px]">2</div>
            <div className="w-6 h-6 rounded border border-white dark:border-stone-800 bg-primary/20 flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-primary text-[10px]">image</span>
            </div>
          </div>
          <p className="text-stone-500 text-xs">
            Carregando variações: <span className="font-semibold text-charcoal dark:text-stone-200">3 de 8</span>
          </p>
        </div>
      </div>
    </div>
  );
};
