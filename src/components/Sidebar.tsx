import React from 'react';
import { PageId } from '../types';
import logo from '../assets/logo.png';

interface SidebarProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
  alertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onPageChange,
}) => {
  const navItems: { id: PageId; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Painel', icon: 'dashboard' },
    { id: 'tool-requests', label: 'Solicitação de Ferramentas', icon: 'shopping_cart_checkout' },
    { id: 'estoque', label: 'Estoque', icon: 'inventory_2' },
    { id: 'mechanic-boxes', label: 'Caixas dos Mecânicos', icon: 'handyman' },
    { id: 'damage-loss', label: 'Danos e Perdas', icon: 'report_problem' },
    { id: 'audit-logs', label: 'Logs de Auditoria', icon: 'list_alt' },
  ];

  const itemClasses = (isActive: boolean) =>
    `group relative flex items-center gap-3 px-3 py-2 rounded-2xl transition-colors ${
      isActive ? 'text-white' : 'text-white/50 hover:bg-white/[0.035] hover:text-white/85'
    }`;

  const iconClasses = (isActive: boolean) =>
    `material-symbols-outlined text-[18px] w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
      isActive
        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
        : 'bg-white/[0.07] text-white/50 group-hover:bg-white/[0.1] group-hover:text-white/75'
    }`;

  const activeBar = (isActive: boolean) =>
    isActive ? (
      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 rounded-full bg-red-600" />
    ) : null;

  return (
    <aside className="fixed left-4 top-4 bottom-4 w-60 z-50 flex flex-col rounded-3xl bg-[#0b0b0d] border border-white/5 shadow-2xl shadow-black/40 overflow-hidden select-none">
      {/* Ambient glow */}
      <div className="absolute -top-20 -left-14 w-56 h-56 bg-red-600/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-24 -right-10 w-56 h-56 bg-red-900/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Brand Header */}
      <div
        className="relative h-16 px-lg flex items-center gap-sm cursor-pointer shrink-0"
        onClick={() => onPageChange('dashboard')}
      >
        <div className="w-9 h-9 flex items-center justify-center shrink-0 rounded-xl bg-white/[0.07] p-1.5">
          <img src={logo} alt="Center Truck" className="w-full h-full object-contain" />
        </div>
        <span className="text-[13px] text-white tracking-tight font-semibold truncate min-w-0" title="Inventario Ferramentas - GV">
          Inventario Ferramentas - GV
        </span>
      </div>

      <div className="h-px bg-white/10 mx-lg" />

      {/* Navigation Links */}
      <nav className="gv-sidebar-scroll relative flex-1 px-sm py-sm space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              title={item.label}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(item.id);
              }}
              className={itemClasses(isActive)}
            >
              {activeBar(isActive)}
              <span className={iconClasses(isActive)}>{item.icon}</span>
              <span className={`min-w-0 truncate text-[13px] leading-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
            </a>
          );
        })}
      </nav>

      {/* Settings pinned to the bottom */}
      <div className="relative px-sm pb-md pt-sm">
        <div className="h-px bg-white/10 mb-sm mx-sm" />
        <a
          href="#settings"
          onClick={(e) => {
            e.preventDefault();
            onPageChange('settings');
          }}
          className={itemClasses(currentPage === 'settings')}
        >
          {activeBar(currentPage === 'settings')}
          <span className={iconClasses(currentPage === 'settings')}>settings</span>
          <span className={`min-w-0 truncate text-[13px] leading-tight ${currentPage === 'settings' ? 'font-semibold' : 'font-medium'}`}>Configurações</span>
        </a>
      </div>
    </aside>
  );
};
