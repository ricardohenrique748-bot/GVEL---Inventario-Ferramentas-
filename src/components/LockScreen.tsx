import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Capacitor } from '@capacitor/core';
import { Person } from '../types';
import logo from '../assets/logo.png';

interface LockScreenProps {
  people: Person[];
  onUnlock: (person: Person) => void;
}

type ModelsState = 'idle' | 'loading' | 'ready' | 'error';

const REMEMBERED_EMAIL_KEY = 'toolcontrol-remembered-email';

const MODEL_URL = '/models/';
const MATCH_THRESHOLD = 0.55;
const DETECTOR_OPTIONS = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

export const LockScreen: React.FC<LockScreenProps> = ({ people, onUnlock }) => {
  // Facial tab state
  const [modelsState, setModelsState] = useState<ModelsState>('idle');
  const [isScanning, setIsScanning] = useState(false);
  const [facialStatus, setFacialStatus] = useState<string | null>(null);
  const [matchedName, setMatchedName] = useState<string | null>(null);

  // Web email/password login state
  const [loginEmail, setLoginEmail] = useState(() => localStorage.getItem(REMEMBERED_EMAIL_KEY) || '');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginShowPass, setLoginShowPass] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [rememberEmail, setRememberEmail] = useState(() => !!localStorage.getItem(REMEMBERED_EMAIL_KEY));

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const matcherRef = useRef<faceapi.FaceMatcher | null>(null);
  const matcherSignatureRef = useRef<string | null>(null);
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

  // Pré-aquece modelos de IA e o comparador de rostos em segundo plano,
  // assim o clique em "Iniciar Reconhecimento" só precisa ligar a câmera.
  useEffect(() => {
    if (enrolledPeople.length === 0) return;
    (async () => {
      const loaded = await ensureModelsLoaded();
      if (loaded) await buildMatcher();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [people]);

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
    const signature = enrolledPeople.map((p) => `${p.id}:${p.photoUrl}`).join('|');
    if (matcherRef.current && matcherSignatureRef.current === signature) return;

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

    if (labeled.length > 0) {
      matcherRef.current = new faceapi.FaceMatcher(labeled, MATCH_THRESHOLD);
      matcherSignatureRef.current = signature;
    } else {
      matcherRef.current = null;
    }
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
      setFacialStatus('Nenhuma biometria cadastrada ainda. Peça a um administrador para cadastrar sua foto após entrar no sistema.');
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
      setFacialStatus('Rosto cadastrado não detectado na foto. Peça a um administrador para atualizar sua foto no sistema.');
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


  const handleWebLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const emailInput = loginEmail.trim().toLowerCase();
    const passwordInput = loginPassword;

    if (!emailInput || !passwordInput) {
      setLoginError('Informe e-mail e senha.');
      return;
    }

    const person = people.find((p) => p.email.toLowerCase() === emailInput);
    if (!person || person.password !== passwordInput) {
      setLoginError('E-mail ou senha inválidos.');
      return;
    }
    if (!person.active) {
      setLoginError('Este usuário está inativo. Contate um administrador.');
      return;
    }

    if (rememberEmail) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, person.email);
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    setLoginError(null);
    onUnlock(person);
  };

  const isNative = Capacitor.isNativePlatform();

  const scanKeyframes = (
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
  );

  const facialAuthContent = (
    <>
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
            <div className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm text-center font-medium w-full max-w-[20rem] transition-all ${
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

          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-[11px] text-white/30 text-center max-w-[20rem] mx-auto mt-6">
        Inventário de Ferramentas GVEL — Controle e segurança de ativos industriais.
      </p>
    </>
  );

  const emailAuthContent = (
    <>
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
          Acesso ao Sistema
        </h1>
        <p className="text-xs sm:text-sm text-white/50 mt-1.5 mb-6 text-center">
          Entre com seu e-mail e senha cadastrados para acessar o sistema.
        </p>

        <form onSubmit={handleWebLogin} className="flex flex-col gap-3">
          {/* Email */}
          <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/10 focus-within:border-red-500/60 transition-colors">
            <span className="material-symbols-outlined text-white/30 text-[18px]">mail</span>
            <input
              type="email"
              autoComplete="off"
              placeholder="E-mail"
              value={loginEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLoginEmail(e.target.value);
                setLoginError(null);
              }}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25"
            />
          </div>

          {/* Password */}
          <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 border border-white/10 focus-within:border-red-500/60 transition-colors">
            <span className="material-symbols-outlined text-white/30 text-[18px]">lock</span>
            <input
              type={loginShowPass ? 'text' : 'password'}
              autoComplete="off"
              placeholder="Senha"
              value={loginPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setLoginPassword(e.target.value);
                setLoginError(null);
              }}
              className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25"
            />
            <button
              type="button"
              onClick={() => setLoginShowPass(!loginShowPass)}
              className="text-white/30 hover:text-white/60 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">
                {loginShowPass ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>

          {/* Remember Email */}
          <label className="flex items-center gap-2.5 px-1 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberEmail}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRememberEmail(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/5 accent-red-600 cursor-pointer"
            />
            <span className="text-xs text-white/50">Lembrar meu e-mail neste dispositivo</span>
          </label>

          {/* Error Message */}
          {loginError && (
            <div className="px-4 py-2.5 rounded-xl text-xs sm:text-sm text-center font-medium bg-red-500/10 border border-red-500/20 text-red-400">
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-all shadow-lg shadow-red-600/25 active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
          >
            <span className="material-symbols-outlined text-[20px]">login</span>
            Entrar
          </button>
        </form>
      </div>

      {/* Footer note */}
      <p className="text-[11px] text-white/30 text-center max-w-[20rem] mx-auto mt-6">
        Inventário de Ferramentas GVEL — Controle e segurança de ativos industriais.
      </p>
    </>
  );

  const authContent = isNative ? facialAuthContent : emailAuthContent;

  // Native (APK/Android): mobile-app style centered card, unchanged from the original design.
  if (isNative) {
    return (
      <div className="min-h-screen w-full flex flex-col justify-center items-stretch bg-[#0d0d0d] p-3 sm:p-6 md:p-8 box-border">
        {/* Background ambient lighting */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-red-900/10 rounded-full blur-[90px]" />
        </div>

        <div className="relative z-10 w-full max-w-[28rem] lg:max-w-5xl mx-auto bg-[#141414] rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col lg:flex-row my-auto" style={{ width: '100%' }}>
          {/* Left: auth panel */}
          <div className="w-full lg:w-1/2 flex flex-col p-5 sm:p-8 md:p-10 justify-between box-border" style={{ width: '100%' }}>
            {authContent}
          </div>

          {/* Right: brand panel (shown on tablets landscape and desktops) */}
          <div className="hidden lg:flex lg:w-1/2 min-h-[500px] relative items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#160505] to-[#2a0808]">
            {scanKeyframes}

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
                <p className="text-white/60 text-xs sm:text-sm mt-2 max-w-[20rem] mx-auto leading-relaxed">
                  Gestão de estoque industrial, empréstimos biométricos e auditoria em tempo real.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Web: wide split-screen layout that uses the full viewport instead of a centered mobile card.
  const webFeatures = [
    { icon: 'inventory_2', label: 'Controle de estoque de ferramentas em tempo real' },
    { icon: 'fact_check', label: 'Auditoria e rastreabilidade completa dos ativos' },
    { icon: 'lock', label: 'Acesso seguro com e-mail e senha corporativos' },
    { icon: 'engineering', label: 'Gestão de caixas e ferramentas dos mecânicos' },
  ];

  return (
    <div className="min-h-screen w-full flex bg-[#0d0d0d]">
      {/* Left: auth column */}
      <div className="w-full lg:w-[440px] xl:w-[520px] shrink-0 flex flex-col justify-center px-6 sm:px-12 xl:px-16 py-10 relative z-10 bg-[#0d0d0d] lg:border-r lg:border-white/10 min-h-screen box-border">
        {authContent}
      </div>

      {/* Right: wide hero panel filling the rest of the browser viewport */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#160505] to-[#2a0808]">
        {scanKeyframes}

        {/* Ambient red glow */}
        <div
          className="absolute w-[36rem] h-[36rem] rounded-full bg-red-600/25 blur-[140px]"
          style={{ animation: 'gv-glow-shift 5s ease-in-out infinite' }}
        />

        {/* Decorative vertical dashed lines spanning the full panel */}
        <div className="absolute inset-0 flex justify-between px-16 opacity-10 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
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

        <div className="relative z-10 flex flex-col items-center gap-8 px-12 xl:px-20 text-center w-full max-w-[42rem] mx-auto">
          <div
            className="w-40 h-40 xl:w-48 xl:h-48 rounded-3xl bg-black/50 border border-red-500/40 flex items-center justify-center shadow-2xl backdrop-blur-sm"
            style={{ animation: 'gv-pulse-ring 3s ease-in-out infinite' }}
          >
            <img
              src={logo}
              alt="GVEL"
              className="w-28 h-28 xl:w-32 xl:h-32 object-contain drop-shadow-2xl"
              style={{ animation: 'gv-float 4s ease-in-out infinite' }}
            />
          </div>

          <div>
            <h3 className="text-white text-2xl xl:text-3xl font-extrabold tracking-tight">
              Controle Total de Ferramentas
            </h3>
            <p className="text-white/60 text-sm xl:text-base mt-3 max-w-[28rem] mx-auto leading-relaxed">
              Gestão de estoque industrial, empréstimos biométricos e auditoria em tempo real — agora também no navegador.
            </p>
          </div>

          {/* Feature highlights, exclusive to the wide web layout */}
          <div className="flex flex-col gap-3 w-full max-w-[24rem] text-left mt-2">
            {webFeatures.map((f) => (
              <div key={f.icon} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0">{f.icon}</span>
                <span className="text-white/70 text-xs xl:text-sm">{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
