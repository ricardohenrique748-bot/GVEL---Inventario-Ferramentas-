import React, { useEffect, useRef, useState } from 'react';

interface CameraCaptureProps {
  value: string | null;
  onCapture: (dataUrl: string) => void;
  onClear: () => void;
  size?: number;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  value,
  onCapture,
  onClear,
  size = 200,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsStreaming(false);
  };

  useEffect(() => stopStream, []);

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      // The <video> element is always mounted (see render below), so the ref
      // is guaranteed to exist here even before isStreaming flips to true.
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setIsStreaming(true);
    } catch {
      setError('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
    }
  };

  const capturePhoto = () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL('image/jpeg', 0.85));
    stopStream();
  };

  const retake = () => {
    onClear();
    startCamera();
  };

  const showVideo = isStreaming && !value;

  return (
    <div className="flex flex-col items-center gap-sm">
      <div
        className={`rounded-xl bg-surface-container-high border-2 flex items-center justify-center overflow-hidden relative ${
          value ? 'border-primary' : 'border-dashed border-outline-variant'
        }`}
        style={{ width: size, height: size }}
      >
        {/* Kept permanently mounted so the ref is attached before getUserMedia resolves. */}
        <video
          ref={videoRef}
          className={`w-full h-full object-cover -scale-x-100 ${showVideo ? '' : 'hidden'}`}
          muted
          playsInline
        />
        {value && (
          <img src={value} alt="Foto capturada" className="absolute inset-0 w-full h-full object-cover" />
        )}
        {!showVideo && !value && (
          <span className="material-symbols-outlined text-on-surface-variant text-[36px]">
            {error ? 'no_photography' : 'face'}
          </span>
        )}
      </div>
      {error && <p className="font-label-sm text-error text-center max-w-[220px]">{error}</p>}
      {value ? (
        <button
          type="button"
          onClick={retake}
          className="font-label-sm text-primary hover:opacity-70 transition-opacity flex items-center gap-xs"
        >
          <span className="material-symbols-outlined text-[16px]">refresh</span>
          Tirar outra foto
        </button>
      ) : isStreaming ? (
        <button
          type="button"
          onClick={capturePhoto}
          className="px-md py-xs bg-primary text-on-primary font-label-md rounded-lg flex items-center gap-xs hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">camera</span>
          Capturar foto
        </button>
      ) : (
        <button
          type="button"
          onClick={startCamera}
          className="px-md py-xs bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md rounded-lg flex items-center gap-xs transition-colors border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[18px]">videocam</span>
          Abrir câmera
        </button>
      )}
    </div>
  );
};
