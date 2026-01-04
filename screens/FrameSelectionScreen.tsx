
import React from 'react';
import { FRAMES } from '../constants';
import { FrameOption } from '../types';

interface FrameSelectionScreenProps {
  selectedFrameId: string;
  onFrameSelect: (id: string) => void;
  glass: boolean;
  onGlassToggle: (val: boolean) => void;
  onContinue: () => void;
  productFrames?: FrameOption[];
  category?: 'caixa' | 'premium' | 'none';
}

export const FrameSelectionScreen: React.FC<FrameSelectionScreenProps> = ({
  selectedFrameId,
  onFrameSelect,
  glass,
  onGlassToggle,
  onContinue,
  productFrames,
  category
}) => {
  // Se houver molduras do produto, usamos elas, senão as padrão
  let options = (productFrames && productFrames.length > 0) ? productFrames : FRAMES;

  // Filtrar por categoria se fornecida e se não for 'none' (none geralmente pula essa tela, mas por segurança)
  if (category && category !== 'none') {
    options = options.filter(f => f.category === category);
  }

  const currentFrame = options.find(f => f.frameId === selectedFrameId || f.id === selectedFrameId) || options[0];

  return (
    <div className="flex-1 flex flex-col px-6 pb-40 max-w-md mx-auto w-full overflow-y-auto hide-scrollbar fade-in">
      <div className="pt-6 pb-4">
        <h2 className="font-serif text-3xl mb-2">Acabamento</h2>
        <p className="text-charcoal/50 text-sm">
          Selecione a moldura disponível para este quadro.
        </p>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {options.map(frame => {
          const fid = frame.frameId || frame.id;
          const isSelected = selectedFrameId === fid;
          return (
            <label
              key={fid}
              onClick={() => onFrameSelect(fid)}
              className={`group relative flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${isSelected
                ? 'border-charcoal bg-white shadow-md'
                : 'border-border-soft bg-white/50'
                }`}
            >
              <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-luxury-gray">
                <img src={frame.framePreviewImageUrl || frame.imageUrl} className="w-full h-full object-cover" alt={frame.frameName || frame.name} />
              </div>

              <div className="flex-1">
                <h3 className="font-bold text-sm">{frame.frameName || frame.name}</h3>
                <p className="text-[10px] text-charcoal/40 uppercase tracking-widest mt-0.5">
                  {frame.frameMaterial || frame.description || 'Material Nobre'}
                </p>
                {frame.framePriceDelta ? (
                  <span className="text-xs font-semibold text-gold-accent mt-1 block">+ R$ {frame.framePriceDelta.toFixed(2)}</span>
                ) : null}
              </div>

              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-gold-accent' : 'border-stone-200'}`}>
                {isSelected && <div className="w-2.5 h-2.5 bg-gold-accent rounded-full" />}
              </div>
            </label>
          );
        })}

        <div className="mt-6">
          <label className="text-[10px] font-bold uppercase tracking-widest text-charcoal/30 mb-3 block">Proteção Extra</label>
          <label className={`flex items-center p-4 rounded-2xl border cursor-pointer transition-all ${glass ? 'border-charcoal bg-white shadow-sm' : 'border-border-soft'
            }`}>
            <span className="material-symbols-outlined mr-4 text-gold-accent">shield</span>
            <div className="flex-1">
              <span className="font-bold text-sm">Proteção com Vidro</span>
              <span className="block text-[10px] text-charcoal/40 uppercase tracking-tighter">Acrílico Premium Anti-Reflexo</span>
            </div>
            <input
              type="checkbox"
              checked={glass}
              onChange={(e) => onGlassToggle(e.target.checked)}
              className="w-5 h-5 rounded border-stone-300 text-gold-accent focus:ring-gold-accent"
            />
          </label>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 pb-12 bg-gradient-to-t from-off-white via-off-white to-transparent z-50">
        <div className="max-w-md mx-auto w-full">
          <button
            onClick={onContinue}
            className="w-full bg-mustard text-charcoal font-bold py-4 rounded-xl shadow-2xl transition-all flex items-center justify-center gap-2 btn-luxury"
          >
            <span>Próxima Etapa</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
};
