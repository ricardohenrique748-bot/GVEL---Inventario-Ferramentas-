import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Person } from '../types';
import logo from '../assets/logo.png';

interface LockScreenProps {
  people: Person[];
  onUnlock: (person: Person) => void;
}

type Tab = 'credentials' | 'facial';
type ModelsState = 'idle' | 'loading' | 'ready' | 'error';

const MODEL_URL = '/models';
const MATCH_THRESHOLD = 0.55;
const DETECTOR_OPTIONS = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

export const LockScreen: React.FC<LockScreenProps> = ({ people, onUnlock }) => {
  const [tab, setTab] = useState<Tab>('credentials');

  // Credentials tab state
  const [email, setEmail] = useState('ricardo_h.16@hotmail.com');
  const [password, setPassword] = useState('');
  const [credError, setCredError] = useState<string | null>(null);

  // Facial tab state
  const [modelsState, setModelsState] = useState<ModelsState>('idle');
  const [isScanning, setIsScanning] = useState(false);
  const [facialStatus, setFacialStatus] = useState<string | null>(null);
  const [matchedName, setMatchedName] = useState<string | null>(null);

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

  const ensureModelsLoaded = async () => {
    if (modelsState === 'ready') return true;
    setModelsState('loading');
    try {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
      ]);
      setModelsState('ready');
      return true;
    } catch {
      setModelsState('error');
      return false;
    }
  };

  const buildMatcher = async () => {
    const labeled: faceapi.LabeledFaceDescriptors[] = [];
    for (const person of enrolledPeople) {
      try {
        const img = await faceapi.fetchImage(person.photoUrl!);
        const detection = await faceapi
          .detectSingleFace(img, DETECTOR_OPTIONS)
          .withFaceLandmarks(true)
          .withFaceDescriptor();
        if (detection) {
          labeled.push(new faceapi.LabeledFaceDescriptors(person.id, [detection.descriptor]));
        }
      } catch {
        // Skip people whose registered photo doesn't yield a usable face.
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
    setCredError(null);
    setFacialStatus('Carregando modelos de reconhecimento facial...');
    const loaded = await ensureModelsLoaded();
    if (!loaded) {
      setFacialStatus('Não foi possível carregar o reconhecimento facial.');
      return;
    }

    if (enrolledPeople.length === 0) {
      setFacialStatus('Nenhum rosto cadastrado ainda. Peça para cadastrar seu rosto em Configurações ou use email e senha.');
      return;
    }

    setFacialStatus('Preparando reconhecimento facial...');
    await buildMatcher();
    if (!matcherRef.current) {
      setFacialStatus('Não foi possível processar os rostos cadastrados. Tente cadastrar a foto novamente.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      unlockedRef.current = false;
      setIsScanning(true);
      setFacialStatus('Procurando rosto...');
      intervalRef.current = setInterval(runDetectionTick, 900);
    } catch {
      setFacialStatus('Não foi possível acessar a câmera. Verifique as permissões do navegador.');
    }
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCredError(null);
    const search = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const match = people.find(
      (p) =>
        p.active &&
        (p.email.trim().toLowerCase() === search || p.username.trim().toLowerCase() === search) &&
        p.password.trim() === cleanPass
    );

    if (!match) {
      setCredError('Email ou senha incorretos.');
      return;
    }
    onUnlock(match);
  };

  const switchTab = (next: Tab) => {
    if (tab === 'facial' && next !== 'facial') stopScanning();
    setCredError(null);
    setFacialStatus(null);
    setMatchedName(null);
    setTab(next);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-lg">
      <div className="w-full max-w-[68rem] bg-surface-container rounded-[28px] border border-outline-variant/30 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 animate-in zoom-in-95">
        {/* Left: auth panel */}
        <div className="flex flex-col p-2xl">
          <div className="flex flex-col items-center justify-center text-center gap-xs mb-2">
            <img src={logo} alt="Inventário de Ferramentas" className="w-14 h-14 object-contain" />
            <span className="font-headline-sm text-on-surface font-bold">Inventário de Ferramentas</span>
          </div>

          <div className="flex-1 flex flex-col justify-center w-full max-w-[22rem] mx-auto py-xl">
            <h1 className="font-display-lg text-on-surface leading-tight text-center">Bem-vindo de volta</h1>
            <p className="font-body-sm text-on-surface-variant mt-xs mb-lg text-center">
              Entre com suas credenciais ou use o reconhecimento facial.
            </p>

            <div className="flex bg-surface-container-high rounded-full p-1 mb-lg">
              <button
                type="button"
                onClick={() => switchTab('credentials')}
                className={`flex-1 py-sm rounded-full font-label-md transition-colors ${
                  tab === 'credentials'
                    ? 'bg-surface-container text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Email e senha
              </button>
              <button
                type="button"
                onClick={() => switchTab('facial')}
                className={`flex-1 py-sm rounded-full font-label-md transition-colors ${
                  tab === 'facial'
                    ? 'bg-surface-container text-on-surface shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Facial
              </button>
            </div>

            {tab === 'credentials' ? (
              <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-md">
                <div className="flex items-center gap-sm rounded-full border border-outline-variant bg-surface-container-high px-lg py-sm focus-within:border-error transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0">mail</span>
                  <input
                    type="email"
                    required
                    autoFocus
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className="flex-1 min-w-0 bg-transparent outline-none text-body-md text-on-surface placeholder:text-on-surface-variant/60"
                  />
                </div>
                <div className="flex items-center gap-sm rounded-full border border-outline-variant bg-surface-container-high px-lg py-sm focus-within:border-error transition-colors">
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px] shrink-0">lock</span>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Senha"
                    className="flex-1 min-w-0 bg-transparent outline-none text-body-md text-on-surface placeholder:text-on-surface-variant/60"
                  />
                </div>
                {credError && (
                  <p className="font-label-sm text-error flex items-center gap-xs px-md">
                    <span className="material-symbols-outlined text-[16px]">error</span>
                    {credError}
                  </p>
                )}
                <button
                  type="submit"
                  className="mt-xs w-full py-sm rounded-full bg-error text-on-error font-label-md font-bold hover:bg-error/90 transition-colors"
                >
                  Continuar
                </button>
              </form>
            ) : (
              <div className="flex flex-col items-center gap-md">
                <div
                  className={`w-48 h-48 rounded-2xl bg-surface-container-high border-2 flex items-center justify-center overflow-hidden relative ${
                    matchedName ? 'border-error' : 'border-dashed border-outline-variant'
                  }`}
                >
                  <video
                    ref={videoRef}
                    className={`w-full h-full object-cover -scale-x-100 ${isScanning ? '' : 'hidden'}`}
                    muted
                    playsInline
                  />
                  {!isScanning && (
                    <span className="material-symbols-outlined text-on-surface-variant text-[36px]">
                      {matchedName ? 'check_circle' : 'face'}
                    </span>
                  )}
                </div>

                {facialStatus && (
                  <p
                    className={`font-label-sm text-center ${
                      matchedName ? 'text-error font-bold' : 'text-on-surface-variant'
                    }`}
                  >
                    {facialStatus}
                  </p>
                )}

                {!isScanning && !matchedName && (
                  <button
                    type="button"
                    onClick={startFacialScan}
                    disabled={modelsState === 'loading'}
                    className="w-full py-sm rounded-full bg-error text-on-error font-label-md font-bold hover:bg-error/90 transition-colors disabled:opacity-50"
                  >
                    {modelsState === 'loading' ? 'Carregando...' : 'Iniciar reconhecimento'}
                  </button>
                )}
              </div>
            )}
          </div>

          <p className="font-label-sm text-on-surface-variant text-center max-w-[26rem] mx-auto">
            Junte-se aos times que confiam no Inventário de Ferramentas para controlar o estoque, evitar perdas e
            sempre saber quem está com cada ferramenta.
          </p>
        </div>

        {/* Right: brand panel */}
        <div className="hidden lg:flex relative items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#160505] to-[#2a0808]">
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
            @keyframes gv-scan {
              0% { transform: translateY(-120%); opacity: 0; }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { transform: translateY(120%); opacity: 0; }
            }
          `}</style>

          {/* Ambient red glow, slowly pulsing */}
          <div
            className="absolute w-96 h-96 rounded-full bg-error/40 blur-3xl"
            style={{ animation: 'gv-glow-shift 5s ease-in-out infinite' }}
          />

          {/* Decorative dashed columns */}
          <div className="absolute inset-0 flex justify-between px-2xl opacity-10 pointer-events-none">
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

          {/* Scanning light sweep */}
          <div
            className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-error/25 to-transparent pointer-events-none"
            style={{ animation: 'gv-scan 4s ease-in-out infinite' }}
          />

          <div className="relative z-10 flex flex-col items-center gap-lg px-2xl">
            <div
              className="w-40 h-40 rounded-[28px] bg-black/40 border border-error/40 flex items-center justify-center shadow-2xl"
              style={{ animation: 'gv-pulse-ring 2.8s ease-in-out infinite' }}
            >
              <img
                src={logo}
                alt=""
                className="w-24 h-24 object-contain drop-shadow-2xl"
                style={{ animation: 'gv-float 4s ease-in-out infinite' }}
              />
            </div>
            <div className="text-center">
              <p className="font-headline-sm text-white">Controle total da sua oficina</p>
              <p className="font-body-sm text-white/70 mt-xs">
                Ferramentas, empréstimos e auditorias em um só lugar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
