import React, { useState } from 'react';
import { Person } from '../types';
import { PersonFormModal } from './PersonFormModal';

interface PeopleManagementProps {
  people: Person[];
  onAddPerson: (person: Omit<Person, 'id'>) => void;
  onUpdatePerson: (id: string, updates: Partial<Person>) => void;
  onTogglePersonActive: (id: string) => void;
  onDeletePerson: (id: string) => void;
  isAdmin: boolean;
}

export const PeopleManagement: React.FC<PeopleManagementProps> = ({
  people,
  onAddPerson,
  onUpdatePerson,
  onTogglePersonActive,
  onDeletePerson,
  isAdmin,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  const openAddModal = () => {
    setEditingPerson(null);
    setShowModal(true);
  };

  const openEditModal = (person: Person) => {
    setEditingPerson(person);
    setShowModal(true);
    setActionMenuId(null);
  };

  const toggleReveal = (id: string) => {
    setRevealedIds((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  return (
    <div className="bg-surface-container rounded-xl p-lg border border-outline-variant/30 max-w-3xl">
      <div className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between mb-md">
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
                        {isAdmin && (
                          <>
                            <div className="my-xs border-t border-outline-variant/30" />
                            <button
                              onClick={() => {
                                setActionMenuId(null);
                                if (window.confirm(`Excluir permanentemente "${person.name}"? Essa ação não pode ser desfeita.`)) {
                                  onDeletePerson(person.id);
                                }
                              }}
                              className="w-full px-md py-xs text-body-sm text-error hover:bg-error-container/40 flex items-center gap-2 font-bold"
                            >
                              <span className="material-symbols-outlined text-[16px] text-error">delete</span>
                              Excluir
                            </button>
                          </>
                        )}
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
        <PersonFormModal
          onClose={() => setShowModal(false)}
          onAddPerson={onAddPerson}
          onUpdatePerson={onUpdatePerson}
          editingPerson={editingPerson}
        />
      )}
    </div>
  );
};
