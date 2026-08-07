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

type Tab = 'credentials' | 'facial';
type ModelsState = 'idle' | 'loading' | 'ready' | 'error';

const MODEL_URL = '/models/';
const MATCH_THRESHOLD = 0.55;
const DETECTOR_OPTIONS = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.5 });

export const LockScreen: React.FC<LockScreenProps> = ({ people, onUnlock, onRegisterFace }) => {
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

  // Facial Enrollment Modal State
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedPersonId, setSelectedPersonId] = useState(people[0]?.id || '');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

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
    setCredError(null);

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
            <img src={logo} alt="Inventario Ferramentas - GV" className="w-14 h-14 object-contain" />
            <span className="font-headline-sm text-on-surface font-bold">Inventario Ferramentas - GV</span>
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
                  <div className="flex flex-col w-full gap-xs">
                    <button
                      type="button"
                      onClick={startFacialScan}
                      disabled={modelsState === 'loading'}
                      className="w-full py-sm rounded-full bg-error text-on-error font-label-md font-bold hover:bg-error/90 transition-colors disabled:opacity-50"
                    >
                      {modelsState === 'loading' ? 'Carregando...' : 'Iniciar reconhecimento'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPersonId(people[0]?.id || '');
                        setCapturedPhoto(null);
                        setShowEnrollModal(true);
                      }}
                      className="w-full py-sm rounded-full bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md font-semibold transition-colors border border-outline-variant flex items-center justify-center gap-xs"
                    >
                      <span className="material-symbols-outlined text-[18px]">add_a_photo</span>
                      Cadastrar biometria facial
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Facial Registration Modal */}
          {showEnrollModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-md">
              <div className="bg-surface-container rounded-2xl border border-outline-variant max-w-md w-full p-lg shadow-2xl animate-in zoom-in-95">
                <div className="flex items-center justify-between pb-sm border-b border-outline-variant mb-md">
                  <h3 className="font-headline-sm text-on-surface text-[17px] flex items-center gap-xs">
                    <span className="material-symbols-outlined text-error">face</span>
                    Cadastrar Biometria Facial
                  </h3>
                  <button
                    onClick={() => setShowEnrollModal(false)}
                    className="text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                  </button>
                </div>

                <div className="flex flex-col gap-md">
                  <div>
                    <label className="font-label-sm text-on-surface-variant mb-xs block">
                      Selecione o Usuário
                    </label>
                    <select
                      value={selectedPersonId}
                      onChange={(e) => setSelectedPersonId(e.target.value)}
                      className="w-full bg-surface-container-high border border-outline-variant rounded-xl p-sm text-body-md text-on-surface outline-none"
                    >
                      {people
                        .filter((p) => p.active)
                        .map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.role} - {p.email})
                          </option>
                        ))}
                    </select>
                  </div>

                  <div className="flex flex-col items-center justify-center py-xs">
                    <CameraCapture
                      value={capturedPhoto}
                      onCapture={(url) => setCapturedPhoto(url)}
                      onClear={() => setCapturedPhoto(null)}
                      size={180}
                    />
                  </div>

                  <div className="flex gap-sm pt-xs">
                    <button
                      type="button"
                      onClick={() => setShowEnrollModal(false)}
                      className="flex-1 py-sm rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      disabled={!capturedPhoto || !selectedPersonId}
                      onClick={() => {
                        if (!selectedPersonId || !capturedPhoto) return;
                        if (onRegisterFace) {
                          onRegisterFace(selectedPersonId, capturedPhoto);
                        }
                        const targetPerson = people.find((p) => p.id === selectedPersonId);
                        setShowEnrollModal(false);
                        setFacialStatus(
                          `Rosto cadastrado com sucesso para ${targetPerson?.name || 'usuário'}! Clique em Iniciar reconhecimento.`
                        );
                      }}
                      className="flex-1 py-sm rounded-xl bg-error text-on-error font-label-md font-bold hover:bg-error/90 transition-colors disabled:opacity-50"
                    >
                      Salvar Biometria
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

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
