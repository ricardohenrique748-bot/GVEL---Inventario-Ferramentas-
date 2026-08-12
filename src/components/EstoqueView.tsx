import React, { useState } from 'react';
import { ToolItem, ToolStatus } from '../types';
import { STATUS_LABELS } from '../labels';
import { AddToolModal } from './AddToolModal';

interface EstoqueViewProps {
  tools: ToolItem[];
  onAddTool: (newTool: Omit<ToolItem, 'id'>) => void;
  onUpdateToolStatus: (toolId: string, newStatus: ToolStatus, location?: string) => void;
  onDeleteTool: (toolId: string) => void;
  isAdmin: boolean;
}

const statusBadgeClasses: Record<ToolStatus, string> = {
  available: 'bg-primary-container text-on-primary-container',
  loaned: 'bg-secondary-container text-on-secondary-container',
  repair: 'bg-tertiary-container text-on-tertiary-container',
  lost: 'bg-error-container text-on-error-container',
};

const statusDotClasses: Record<ToolStatus, string> = {
  available: 'bg-primary',
  loaned: 'bg-secondary',
  repair: 'bg-tertiary',
  lost: 'bg-error',
};

export const EstoqueView: React.FC<EstoqueViewProps> = ({
  tools,
  onAddTool,
  onUpdateToolStatus,
  onDeleteTool,
  isAdmin,
}) => {
  // Filter States
  const [selectedStatuses, setSelectedStatuses] = useState<ToolStatus[]>([
    'available',
    'loaned',
    'repair',
    'lost',
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modal / menu states
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionMenuToolId, setActionMenuToolId] = useState<string | null>(null);

  const handleExportCSV = () => {
    const headers = ['Código Interno,Nome,Categoria,Marca,Localização,Status\n'];
    const rows = tools.map(
      (t) => `${t.code},"${t.name}",${t.category},${t.brand},"${t.location}",${t.status}`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `estoque-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  const toggleStatusFilter = (status: ToolStatus) => {
    if (selectedStatuses.includes(status)) {
      if (selectedStatuses.length > 1) {
        setSelectedStatuses(selectedStatuses.filter((s) => s !== status));
      }
    } else {
      setSelectedStatuses([...selectedStatuses, status]);
    }
  };

  const handleClearFilters = () => {
    setSelectedStatuses(['available', 'loaned', 'repair', 'lost']);
    setSelectedCategory('all');
  };

  const filteredTools = tools.filter((t) => {
    if (!selectedStatuses.includes(t.status)) return false;
    if (selectedCategory !== 'all' && t.category !== selectedCategory) return false;
    return true;
  });

  return (
    <div className="flex flex-col w-full h-full pb-xl select-none animate-in fade-in duration-300">
      {/* Top Header & Actions */}
      <div className="px-lg flex items-center justify-between mb-lg pt-lg">
        <div className="flex flex-col">
          <h1 className="font-headline-lg text-on-background">Estoque</h1>
          <p className="font-body-sm text-on-surface-variant mt-xs">
            Cadastre e acompanhe todas as ferramentas disponíveis na oficina.
          </p>
        </div>
        <div className="flex items-center gap-sm">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-sm px-md py-sm rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors font-label-md"
          >
            <span className="material-symbols-outlined text-[18px]">download</span>
            Exportar CSV
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-sm px-lg py-sm rounded-lg bg-primary hover:bg-primary/90 text-on-primary transition-colors font-label-md ml-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Nova ferramenta
          </button>
        </div>
      </div>

      {/* Main Content Layout: Left Filter Panel + Right Asset Table */}
      <div className="px-lg grid grid-cols-12 gap-lg min-h-[calc(100vh-200px)]">
        {/* Left Filters Panel */}
        <div className="col-span-12 lg:col-span-3 bg-surface-container-low rounded-xl p-lg flex flex-col gap-lg border border-outline-variant h-fit">
          <div className="flex items-center justify-between border-b border-outline-variant pb-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">filter_alt</span>
              Filtros
            </h2>
            <button
              onClick={handleClearFilters}
              className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm"
            >
              Limpar tudo
            </button>
          </div>

          {/* Status Checkboxes */}
          <div className="flex flex-col gap-sm">
            <label className="font-label-md text-label-md text-on-surface-variant mb-xs">
              Status
            </label>
            {(['available', 'loaned', 'repair', 'lost'] as ToolStatus[]).map((status) => (
              <label key={status} className="flex items-center gap-md cursor-pointer group select-none">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(status)}
                  onChange={() => toggleStatusFilter(status)}
                  className="w-4 h-4 rounded-sm border-outline-variant bg-surface-container-high text-primary focus:ring-primary/50"
                />
                <span className="font-body-md text-body-md text-on-surface group-hover:text-primary transition-colors flex items-center gap-sm">
                  <div className={`w-2 h-2 rounded-full ${statusDotClasses[status]}`} /> {STATUS_LABELS[status]}
                </span>
              </label>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex flex-col gap-sm">
            <label className="font-label-md text-label-md text-on-surface-variant mb-xs">
              Categoria
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-surface-container-high border border-outline-variant/30 text-on-surface font-body-md text-body-md rounded-lg py-sm px-md focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
            >
              <option value="all">Todas as Categorias</option>
              <option value="Ferramentas Elétricas">Ferramentas Elétricas</option>
              <option value="Ferramentas Manuais">Ferramentas Manuais</option>
              <option value="Equip. de Diagnóstico">Equip. de Diagnóstico</option>
              <option value="Automotivo Especializado">Automotivo Especializado</option>
            </select>
          </div>
        </div>

        {/* Right Asset Table */}
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-md">
          <div className="bg-surface-container-low rounded-xl shadow-sm flex flex-col flex-1 overflow-hidden relative border border-outline-variant/20">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-high sticky top-0 z-10 border-b border-outline-variant/20">
                  <tr>
                    <th className="py-md px-md font-label-md text-label-md text-on-surface-variant">
                      Código interno
                    </th>
                    <th className="py-md px-md font-label-md text-label-md text-on-surface-variant">
                      Foto
                    </th>
                    <th className="py-md px-md font-label-md text-label-md text-on-surface-variant">
                      Nome e categoria
                    </th>
                    <th className="py-md px-md font-label-md text-label-md text-on-surface-variant">
                      Localização
                    </th>
                    <th className="py-md px-md font-label-md text-label-md text-on-surface-variant">
                      Status
                    </th>
                    <th className="py-md px-md" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/10">
                  {filteredTools.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-xl text-center text-on-surface-variant font-body-md">
                        Nenhuma ferramenta encontrada com os filtros atuais.
                      </td>
                    </tr>
                  ) : (
                    filteredTools.map((tool) => {
                      const isAvailable = tool.status === 'available';
                      const isLoaned = tool.status === 'loaned';
                      const isRepair = tool.status === 'repair';
                      const isLost = tool.status === 'lost';

                      return (
                        <tr
                          key={tool.id}
                          className="hover:bg-surface-container transition-colors group"
                        >
                          {/* Internal Code */}
                          <td className="py-md px-md">
                            <span
                              className={`font-label-md text-label-md px-sm py-xs rounded ${
                                isAvailable
                                  ? 'text-primary bg-primary/10'
                                  : isLoaned
                                  ? 'text-secondary bg-secondary/10'
                                  : isRepair
                                  ? 'text-tertiary bg-tertiary/10'
                                  : 'text-error bg-error/10'
                              }`}
                            >
                              {tool.code}
                            </span>
                          </td>

                          {/* Photo */}
                          <td className="py-md px-md">
                            <div className="w-12 h-12 shrink-0 rounded-lg bg-surface-container-high overflow-hidden flex items-center justify-center">
                              {tool.photoUrl ? (
                                <img src={tool.photoUrl} alt={tool.name} className="w-full h-full object-cover" />
                              ) : (
                                <span className="material-symbols-outlined text-on-surface-variant text-[20px]">construction</span>
                              )}
                            </div>
                          </td>

                          {/* Name & Brand */}
                          <td className="py-md px-md">
                            <div className="flex flex-col">
                              <span
                                className={`font-headline-sm text-headline-sm text-[16px] leading-tight mb-xs ${
                                  isLost ? 'text-on-surface-variant/70 line-through' : 'text-on-surface'
                                }`}
                              >
                                {tool.name}
                              </span>
                              <span className="font-label-sm text-label-sm text-on-surface-variant">
                                {tool.category} • Marca: {tool.brand}
                              </span>
                            </div>
                          </td>

                          {/* Location / Assignee */}
                          <td className="py-md px-md">
                            <span className="font-body-md text-body-md text-on-surface flex items-center gap-xs">
                              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                                {isLoaned ? 'person' : isRepair ? 'build' : 'home_storage'}
                              </span>
                              {tool.assignedTo || tool.location}
                            </span>
                          </td>

                          {/* Status Badge */}
                          <td className="py-md px-md">
                            <div
                              className={`inline-flex items-center gap-xs px-sm py-xs rounded-full ${statusBadgeClasses[tool.status]}`}
                            >
                              <div className={`w-2 h-2 rounded-full ${statusDotClasses[tool.status]}`} />
                              <span className="font-label-sm text-label-sm font-bold">
                                {STATUS_LABELS[tool.status]}
                              </span>
                            </div>
                          </td>

                          {/* Action Vert Menu */}
                          <td className="py-md px-md text-right relative">
                            <button
                              onClick={() =>
                                setActionMenuToolId(actionMenuToolId === tool.id ? null : tool.id)
                              }
                              className="p-xs text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors"
                            >
                              <span className="material-symbols-outlined text-[20px]">
                                more_vert
                              </span>
                            </button>

                            {actionMenuToolId === tool.id && (
                              <div className="absolute right-md top-12 w-48 bg-surface-container shadow-2xl rounded-xl border border-outline-variant/30 py-xs z-30 text-left animate-in fade-in zoom-in-95">
                                <button
                                  onClick={() => {
                                    onUpdateToolStatus(tool.id, 'available', 'Almoxarifado Principal - Prateleira A1');
                                    setActionMenuToolId(null);
                                  }}
                                  className="w-full px-md py-xs text-body-sm text-on-surface hover:bg-surface-container-high flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-[16px] text-primary">
                                    check_circle
                                  </span>
                                  Marcar como Disponível
                                </button>
                                <button
                                  onClick={() => {
                                    onUpdateToolStatus(tool.id, 'repair', 'Laboratório de Calibração');
                                    setActionMenuToolId(null);
                                  }}
                                  className="w-full px-md py-xs text-body-sm text-on-surface hover:bg-surface-container-high flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-[16px] text-tertiary">
                                    build
                                  </span>
                                  Enviar para Manutenção
                                </button>
                                <button
                                  onClick={() => {
                                    onUpdateToolStatus(tool.id, 'lost', 'Não atribuído');
                                    setActionMenuToolId(null);
                                  }}
                                  className="w-full px-md py-xs text-body-sm text-error hover:bg-surface-container-high flex items-center gap-2"
                                >
                                  <span className="material-symbols-outlined text-[16px] text-error">
                                    report_problem
                                  </span>
                                  Marcar como Perdida
                                </button>
                                {isAdmin && (
                                  <>
                                    <div className="my-xs border-t border-outline-variant/30" />
                                    <button
                                      onClick={() => {
                                        setActionMenuToolId(null);
                                        if (window.confirm(`Excluir permanentemente "${tool.name}" (${tool.code})?`)) {
                                          onDeleteTool(tool.id);
                                        }
                                      }}
                                      className="w-full px-md py-xs text-body-sm text-error hover:bg-error-container/40 flex items-center gap-2 font-bold"
                                    >
                                      <span className="material-symbols-outlined text-[16px] text-error">
                                        delete
                                      </span>
                                      Excluir Ferramenta
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Footer count */}
            <div className="bg-surface-container p-md flex items-center justify-between border-t border-outline-variant/10 rounded-b-xl">
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Mostrando {filteredTools.length} de {tools.length} ativos
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Add Tool */}
      {showAddModal && (
        <AddToolModal onClose={() => setShowAddModal(false)} onAddTool={onAddTool} />
      )}
    </div>
  );
};
