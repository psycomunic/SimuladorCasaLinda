
/**
 * Este script deve ser colado no final da página do produto da loja.
 * Ele gerencia a captura dos dados e redireciona para o simulador.
 */

export const setupStoreButton = (config: {
    buttonId: string;
    simulatorUrl: string;
    sellerWhatsapp: string;
}) => {
    const btn = document.getElementById(config.buttonId);
    if (!btn) return;

    btn.addEventListener('click', () => {
        const productData = {
            productId: document.querySelector('[data-product-id]')?.getAttribute('data-product-id') || 'unknown',
            productName: document.querySelector('h1')?.innerText || document.title,
            productPageUrl: window.location.href,
            productImageUrl: (document.querySelector('meta[property="og:image"]') as HTMLMetaElement)?.content || 
                             document.querySelector('.product-gallery img')?.getAttribute('src') || '',
            sellerWhatsapp: config.sellerWhatsapp,
            returnUrl: window.location.href,
            frameOptions: Array.from(document.querySelectorAll('.frame-option')).map((el: any) => ({
                frameId: el.dataset.id || el.innerText,
                frameName: el.innerText,
                framePreviewImageUrl: el.querySelector('img')?.src || '',
                frameMaterial: el.dataset.material || '',
                framePriceDelta: parseFloat(el.dataset.price) || 0
            }))
        };

        sessionStorage.setItem('simuladorProductData', JSON.stringify(productData));
        window.location.href = config.simulatorUrl;
    });
};
