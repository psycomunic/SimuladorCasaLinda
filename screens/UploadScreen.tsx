
import React, { useRef } from 'react';

interface UploadScreenProps {
  onImageSelect: (data: string) => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          onImageSelect(ev.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col px-6 pt-6 pb-8 max-w-md mx-auto w-full">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-extrabold tracking-tight mb-3">Seu ambiente</h2>
        <p className="text-base font-medium text-stone-600 dark:text-stone-400 leading-relaxed">
          Para o melhor resultado, fotografe a parede de frente e com boa iluminação.
        </p>
      </div>

      <div
        onClick={() => fileInputRef.current?.click()}
        className="flex-1 flex flex-col justify-center min-h-[320px] relative mb-8 group cursor-pointer"
      >
        <div className="relative flex flex-col items-center justify-center w-full h-full min-h-[320px] rounded-2xl border-2 border-dashed border-[#e8e2ce] dark:border-stone-700 bg-[#fcfbf8] dark:bg-stone-900/50 hover:border-primary transition-all duration-300 overflow-hidden shadow-sm">
          <div className="flex flex-col items-center p-6 text-center z-10 transition-transform duration-300 group-hover:scale-105">
            <div className="mb-6 p-5 rounded-full bg-white dark:bg-stone-800 shadow-sm ring-1 ring-stone-100 dark:ring-stone-700 group-hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[40px] text-primary">add_a_photo</span>
            </div>
            <p className="text-lg font-bold mb-2 tracking-tight">Área de Upload</p>
            <p className="text-sm text-stone-500 dark:text-stone-400 max-w-[200px]">
              Toque para capturar ou selecionar uma imagem
            </p>
          </div>

          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-stone-300 dark:border-stone-600 group-hover:border-primary transition-colors" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-stone-300 dark:border-stone-600 group-hover:border-primary transition-colors" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-stone-300 dark:border-stone-600 group-hover:border-primary transition-colors" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-stone-300 dark:border-stone-600 group-hover:border-primary transition-colors" />
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="flex flex-col gap-4 mt-auto">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-3 w-full h-14 bg-mustard hover:bg-[#D4A017] text-charcoal font-bold rounded-xl transition-all shadow-lg shadow-mustard/20 active:scale-[0.98]"
        >
          <span className="material-symbols-outlined">photo_camera</span>
          <span>Tirar foto agora</span>
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center justify-center gap-3 w-full h-14 bg-transparent border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-white/5 text-stone-800 dark:text-stone-200 font-bold rounded-xl transition-all"
        >
          <span className="material-symbols-outlined">image</span>
          <span>Escolher da galeria</span>
        </button>
      </div>
    </div>
  );
};
