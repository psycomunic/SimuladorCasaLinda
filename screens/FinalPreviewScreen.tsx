
import React from 'react';
import { SimulationConfig, ProductData } from '../types';

interface FinalPreviewScreenProps {
  config: SimulationConfig;
  resultImage: string;
  product: ProductData;
  onRestart: () => void;
}

export const FinalPreviewScreen: React.FC<FinalPreviewScreenProps> = ({ config, resultImage, product, onRestart }) => {

  const handleShare = () => {
    const text = `Confira a simulação do quadro "${product.productName}" que fiz para minha parede!\n\nTamanho: ${config.size}cm\n\nQuero finalizar o pedido!`;
    const waUrl = `https://wa.me/${product.sellerWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = resultImage;
    link.download = `simulacao-${product.productName}.png`;
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col px-6 pt-4 pb-24 max-w-md mx-auto w-full animate-in fade-in duration-700 overflow-y-auto hide-scrollbar">
      <div className="mb-6 text-center">
        <h2 className="font-serif text-3xl mb-1">Simulação Finalizada</h2>
        <p className="text-[10px] uppercase tracking-[0.2em] text-gold-accent font-bold">Powered by Nano Banana AI</p>
      </div>

      <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl mb-8 border border-border-soft group">
        <img src={resultImage} className="w-full h-full object-cover" alt="Simulação" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
          <p className="text-white text-[10px] font-bold uppercase tracking-widest">Toque para ampliar</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 border border-border-soft space-y-6 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-serif text-xl">{product.productName}</h3>
            <p className="text-[10px] text-charcoal/40 uppercase font-bold tracking-widest">{config.size} cm • {config.glass ? 'Com Vidro' : 'Borda Infinita'}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-charcoal/30 block mb-1">CÓD: {product.productId}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 py-3 px-4 border border-border-soft rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gray transition-colors"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Salvar Foto
          </button>
          <button
            onClick={onRestart}
            className="flex items-center justify-center gap-2 py-3 px-4 border border-border-soft rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-luxury-gray transition-colors"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refazer
          </button>
        </div>

        <button
          onClick={handleShare}
          className="w-full py-4 bg-whatsapp text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl btn-luxury hover:bg-[#1DA851] transition-colors"
        >
          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" /></svg>
          Finalizar via WhatsApp
        </button>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={() => window.location.href = product.returnUrl}
          className="text-charcoal/30 hover:text-charcoal text-[10px] font-bold uppercase tracking-[0.3em] transition-colors"
        >
          Voltar ao Catálogo
        </button>
      </div>
    </div>
  );
};
