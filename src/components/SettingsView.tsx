import React, { useState } from 'react';
import { Person } from '../types';
import { PeopleManagement } from './PeopleManagement';

interface SettingsViewProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  people: Person[];
  onAddPerson: (person: Omit<Person, 'id'>) => void;
  onUpdatePerson: (id: string, updates: Partial<Person>) => void;
  onTogglePersonActive: (id: string) => void;
  onDeletePerson: (id: string) => void;
  isAdmin: boolean;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  isDarkMode,
  onToggleDarkMode,
  people,
  onAddPerson,
  onUpdatePerson,
  onTogglePersonActive,
  onDeletePerson,
  isAdmin,
}) => {
  const [workshopLocation, setWorkshopLocation] = useState('Oficina Principal - Baia da Frota 4');
  const [barcodeFormat, setBarcodeFormat] = useState('QR Code 2D');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [auditReminder, setAuditReminder] = useState('Semanal');
  const [damageAlertsEnabled, setDamageAlertsEnabled] = useState(true);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSave = () => {
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <div className="flex flex-col w-full p-lg gap-lg select-none animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">
            Configurações e Preferências do Sistema
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Configure a localização da oficina, o leitor de código de barras e a frequência de auditorias.
          </p>
        </div>
      </div>

      {savedMessage && (
        <div className="bg-primary/20 border border-primary/50 text-primary p-md rounded-lg font-label-md flex items-center gap-2">
          <span className="material-symbols-outlined">check_circle</span>
          Configurações do sistema salvas com sucesso!
        </div>
      )}

      <PeopleManagement
        people={people}
        onAddPerson={onAddPerson}
        onUpdatePerson={onUpdatePerson}
        onTogglePersonActive={onTogglePersonActive}
        onDeletePerson={onDeletePerson}
        isAdmin={isAdmin}
      />

      <div className="bg-surface-container rounded-xl p-lg border border-outline-variant/30 space-y-lg max-w-3xl">
        <div className="flex items-center justify-between p-md bg-surface-container-high rounded-lg border border-outline-variant/20">
          <div className="flex items-center gap-md">
            <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                {isDarkMode ? 'dark_mode' : 'light_mode'}
              </span>
            </div>
            <div>
              <p className="font-body-md text-on-surface font-medium">Modo escuro</p>
              <p className="font-label-sm text-on-surface-variant">Deixe a interface mais confortável em ambientes com pouca luz.</p>
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={isDarkMode}
            onClick={onToggleDarkMode}
            className={`relative w-14 h-8 rounded-full shrink-0 transition-colors ${
              isDarkMode ? 'bg-primary' : 'bg-surface-container-highest'
            }`}
          >
            <span
              className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-surface shadow-sm flex items-center justify-center transition-transform ${
                isDarkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              <span className="material-symbols-outlined text-[15px] text-on-surface-variant">
                {isDarkMode ? 'dark_mode' : 'light_mode'}
              </span>
            </span>
          </button>
        </div>

        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-on-surface-variant">
            Localização da oficina
          </label>
          <input
            type="text"
            value={workshopLocation}
            onChange={(e) => setWorkshopLocation(e.target.value)}
            className="w-full bg-surface-container-high border-b-2 border-outline-variant px-md py-sm text-on-surface font-body-md outline-none"
          />
        </div>

        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-on-surface-variant">
            Padrão principal de código de barras / QR
          </label>
          <select
            value={barcodeFormat}
            onChange={(e) => setBarcodeFormat(e.target.value)}
            className="w-full bg-surface-container-high border-b-2 border-outline-variant px-md py-sm text-on-surface font-body-md outline-none cursor-pointer"
          >
            <option>QR Code 2D</option>
            <option>Code 128 (1D Industrial)</option>
            <option>DataMatrix 2D</option>
          </select>
        </div>

        <div className="flex flex-col gap-xs">
          <label className="font-label-md text-on-surface-variant">
            Lembrete de auditoria das caixas dos mecânicos
          </label>
          <select
            value={auditReminder}
            onChange={(e) => setAuditReminder(e.target.value)}
            className="w-full bg-surface-container-high border-b-2 border-outline-variant px-md py-sm text-on-surface font-body-md outline-none cursor-pointer"
          >
            <option>Diária</option>
            <option>Semanal</option>
            <option>Quinzenal</option>
            <option>Desativado</option>
          </select>
        </div>

        <div className="flex items-center justify-between p-md bg-surface-container-high rounded-lg border border-outline-variant/20">
          <div>
            <p className="font-body-md text-on-surface font-medium">Bipe sonoro do leitor</p>
            <p className="font-label-sm text-on-surface-variant">Tocar som ao escanear código de barras com sucesso.</p>
          </div>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
            className="w-5 h-5 accent-primary cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between p-md bg-surface-container-high rounded-lg border border-outline-variant/20">
          <div>
            <p className="font-body-md text-on-surface font-medium">Alertas de danos e perdas</p>
            <p className="font-label-sm text-on-surface-variant">Notificar quando uma nova ocorrência for registrada.</p>
          </div>
          <input
            type="checkbox"
            checked={damageAlertsEnabled}
            onChange={(e) => setDamageAlertsEnabled(e.target.checked)}
            className="w-5 h-5 accent-primary cursor-pointer"
          />
        </div>

        <div className="pt-md border-t border-outline-variant/30 flex justify-end">
          <button
            onClick={handleSave}
            className="px-xl py-sm bg-primary text-on-primary font-label-md font-bold rounded shadow hover:bg-primary-fixed transition-colors"
          >
            Salvar preferências
          </button>
        </div>
      </div>
    </div>
  );
};
