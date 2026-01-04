
import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onBack, rightAction }) => {
  return (
    <header className="sticky top-0 z-50 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md px-4 py-4 flex flex-col items-center">
      <div className="w-full flex items-center justify-between mb-2">
        {onBack ? (
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
        ) : <div className="w-10" />}
        
        <h1 className="text-xs font-bold tracking-[0.2em] uppercase opacity-60 flex-1 text-center">
          {title}
        </h1>
        
        <div className="w-10 flex justify-end">
          {rightAction}
        </div>
      </div>
      {subtitle && <p className="text-[10px] font-bold text-primary uppercase tracking-wider">{subtitle}</p>}
    </header>
  );
};
