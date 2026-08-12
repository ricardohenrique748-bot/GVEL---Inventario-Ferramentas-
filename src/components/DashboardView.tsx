import React from 'react';
import { PageId, AuditLogItem, Person } from '../types';

interface DashboardViewProps {
  currentUser: Person;
  onNavigate: (page: PageId) => void;
  auditLogs: AuditLogItem[];
  onOpenScanner: () => void;
}

const activityIcon: Record<AuditLogItem['type'], string> = {
  'Empréstimo': 'swap_horizontal_circle',
  'Devolução': 'assignment_return',
  'Dano': 'report_problem',
  'Auditoria de Caixa': 'fact_check',
  'Novo Ativo': 'add_box',
  'Manutenção': 'build_circle',
  'Exclusão': 'delete',
};

const activityColor: Record<AuditLogItem['statusColor'], { bg: string; fg: string }> = {
  primary: { bg: 'bg-primary-container', fg: 'text-on-primary-container' },
  error: { bg: 'bg-error-container', fg: 'text-on-error-container' },
  secondary: { bg: 'bg-secondary-container', fg: 'text-on-secondary-container' },
  tertiary: { bg: 'bg-tertiary-container', fg: 'text-on-tertiary-container' },
};

const weeklyMovement = [
  { label: 'Sem 1', value: 2400 },
  { label: 'Sem 2', value: 3100 },
  { label: 'Sem 3', value: 3800 },
  { label: 'Sem 4', value: 4200 },
];

const categoryBreakdown = [
  { label: 'Ferramentas Elétricas', pct: 38, color: 'bg-primary', dot: 'bg-primary' },
  { label: 'Ferramentas Manuais', pct: 27, color: 'bg-[#0891B2]', dot: 'bg-[#0891B2]' },
  { label: 'Equip. de Diagnóstico', pct: 21, color: 'bg-secondary', dot: 'bg-secondary' },
  { label: 'Automotivo Especializado', pct: 14, color: 'bg-tertiary', dot: 'bg-tertiary' },
];

const frequentMechanics = ['JM', 'SC', 'AR', 'MC', 'RD'];

