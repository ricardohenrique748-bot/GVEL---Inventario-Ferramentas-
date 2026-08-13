import React, { useState } from 'react';
import { Person, ToolItem, Category } from '../types';
import { CameraCapture } from './CameraCapture';
import { AddToolModal } from './AddToolModal';
import { PersonFormModal } from './PersonFormModal';

interface ToolRequestsViewProps {
  tools: ToolItem[];
  categories?: Category[];
  mechanicNames: string[];
  onRequestTools: (
    toolIds: string[],
    requesterName: string,
    requesterBay: string,
    proofPhotoUrl: string
  ) => void;
  isAdmin?: boolean;
  onAddTool?: (newTool: Omit<ToolItem, 'id'>) => void;
  onAddCategory?: (name: string) => void;
  onDeleteTool?: (toolId: string) => void;
  onAddPerson?: (person: Omit<Person, 'id'>) => void;
}

export const ToolRequestsView: React.FC<ToolRequestsViewProps> = ({
  tools,
  categories = [],
  mechanicNames,
  onRequestTools,
  isAdmin,
  onAddTool,
  onAddCategory,
  onDeleteTool,
  onAddPerson,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showAddToolModal, setShowAddToolModal] = useState(false);
  const [showAddPersonModal, setShowAddPersonModal] = useState(false);
  const [requesterName, setRequesterName] = useState('');
  const [requesterBay, setRequesterBay] = useState('');
  const [proofPhoto, setProofPhoto] = useState<string | null>(null);

  const availableTools = tools.filter((t) => {
    if (t.status !== 'available') return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      if (!t.name.toLowerCase().includes(q) && !t.code.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const loanedTools = tools.filter((t) => {
    if (t.status !== 'loaned') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      const matches =
        t.name.toLowerCase().includes(q) ||
        t.code.toLowerCase().includes(q) ||
        (t.assignedTo || '').toLowerCase().includes(q);
      if (!matches) return false;
    }
    return true;
  });

  const selectedTools = tools.filter((t) => selectedToolIds.includes(t.id));

  const toggleTool = (toolId: string) => {
    setSelectedToolIds((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedToolIds.length === 0 || !requesterName.trim() || !proofPhoto) return;
    onRequestTools(selectedToolIds, requesterName.trim(), requesterBay.trim(), proofPhoto);
    setSelectedToolIds([]);
    setRequesterName('');
    setRequesterBay('');
    setProofPhoto(null);
    setShowRequestModal(false);
  };

  const closeRequestModal = () => {
    setShowRequestModal(false);
    setProofPhoto(null);
  };

  return (
    <div className="flex flex-col w-full h-full pb-32 select-none animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="px-lg flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between mb-lg pt-lg">
        <div className="flex flex-col">
          <h1 className="font-headline-lg text-on-background">Solicitação de Ferramentas</h1>
          <p className="font-body-sm text-on-surface-variant mt-xs">
            Selecione as ferramentas disponíveis no estoque para registrar a retirada.
          </p>
        </div>
        {isAdmin && (onAddTool || onAddPerson) && (
          <div className="flex flex-wrap items-center gap-sm shrink-0">
            {onAddTool && (
              <button
                onClick={() => setShowAddToolModal(true)}
                className="flex items-center gap-sm px-lg py-sm rounded-lg bg-primary hover:bg-primary/90 text-on-primary transition-colors font-label-md"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Cadastrar Ferramenta
              </button>
            )}
            {onAddPerson && (
              <button
                onClick={() => setShowAddPersonModal(true)}
                className="flex items-center gap-sm px-lg py-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors font-label-md border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[18px]">person_add</span>
                Cadastrar Usuário
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Content Layout: Left Filter Panel + Right Tool Grid */}
      <div className="px-lg grid grid-cols-12 gap-lg">
        {/* Left Filters Panel */}
        <div className="col-span-12 lg:col-span-3 bg-surface-container-low rounded-xl p-lg flex flex-col gap-lg border border-outline-variant h-fit">
          <div className="flex items-center justify-between border-b border-outline-variant pb-md">
            <h2 className="font-headline-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">filter_alt</span>
              Filtros
            </h2>
          </div>

          <div className="flex flex-col gap-xs">
            <label className="font-label-md text-on-surface-variant mb-xs">Buscar</label>
            <div className="relative">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px] absolute left-3 top-1/2 -translate-y-1/2">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nome, código ou responsável"
                className="w-full bg-surface-container-high border border-outline-variant/30 text-on-surface font-body-md rounded-lg py-sm pl-9 pr-md focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-sm">
            <label className="font-label-md text-on-surface-variant mb-xs">Categoria</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant/30 text-on-surface font-body-md rounded-lg py-sm px-md focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
            >
              <option value="all">Todas as Categorias</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          {selectedToolIds.length > 0 && (
            <div className="flex flex-col gap-xs pt-md border-t border-outline-variant">
              <span className="font-label-md text-on-surface-variant">
                {selectedToolIds.length} selecionada{selectedToolIds.length > 1 ? 's' : ''}
              </span>
              <button
                onClick={() => setSelectedToolIds([])}
                className="font-label-sm text-error hover:opacity-70 transition-opacity text-left"
              >
                Limpar seleção
              </button>
            </div>
          )}
        </div>

        {/* Right Tool Grid */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-lg">
          {availableTools.length === 0 ? (
            <div className="bg-surface-container-low rounded-xl border border-outline-variant/20 py-2xl flex flex-col items-center justify-center gap-sm">
              <span className="material-symbols-outlined text-on-surface-variant text-[32px]">inventory_2</span>
              <span className="font-body-md text-on-surface-variant">
                Nenhuma ferramenta disponível encontrada.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-md">
              {availableTools.map((tool) => {
                const isSelected = selectedToolIds.includes(tool.id);
                return (
                  <div key={tool.id} className="relative">
                    <button
                      type="button"
                      onClick={() => toggleTool(tool.id)}
                      className={`w-full text-left bg-surface-container-low rounded-xl p-md border-2 transition-colors flex gap-md items-start ${
                        isSelected
                          ? 'border-primary bg-primary-container/30'
                          : 'border-outline-variant/30 hover:border-primary/40'
                      }`}
                    >
                      <div className="w-12 h-12 shrink-0 rounded-lg bg-surface-container-high overflow-hidden flex items-center justify-center">
                        {tool.photoUrl ? (
                          <img src={tool.photoUrl} alt={tool.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">construction</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-headline-sm text-[15px] leading-tight text-on-surface mb-xs truncate">
                          {tool.name}
                        </p>
                        <p className="font-label-sm text-on-surface-variant truncate">
                          {tool.code} • {tool.brand}
                        </p>
                        <p className="font-label-sm text-on-surface-variant/80 truncate mt-xs">
                          {tool.location}
                        </p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center ${
                          isSelected ? 'bg-primary border-primary' : 'border-outline-variant'
                        }`}
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined text-on-primary text-[14px]">check</span>
                        )}
                      </div>
                    </button>

                    {isAdmin && onDeleteTool && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Excluir permanentemente "${tool.name}" (${tool.code})?`)) {
                            onDeleteTool(tool.id);
                          }
                        }}
                        title="Excluir ferramenta"
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-error text-on-error flex items-center justify-center shadow-md hover:opacity-90 transition-opacity"
                      >
                        <span className="material-symbols-outlined text-[15px]">delete</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Currently loaned-out tools, for context */}
          <div className="bg-surface-container-low rounded-xl shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="p-md border-b border-outline-variant/20">
              <h2 className="font-headline-sm text-on-surface">Retiradas ativas</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-high">
                  <tr>
                    <th className="py-sm px-md font-label-md text-on-surface-variant">Comprovação</th>
                    <th className="py-sm px-md font-label-md text-on-surface-variant">Código</th>
                    <th className="py-sm px-md font-label-md text-on-surface-variant">Ferramenta</th>
                    <th className="py-sm px-md font-label-md text-on-surface-variant">Com quem está</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {loanedTools.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-lg text-center text-on-surface-variant font-body-sm">
                        Nenhuma ferramenta emprestada no momento.
                      </td>
                    </tr>
                  ) : (
                    loanedTools.map((tool) => (
                      <tr key={tool.id} className="hover:bg-surface-container transition-colors">
                        <td className="py-sm px-md">
                          <div className="w-9 h-9 rounded-full bg-surface-container-high overflow-hidden flex items-center justify-center border border-outline-variant/30">
                            {tool.assignedPhotoUrl ? (
                              <img
                                src={tool.assignedPhotoUrl}
                                alt={`Comprovante: ${tool.assignedTo}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="material-symbols-outlined text-on-surface-variant text-[16px]">
                                no_photography
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-sm px-md font-label-md text-secondary">{tool.code}</td>
                        <td className="py-sm px-md font-body-sm text-on-surface">{tool.name}</td>
                        <td className="py-sm px-md font-body-sm text-on-surface-variant">
                          {tool.assignedTo || '—'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky selection bar */}
      {selectedToolIds.length > 0 && (
        <div className="fixed bottom-0 left-0 lg:left-[17rem] right-0 z-30 bg-surface-container shadow-2xl border-t border-outline-variant px-lg py-md flex items-center justify-between animate-in slide-in-from-bottom-3">
          <span className="font-label-md text-on-surface flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-[20px]">shopping_cart_checkout</span>
            {selectedToolIds.length} ferramenta{selectedToolIds.length > 1 ? 's' : ''} selecionada{selectedToolIds.length > 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setShowRequestModal(true)}
            className="px-lg py-sm bg-primary hover:bg-primary/90 text-on-primary font-label-md rounded-lg font-bold transition-colors"
          >
            Solicitar retirada
          </button>
        </div>
      )}

      {/* Modal: Confirm Request */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-lg">
          <div className="bg-surface-container rounded-xl shadow-2xl w-full max-w-[32rem] max-h-[92vh] border border-outline-variant/30 overflow-y-auto animate-in zoom-in-95">
            <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">shopping_cart_checkout</span>
                Confirmar retirada
              </h2>
              <button
                onClick={closeRequestModal}
                className="text-on-surface-variant hover:text-on-surface p-xs rounded-full hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-lg flex flex-col gap-md bg-surface">
              <div className="flex flex-col gap-xs items-center">
                <label className="font-label-sm text-on-surface-variant self-start">
                  Foto de comprovação *
                </label>
                <p className="font-label-sm text-on-surface-variant/70 self-start -mt-xs mb-xs">
                  Tire uma foto de quem está retirando, para provar quem pegou.
                </p>
                <CameraCapture value={proofPhoto} onCapture={setProofPhoto} onClear={() => setProofPhoto(null)} size={160} />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-on-surface-variant">Ferramentas selecionadas</label>
                <div className="flex flex-col gap-xs max-h-40 overflow-y-auto">
                  {selectedTools.map((tool) => (
                    <div
                      key={tool.id}
                      className="flex items-center justify-between bg-surface-container-high rounded-lg px-md py-sm"
                    >
                      <span className="font-body-sm text-on-surface">
                        {tool.name} <span className="text-on-surface-variant">({tool.code})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleTool(tool.id)}
                        className="text-on-surface-variant hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-on-surface-variant">Nome do solicitante *</label>
                <input
                  type="text"
                  required
                  list="mechanic-name-suggestions"
                  value={requesterName}
                  onChange={(e) => setRequesterName(e.target.value)}
                  placeholder="ex: J. Miller"
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
                />
                <datalist id="mechanic-name-suggestions">
                  {mechanicNames.map((name) => (
                    <option key={name} value={name} />
                  ))}
                </datalist>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-on-surface-variant">Baia / setor</label>
                <input
                  type="text"
                  value={requesterBay}
                  onChange={(e) => setRequesterBay(e.target.value)}
                  placeholder="ex: Baia 3"
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
                />
              </div>

              <div className="p-lg bg-surface-container flex justify-end gap-md border-t border-outline-variant/30 mt-md -mx-lg -mb-lg">
                <button
                  type="button"
                  onClick={closeRequestModal}
                  className="px-lg py-sm text-on-surface font-label-md hover:bg-surface-container-high rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!proofPhoto || !requesterName.trim()}
                  className="px-lg py-sm bg-primary text-on-primary font-label-md rounded shadow-sm hover:bg-primary-fixed transition-colors font-bold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-primary"
                >
                  Confirmar retirada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Tool (admin only) */}
      {showAddToolModal && onAddTool && (
        <AddToolModal
          onClose={() => setShowAddToolModal(false)}
          onAddTool={onAddTool}
          categories={categories}
          onAddCategory={onAddCategory || (() => {})}
        />
      )}

      {/* Modal: Add Person (admin only) */}
      {showAddPersonModal && onAddPerson && (
        <PersonFormModal onClose={() => setShowAddPersonModal(false)} onAddPerson={onAddPerson} />
      )}
    </div>
  );
};
