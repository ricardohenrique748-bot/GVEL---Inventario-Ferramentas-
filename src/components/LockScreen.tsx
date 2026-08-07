import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Person } from '../types';
import logo from '../assets/logo.png';
import { CameraCapture } from './CameraCapture';

interface LockScreenProps {
  people: Person[];
  onUnlock: (person: Person) => void;
  onRegisterFace?: (personId: string, photoUrl: string) => void;
}

type ModelsState = 'idle' | 'loading' | 'ready' | 'error';

const MODEL_URL = '/models/';
const MATCH_THRESHOLD = 0.55;
const DETECTOR_OPTIONS = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

export const LockScreen: React.FC<LockScreenProps> = ({ people, onUnlock, onRegisterFace }) => {
  // Facial tab state
  const [modelsState, setModelsState] = useState<ModelsState>('idle');
  const [isScanning, setIsScanning] = useState(false);
  const [facialStatus, setFacialStatus] = useState<string | null>(null);
  const [matchedName, setMatchedName] = useState<string | null>(null);

  // Facial Enrollment Modal State
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [enrollName, setEnrollName] = useState('');
  const [enrollRole, setEnrollRole] = useState('');
  const [enrollEmail, setEnrollEmail] = useState('');
  const [enrollPassword, setEnrollPassword] = useState('');
  const [enrollShowPass, setEnrollShowPass] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const matcherRef = useRef<faceapi.FaceMatcher | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const unlockedRef = useRef(false);

  const enrolledPeople = people.filter((p) => p.active && p.photoUrl);

  const stopScanning = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    setIsScanning(false);
  };

  useEffect(() => stopScanning, []);

  const loadImageElement = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  };

  const ensureModelsLoaded = async () => {
    if (modelsState === 'ready') return true;
    setModelsState('loading');

    const candidateUris = [
      '/models/',
      './models/',
      `${window.location.origin}/models/`,
      'https://justadudewhohacks.github.io/face-api.js/models/',
      'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights/',
    ];

    for (const uri of candidateUris) {
      try {
        console.log(`Carregando modelos de IA de: ${uri}`);
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(uri),
          faceapi.nets.faceLandmark68TinyNet.loadFromUri(uri),
          faceapi.nets.faceRecognitionNet.loadFromUri(uri),
        ]);
        setModelsState('ready');
        return true;
      } catch (err) {
        console.warn(`Tentativa de carregar modelos de ${uri} falhou:`, err);
      }
    }

    setModelsState('error');
    return false;
  };

  const buildMatcher = async () => {
    const labeled: faceapi.LabeledFaceDescriptors[] = [];
    for (const person of enrolledPeople) {
      try {
        let img: HTMLImageElement;
        if (person.photoUrl?.startsWith('data:') || person.photoUrl?.startsWith('blob:')) {
          img = await loadImageElement(person.photoUrl);
        } else {
          img = await faceapi.fetchImage(person.photoUrl!);
        }

        const detection = await faceapi
          .detectSingleFace(img, DETECTOR_OPTIONS)
          .withFaceLandmarks(true)
          .withFaceDescriptor();

        if (detection) {
          labeled.push(new faceapi.LabeledFaceDescriptors(person.id, [detection.descriptor]));
        }
      } catch (err) {
        console.error(`Erro ao extrair descritor facial de ${person.name}:`, err);
      }
    }
    matcherRef.current = labeled.length > 0 ? new faceapi.FaceMatcher(labeled, MATCH_THRESHOLD) : null;
  };

  const runDetectionTick = async () => {
    if (!videoRef.current || !matcherRef.current || unlockedRef.current) return;
    const detection = await faceapi
      .detectSingleFace(videoRef.current, DETECTOR_OPTIONS)
      .withFaceLandmarks(true)
      .withFaceDescriptor();

    if (!detection) {
      setFacialStatus('Posicione seu rosto na câmera...');
      return;
    }
    const match = matcherRef.current.findBestMatch(detection.descriptor);
    if (match.label === 'unknown') {
      setFacialStatus('Rosto não reconhecido.');
      return;
    }
    const person = people.find((p) => p.id === match.label);
    if (!person) return;

    unlockedRef.current = true;
    setMatchedName(person.name);
    setFacialStatus(`Bem-vindo, ${person.name}!`);
    stopScanning();
    setTimeout(() => onUnlock(person), 700);
  };

  const startFacialScan = async () => {

    if (enrolledPeople.length === 0) {
      setFacialStatus('Nenhuma biometria cadastrada ainda. Clique no botão "Cadastrar biometria facial" abaixo.');
      return;
    }

    setFacialStatus('Carregando modelos de reconhecimento facial...');
    const loaded = await ensureModelsLoaded();
    if (!loaded) {
      setFacialStatus('Não foi possível carregar os modelos de inteligência artificial facial.');
      return;
    }

    setFacialStatus('Preparando reconhecimento facial...');
    await buildMatcher();
    if (!matcherRef.current) {
      setFacialStatus('Rosto cadastrado não detectado na foto. Clique em "Cadastrar biometria facial" para atualizar sua foto.');
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      } catch {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      unlockedRef.current = false;
      setIsScanning(true);
      setFacialStatus('Procurando rosto...');
      intervalRef.current = setInterval(runDetectionTick, 900);
    } catch (err) {
      console.error('Erro ao acessar câmera:', err);
      setFacialStatus('Não foi possível acessar a câmera. Verifique as permissões de câmera do dispositivo.');
    }
  };


  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-stretch bg-[#0d0d0d] p-3 sm:p-6 md:p-8 box-border">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-red-900/10 rounded-full blur-[90px]" />
      </div>

      <div className="relative z-10 w-full max-w-md lg:max-w-5xl mx-auto bg-[#141414] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row my-auto" style={{ width: '100%' }}>
        {/* Left: auth panel */}
        <div className="w-full lg:w-1/2 flex flex-col p-5 sm:p-8 md:p-10 justify-between box-border" style={{ width: '100%' }}>
          {/* Header Branding */}
          <div className="flex flex-col items-center justify-center text-center gap-2 mb-4 sm:mb-6">
            <div className="relative w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center p-2.5 shadow-lg">
              <img src={logo} alt="Inventario Ferramentas - GV" className="w-full h-full object-contain" />
            </div>
            <div className="mt-1">
              <h2 className="text-white font-extrabold text-lg sm:text-xl tracking-tight">Inventario Ferramentas - GV</h2>
              <span className="text-red-500 text-[10px] uppercase font-bold tracking-[3px] block">Sistema de Gestão Industrial</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center w-full mx-auto my-2 box-border">
            <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight text-center tracking-tight">
              Reconhecimento Facial
            </h1>
            <p className="text-xs sm:text-sm text-white/50 mt-1.5 mb-6 text-center">
              Posicione o rosto em frente à câmera para acessar o sistema.
            </p>

            <div className="flex flex-col items-center gap-5">
              {/* Biometric Camera Viewfinder with Corner Brackets & Scanner HUD */}
              <div
                className={`relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-black/60 border-2 transition-all duration-300 flex items-center justify-center overflow-hidden shadow-2xl ${
                  matchedName
                    ? 'border-emerald-500 shadow-emerald-500/20'
                    : isScanning
                    ? 'border-red-500 shadow-red-500/25 ring-4 ring-red-500/10'
                    : 'border-white/15'
                }`}
              >
                {/* HUD Corner Brackets */}
                <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-red-500 z-20 pointer-events-none" />
                <div className="absolute top-2.5 right-2.5 w-4 h-4 border-t-2 border-r-2 border-red-500 z-20 pointer-events-none" />
                <div className="absolute bottom-2.5 left-2.5 w-4 h-4 border-b-2 border-l-2 border-red-500 z-20 pointer-events-none" />
                <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-red-500 z-20 pointer-events-none" />

                {/* Laser scan line animation while scanning */}
                {isScanning && (
                  <div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent z-20 shadow-[0_0_15px_#ef4444]"
                    style={{ animation: 'gv-scan-laser 2s linear infinite' }}
                  />
                )}

                <video
                  ref={videoRef}
                  className={`w-full h-full object-cover -scale-x-100 ${isScanning ? '' : 'hidden'}`}
                  muted
                  playsInline
                />

                {!isScanning && (
                  <div className="flex flex-col items-center gap-2 p-4 text-center z-10">
                    {matchedName ? (
                      <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <span className="material-symbols-outlined text-[36px]">check_circle</span>
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40">
                        <span className="material-symbols-outlined text-[36px]">face</span>
                      </div>
                    )}
                    <span className="text-white/40 text-xs">
                      {matchedName ? matchedName : 'Aguardando câmera...'}
                    </span>
                  </div>
                )}
              </div>

              {/* Status Message Display */}
              {facialStatus && (
                <div className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm text-center font-medium w-full max-w-xs transition-all ${
                  matchedName 
                    ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold' 
                    : isScanning 
                    ? 'bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse'
                    : 'bg-white/5 border border-white/10 text-white/70'
                }`}>
                  {facialStatus}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col w-full gap-3 mt-1">
                {!isScanning && !matchedName && (
                  <button
                    type="button"
                    onClick={startFacialScan}
                    disabled={modelsState === 'loading'}
                    className="w-full py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all shadow-lg shadow-red-600/25 active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined text-[20px]">videocam</span>
                    {modelsState === 'loading' ? 'Carregando Modelos IA...' : 'Iniciar Reconhecimento'}
                  </button>
                )}

                {/* Enrollment button always visible */}
                <button
                  type="button"
                  onClick={() => {
                    setCapturedPhoto(null);
                    setEnrollName('');
                    setEnrollRole('');
                    setEnrollEmail('');
                    setEnrollPassword('');
                    setShowEnrollModal(true);
                  }}
                  className="w-full py-3.5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all border border-white/10 active:scale-[0.99] flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[20px] text-red-500">add_a_photo</span>
                  Cadastrar Biometria Facial
                </button>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-[11px] text-white/30 text-center max-w-xs mx-auto mt-6">
            Inventário de Ferramentas GVEL — Controle e segurança de ativos industriais.
          </p>
        </div>

        {/* Facial Registration Modal */}
        {showEnrollModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-[#181818] w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl border border-white/10 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 sm:zoom-in-95 max-h-[92vh] overflow-y-auto">
              {/* Header */}
              <div className="relative flex items-center justify-center pt-5 pb-3.5 px-5 border-b border-white/10 bg-white/[0.02]">
                <div className="absolute left-5 w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
                  <span className="material-symbols-outlined text-[18px]">face</span>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Novo Cadastro</p>
                  <h3 className="text-white text-base font-bold">Biometria Facial</h3>
                </div>
                <button
                  onClick={() => setShowEnrollModal(false)}
                  className="absolute right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-white/60 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              </div>

              <div className="p-5 flex flex-col gap-4">
                {/* Camera capture centered */}
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className={`w-36 h-36 rounded-2xl overflow-hidden border-2 transition-all ${capturedPhoto ? 'border-red-500 shadow-lg shadow-red-500/20' : 'border-dashed border-white/20'} bg-white/5 flex items-center justify-center`}>
                      {capturedPhoto ? (
                        <img src={capturedPhoto} alt="Foto facial" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center gap-1.5">
                          <span className="material-symbols-outlined text-white/20 text-[40px]">face_4</span>
                          <p className="text-white/30 text-[10px] text-center px-2">Toque para fotografar</p>
                        </div>
                      )}
                    </div>
                    {capturedPhoto && (
                      <button
                        type="button"
                        onClick={() => setCapturedPhoto(null)}
                        className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shadow-md text-white"
                      >
                        <span className="material-symbols-outlined text-[13px]">close</span>
                      </button>
                    )}
                  </div>
                  <CameraCapture
                    value={capturedPhoto}
                    onCapture={(url) => setCapturedPhoto(url)}
                    onClear={() => setCapturedPhoto(null)}
                    size={0}
                  />
                  {capturedPhoto ? (
                    <p className="text-xs text-red-400 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check_circle</span> Rosto capturado
                    </p>
                  ) : (
                    <p className="text-xs text-white/40 text-center">A foto do rosto é obrigatória para a biometria</p>
                  )}
                </div>

                {/* User fields - all optional */}
                <div className="flex flex-col gap-2.5">
                  {/* Name */}
                  <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/10 focus-within:border-red-500/60 transition-colors">
                    <span className="material-symbols-outlined text-white/30 text-[18px]">person</span>
                    <input
                      type="text"
                      placeholder="Nome completo (opcional)"
                      value={enrollName}
                      onChange={(e) => setEnrollName(e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25"
                    />
                  </div>

                  {/* Função / Role */}
                  <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/10 focus-within:border-red-500/60 transition-colors">
                    <span className="material-symbols-outlined text-white/30 text-[18px]">badge</span>
                    <input
                      type="text"
                      placeholder="Função (ex: Mecânico, Supervisor) (opcional)"
                      value={enrollRole}
                      onChange={(e) => setEnrollRole(e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25"
                    />
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/10 focus-within:border-red-500/60 transition-colors">
                    <span className="material-symbols-outlined text-white/30 text-[18px]">mail</span>
                    <input
                      type="email"
                      placeholder="E-mail (opcional)"
                      value={enrollEmail}
                      onChange={(e) => setEnrollEmail(e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25"
                    />
                  </div>

                  {/* Password */}
                  <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/10 focus-within:border-red-500/60 transition-colors">
                    <span className="material-symbols-outlined text-white/30 text-[18px]">lock</span>
                    <input
                      type={enrollShowPass ? 'text' : 'password'}
                      placeholder="Senha (opcional)"
                      value={enrollPassword}
                      onChange={(e) => setEnrollPassword(e.target.value)}
                      className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25"
                    />
                    <button
                      type="button"
                      onClick={() => setEnrollShowPass(!enrollShowPass)}
                      className="text-white/30 hover:text-white/60 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {enrollShowPass ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowEnrollModal(false)}
                    className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white/70 text-sm font-semibold transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={!capturedPhoto}
                    onClick={() => {
                      if (!capturedPhoto) return;
                      const targetId = people[0]?.id;
                      if (onRegisterFace && targetId) {
                        onRegisterFace(targetId, capturedPhoto);
                      }
                      setShowEnrollModal(false);
                      setCapturedPhoto(null);
                      setEnrollName('');
                      setEnrollRole('');
                      setEnrollEmail('');
                      setEnrollPassword('');
                      setFacialStatus(
                        `Biometria cadastrada para ${enrollName || 'novo usuário'}! Clique em Iniciar reconhecimento.`
                      );
                    }}
                    className="flex-[2] py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                  >
                    <span className="material-symbols-outlined text-[18px]">face_unlock</span>
                    Salvar Biometria
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right: brand panel (shown on tablets landscape and desktops) */}
        <div className="hidden lg:flex lg:w-1/2 min-h-[500px] relative items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#160505] to-[#2a0808]">
          <style>{`
            @keyframes gv-glow-shift {
              0%, 100% { opacity: 0.35; transform: scale(1); }
              50% { opacity: 0.6; transform: scale(1.12); }
            }
            @keyframes gv-pulse-ring {
              0% { box-shadow: 0 0 0 0 rgba(220,38,38,0.55); }
              70% { box-shadow: 0 0 0 28px rgba(220,38,38,0); }
              100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
            }
            @keyframes gv-float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
            }
            @keyframes gv-scan-laser {
              0% { top: 0%; opacity: 0.2; }
              50% { opacity: 1; }
              100% { top: 100%; opacity: 0.2; }
            }
          `}</style>

          {/* Ambient red glow */}
          <div
            className="absolute w-96 h-96 rounded-full bg-red-600/30 blur-3xl"
            style={{ animation: 'gv-glow-shift 5s ease-in-out infinite' }}
          />

          {/* Decorative vertical dashed lines */}
          <div className="absolute inset-0 flex justify-between px-12 opacity-10 pointer-events-none">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="w-px h-full"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(to bottom, white 0px, white 6px, transparent 6px, transparent 16px)',
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6 px-10 text-center">
            <div
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-black/50 border border-red-500/40 flex items-center justify-center shadow-2xl backdrop-blur-sm"
              style={{ animation: 'gv-pulse-ring 3s ease-in-out infinite' }}
            >
              <img
                src={logo}
                alt="GVEL"
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain drop-shadow-2xl"
                style={{ animation: 'gv-float 4s ease-in-out infinite' }}
              />
            </div>
            <div>
              <h3 className="text-white text-xl sm:text-2xl font-extrabold tracking-tight">
                Controle Total de Ferramentas
              </h3>
              <p className="text-white/60 text-xs sm:text-sm mt-2 max-w-xs mx-auto leading-relaxed">
                Gestão de estoque industrial, empréstimos biométricos e auditoria em tempo real.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
