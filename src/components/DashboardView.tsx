import React from 'react';
import { PageId, AuditLogItem } from '../types';

interface DashboardViewProps {
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

export const DashboardView: React.FC<DashboardViewProps> = ({
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

  return (
    <div className="flex flex-col w-full px-lg py-lg gap-lg select-none animate-in fade-in duration-300">
      {/* Row 1: Overview chart · Stat stack · Operator card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-stretch">
        {/* Overview + bar chart */}
        <div className="lg:col-span-5 bg-surface-container rounded-2xl p-lg border border-outline-variant flex flex-col">
          <div className="flex items-start justify-between mb-md">
            <div>
              <p className="font-label-md text-on-surface-variant mb-xs">Total de ativos</p>
              <p className="font-display-lg text-on-surface leading-none">12.450</p>
              <div className="flex items-center gap-xs text-primary mt-sm">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                <span className="font-label-sm">+125 esta semana</span>
              </div>
            </div>
            <span className="font-label-sm text-on-surface-variant bg-surface-container-high px-sm py-xs rounded-full">
              Últimas 4 semanas
            </span>
          </div>

          <div className="flex items-end justify-between gap-md h-32 mt-auto px-sm">
            {weeklyMovement.map((week, i) => {
              const isCurrent = i === currentIndex;
              const heightPx = Math.round((week.value / maxMovement) * 112);
              return (
                <div key={week.label} className="flex-1 flex flex-col items-center gap-xs">
                  {isCurrent && (
                    <span className="font-label-sm text-on-surface">{(week.value / 1000).toFixed(1)}mil</span>
                  )}
                  <div
                    className={`w-6 rounded-t-md ${isCurrent ? 'bg-primary' : 'bg-surface-container-highest'}`}
                    style={{ height: `${heightPx}px` }}
                  />
                  <span className="font-label-sm text-on-surface-variant">{week.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stat stack */}
        <div className="lg:col-span-3 flex flex-col gap-md">
          <button
            onClick={() => onNavigate('mechanic-boxes')}
            className="text-left bg-surface-container rounded-2xl p-md border border-outline-variant flex-1 flex flex-col justify-center"
          >
            <p className="font-label-md text-on-surface-variant mb-xs">Caixas incompletas</p>
            <p className="font-headline-md text-on-surface">2</p>
            <div className="flex items-center gap-xs text-secondary mt-xs">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              <span className="font-label-sm">Verificação pendente</span>
            </div>
          </button>
          <button
            onClick={() => onNavigate('mechanic-boxes')}
            className="text-left bg-surface-container rounded-2xl p-md border border-outline-variant flex-1 flex flex-col justify-center"
          >
            <p className="font-label-md text-on-surface-variant mb-xs">Auditorias (7 dias)</p>
            <p className="font-headline-md text-on-surface">12</p>
            <div className="flex items-center gap-xs text-primary mt-xs">
              <span className="material-symbols-outlined text-[14px]">trending_up</span>
              <span className="font-label-sm">4 desde ontem</span>
            </div>
          </button>
          <button
            onClick={() => onNavigate('damage-loss')}
            className="text-left bg-surface-container rounded-2xl p-md border border-error/30 flex-1 flex flex-col justify-center"
          >
            <p className="font-label-md text-on-surface-variant mb-xs">Ocorrências abertas</p>
            <p className="font-headline-md text-error">2</p>
            <div className="flex items-center gap-xs text-error mt-xs">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              <span className="font-label-sm">Ação necessária</span>
            </div>
          </button>
        </div>

        {/* Operator quick-actions card */}
        <div className="lg:col-span-4 bg-surface-container rounded-2xl p-md border border-outline-variant flex flex-col gap-md">
          <div className="rounded-xl bg-gradient-to-br from-primary to-on-primary-fixed-variant p-md text-on-primary relative overflow-hidden">
            <div className="flex items-start justify-between">
              <span className="material-symbols-outlined text-[26px]">badge</span>
              <span className="font-label-sm opacity-80">Turno atual</span>
            </div>
            <p className="font-headline-sm mt-lg">OPERADOR-42</p>
            <p className="font-label-sm opacity-80">Baia Principal da Oficina</p>
          </div>

          <div className="grid grid-cols-3 gap-xs">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={action.onClick}
                className="flex flex-col items-center gap-xs group"
              >
                <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant group-hover:bg-primary-container group-hover:text-on-primary-container transition-colors">
                  <span className="material-symbols-outlined text-[18px]">{action.icon}</span>
                </div>
                <span className="font-label-sm text-on-surface-variant text-[10px] text-center leading-tight">
                  {action.label}
                </span>
              </button>
            ))}
          </div>

          <div>
            <p className="font-label-sm text-on-surface-variant mb-sm">Mecânicos frequentes</p>
            <div className="flex items-center gap-xs">
              {frequentMechanics.map((initials, i) => (
                <div
                  key={initials}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-label-sm text-[10px] border-2 border-surface-container ${
                    i % 2 === 0 ? 'bg-primary-container text-on-primary-container' : 'bg-tertiary-container text-on-tertiary-container'
                  } ${i > 0 ? '-ml-2' : ''}`}
                >
                  {initials}
                </div>
              ))}
              <button
                onClick={() => onNavigate('mechanic-boxes')}
                className="w-8 h-8 -ml-2 rounded-full bg-surface-container-high border-2 border-surface-container flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Category breakdown · Compliance gauge */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-stretch">
        {/* Category distribution */}
        <div className="lg:col-span-6 bg-surface-container rounded-2xl p-lg border border-outline-variant">
          <p className="font-label-md text-on-surface-variant mb-md">Distribuição por categoria</p>
          <div className="flex gap-[2px] h-2.5 rounded-full overflow-hidden mb-md">
            {categoryBreakdown.map((cat) => (
              <div
                key={cat.label}
                className={cat.color}
                style={{ width: `${cat.pct}%` }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-sm">
            {categoryBreakdown.map((cat) => (
              <div key={cat.label} className="flex items-center justify-between">
                <div className="flex items-center gap-sm">
                  <div className={`w-2.5 h-2.5 rounded-full ${cat.dot}`} />
                  <span className="font-body-sm text-on-surface">{cat.label}</span>
                </div>
                <span className="font-label-sm text-on-surface-variant">{cat.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Compliance gauge */}
        <div className="lg:col-span-6 bg-surface-container rounded-2xl p-lg border border-outline-variant flex flex-col items-center">
          <p className="font-label-md text-on-surface-variant self-start mb-md">Conformidade da frota</p>
          <div className="relative w-32 h-32">
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
            Baseado nas auditorias dos últimos 30 dias
          </p>
        </div>
      </div>

      {/* Row 3: Recent activity */}
      <div className="bg-surface-container rounded-2xl p-lg border border-outline-variant">
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
  );
};
