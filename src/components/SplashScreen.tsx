import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
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

  const isNative = Capacitor.isNativePlatform();

  if (!isNative) {
    return (
      <div
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0505 50%, #0d0d0d 100%)',
          opacity: phase === 'exit' ? 0 : 1,
          transition: phase === 'exit' ? 'opacity 0.6s ease-in-out' : undefined,
        }}
      >
        {/* Decorative vertical dashed lines spanning the full viewport (web only) */}
        <div className="absolute inset-0 hidden sm:flex justify-between px-16 opacity-10 pointer-events-none">
          {Array.from({ length: 14 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '1px',
                height: '100%',
                backgroundImage:
                  'repeating-linear-gradient(to bottom, white 0px, white 6px, transparent 6px, transparent 16px)',
              }}
            />
          ))}
        </div>

        {/* Ambient background glow */}
        <div
          style={{
            position: 'absolute',
            width: '560px',
            height: '560px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(180,30,30,0.18) 0%, transparent 70%)',
            transform: phase === 'visible' ? 'scale(1)' : 'scale(0)',
            transition: 'transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        />

        {/* Logo + text block */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            transform: phase === 'visible' ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.8)',
            opacity: phase === 'visible' ? 1 : 0,
            transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.5s ease-out',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '168px',
              height: '168px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: '-8px',
                borderRadius: '50%',
                border: '2px solid transparent',
                borderTopColor: '#ef4444',
                borderRightColor: 'rgba(239,68,68,0.35)',
                animation: phase === 'visible' ? 'spin 1.5s linear infinite' : undefined,
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: '-14px',
                borderRadius: '50%',
                border: '1px solid rgba(239,68,68,0.18)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.02) 100%)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 48px rgba(220,38,38,0.25)',
              }}
            />
            <img
              src={logo}
              alt="GVEL"
              style={{
                position: 'relative',
                width: '128px',
                height: '128px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))',
              }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 800,
                fontSize: '28px',
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
                margin: '6px 0 0',
                letterSpacing: '5px',
                textTransform: 'uppercase',
              }}
            >
              Sistema Web GV
            </p>
          </div>

          {/* Horizontal loading bar (web only) */}
          <div
            style={{
              width: '220px',
              height: '3px',
              borderRadius: '2px',
              background: 'rgba(255,255,255,0.08)',
              overflow: 'hidden',
              marginTop: '4px',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: '2px',
                background: 'linear-gradient(90deg, #7f1d1d, #ef4444)',
                width: phase === 'visible' ? '100%' : '0%',
                transition: 'width 2s ease-in-out',
              }}
            />
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
            Gestão de Ferramentas — Acesse de qualquer navegador
          </p>
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

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
            width: '148px',
            height: '148px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Rotating ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-8px',
              borderRadius: '50%',
              border: '2px solid transparent',
              borderTopColor: '#ef4444',
              borderRightColor: 'rgba(239,68,68,0.35)',
              animation: phase === 'visible' ? 'spin 1.5s linear infinite' : undefined,
            }}
          />
          {/* Static ring */}
          <div
            style={{
              position: 'absolute',
              inset: '-13px',
              borderRadius: '50%',
              border: '1px solid rgba(239,68,68,0.18)',
            }}
          />
          {/* Backdrop plate for contrast */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 45%, rgba(255,255,255,0.02) 100%)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 40px rgba(220,38,38,0.25)',
            }}
          />
          {/* Logo image */}
          <img
            src={logo}
            alt="GVEL"
            style={{
              position: 'relative',
              width: '112px',
              height: '112px',
              objectFit: 'contain',
              filter: 'drop-shadow(0 2px 10px rgba(0,0,0,0.6))',
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
