import React, { useState } from 'react';

interface QRScannerModalProps {
  onClose: () => void;
  onScanResult: (code: string) => void;
}

export const QRScannerModal: React.FC<QRScannerModalProps> = ({
  onClose,
  onScanResult,
}) => {
  const [manualCode, setManualCode] = useState('');

  const sampleCodes = [
    { code: 'TL-P-4092', name: 'Chave de Impacto Milwaukee 1/2"' },
    { code: 'TL-D-1104', name: 'Scanner Snap-On OBD2 PRO' },
    { code: 'TL-H-8831', name: 'Torquímetro 1/2" Drive' },
    { code: 'TL-P-2019', name: 'Esmerilhadeira Angular DeWalt' },
  ];

  const handleSelectCode = (code: string) => {
    onScanResult(code);
    onClose();
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onScanResult(manualCode.trim().toUpperCase());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-md p-lg select-none">
      <div className="bg-surface-container rounded-2xl shadow-2xl w-full max-w-[32rem] border border-outline-variant/30 overflow-hidden animate-in zoom-in-95">
        {/* Modal Header */}
        <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
          <div className="flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-[24px]">
              qr_code_scanner
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              Scanner de QR / Código de Barras
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-xs rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Viewfinder Canvas Simulation */}
        <div className="p-lg flex flex-col items-center gap-md bg-surface">
          <div className="relative w-64 h-64 bg-surface-container-lowest rounded-xl border-2 border-primary/40 flex items-center justify-center overflow-hidden shadow-inner">
            {/* Corner Bracket Guides */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-primary" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-primary" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-primary" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-primary" />

            {/* Laser Line Scan animation */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent animate-bounce opacity-80" />

            {/* Simulated Camera Feed Grid */}
            <div className="text-center p-md">
              <span className="material-symbols-outlined text-[48px] text-primary/40 animate-pulse">
                center_focus_weak
              </span>
              <p className="font-label-sm text-on-surface-variant mt-2">
                Alinhe o código de barras dentro do quadro da câmera...
              </p>
            </div>
          </div>

          {/* Quick Scan Preset Buttons */}
          <div className="w-full space-y-xs">
            <p className="font-label-sm text-on-surface-variant text-center mb-xs">
              Ou clique em um alvo de teste rápido:
            </p>
            <div className="grid grid-cols-2 gap-xs">
              {sampleCodes.map((item) => (
                <button
                  key={item.code}
                  onClick={() => handleSelectCode(item.code)}
                  className="p-sm bg-surface-container-high hover:bg-surface-bright text-left rounded-lg border border-outline-variant/20 transition-all hover:border-primary group"
                >
                  <p className="font-label-md text-primary font-bold">{item.code}</p>
                  <p className="font-body-sm text-[11px] text-on-surface-variant truncate">
                    {item.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Code Input Form */}
          <form onSubmit={handleManualSubmit} className="w-full flex gap-2 pt-2 border-t border-outline-variant/20">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Digite o código do ativo manualmente..."
              className="flex-1 bg-surface-container-high border border-outline-variant/30 rounded-lg px-md py-xs text-body-sm text-on-surface font-label-md outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="px-md py-xs bg-primary text-on-primary font-label-md font-bold rounded-lg hover:bg-primary-fixed transition-colors"
            >
              Escanear
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
