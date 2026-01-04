
export interface SizeOption {
  id: string;
  dimensions: string;
  category: string;
}

export interface FrameOption {
  // Compatibility with App.tsx and bridge.ts
  frameId: string;
  frameName: string;
  framePreviewImageUrl?: string;
  frameColor?: string;
  frameMaterial?: string;
  frameWidthMm?: number;
  framePriceDelta?: number;
  details?: string;

  // Compatibility with constants.tsx and modular screens
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  depth?: string;
  category?: 'caixa' | 'premium' | 'none';
}

export interface ProductData {
  productId: string;
  productName: string;
  productPageUrl: string;
  productImageUrl: string;
  frameOptions: FrameOption[];
  sellerWhatsapp: string;
  returnUrl: string;
}

export interface SimulationConfig {
  roomImage: string | null;
  size: string;
  customWidth?: number;
  customHeight?: number;
  selectedFrameId: string;
  placement: string;
  lighting: string;
  // Added glass property used in modular screens
  glass?: boolean;
  frameCategory?: 'caixa' | 'premium' | 'none';
}

export type WizardStep = 'loading' | 'room' | 'size' | 'frame-category' | 'frame' | 'adjust' | 'generating' | 'result';
