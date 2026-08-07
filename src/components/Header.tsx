import React, { useState } from 'react';
import { AlertItem, Person } from '../types';
import { LEVEL_LABELS } from '../labels';

interface HeaderProps {
  alerts: AlertItem[];
  onNavigateToAlert: (type: string) => void;
  currentUser: Person;
  onLock: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  alerts,
  onNavigateToAlert,
  currentUser,
  onLock,
}) => {
  const [showAlertsMenu, setShowAlertsMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-64 right-0 h-16 bg-background/80 backdrop-blur-xl z-40 border-b border-outline-variant flex items-center justify-end px-lg select-none">
        {/* Right Header Actions */}
        <div className="flex items-center gap-sm relative">
          {/* Alerts Toggle Button */}
          <div className="relative">
            <button
              onClick={() => setShowAlertsMenu(!showAlertsMenu)}
              className="flex items-center gap-xs text-secondary hover:bg-surface-container-high px-sm h-9 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span className="font-label-md">
                {alerts.length} alertas
              </span>
            </button>

            {/* Alerts Dropdown Drawer */}
            {showAlertsMenu && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container shadow-2xl rounded-xl border border-outline-variant p-md z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-sm border-b border-outline-variant mb-sm">
                  <h4 className="font-headline-sm text-on-surface text-[15px]">
                    Alertas do Sistema ({alerts.length})
                  </h4>
                  <button
                    onClick={() => setShowAlertsMenu(false)}
                    className="text-on-surface-variant hover:text-on-surface"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>

                <div className="space-y-xs max-h-64 overflow-y-auto pr-xs">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      onClick={() => {
                        setShowAlertsMenu(false);
                        onNavigateToAlert(alert.type);
                      }}
                      className="p-sm bg-surface-container-high rounded-lg hover:bg-surface-bright cursor-pointer transition-colors flex justify-between items-start gap-sm"
                    >
                      <div>
                        <p className="font-body-sm text-on-surface leading-snug">
                          {alert.title}
                        </p>
                        <p className="font-label-sm text-on-surface-variant mt-0.5">
                          {alert.subtitle}
                        </p>
                      </div>
                      <span
                        className={`font-label-sm px-xs py-0.5 rounded shrink-0 ${
                          alert.level === 'HIGH'
                            ? 'bg-error/15 text-error'
                            : 'bg-secondary/15 text-secondary'
                        }`}
                      >
                        {LEVEL_LABELS[alert.level]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-5 w-px bg-outline-variant" />

          {/* Quick Icon Actions */}
          <div className="flex items-center gap-xs">
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-colors relative"
                title="Notifications"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-surface-container shadow-2xl rounded-xl border border-outline-variant p-md z-50">
                  <div className="flex justify-between items-center pb-xs border-b border-outline-variant mb-sm">
                    <span className="font-headline-sm text-on-surface text-[15px]">Notificações</span>
                    <button onClick={() => setShowNotifications(false)} className="text-on-surface-variant text-xs">Fechar</button>
                  </div>
                  <div className="space-y-sm font-body-sm text-on-surface-variant">
                    <p className="p-sm bg-surface-container-high rounded-lg">Inspeção da Caixa-042 solicitada por Vance.</p>
                    <p className="p-sm bg-surface-container-high rounded-lg">Compressor de Ar AC-102 aguardando avaliação de dano.</p>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowHelpModal(true)}
              className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-on-surface transition-colors"
              title="Ajuda e Informações do Sistema"
            >
              <span className="material-symbols-outlined text-[20px]">help</span>
            </button>
          </div>

          <div className="h-5 w-px bg-outline-variant" />

          {/* Operator Profile Chip */}
          <div className="flex items-center gap-sm pl-xs">
            <div className="w-9 h-9 rounded-full bg-primary-container overflow-hidden flex items-center justify-center text-on-primary-container shrink-0">
              {currentUser.photoUrl ? (
                <img src={currentUser.photoUrl} alt={currentUser.name} className="w-full h-full object-cover" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </div>
            <div className="hidden lg:block leading-tight">
              <p className="font-label-md text-on-surface">{currentUser.name}</p>
              <p className="font-body-sm text-on-surface-variant text-[12px]">
                {currentUser.sector || currentUser.role}
              </p>
            </div>
            <button
              onClick={onLock}
              title="Bloquear sessão"
              className="w-9 h-9 flex items-center justify-center hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-error transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
            </button>
          </div>
        </div>
      </header>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-lg">
          <div className="bg-surface-container rounded-xl shadow-2xl w-full max-w-[32rem] border border-outline-variant overflow-hidden animate-in zoom-in-95">
            <div className="p-lg border-b border-outline-variant flex justify-between items-center">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">support</span>
                <h3 className="font-headline-md text-on-surface">Manual do Inventário de Ferramentas</h3>
              </div>
              <button
                onClick={() => setShowHelpModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-lg space-y-md font-body-sm text-on-surface-variant">
              <p>
                Bem-vindo ao <strong className="text-on-surface">Inventário de Ferramentas</strong> — o sistema de gestão de ativos industriais para baias de oficina mecânica e almoxarifados de frota.
              </p>
              <div className="bg-surface-container-high p-md rounded-lg space-y-xs">
                <h4 className="font-headline-sm text-primary text-[14px]">Atalhos Rápidos</h4>
                <ul className="list-disc list-inside space-y-1 font-label-sm text-on-surface">
                  <li>No Painel, clique em "Escanear" para abrir o leitor de QR/código de barras</li>
                  <li>Em Caixas dos Mecânicos, clique em "Auditoria Rápida" para verificar as ferramentas da gaveta</li>
                  <li>Em Danos e Perdas, clique em "Reportar ocorrência" para registrar um item danificado ou perdido</li>
                </ul>
              </div>
            </div>
            <div className="p-md bg-surface-container-low border-t border-outline-variant flex justify-end">
              <button
                onClick={() => setShowHelpModal(false)}
                className="px-lg py-sm bg-primary text-on-primary font-label-md rounded-lg hover:bg-primary/90 transition-colors"
              >
                Entendi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
