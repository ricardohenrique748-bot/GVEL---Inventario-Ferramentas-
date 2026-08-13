import React, { useState } from 'react';
import { ToolItem } from '../types';
import { STATUS_LABELS } from '../labels';

interface DamageLossViewProps {
  tools: ToolItem[];
  onReportIncident: (toolId: string, type: 'damaged' | 'lost', notes: string) => void;
}

export const DamageLossView: React.FC<DamageLossViewProps> = ({
  tools,
  onReportIncident,
}) => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedToolId, setSelectedToolId] = useState(tools[0]?.id || '');
  const [incidentType, setIncidentType] = useState<'damaged' | 'lost'>('damaged');
  const [notes, setNotes] = useState('');

  const lostOrDamaged = tools.filter((t) => t.status === 'lost' || t.status === 'repair');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedToolId) return;
    onReportIncident(selectedToolId, incidentType, notes);
    setShowReportModal(false);
    setNotes('');
  };

  return (
    <div className="flex flex-col w-full p-lg gap-lg select-none animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">
            Relatórios de Danos e Perdas
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Investigação de danos à frota, registros de itens perdidos e reposições por seguro.
          </p>
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="bg-error hover:bg-error/80 text-on-error px-lg py-sm rounded-lg flex items-center gap-sm font-bold font-label-md"
        >
          <span className="material-symbols-outlined text-[20px]">report_problem</span>
          Reportar ocorrência
        </button>
      </div>

      <div className="bg-surface-container rounded-xl p-md border border-outline-variant/30 shadow-sm">
        <h2 className="font-headline-sm text-on-surface mb-md">Ocorrências ativas de dano e perda</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant/20">
                <th className="p-md font-label-md text-on-surface-variant">ID do ativo</th>
                <th className="p-md font-label-md text-on-surface-variant">Nome</th>
                <th className="p-md font-label-md text-on-surface-variant">Marca</th>
                <th className="p-md font-label-md text-on-surface-variant">Status</th>
                <th className="p-md font-label-md text-on-surface-variant">Última localização</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {lostOrDamaged.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-xl text-center text-on-surface-variant">
                    Nenhuma ocorrência de dano ou perda registrada.
                  </td>
                </tr>
              ) : (
                lostOrDamaged.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-high/50 transition-colors">
                    <td className="p-md font-label-md text-error">{t.code}</td>
                    <td className="p-md font-headline-sm text-[15px] text-on-surface">{t.name}</td>
                    <td className="p-md text-body-sm text-on-surface-variant">{t.brand}</td>
                    <td className="p-md">
                      <span className="px-sm py-xs bg-error/20 text-error font-label-sm rounded font-bold">
                        {STATUS_LABELS[t.status]}
                      </span>
                    </td>
                    <td className="p-md text-body-sm text-on-surface-variant">
                      {t.assignedTo || t.location}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-lg">
          <div className="bg-surface-container rounded-xl shadow-2xl w-full max-w-[32rem] max-h-[92vh] border border-outline-variant/30 overflow-y-auto">
            <div className="p-lg border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low">
              <h2 className="font-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-error">report</span>
                Registrar ocorrência
              </h2>
              <button onClick={() => setShowReportModal(false)} className="text-on-surface-variant">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-lg space-y-md bg-surface">
              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-on-surface-variant">Selecionar ativo</label>
                <select
                  value={selectedToolId}
                  onChange={(e) => setSelectedToolId(e.target.value)}
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant px-md py-sm text-on-surface outline-none cursor-pointer"
                >
                  {tools.map((tool) => (
                    <option key={tool.id} value={tool.id}>
                      {tool.code} - {tool.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-on-surface-variant">Tipo de ocorrência</label>
                <div className="flex gap-md">
                  <label className="flex items-center gap-xs text-on-surface cursor-pointer">
                    <input
                      type="radio"
                      name="incType"
                      checked={incidentType === 'damaged'}
                      onChange={() => setIncidentType('damaged')}
                      className="accent-error"
                    />
                    Equipamento danificado
                  </label>
                  <label className="flex items-center gap-xs text-on-surface cursor-pointer">
                    <input
                      type="radio"
                      name="incType"
                      checked={incidentType === 'lost'}
                      onChange={() => setIncidentType('lost')}
                      className="accent-error"
                    />
                    Perdido / não localizado
                  </label>
                </div>
              </div>

              <div className="flex flex-col gap-xs">
                <label className="font-label-sm text-on-surface-variant">Notas da ocorrência</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Descreva a causa do dano ou última localização conhecida..."
                  className="w-full bg-surface-container-high border-b-2 border-outline-variant px-md py-sm text-on-surface outline-none"
                />
              </div>

              <div className="p-md bg-surface-container-low flex justify-end gap-md">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-lg py-sm text-on-surface font-label-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-lg py-sm bg-error text-on-error font-label-md rounded font-bold"
                >
                  Enviar relatório
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
