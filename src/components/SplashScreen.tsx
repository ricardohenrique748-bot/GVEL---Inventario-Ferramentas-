import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [phase, setPhase] = useState<'enter' | 'visible' | 'exit'>('enter');

  useEffect(() => {
    // Phase 1: Logo animates in (0 → 600ms)
    const t1 = setTimeout(() => setPhase('visible'), 100);
    // Phase 2: Start exit after 2.4s
    const t2 = setTimeout(() => setPhase('exit'), 2400);
    // Phase 3: Unmount after exit animation
    const t3 = setTimeout(() => onFinish(), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onFinish]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0505 50%, #0d0d0d 100%)',
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit' ? 'opacity 0.6s ease-in-out' : undefined,
      }}
    >
      {/* Animated background glow */}
      <div
        style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,30,30,0.15) 0%, transparent 70%)',
          transform: phase === 'visible' ? 'scale(1)' : 'scale(0)',
          transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
      />

      {/* Logo container */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
          transform: phase === 'visible' ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.8)',
          opacity: phase === 'visible' ? 1 : 0,
          transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease-out',
        }}
      >
        {/* Logo with glow ring */}
        <div
          style={{
            position: 'relative',
            width: '100px',
            height: '100px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Rotating ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: '#b91c1c',
              borderRightColor: 'rgba(185,28,28,0.3)',
              animation: phase === 'visible' ? 'spin 1.5s linear infinite' : undefined,
            }}
          />
          {/* Static ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-10px',
              borderRadius: '50%',
              border: '1px solid rgba(185,28,28,0.15)',
            }}
          />
          {/* Logo image */}
          <img
            src={logo}
            alt="GVEL"
            style={{
              width: '84px',
              height: '84px',
              objectFit: 'contain',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
              padding: '10px',
            }}
          />
        </div>

        {/* App name */}
        <div style={{ textAlign: 'center' }}>
          <h1
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 800,
              fontSize: '22px',
              color: '#ffffff',
              letterSpacing: '-0.3px',
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            Inventario Ferramentas
          </h1>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 600,
              fontSize: '13px',
              color: '#b91c1c',
              margin: '4px 0 0',
              letterSpacing: '4px',
              textTransform: 'uppercase',
            }}
          >
            GV
          </p>
        </div>

        {/* Loading dots */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#b91c1c',
                opacity: phase === 'visible' ? 1 : 0,
                animation: phase === 'visible' ? `pulse 1.2s ease-in-out ${i * 0.2}s infinite` : undefined,
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          textAlign: 'center',
          opacity: phase === 'visible' ? 0.3 : 0,
          transition: 'opacity 0.8s ease-out 0.5s',
        }}
      >
        <p
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '11px',
            color: '#ffffff',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            margin: 0,
          }}
        >
          Gestão de Ferramentas
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};
