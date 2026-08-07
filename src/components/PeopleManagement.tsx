import React, { useState } from 'react';
import { Person } from '../types';
import { CameraCapture } from './CameraCapture';

interface PeopleManagementProps {
  people: Person[];
  onAddPerson: (person: Omit<Person, 'id'>) => void;
  onUpdatePerson: (id: string, updates: Partial<Person>) => void;
  onTogglePersonActive: (id: string) => void;
}

const ROLE_OPTIONS = ['Mecânico', 'Auxiliar de Mecânica', 'Supervisor', 'Almoxarife', 'Administrativo'];

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

const emptyForm = {
  name: '',
  registration: '',
  role: ROLE_OPTIONS[0],
  sector: '',
  username: '',
  email: '',
  password: generatePassword(),
  photoUrl: null as string | null,
};

export const PeopleManagement: React.FC<PeopleManagementProps> = ({
  people,
  onAddPerson,
  onUpdatePerson,
  onTogglePersonActive,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingId(null);
    setForm({ ...emptyForm, password: generatePassword() });
    setUsernameTouched(false);
    setEmailTouched(false);
    setShowModal(true);
  };

  const openEditModal = (person: Person) => {
    setEditingId(person.id);
    setForm({
      name: person.name,
      registration: person.registration,
      role: person.role,
      sector: person.sector,
      username: person.username,
      email: person.email,
      password: person.password,
      photoUrl: person.photoUrl || null,
    });
    setUsernameTouched(true);
    setEmailTouched(true);
    setShowModal(true);
    setActionMenuId(null);
  };

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

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.username.trim() || !form.email.trim() || !form.password.trim()) return;

    const payload = { ...form, photoUrl: form.photoUrl || undefined };

    if (editingId) {
      onUpdatePerson(editingId, payload);
    } else {
      onAddPerson({ ...payload, active: true });
    }
    setShowModal(false);
  };

  return (
    <div className="bg-surface-container rounded-xl p-lg border border-outline-variant/30 max-w-3xl">
      <div className="flex items-center justify-between mb-md">
        <div>
          <h2 className="font-headline-sm text-on-surface">Pessoas e usuários</h2>
          <p className="font-label-sm text-on-surface-variant mt-xs">
            Cadastre quem pode retirar ferramentas do estoque e crie o usuário de acesso de cada um.
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-sm px-md py-sm rounded-lg bg-primary hover:bg-primary/90 text-on-primary transition-colors font-label-md shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Nova pessoa
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-outline-variant/20">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-high">
            <tr>
              <th className="py-sm px-md font-label-md text-on-surface-variant">Nome</th>
              <th className="py-sm px-md font-label-md text-on-surface-variant">Função</th>
              <th className="py-sm px-md font-label-md text-on-surface-variant">Usuário</th>
              <th className="py-sm px-md font-label-md text-on-surface-variant">Senha</th>
              <th className="py-sm px-md font-label-md text-on-surface-variant">Status</th>
              <th className="py-sm px-md" />
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {people.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-lg text-center text-on-surface-variant font-body-sm">
                  Nenhuma pessoa cadastrada ainda.
                </td>
              </tr>
            ) : (
              people.map((person) => (
                <tr key={person.id} className="hover:bg-surface-container-high/50 transition-colors">
                  <td className="py-sm px-md">
                    <div className="flex items-center gap-sm">
                      <div className="w-9 h-9 rounded-full bg-surface-container-high overflow-hidden shrink-0 flex items-center justify-center border border-outline-variant/30">
                        {person.photoUrl ? (
                          <img src={person.photoUrl} alt={person.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-on-surface-variant text-[18px]">face</span>
                        )}
                      </div>
                      <div>
                        <p className="font-body-sm text-on-surface font-medium">{person.name}</p>
                        <p className="font-label-sm text-on-surface-variant">
                          {person.registration || '—'} • {person.sector || 'Sem setor'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-sm px-md font-body-sm text-on-surface-variant">{person.role}</td>
                  <td className="py-sm px-md">
                    <p className="font-label-md text-primary">{person.username}</p>
                    <p className="font-label-sm text-on-surface-variant">{person.email}</p>
                  </td>
                  <td className="py-sm px-md">
                    <div className="flex items-center gap-xs font-label-md text-on-surface-variant">
                      <span className="font-mono">
                        {revealedIds.includes(person.id) ? person.password : '••••••••'}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleReveal(person.id)}
                        className="text-on-surface-variant hover:text-primary transition-colors"
                        title={revealedIds.includes(person.id) ? 'Ocultar senha' : 'Mostrar senha'}
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          {revealedIds.includes(person.id) ? 'visibility_off' : 'visibility'}
                        </span>
                      </button>
                    </div>
                  </td>
                  <td className="py-sm px-md">
                    <span
                      className={`font-label-sm px-sm py-xs rounded-full font-bold ${
                        person.active
                          ? 'bg-primary-container text-on-primary-container'
                          : 'bg-surface-container-highest text-on-surface-variant'
                      }`}
                    >
                      {person.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-sm px-md text-right relative">
                    <button
                      onClick={() => setActionMenuId(actionMenuId === person.id ? null : person.id)}
                      className="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">more_vert</span>
                    </button>
                    {actionMenuId === person.id && (
                      <div className="absolute right-md top-10 w-44 bg-surface-container shadow-2xl rounded-xl border border-outline-variant/30 py-xs z-30 text-left animate-in fade-in zoom-in-95">
                        <button
                          onClick={() => openEditModal(person)}
                          className="w-full px-md py-xs text-body-sm text-on-surface hover:bg-surface-container-high flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px] text-primary">edit</span>
                          Editar
                        </button>
                        <button
                          onClick={() => {
                            onTogglePersonActive(person.id);
                            setActionMenuId(null);
                          }}
                          className="w-full px-md py-xs text-body-sm text-on-surface hover:bg-surface-container-high flex items-center gap-2"
                        >
                          <span className="material-symbols-outlined text-[16px] text-secondary">
                            {person.active ? 'block' : 'check_circle'}
                          </span>
                          {person.active ? 'Desativar' : 'Ativar'}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-lg">
          <div className="bg-surface-container rounded-xl shadow-2xl w-full max-w-[32rem] border border-outline-variant/30 overflow-hidden animate-in zoom-in-95">
            <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline-md text-on-surface">
                {editingId ? 'Editar pessoa' : 'Cadastrar pessoa'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
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
                  onClick={() => setShowModal(false)}
                  className="px-lg py-sm text-on-surface font-label-md hover:bg-surface-container-high rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-lg py-sm bg-primary text-on-primary font-label-md rounded shadow-sm hover:bg-primary-fixed transition-colors font-bold"
                >
                  {editingId ? 'Salvar alterações' : 'Cadastrar pessoa'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
