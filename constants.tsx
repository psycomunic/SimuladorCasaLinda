
import { FrameOption, SizeOption } from './types';

export const ASSETS = {
  abstractArt: 'https://lh3.googleusercontent.com/aida-public/AB6AXuANiDkvydNa0Lnx7aq4rnO5r4FvXGjdwoX4JN_dQ3oqeeclMQeqHRAvU8p8_rVPjZJq3j4B6pUZVDuXQnXQvbAIZBI2TZ3KRQiyw2BXV09yFooKcXLulBS7gVBMRjvD2KOSR50iX1YNC8-KLztJwOjhRttyjhPzvKS4FM0RJBUqVGgSAVieIMgc1PTk-EJhNdOit9vOKUgnRfxJfTnY24ic24zGOpOT-Yq5LK4FSVL5o6wvlmEkwIWX4zN9hx8mZN5IQ53ZioI_b6G7',
  frameBlack: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAciZE4hPx9sKPX0WAI_w4OW1jBET0-8JbH7HuADsGOvfzQf_auRTYAoRu3_royw6vQtQsLX2zxYOoXPaCCfQRXGH9yJV0sPSCB1dL6f4Fwl3cXRbcKXAJvFMlMfXUYcp3a8H_CDuACjSNu4mHrkk8giGGdbNmxJW8gbp-fh17_Rx-azDwG9l9_PY6yAphIHB0zaAhyHJQqfDqANjEvL2XnTmE7ENKVM0RtVVuoL7a2PBJQxv5PQG5h1_Bi_6I5MDSimPRImsMRWQlx',
  frameWood: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW58s9SR8ooHVTel5duN964WUAKDaEmkv4jdrdzz5ukt4KdPNTX4jJBet4pqFvdflXL-8WC5J6r79NRWjOFhMGz1_g3Ded59AYfa12cR7qf6RwEBZF0YyUmCftxOXkK8rKy9YVo9sMpmKirGjQqKPY69m9GXyxSjoyczkwu5FtfCwfJvkG3HKYIzR6u400fjR1NLaHl9hFFg7ndYu7uPPgg7-hGcPS5JXssBA5Hu97vrbpmyruRlx8hMlRgiB667790jwN2KwypwuL',
  frameGold: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ2-WpL97-6g5dr4b3QtEN3WG_TfdmkDtzAa75VP2YqDshvMmkza_guqaygLJTkUNt2f4NXVBH5U4auP3mBjOsu3GdcNPVBkpxxwDf1gGW636l-apTZ6Zyblg5uEYsyx4l47skNGvQ6D9ajPR47g54Vy5UH6_hA8D566Sud-jxbflP9BolM6za-KjAG4v-NYDF0JPjE6h-e7oEe8HYkJOt7bfDeYFlnBLEujKl_vUgnmKJu5UExXNWHljN5_E7RneNsqWzol8j22a1',
  frameDetails: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDTWolsigmql8XLixz4FpsZuK5X0Tmq9zDAkRJWz5S0NiylZ-lCCVNJJc1bvlL6rblqHsjcThIgOL0KL1i1ISHTG58CsYNzRjhg9ZVH64s4gqWDYauRFlZcYNDtg0t-zyvy4pa6wrLYpVWA82XgS5v1Jhazo6OEku5gSpxkK43B_-In8P_GZQYWvd6CFE9XsVhRV6dQR7y8qilpJ8Ou-L-9ai3w7jJPjKHOxFXoOsPLuOOaWcBS4lF564nR6CThNHlY4TopYYndaL0'
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