const CARD = 'bg-surface-container rounded-[28px] shadow-[0_1px_3px_rgba(0,0,0,0.06)]';

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onNavigate,
  auditLogs,
  onOpenScanner,
}) => {
  const maxMovement = Math.max(...weeklyMovement.map((w) => w.value));
  const currentIndex = weeklyMovement.length - 1;

  const quickActions: { icon: string; label: string; onClick: () => void }[] = [
    { icon: 'qr_code_scanner', label: 'Escanear', onClick: onOpenScanner },
    { icon: 'fact_check', label: 'Auditar caixa', onClick: () => onNavigate('mechanic-boxes') },
    { icon: 'report_problem', label: 'Reportar dano', onClick: () => onNavigate('damage-loss') },
  ];

  const pendingItems: { icon: string; title: string; subtitle: string; urgent: boolean; onClick: () => void }[] = [
    {
      icon: 'inventory_2',
      title: 'Caixas incompletas',
      subtitle: '2 · Verificação pendente',
      urgent: false,
      onClick: () => onNavigate('mechanic-boxes'),
    },
    {
      icon: 'fact_check',
      title: 'Auditorias (7 dias)',
      subtitle: '12 · 4 desde ontem',
      urgent: false,
      onClick: () => onNavigate('mechanic-boxes'),
    },
    {
      icon: 'report_problem',
      title: 'Ocorrências abertas',
      subtitle: '2 · Ação necessária',
      urgent: true,
      onClick: () => onNavigate('damage-loss'),
    },
  ];

  return (
    <div className="w-full px-lg py-lg select-none animate-in fade-in duration-300">
      {/* Everything lives inside one big rounded surface, like the reference */}
      <div className="rounded-[40px] bg-gradient-to-br from-primary-container/60 via-surface-container-low to-surface-container-low p-lg lg:p-xl flex flex-col gap-lg">
        {/* Heading */}
        <div>
          <h1 className="font-display-lg text-on-background leading-tight">Painel de Controle</h1>
          <p className="font-body-md text-on-surface-variant mt-xs max-w-[38rem]">
            Visão geral do inventário, auditorias e operações da oficina em tempo real.
          </p>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-stretch">
          {/* Profile card — currently logged-in operator */}
          <div className="lg:col-span-4 relative rounded-[28px] overflow-hidden min-h-[240px] bg-surface-container-high shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            {currentUser.photoUrl ? (
              <img
                src={currentUser.photoUrl}
                alt={currentUser.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant/40">
                <span className="material-symbols-outlined text-[72px]">person</span>
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 p-md pt-16 bg-gradient-to-t from-black/85 via-black/40 to-transparent">
              <div className="flex items-end justify-between gap-sm">
                <div className="min-w-0">
                  <p className="text-white font-headline-sm text-[16px] leading-tight truncate">{currentUser.name}</p>
                  <p className="text-white/70 font-label-sm truncate">{currentUser.role || 'Colaborador'}</p>
                </div>
                <span className="bg-white text-on-background font-label-sm px-sm py-xs rounded-full shrink-0">
                  {currentUser.active ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
          </div>

          {/* Overview + bar chart */}
          <div className={`lg:col-span-4 ${CARD} p-lg flex flex-col`}>
            <div className="flex items-start justify-between mb-md">
              <div>
                <p className="font-label-md text-on-surface-variant mb-xs">Total de ativos</p>
                <p className="font-display-lg text-on-surface leading-none">12.450</p>
                <div className="flex items-center gap-xs text-primary mt-sm">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>
                  <span className="font-label-sm">+125 esta semana</span>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between gap-md h-28 mt-auto px-sm">
              {weeklyMovement.map((week, i) => {
                const isCurrent = i === currentIndex;
                const heightPx = Math.max(20, Math.round((week.value / maxMovement) * 96));
                return (
                  <div key={week.label} className="flex-1 flex flex-col items-center gap-xs">
                    {isCurrent && (
                      <span className="font-label-sm text-on-primary bg-primary px-sm py-0.5 rounded-full whitespace-nowrap">
                        {(week.value / 1000).toFixed(1)}mil
                      </span>
                    )}
                    <div
                      className={`w-5 rounded-full ${isCurrent ? 'bg-primary' : 'bg-surface-container-highest'}`}
                      style={{ height: `${heightPx}px` }}
                    />
                    <span className="font-label-sm text-on-surface-variant">{week.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compliance gauge */}
          <div className={`lg:col-span-4 ${CARD} p-lg flex flex-col items-center justify-center`}>
            <p className="font-label-md text-on-surface-variant self-start mb-md">Conformidade da frota</p>
            <div className="relative w-28 h-28">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-surface-container-highest"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.2"
                />
                <path
                  className="text-primary"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="96, 100"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-md text-on-surface">96%</span>
              </div>
            </div>
            <p className="font-body-sm text-on-surface-variant text-center mt-md">
              Últimos 30 dias
            </p>
          </div>

          {/* Dark checklist card — pending items, quick actions, mechanics */}
          <div className="lg:col-span-4 lg:row-span-2 bg-inverse-surface text-inverse-on-surface rounded-[28px] p-lg flex flex-col gap-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-headline-sm">Pendências</p>
                <p className="font-label-sm text-inverse-on-surface/50">Turno atual · OPERADOR-42</p>
              </div>
              <span className="bg-primary text-on-primary font-label-sm px-sm py-xs rounded-full shrink-0">
                {pendingItems.length} itens
              </span>
            </div>

            <div className="flex flex-col gap-sm">
              {pendingItems.map((item) => (
                <button
                  key={item.title}
                  onClick={item.onClick}
                  className="flex items-center gap-sm text-left rounded-2xl -mx-2 px-2 py-1.5 hover:bg-inverse-on-surface/5 transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-inverse-on-surface/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md truncate">{item.title}</p>
                    <p className="font-label-sm text-inverse-on-surface/50 truncate">{item.subtitle}</p>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.urgent ? 'bg-error' : 'bg-secondary'}`} />
                </button>
              ))}
            </div>

            <div className="h-px bg-inverse-on-surface/10" />

            <div>
              <p className="font-label-sm text-inverse-on-surface/50 mb-sm">Ações rápidas</p>
              <div className="grid grid-cols-3 gap-xs">
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={action.onClick}
                    className="flex flex-col items-center gap-xs group"
                  >
                    <div className="w-11 h-11 rounded-full bg-inverse-on-surface/10 flex items-center justify-center text-inverse-on-surface group-hover:bg-primary group-hover:text-on-primary transition-colors">
                      <span className="material-symbols-outlined text-[19px]">{action.icon}</span>
                    </div>
                    <span className="font-label-sm text-inverse-on-surface/70 text-[10px] text-center leading-tight">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto">
              <p className="font-label-sm text-inverse-on-surface/50 mb-sm">Mecânicos frequentes</p>
              <div className="flex items-center gap-xs">
                {frequentMechanics.map((initials, i) => (
                  <div
                    key={initials}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-label-sm text-[10px] border-2 border-inverse-surface ${
                      i % 2 === 0 ? 'bg-primary-container text-on-primary-container' : 'bg-tertiary-container text-on-tertiary-container'
                    } ${i > 0 ? '-ml-2' : ''}`}
                  >
                    {initials}
                  </div>
                ))}
                <button
                  onClick={() => onNavigate('mechanic-boxes')}
                  className="w-8 h-8 -ml-2 rounded-full bg-inverse-on-surface/10 border-2 border-inverse-surface flex items-center justify-center text-inverse-on-surface/70 hover:text-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                </button>
              </div>
            </div>
          </div>

          {/* Category distribution — wide, second row */}
          <div className={`lg:col-span-8 ${CARD} p-lg`}>
            <p className="font-label-md text-on-surface-variant mb-md">Distribuição por categoria</p>
            <div className="flex gap-[2px] h-2.5 rounded-full overflow-hidden mb-md">
              {categoryBreakdown.map((cat) => (
                <div key={cat.label} className={cat.color} style={{ width: `${cat.pct}%` }} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-x-lg gap-y-sm">
              {categoryBreakdown.map((cat) => (
                <div key={cat.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-sm min-w-0">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${cat.dot}`} />
                    <span className="font-body-sm text-on-surface truncate">{cat.label}</span>
                  </div>
                  <span className="font-label-sm text-on-surface-variant shrink-0">{cat.pct}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className={`${CARD} p-lg`}>
          <div className="flex items-center justify-between mb-md">
            <p className="font-label-md text-on-surface-variant">Atividade recente</p>
            <button
              onClick={() => onNavigate('audit-logs')}
              className="font-label-sm text-primary hover:opacity-70 transition-opacity"
            >
              Ver histórico completo
            </button>
          </div>
          <div className="flex flex-col">
            {auditLogs.slice(0, 6).map((log) => {
              const colors = activityColor[log.statusColor] ?? activityColor.primary;
              return (
                <div
                  key={log.id}
                  onClick={() => onNavigate('audit-logs')}
                  className="flex items-center gap-md py-sm border-b border-outline-variant last:border-0 cursor-pointer hover:bg-surface-container-high/60 -mx-sm px-sm rounded-lg transition-colors"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colors.bg} ${colors.fg}`}>
                    <span className="material-symbols-outlined text-[18px]">{activityIcon[log.type]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-label-md text-on-surface truncate">{log.title}</p>
                    <p className="font-body-sm text-on-surface-variant truncate">{log.details}</p>
                  </div>
                  <div className="flex flex-col items-end gap-xs shrink-0">
                    <span className={`font-label-sm px-sm py-0.5 rounded-full ${colors.bg} ${colors.fg}`}>
                      {log.type}
                    </span>
                    <span className="font-label-sm text-on-surface-variant">{log.timestamp}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
