import React, { useState } from 'react';
import { MechanicBox } from '../types';

interface MechanicBoxesViewProps {
  boxes: MechanicBox[];
  onAuditBox: (boxId: string, updatedBox: Partial<MechanicBox>) => void;
  onRegisterBox: (newBox: Omit<MechanicBox, 'id'>) => void;
}

export const MechanicBoxesView: React.FC<MechanicBoxesViewProps> = ({
  boxes,
  onAuditBox,
  onRegisterBox,
}) => {
  const [teamFilter, setTeamFilter] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('low-to-high');
  const [activeAuditBox, setActiveAuditBox] = useState<MechanicBox | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Quick Audit Form Items State inside modal
  const [auditChecklist, setAuditChecklist] = useState<
    { name: string; present: boolean }[]
  >([]);

  // Register Box Form State
  const [regBoxNum, setRegBoxNum] = useState('');
  const [regMechName, setRegMechName] = useState('');
  const [regMechId, setRegMechId] = useState('');
  const [regTeam, setRegTeam] = useState<'Turno Alpha' | 'Turno Bravo' | 'Turno Noturno'>('Turno Alpha');

  // Filter & Sort
  const filteredBoxes = boxes
    .filter((b) => (teamFilter === 'All' ? true : b.team === teamFilter))
    .sort((a, b) => {
      if (sortOption === 'low-to-high') return a.compliancePercentage - b.compliancePercentage;
      if (sortOption === 'high-to-low') return b.compliancePercentage - a.compliancePercentage;
      return a.boxNumber.localeCompare(b.boxNumber);
    });

  // Calculate Metrics
  const avgCompliance = (
    boxes.reduce((acc, b) => acc + b.compliancePercentage, 0) / (boxes.length || 1)
  ).toFixed(1);
  const affectedBoxesCount = boxes.filter((b) => b.missingCount > 0).length;

  const handleOpenQuickAudit = (box: MechanicBox) => {
    setActiveAuditBox(box);
    // Build initial checklist
    const items = [
      { name: 'Chave 10mm', present: !box.missingItemsList.includes('Chave 10mm') && !box.missingItemsList.includes('Soquete Sextavado 10mm') },
      { name: 'Chave Dinamométrica 1/4"', present: !box.missingItemsList.includes('Chave Dinamométrica 1/4"') },
      { name: 'Extensão de Catraca 3/8"', present: !box.missingItemsList.includes('Extensão de Catraca 3/8"') },
      { name: 'Manômetro de Linha Pneumática', present: !box.missingItemsList.includes('Manômetro de Linha Pneumática') },
      { name: 'Jogo de Alicates (3pç)', present: true },
      { name: 'Paquímetro Digital', present: true },
    ];
    setAuditChecklist(items);
  };

  const handleToggleCheckitem = (index: number) => {
    const updated = [...auditChecklist];
    updated[index].present = !updated[index].present;
    setAuditChecklist(updated);
  };

  const handleSaveAudit = () => {
    if (!activeAuditBox) return;
    const missing = auditChecklist.filter((item) => !item.present).map((i) => i.name);
    const presentCount = auditChecklist.filter((i) => i.present).length;
    const newComp = Math.round((presentCount / auditChecklist.length) * 100);

    onAuditBox(activeAuditBox.id, {
      compliancePercentage: newComp,
      missingCount: missing.length,
      missingItemsList: missing,
      status: missing.length === 0 ? 'complete' : 'incomplete',
      lastAudit: 'agora mesmo',
    });
    setActiveAuditBox(null);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regBoxNum || !regMechName) return;
    onRegisterBox({
      boxNumber: regBoxNum.startsWith('Caixa #') ? regBoxNum : `Caixa #${regBoxNum}`,
      mechanicName: regMechName,
      mechanicId: regMechId || 'MAT-' + Math.floor(1000 + Math.random() * 9000),
      team: regTeam,
      supervisor: 'Supervisor Vance',
      compliancePercentage: 100,
      missingCount: 0,
      missingItemsList: [],
      status: 'complete',
      lastAudit: 'Recém-registrada',
    });
    setShowRegisterModal(false);
    setRegBoxNum('');
    setRegMechName('');
  };

  return (
    <div className="flex flex-col w-full px-xl py-lg select-none animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex justify-between items-end mb-xl">
        <div>
          <h1 className="font-display-lg text-display-lg text-on-background tracking-tight">
            Caixas dos Mecânicos
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-sm">
            Conformidade da frota e acompanhamento de auditorias
          </p>
        </div>
        <div className="flex gap-md">
          <button
            onClick={() => setShowRegisterModal(true)}
            className="bg-primary text-on-primary font-label-md text-label-md px-lg py-sm rounded flex items-center gap-sm shadow-md hover:bg-primary-fixed transition-colors font-bold cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add_box</span>
            Registrar nova caixa
          </button>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mb-xl">
        {/* Avg Fleet Compliance */}
        <div className="bg-surface-container rounded-xl p-lg border border-outline-variant relative overflow-hidden group">
          <div className="flex items-center gap-sm mb-sm relative z-10">
            <span className="material-symbols-outlined text-primary">analytics</span>
            <span className="font-label-md text-label-md text-on-surface-variant">
              Conformidade média da frota
            </span>
          </div>
          <div className="flex items-baseline gap-sm relative z-10">
            <span className="font-display-lg text-display-lg text-on-surface">
              {avgCompliance}
            </span>
            <span className="font-headline-sm text-headline-sm text-on-surface-variant">%</span>
          </div>
          <div className="mt-md h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${avgCompliance}%` }}
            />
          </div>
        </div>

        {/* Missing Items Alerts */}
        <div className="bg-surface-container rounded-xl p-lg border border-outline-variant relative overflow-hidden group">
          <div className="flex items-center gap-sm mb-sm relative z-10">
            <span className="material-symbols-outlined text-error">report</span>
            <span className="font-label-md text-label-md text-on-surface-variant">
              Alertas de itens faltando
            </span>
          </div>
          <div className="flex items-baseline gap-sm relative z-10">
            <span className="font-display-lg text-display-lg text-error">
              {affectedBoxesCount}
            </span>
            <span className="font-body-md text-body-md text-on-surface-variant">
              caixas afetadas
            </span>
          </div>
          <p className="font-label-md text-label-md text-error mt-sm flex items-center gap-xs">
            <span className="material-symbols-outlined text-[16px]">trending_up</span> +3 desde o último turno
          </p>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="flex justify-between items-center mb-lg bg-surface-container-low p-sm rounded-lg border border-outline-variant/30">
        <div className="flex gap-sm">
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="px-md py-sm rounded bg-surface-container-highest text-on-surface font-label-md text-label-md border border-outline-variant/30 outline-none cursor-pointer"
          >
            <option value="All">Turno: Todos</option>
            <option value="Turno Alpha">Turno: Alpha</option>
            <option value="Turno Bravo">Turno: Bravo</option>
            <option value="Turno Noturno">Turno: Noturno</option>
          </select>
        </div>

        <div className="flex items-center gap-md">
          <span className="font-label-md text-label-md text-on-surface-variant">
            Ordenar por:
          </span>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-transparent border-none text-on-surface font-body-md text-body-md focus:ring-0 cursor-pointer outline-none"
          >
            <option value="low-to-high">Conformidade (menor para maior)</option>
            <option value="high-to-low">Conformidade (maior para menor)</option>
            <option value="box-number">Número da caixa</option>
          </select>
        </div>
      </div>

      {/* Mechanic Box Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter pb-xl">
        {filteredBoxes.map((box) => {
          const isComplete = box.status === 'complete';
          return (
            <div
              key={box.id}
              className={`bg-surface-container rounded-xl flex flex-col shadow-sm border ${
                isComplete ? 'border-outline-variant/30' : 'border-error/40'
              } hover:shadow-lg transition-all relative overflow-hidden group`}
            >
              <div
                className={`absolute top-0 left-0 w-1 h-full ${
                  isComplete ? 'bg-primary' : 'bg-error'
                }`}
              />

              {/* Card Header */}
              <div className="p-md flex justify-between items-start border-b border-outline-variant/20">
                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block mb-xs">
                    {box.boxNumber}
                  </span>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface m-0 leading-tight">
                    {box.mechanicName}
                  </h3>
                  <span className="font-label-md text-label-md text-on-surface-variant">
                    {box.mechanicId}
                  </span>
                </div>
                <div
                  className={`px-sm py-xs rounded flex items-center gap-xs font-bold ${
                    isComplete
                      ? 'bg-primary/10 text-primary'
                      : 'bg-error/10 text-error'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isComplete ? 'check_circle' : 'warning'}
                  </span>
                  <span className="font-label-sm text-label-sm">
                    {isComplete ? 'Completa' : 'Incompleta'}
                  </span>
                </div>
              </div>

              {/* Body Progress */}
              <div className="p-md flex-1">
                <div className="mb-md">
                  <div className="flex justify-between items-end mb-xs">
                    <span className="font-label-md text-label-md text-on-surface-variant">
                      Conformidade
                    </span>
                    <span
                      className={`font-headline-sm text-headline-sm ${
                        isComplete ? 'text-primary' : 'text-error'
                      }`}
                    >
                      {box.compliancePercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isComplete ? 'bg-primary' : 'bg-error'
                      }`}
                      style={{ width: `${box.compliancePercentage}%` }}
                    />
                  </div>
                </div>

                <div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant block">
                    {isComplete ? 'Última auditoria' : 'Faltando'}
                  </span>
                  <span
                    className={`font-body-md text-body-md ${
                      isComplete ? 'text-on-surface' : 'text-error font-bold'
                    }`}
                  >
                    {isComplete ? box.lastAudit : `${box.missingCount} ${box.missingCount === 1 ? 'item' : 'itens'}`}
                  </span>
                </div>

                {!isComplete && box.missingItemsList.length > 0 && (
                  <div className="mt-sm p-xs bg-error/10 rounded text-[11px] font-label-sm text-error truncate">
                    Faltando: {box.missingItemsList.join(', ')}
                  </div>
                )}
              </div>

              {/* Footer Quick Audit */}
              <div className="p-sm bg-surface-container-low border-t border-outline-variant/20">
                <button
                  onClick={() => handleOpenQuickAudit(box)}
                  className="w-full py-sm rounded border border-outline-variant/50 text-on-surface font-label-md text-label-md flex items-center justify-center gap-sm hover:bg-surface-container-high transition-colors group-hover:border-primary group-hover:text-primary font-bold cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">fact_check</span>
                  Auditoria rápida
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Quick Audit Drawer */}
      {activeAuditBox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-lg">
          <div className="bg-surface-container rounded-xl shadow-2xl w-full max-w-[36rem] border border-outline-variant/30 overflow-hidden animate-in zoom-in-95">
            <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">
                  Auditoria de caixa: {activeAuditBox.boxNumber}
                </h2>
                <p className="font-label-sm text-on-surface-variant">
                  Mecânico: {activeAuditBox.mechanicName} ({activeAuditBox.mechanicId})
                </p>
              </div>
              <button
                onClick={() => setActiveAuditBox(null)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-lg space-y-sm bg-surface">
              <p className="font-label-sm text-on-surface-variant mb-xs">
                Marque as ferramentas presentes no armário:
              </p>
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {auditChecklist.map((item, idx) => (
                  <label
                    key={idx}
                    onClick={() => handleToggleCheckitem(idx)}
                    className={`flex items-center justify-between p-md rounded-lg cursor-pointer border transition-colors ${
                      item.present
                        ? 'bg-primary/10 border-primary/30 text-on-surface'
                        : 'bg-error/10 border-error/30 text-error'
                    }`}
                  >
                    <span className="font-body-md font-medium">{item.name}</span>
                    <span className="material-symbols-outlined text-[20px]">
                      {item.present ? 'check_box' : 'check_box_outline_blank'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-lg bg-surface-container-low border-t border-outline-variant/30 flex justify-between items-center">
              <span className="font-label-md text-on-surface">
                Pontuação calculada:{' '}
                <strong className="text-primary font-bold">
                  {Math.round(
                    (auditChecklist.filter((i) => i.present).length / auditChecklist.length) * 100
                  )}
                  %
                </strong>
              </span>
              <div className="flex gap-md">
                <button
                  onClick={() => setActiveAuditBox(null)}
                  className="px-lg py-sm text-on-surface font-label-md hover:bg-surface-container-high rounded"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveAudit}
                  className="px-lg py-sm bg-primary text-on-primary font-label-md rounded font-bold hover:bg-primary-fixed"
                >
                  Salvar auditoria
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Register Box */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-lg">
          <div className="bg-surface-container rounded-xl shadow-2xl w-full max-w-[28rem] border border-outline-variant/30 overflow-hidden animate-in zoom-in-95">
            <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline-md text-headline-md text-on-surface">Registrar nova caixa</h2>
              <button
                onClick={() => setShowRegisterModal(false)}
                className="text-on-surface-variant hover:text-on-surface"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="p-lg space-y-md bg-surface">
              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-on-surface-variant">Número da caixa *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: Caixa #501-A"
                  value={regBoxNum}
                  onChange={(e) => setRegBoxNum(e.target.value)}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-on-surface-variant">
                  Nome do mecânico *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: L. Martinez"
                  value={regMechName}
                  onChange={(e) => setRegMechName(e.target.value)}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-on-surface-variant">ID do mecânico</label>
                <input
                  type="text"
                  placeholder="ex: MAT-3310"
                  value={regMechId}
                  onChange={(e) => setRegMechId(e.target.value)}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none"
                />
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-on-surface-variant">Turno atribuído</label>
                <select
                  value={regTeam}
                  onChange={(e) => setRegTeam(e.target.value as any)}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant focus:border-primary px-md py-sm text-body-md text-on-surface outline-none cursor-pointer"
                >
                  <option value="Turno Alpha">Turno Alpha</option>
                  <option value="Turno Bravo">Turno Bravo</option>
                  <option value="Turno Noturno">Turno Noturno</option>
                </select>
              </div>

              <div className="p-lg bg-surface-container-low border-t border-outline-variant/30 flex justify-end gap-md">
                <button
                  type="button"
                  onClick={() => setShowRegisterModal(false)}
                  className="px-lg py-sm text-on-surface font-label-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-lg py-sm bg-primary text-on-primary font-label-md rounded font-bold hover:bg-primary-fixed"
                >
                  Salvar caixa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
