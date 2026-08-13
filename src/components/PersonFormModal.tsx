import React, { useState } from 'react';
import { Person } from '../types';
import { CameraCapture } from './CameraCapture';

interface PersonFormModalProps {
  onClose: () => void;
  onAddPerson: (person: Omit<Person, 'id'>) => void;
  onUpdatePerson?: (id: string, updates: Partial<Person>) => void;
  editingPerson?: Person | null;
}

const ROLE_OPTIONS = ['Administrador', 'Mecânico', 'Auxiliar de Mecânica', 'Supervisor', 'Almoxarife', 'Administrativo'];

const suggestUsername = (name: string) =>
  name
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .join('.');

const generatePassword = () => Math.random().toString(36).slice(-8);

export const PersonFormModal: React.FC<PersonFormModalProps> = ({
  onClose,
  onAddPerson,
  onUpdatePerson,
  editingPerson,
}) => {
  const [form, setForm] = useState(() =>
    editingPerson
      ? {
          name: editingPerson.name,
          registration: editingPerson.registration,
          role: editingPerson.role,
          sector: editingPerson.sector,
          username: editingPerson.username,
          email: editingPerson.email,
          password: editingPerson.password,
          photoUrl: editingPerson.photoUrl || null,
        }
      : {
          name: '',
          registration: '',
          role: ROLE_OPTIONS[0],
          sector: '',
          username: '',
          email: '',
          password: generatePassword(),
          photoUrl: null as string | null,
        }
  );
  const [usernameTouched, setUsernameTouched] = useState(!!editingPerson);
  const [emailTouched, setEmailTouched] = useState(!!editingPerson);

  const handleNameChange = (name: string) => {
    setForm((prev) => {
      const username = usernameTouched ? prev.username : suggestUsername(name);
      return {
        ...prev,
        name,
        username,
        email: emailTouched ? prev.email : (username ? `${username}@gvel.com` : ''),
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.username.trim() || !form.email.trim() || !form.password.trim()) return;

    const payload = { ...form, photoUrl: form.photoUrl || undefined };

    if (editingPerson && onUpdatePerson) {
      onUpdatePerson(editingPerson.id, payload);
    } else {
      onAddPerson({ ...payload, active: true });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-lg">
      <div className="bg-surface-container rounded-xl shadow-2xl w-full max-w-[32rem] max-h-[92vh] border border-outline-variant/30 overflow-y-auto animate-in zoom-in-95">
        <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
          <h2 className="font-headline-md text-on-surface">
            {editingPerson ? 'Editar pessoa' : 'Cadastrar pessoa'}
          </h2>
          <button
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-xs rounded-full hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-lg flex flex-col gap-md bg-surface">
          <div className="flex flex-col gap-xs items-center">
            <label className="font-label-sm text-on-surface-variant self-start">
              Foto do rosto (identificação facial)
            </label>
            <CameraCapture
              value={form.photoUrl}
              onCapture={(dataUrl) => setForm((prev) => ({ ...prev, photoUrl: dataUrl }))}
              onClear={() => setForm((prev) => ({ ...prev, photoUrl: null }))}
              size={160}
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-on-surface-variant">Nome completo *</label>
            <input
              type="text"
              required
              placeholder="ex: J. Miller"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
            />
          </div>

          <div className="flex gap-md">
            <div className="flex-1 flex flex-col gap-xs">
              <label className="font-label-sm text-on-surface-variant">Matrícula</label>
              <input
                type="text"
                placeholder="ex: MAT-8922"
                value={form.registration}
                onChange={(e) => setForm((prev) => ({ ...prev, registration: e.target.value }))}
                className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
              />
            </div>
            <div className="flex-1 flex flex-col gap-xs">
              <label className="font-label-sm text-on-surface-variant">Função</label>
              <select
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none cursor-pointer"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-on-surface-variant">Setor / turno</label>
            <input
              type="text"
              placeholder="ex: Turno Alpha / Baia 3"
              value={form.sector}
              onChange={(e) => setForm((prev) => ({ ...prev, sector: e.target.value }))}
              className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
            />
          </div>

          <div className="flex flex-col gap-xs">
            <label className="font-label-sm text-on-surface-variant">Email de acesso *</label>
            <input
              type="email"
              required
              placeholder="ex: j.miller@gvel.com"
              value={form.email}
              onChange={(e) => {
                setEmailTouched(true);
                setForm((prev) => ({ ...prev, email: e.target.value }));
              }}
              className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
            />
            <span className="font-label-sm text-on-surface-variant/70">
              Usado para entrar no sistema com email e senha
            </span>
          </div>

          <div className="flex gap-md">
            <div className="flex-1 flex flex-col gap-xs">
              <label className="font-label-sm text-on-surface-variant">Usuário *</label>
              <input
                type="text"
                required
                value={form.username}
                onChange={(e) => {
                  setUsernameTouched(true);
                  setForm((prev) => ({ ...prev, username: e.target.value }));
                }}
                className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
              />
              <span className="font-label-sm text-on-surface-variant/70">Sugerido a partir do nome</span>
            </div>
            <div className="flex-1 flex flex-col gap-xs">
              <label className="font-label-sm text-on-surface-variant">Senha *</label>
              <div className="flex items-center gap-xs">
                <input
                  type="text"
                  required
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, password: generatePassword() }))}
                  title="Gerar nova senha"
                  className="p-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors shrink-0"
                >
                  <span className="material-symbols-outlined text-[20px]">refresh</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-lg bg-surface-container flex justify-end gap-md border-t border-outline-variant/30 mt-md -mx-lg -mb-lg">
            <button
              type="button"
              onClick={onClose}
              className="px-lg py-sm text-on-surface font-label-md hover:bg-surface-container-high rounded transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-lg py-sm bg-primary text-on-primary font-label-md rounded shadow-sm hover:bg-primary-fixed transition-colors font-bold"
            >
              {editingPerson ? 'Salvar alterações' : 'Cadastrar pessoa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
