
import React from 'react';

interface FrameCategoryScreenProps {
    onCategorySelect: (category: 'caixa' | 'premium' | 'none') => void;
    onBack: () => void;
}

export const FrameCategoryScreen: React.FC<FrameCategoryScreenProps> = ({ onCategorySelect, onBack }) => {
    const categories = [
        {
            id: 'caixa' as const,
            name: 'Linha Caixa',
            description: 'Acabamento moderno e minimalista.',
            icon: 'check_box_outline_blank', // Material Symbol
            details: 'Opções em Madeira, Preta, Branca e Dourada'
        },
        {
            id: 'premium' as const,
            name: 'Linha Premium',
            description: 'Sofisticação e exclusividade.',
            icon: 'stars',
            details: 'Clássicas, Côncavas, Inox e Flutuantes'
        },
        {
            id: 'none' as const,
            name: 'Borda Infinita',
            description: 'Arte pura, sem interferências.',
            icon: 'crop_free',
            details: 'Acabamento padrão em canvas esticado'
        }
    ];

    return (
        <div className="flex-1 flex flex-col px-6 pb-40 max-w-md mx-auto w-full fade-in">
            <div className="py-6">
                <h2 className="text-3xl font-light tracking-tight leading-tight">
                    Escolha o tipo da <span className="font-bold text-charcoal dark:text-white">moldura</span>
                </h2>
                <p className="text-stone-500 mt-2 text-sm">
                    Selecione uma categoria para ver os acabamentos disponíveis.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {categories.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => onCategorySelect(cat.id)}
                        className="group relative flex items-center justify-between p-5 rounded-2xl border border-stone-200 bg-white hover:border-charcoal hover:shadow-lg transition-all duration-300 text-left"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-off-white flex items-center justify-center border border-stone-100 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-charcoal text-2xl">
                                    {cat.icon}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg text-charcoal">{cat.name}</span>
                                <span className="text-xs text-stone-500 font-medium mb-1">{cat.description}</span>
                                <span className="text-[10px] text-gold-accent uppercase tracking-wider">{cat.details}</span>
                            </div>
                        </div>
                        <span className="material-symbols-outlined text-stone-300 group-hover:text-charcoal transition-colors">
                            arrow_forward_ios
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};
