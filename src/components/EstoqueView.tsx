import React, { useState } from 'react';
import { ToolItem, ToolStatus } from '../types';
import { STATUS_LABELS } from '../labels';

interface EstoqueViewProps {
  tools: ToolItem[];
  onAddTool: (newTool: Omit<ToolItem, 'id'>) => void;
  onUpdateToolStatus: (toolId: string, newStatus: ToolStatus, location?: string) => void;
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

const CATEGORY_CODE_LETTER: Record<ToolItem['category'], string> = {
  'Ferramentas Elétricas': 'P',
  'Ferramentas Manuais': 'H',
  'Equip. de Diagnóstico': 'D',
  'Automotivo Especializado': 'S',
};

const generateToolCode = (category: ToolItem['category']) => {
  const letter = CATEGORY_CODE_LETTER[category];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `TL-${letter}-${num}`;
};

export const EstoqueView: React.FC<EstoqueViewProps> = ({
  tools,
  onAddTool,
  onUpdateToolStatus,
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

  // New Tool Form State
  const [newToolCode, setNewToolCode] = useState(() => generateToolCode('Ferramentas Elétricas'));
  const [newToolName, setNewToolName] = useState('');
  const [newToolBrand, setNewToolBrand] = useState('Milwaukee');
  const [newToolCategory, setNewToolCategory] = useState<ToolItem['category']>('Ferramentas Elétricas');
  const [newToolLocation, setNewToolLocation] = useState('Almoxarifado Principal - Prateleira A1');
  const [newToolPhoto, setNewToolPhoto] = useState<string | null>(null);

  const handleOpenAddModal = () => {
    setNewToolCode(generateToolCode(newToolCategory));
    setNewToolPhoto(null);
    setShowAddModal(true);
  };

  const handleCategoryChange = (category: ToolItem['category']) => {
    setNewToolCategory(category);
    setNewToolCode(generateToolCode(category));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewToolPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

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

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newToolName || !newToolCode) return;
    onAddTool({
      code: newToolCode,
      qrCode: `QR-${newToolCode}`,
      name: newToolName,
      brand: newToolBrand,
      category: newToolCategory,
      location: newToolLocation,
      status: 'available',
      lastAuditDate: new Date().toISOString().slice(0, 10),
      photoUrl: newToolPhoto || undefined,
    });
    setShowAddModal(false);
    setNewToolName('');
    setNewToolPhoto(null);
  };

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
            onClick={handleOpenAddModal}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-lg">
          <div className="bg-surface-container rounded-xl shadow-2xl w-full max-w-[36rem] border border-outline-variant/30 overflow-hidden animate-in zoom-in-95">
            <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline-md text-headline-md text-on-surface">
                Cadastrar Ferramenta
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-on-surface-variant hover:text-on-surface p-xs rounded-full hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-lg flex flex-col gap-md bg-surface">
              {/* Photo Upload */}
              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Foto da ferramenta
                </label>
                <div className="flex items-center gap-md">
                  <label
                    htmlFor="tool-photo-input"
                    className="w-20 h-20 shrink-0 rounded-lg border-2 border-dashed border-outline-variant hover:border-primary bg-surface-container-high flex items-center justify-center cursor-pointer overflow-hidden transition-colors"
                  >
                    {newToolPhoto ? (
                      <img src={newToolPhoto} alt="Pré-visualização da ferramenta" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-on-surface-variant text-[28px]">add_a_photo</span>
                    )}
                  </label>
                  <input
                    id="tool-photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  <div className="flex flex-col gap-xs">
                    <span className="font-body-sm text-on-surface-variant">
                      {newToolPhoto ? 'Foto selecionada.' : 'Clique no quadro para escolher uma imagem.'}
                    </span>
                    {newToolPhoto && (
                      <button
                        type="button"
                        onClick={() => setNewToolPhoto(null)}
                        className="font-label-sm text-error hover:opacity-70 transition-opacity text-left"
                      >
                        Remover foto
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-md">
                <div className="flex-1 flex flex-col gap-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">
                    Código interno
                  </label>
                  <div className="flex items-center gap-xs">
                    <input
                      type="text"
                      readOnly
                      value={newToolCode}
                      className="w-full bg-surface-container-high border-b-2 border-outline-variant px-md py-sm text-body-md text-on-surface-variant font-label-md outline-none cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setNewToolCode(generateToolCode(newToolCategory))}
                      title="Gerar novo código"
                      className="p-sm text-on-surface-variant hover:text-primary hover:bg-surface-container-high rounded-lg transition-colors shrink-0"
                    >
                      <span className="material-symbols-outlined text-[20px]">refresh</span>
                    </button>
                  </div>
                  <span className="font-label-sm text-on-surface-variant/70">Gerado automaticamente</span>
                </div>
                <div className="flex-1 flex flex-col gap-xs">
                  <label className="font-label-sm text-label-sm text-on-surface-variant">
                    Marca
                  </label>
                  <input
                    type="text"
                    value={newToolBrand}
                    onChange={(e) => setNewToolBrand(e.target.value)}
                    className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Descrição / nome da ferramenta *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Catraca Sem Fio Milwaukee 3/8"
                  value={newToolName}
                  onChange={(e) => setNewToolName(e.target.value)}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Categoria
                </label>
                <select
                  value={newToolCategory}
                  onChange={(e) => handleCategoryChange(e.target.value as ToolItem['category'])}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none cursor-pointer"
                >
                  <option value="Ferramentas Elétricas">Ferramentas Elétricas</option>
                  <option value="Ferramentas Manuais">Ferramentas Manuais</option>
                  <option value="Equip. de Diagnóstico">Equip. de Diagnóstico</option>
                  <option value="Automotivo Especializado">Automotivo Especializado</option>
                </select>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-label-sm text-on-surface-variant">
                  Local de armazenamento
                </label>
                <input
                  type="text"
                  value={newToolLocation}
                  onChange={(e) => setNewToolLocation(e.target.value)}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
                />
              </div>

              <div className="p-lg bg-surface-container flex justify-end gap-md border-t border-outline-variant/30 mt-md">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-lg py-sm text-on-surface font-label-md hover:bg-surface-container-high rounded transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-lg py-sm bg-primary text-on-primary font-label-md rounded shadow-sm hover:bg-primary-fixed transition-colors font-bold"
                >
                  Salvar ferramenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
