
import React from 'react';
import { SIZES } from '../constants';

interface ConfigSizeScreenProps {
  selectedSize: string;
  onSizeSelect: (id: string) => void;
  onContinue: () => void;
}

export const ConfigSizeScreen: React.FC<ConfigSizeScreenProps> = ({ selectedSize, onSizeSelect, onContinue }) => {
  return (
    <div className="flex-1 flex flex-col px-6 pb-40 max-w-md mx-auto w-full">
      <div className="py-6">
        <h2 className="text-3xl font-light tracking-tight leading-tight">
          Qual o tamanho do seu <span className="font-bold text-charcoal dark:text-white">quadro?</span>
        </h2>
        <p className="text-stone-500 mt-2 text-sm">
          Escolha uma das dimensões padrão abaixo para ver o resultado na parede.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {SIZES.map(size => (
          <label
            key={size.id}
            onClick={() => onSizeSelect(size.id)}
            className={`group relative flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-300 ${selectedSize === size.id
                ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800/50 hover:border-primary/50'
              }`}
          >
            <div className="flex items-center gap-4">
              <span className={`material-symbols-outlined text-[28px] transition-colors ${selectedSize === size.id ? 'text-primary' : 'text-stone-400'}`}>
                {selectedSize === size.id ? 'check_circle' : 'photo_frame'}
              </span>
              <div className="flex flex-col">
                <span className="font-semibold text-lg">{size.dimensions}</span>
                <span className="text-xs text-stone-400 font-medium">{size.category}</span>
              </div>
            </div>
            {selectedSize === size.id && (
              <div className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none" />
            )}
          </label>
        ))}
      </div>

      {/* Botão de ação principal - z-50 para ficar acima do menu inferior */}
      {selectedSize && (
        <div className="fixed bottom-0 left-0 right-0 p-6 pb-24 bg-gradient-to-t from-background-light dark:from-background-dark via-background-light/95 dark:via-background-dark/95 to-transparent z-50 animate-slide-up">
          <div className="max-w-md mx-auto w-full">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onContinue();
              }}
              className="w-full bg-mustard hover:bg-[#D4A017] text-charcoal font-bold text-lg py-4 rounded-xl shadow-2xl shadow-mustard/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border-2 border-white/20"
            >
              <span>Continuar para Molduras</span>
              <span className="material-symbols-outlined text-xl">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
