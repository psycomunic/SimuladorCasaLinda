
import React, { useState, useEffect } from 'react';
import { ProductData, SimulationConfig, WizardStep } from './types';
import { generateSimulation } from './geminiService';
import { Header } from './components/Header';
import { Stepper } from './components/Stepper';
import { LoadingScreen } from './screens/LoadingScreen';
import { UploadScreen } from './screens/UploadScreen';
import { ConfigSizeScreen } from './screens/ConfigSizeScreen';
import { FrameCategoryScreen } from './screens/FrameCategoryScreen';
import { FrameSelectionScreen } from './screens/FrameSelectionScreen';
import { FinalPreviewScreen } from './screens/FinalPreviewScreen';
import { FRAMES, ASSETS } from './constants';

const App: React.FC = () => {
  const [step, setStep] = useState<WizardStep>('loading');
  const [product, setProduct] = useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);

  const [config, setConfig] = useState<SimulationConfig>({
    roomImage: null,
    size: '',
    selectedFrameId: 'black',
    placement: 'Centro',
    lighting: 'Média',
    glass: true
  });

  // Carregamento inicial dos dados ou Modo de Demonstração
  useEffect(() => {
    const rawData = sessionStorage.getItem('simuladorProductData');

    if (rawData) {
      try {
        const parsed = JSON.parse(rawData) as ProductData;
        setProduct(parsed);
        if (parsed.frameOptions && parsed.frameOptions.length > 0) {
          setConfig(prev => ({ ...prev, selectedFrameId: parsed.frameOptions[0].frameId }));
        }
      } catch (e) {
        setError("Os dados do produto estão corrompidos.");
      }
    } else {
      // MOCK DATA PARA VISUALIZAÇÃO (QUIET LUXURY DEMO)
      const demoProduct: ProductData = {
        productId: "DEMO-001",
        productName: "Abstract Gold & Charcoal",
        productPageUrl: "#",
        productImageUrl: ASSETS.abstractArt,
        sellerWhatsapp: "5511999999999",
        returnUrl: "/",
        // Fixed: Use spread operator to ensure all required FrameOption properties are included
        frameOptions: FRAMES.map(f => ({
          ...f,
          frameId: f.id,
          frameName: f.name,
          framePreviewImageUrl: f.imageUrl,
          frameMaterial: f.frameMaterial || 'Madeira Nobre',
          framePriceDelta: f.price
        }))
      };
      setProduct(demoProduct);
      console.log("Modo de Demonstração Ativado");
    }
  }, []);

  const handleBack = () => {
    if (step === 'room') setStep('loading');
    else if (step === 'size') setStep('room');
    else if (step === 'frame-category') setStep('size');
    else if (step === 'frame') setStep('frame-category');
    else if (step === 'adjust') {
      // If category is none, we skipped frame selection, so back goes to category
      if (config.frameCategory === 'none') {
        setStep('frame-category');
      } else {
        setStep('frame');
      }
    }
    else if (step === 'result') setStep('adjust');
  };

  const startSimulation = async () => {
    if (!product || !config.roomImage) return;
    setStep('generating');
    try {
      const simulatedUrl = await generateSimulation(product, config);
      setResultImage(simulatedUrl);
      setStep('result');
    } catch (err) {
      // Fallback para visualização se a API falhar ou não houver chave
      console.warn("Usando fallback de visualização (API Key pode estar ausente)");
      setResultImage(config.roomImage); // Apenas para debug visual
      setStep('result');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center bg-off-white">
        <h2 className="font-serif text-4xl mb-4 text-charcoal">Atenção</h2>
        <p className="text-charcoal/60 mb-8 max-w-xs font-sans">Não foi possível carregar os dados. Inicie a partir da página do produto.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-10 py-4 bg-charcoal text-white rounded-full font-bold tracking-widest text-[10px] uppercase transition-all hover:scale-105 active:scale-95"
        >
          Recarregar
        </button>
      </div>
    );
  }

  const stepIndex = ['loading', 'room', 'size', 'frame-category', 'frame', 'adjust', 'generating', 'result'].indexOf(step);

  return (
    <div className="flex flex-col min-h-screen bg-off-white text-charcoal max-w-md mx-auto w-full shadow-2xl relative overflow-x-hidden">

      {/* Elementos de UI visíveis durante o fluxo */}
      {step !== 'loading' && step !== 'generating' && step !== 'result' && (
        <div className="fade-in">
          <Header
            title="Simulador de Ambiente"
            subtitle={product?.productName}
            onBack={handleBack}
          />
          <Stepper currentStep={stepIndex} totalSteps={5} />
        </div>
      )}

      {step === 'loading' && (
        <LoadingScreen onComplete={() => setStep('room')} />
      )}

      {step === 'room' && (
        <UploadScreen onImageSelect={(img) => {
          setConfig(prev => ({ ...prev, roomImage: img }));
          setStep('size');
        }} />
      )}

      {step === 'size' && (
        <ConfigSizeScreen
          selectedSize={config.size}
          onSizeSelect={(id) => setConfig(prev => ({ ...prev, size: id }))}
          onContinue={() => setStep('frame-category')}
        />
      )}

      {step === 'frame-category' && (
        <FrameCategoryScreen
          onCategorySelect={(cat) => {
            setConfig(prev => ({ ...prev, frameCategory: cat, selectedFrameId: cat === 'none' ? 'none' : prev.selectedFrameId }));
            if (cat === 'none') {
              setStep('adjust');
            } else {
              setStep('frame');
            }
          }}
          onBack={handleBack}
        />
      )}

      {step === 'frame' && (
        <FrameSelectionScreen
          selectedFrameId={config.selectedFrameId}
          onFrameSelect={(id) => setConfig(prev => ({ ...prev, selectedFrameId: id }))}
          glass={!!config.glass}
          onGlassToggle={(val) => setConfig(prev => ({ ...prev, glass: val }))}
          onContinue={() => setStep('adjust')}
          productFrames={product?.frameOptions}
          category={config.frameCategory}
        />
      )}

      {step === 'adjust' && (
        <div className="flex-1 flex flex-col px-8 pt-10 fade-in pb-32">
          <div className="mb-10">
            <h2 className="font-serif text-4xl mb-3 leading-tight">Refinamento</h2>
            <p className="text-charcoal/40 text-sm font-medium tracking-wide italic">Ajuste o cenário para a máxima precisão.</p>
          </div>

          <div className="space-y-12">
            <section>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-accent mb-5 block">Posicionamento Ideal</label>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                {['Centro', 'Sobre o Sofá', 'Aparador', 'Cabeceira'].map(p => (
                  <button
                    key={p}
                    onClick={() => setConfig({ ...config, placement: p })}
                    className={`px-8 py-3 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${config.placement === p ? 'bg-charcoal text-white border-charcoal shadow-xl' : 'bg-white border-border-soft text-charcoal/50'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold-accent mb-5 block">Atmosfera de Luz</label>
              <div className="flex gap-3">
                {['Clara', 'Média', 'Baixa'].map(l => (
                  <button
                    key={l}
                    onClick={() => setConfig({ ...config, lighting: l })}
                    className={`px-8 py-3 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${config.lighting === l ? 'bg-charcoal text-white border-charcoal shadow-xl' : 'bg-white border-border-soft text-charcoal/50'}`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="fixed bottom-0 left-0 right-0 p-8 glass border-t border-border-soft z-50">
            <div className="max-w-md mx-auto">
              <button
                onClick={startSimulation}
                className="w-full py-5 bg-mustard text-charcoal rounded-2xl font-bold uppercase tracking-[0.2em] text-[12px] btn-luxury shadow-2xl shadow-mustard/30"
              >
                Simular Obra
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'generating' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-8 bg-off-white">
          <div className="relative">
            <div className="w-24 h-24 border-t-2 border-gold-accent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-gold-accent animate-pulse">auto_awesome</span>
            </div>
          </div>
          <div className="space-y-3">
            <h3 className="font-serif text-3xl text-charcoal">Criando Simulação</h3>
            <p className="text-charcoal/40 text-sm italic tracking-wide">Nano Banana está interpretando luzes e profundidade...</p>
          </div>
        </div>
      )}

      {step === 'result' && resultImage && (
        <FinalPreviewScreen
          config={config}
          resultImage={resultImage}
          product={product!}
          onRestart={() => setStep('room')}
        />
      )}
    </div>
  );
};

export default App;
