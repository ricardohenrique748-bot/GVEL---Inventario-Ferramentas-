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

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface-container-low z-50 flex flex-col border-r border-outline-variant select-none">
      {/* Brand Header */}
      <div
        className="h-16 px-lg flex items-center gap-sm cursor-pointer shrink-0"
        onClick={() => onPageChange('dashboard')}
      >
        <div className="w-9 h-9 flex items-center justify-center shrink-0">
          <img src={logo} alt="Center Truck" className="w-full h-full object-contain" />
        </div>
        <span className="text-[13px] text-on-surface tracking-tight font-semibold whitespace-nowrap">
          Inventario Ferramentas - GV
        </span>
      </div>

      <div className="h-px bg-outline-variant mx-lg" />

      {/* Navigation Links */}
      <nav className="flex-1 px-sm py-md space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPage === item.id;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                onPageChange(item.id);
              }}
              className={`flex items-center gap-sm px-md py-sm rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-medium'
                  : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[19px]">
                {item.icon}
              </span>
              <span className="font-body-sm">{item.label}</span>
            </a>
          );
        })}

        <div className="my-sm border-t border-outline-variant" />

        <a
          href="#settings"
          onClick={(e) => {
            e.preventDefault();
            onPageChange('settings');
          }}
          className={`flex items-center gap-sm px-md py-sm rounded-lg transition-colors ${
            currentPage === 'settings'
              ? 'bg-primary-container text-on-primary-container font-medium'
              : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[19px]">settings</span>
          <span className="font-body-sm">Configurações</span>
        </a>
      </nav>
    </aside>
  );
};
