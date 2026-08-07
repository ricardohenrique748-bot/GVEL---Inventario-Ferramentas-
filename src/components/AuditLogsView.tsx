import React, { useState } from 'react';
import { AuditLogItem } from '../types';

interface AuditLogsViewProps {
  logs: AuditLogItem[];
}

export const AuditLogsView: React.FC<AuditLogsViewProps> = ({ logs }) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => {
    if (filterType !== 'all' && log.type.toLowerCase() !== filterType.toLowerCase()) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return (
        log.title.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full p-lg gap-lg select-none animate-in fade-in duration-300">
      <div className="flex justify-between items-center mb-md">
        <div>
          <h1 className="font-headline-lg text-headline-lg text-on-background">
            Logs de Auditoria do Sistema
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Linha do tempo imutável de retiradas, devoluções, auditorias de caixa e eventos do sistema.
          </p>
        </div>
      </div>

      <div className="flex gap-md mb-md bg-surface-container-low p-sm rounded-lg border border-outline-variant/30">
        <input
          type="text"
          value={searchFilter}
          onChange={(e) => setSearchFilter(e.target.value)}
          placeholder="Filtrar logs por usuário, ativo ou título..."
          className="bg-surface-container-high px-md py-xs text-body-sm text-on-surface rounded border border-outline-variant/30 outline-none w-80"
        />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-surface-container-high px-md py-xs text-body-sm text-on-surface rounded border border-outline-variant/30 outline-none cursor-pointer"
        >
          <option value="all">Todos os tipos</option>
          <option value="Empréstimo">Empréstimo</option>
          <option value="Devolução">Devolução</option>
          <option value="Dano">Dano</option>
          <option value="Auditoria de Caixa">Auditoria de Caixa</option>
          <option value="Novo Ativo">Novo Ativo</option>
        </select>
      </div>

      <div className="bg-surface-container rounded-xl p-md border border-outline-variant/30 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-high border-b border-outline-variant/20">
                <th className="p-md font-label-md text-on-surface-variant">Horário</th>
                <th className="p-md font-label-md text-on-surface-variant">Evento</th>
                <th className="p-md font-label-md text-on-surface-variant">Detalhes</th>
                <th className="p-md font-label-md text-on-surface-variant">Operador / Usuário</th>
                <th className="p-md font-label-md text-on-surface-variant">Comprovante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-md text-on-surface">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-xl text-center text-on-surface-variant">
                    Nenhum log encontrado com os filtros de busca atuais.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-container-high/50 transition-colors">
                    <td className="p-md font-label-sm text-on-surface-variant">{log.timestamp}</td>
                    <td className="p-md">
                      <span className="font-headline-sm text-[15px] text-on-surface">{log.title}</span>
                    </td>
                    <td className="p-md text-body-sm text-on-surface-variant">{log.details}</td>
                    <td className="p-md font-label-md text-primary">{log.user}</td>
                    <td className="p-md">
                      {log.photoUrl ? (
                        <button
                          type="button"
                          onClick={() => setPreviewPhoto(log.photoUrl!)}
                          className="w-9 h-9 rounded-full overflow-hidden border border-outline-variant/30 hover:border-primary transition-colors"
                          title="Ver foto de comprovação"
                        >
                          <img src={log.photoUrl} alt="Comprovante" className="w-full h-full object-cover" />
                        </button>
                      ) : (
                        <span className="font-label-sm text-on-surface-variant/50">—</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {previewPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm p-lg"
          onClick={() => setPreviewPhoto(null)}
        >
          <div className="flex flex-col items-center gap-md animate-in zoom-in-95">
            <img
              src={previewPhoto}
              alt="Comprovante de retirada"
              className="max-w-[24rem] max-h-[24rem] rounded-xl border-2 border-primary shadow-2xl object-cover"
            />
            <button
              type="button"
              onClick={() => setPreviewPhoto(null)}
              className="px-lg py-sm bg-surface-container text-on-surface font-label-md rounded-lg hover:bg-surface-container-high transition-colors"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
