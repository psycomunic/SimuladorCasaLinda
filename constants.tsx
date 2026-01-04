
import { FrameOption, SizeOption } from './types';

export const ASSETS = {
  abstractArt: '/assets/abstract.jpg',
  frameBlack: '/assets/frame-black.jpg',
  frameWood: '/assets/frame-wood.jpg',
  frameGold: '/assets/frame-gold.jpg',
  frameDetails: '/assets/frame-details.jpg'
};

export const SIZES: SizeOption[] = [
  { id: '40x20', dimensions: '40x20 cm', category: 'Panorâmico Pequeno' },
  { id: '55x30', dimensions: '55x30 cm', category: 'Médio' },
  { id: '85x55', dimensions: '85x55 cm', category: 'Padrão Sala' },
  { id: '115x75', dimensions: '115x75 cm', category: 'Grande' },
  { id: '145x95', dimensions: '145x95 cm', category: 'Extra Grande' },
  { id: '175x100', dimensions: '175x100 cm', category: 'Panorâmico Grande' },
];

export const FRAMES: FrameOption[] = [
  {
    id: 'none',
    frameId: 'none',
    name: 'Sem Moldura',
    frameName: 'Sem Moldura',
    description: 'Acabamento padrão em canvas esticado.',
    price: 0,
    framePriceDelta: 0,
    imageUrl: ASSETS.abstractArt,
    framePreviewImageUrl: ASSETS.abstractArt,
    depth: 'N/A',
    category: 'none'
  },
  // --- CAIXA ---
  {
    id: 'black',
    frameId: 'black',
    name: 'Caixa - Preta',
    frameName: 'Caixa - Preta',
    description: 'Madeira Maciça • Textura Fosca',
    price: 45,
    framePriceDelta: 45,
    imageUrl: ASSETS.frameBlack,
    framePreviewImageUrl: ASSETS.frameBlack,
    depth: '2cm',
    frameMaterial: 'Madeira Maciça',
    category: 'caixa'
  },
  {
    id: 'white',
    frameId: 'white',
    name: 'Caixa - Branca',
    frameName: 'Caixa - Branca',
    description: 'Acabamento Clean • Minimalista',
    price: 45,
    framePriceDelta: 45,
    imageUrl: ASSETS.frameBlack, // Placeholder (would be white)
    framePreviewImageUrl: ASSETS.frameBlack,
    depth: '2cm',
    frameMaterial: 'Madeira Laqueada',
    category: 'caixa'
  },
  {
    id: 'wood-box',
    frameId: 'wood-box',
    name: 'Caixa - Madeira',
    frameName: 'Caixa - Madeira',
    description: 'Tom Natural • Aconchego',
    price: 55,
    framePriceDelta: 55,
    imageUrl: ASSETS.frameWood,
    framePreviewImageUrl: ASSETS.frameWood,
    depth: '2cm',
    frameMaterial: 'Madeira Natural',
    category: 'caixa'
  },
  {
    id: 'gold-box',
    frameId: 'gold-box',
    name: 'Caixa - Dourada',
    frameName: 'Caixa - Dourada',
    description: 'Toque de Brilho • Sofisticação',
    price: 65,
    framePriceDelta: 65,
    imageUrl: ASSETS.frameGold, // Placeholder (would be simple gold box)
    framePreviewImageUrl: ASSETS.frameGold,
    depth: '2cm',
    frameMaterial: 'Alumínio Dourado',
    category: 'caixa'
  },

  // --- PREMIUM ---
  {
    id: 'classic-gold',
    frameId: 'classic-gold',
    name: 'Clássica - Dourada',
    frameName: 'Clássica - Dourada',
    description: 'Alumínio Escovado • Elegante',
    price: 85,
    framePriceDelta: 85,
    imageUrl: ASSETS.frameGold,
    framePreviewImageUrl: ASSETS.frameGold,
    depth: '3cm',
    frameMaterial: 'Alumínio Escovado',
    category: 'premium'
  },
  {
    id: 'concave',
    frameId: 'concave',
    name: 'Côncava',
    frameName: 'Coleção Côncava',
    description: 'Design Curvo • Profundidade',
    price: 120,
    framePriceDelta: 120,
    imageUrl: ASSETS.frameDetails, // Placeholder
    framePreviewImageUrl: ASSETS.frameDetails,
    depth: '4cm',
    frameMaterial: 'Madeira Trabalhada',
    category: 'premium'
  },
  {
    id: 'floating',
    frameId: 'floating',
    name: 'Flutuante',
    frameName: 'Coleção Flutuante',
    description: 'Efeito Suspenso • Moderno',
    price: 150,
    framePriceDelta: 150,
    imageUrl: ASSETS.frameDetails, // Placeholder
    framePreviewImageUrl: ASSETS.frameDetails,
    depth: '4cm',
    frameMaterial: 'Composto Premium',
    category: 'premium'
  },
  {
    id: 'inox',
    frameId: 'inox',
    name: 'Inox',
    frameName: 'Coleção Inox',
    description: 'Acabamento Metálico • Industrial',
    price: 140,
    framePriceDelta: 140,
    imageUrl: ASSETS.frameDetails, // Placeholder
    framePreviewImageUrl: ASSETS.frameDetails,
    depth: '2.5cm',
    frameMaterial: 'Aço Inoxidável',
    category: 'premium'
  },
  {
    id: 'luxury',
    frameId: 'luxury',
    name: 'Luxo',
    frameName: 'Coleção Luxo',
    description: 'Detalhes Ricos • Exclusivo',
    price: 200,
    framePriceDelta: 200,
    imageUrl: ASSETS.frameDetails, // Placeholder
    framePreviewImageUrl: ASSETS.frameDetails,
    depth: '5cm',
    frameMaterial: 'Madeira Nobre e Folha de Ouro',
    category: 'premium'
  },
];
