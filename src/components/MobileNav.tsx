import React, { useState } from 'react';
import { PageId } from '../types';

interface MobileNavProps {
  currentPage: PageId;
  onPageChange: (page: PageId) => void;
}

const PRIMARY_TABS: { id: PageId; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Painel', icon: 'dashboard' },
  { id: 'tool-requests', label: 'Pedidos', icon: 'shopping_cart_checkout' },
  { id: 'estoque', label: 'Estoque', icon: 'inventory_2' },
  { id: 'mechanic-boxes', label: 'Caixas', icon: 'handyman' },
];

const MORE_TABS: { id: PageId; label: string; icon: string }[] = [
  { id: 'damage-loss', label: 'Danos e Perdas', icon: 'report_problem' },
  { id: 'audit-logs', label: 'Logs de Auditoria', icon: 'list_alt' },
  { id: 'settings', label: 'Configurações', icon: 'settings' },
];

export const MobileNav: React.FC<MobileNavProps> = ({ currentPage, onPageChange }) => {
  const [showMore, setShowMore] = useState(false);
  const isMoreActive = MORE_TABS.some((t) => t.id === currentPage);

  const tabClasses = (isActive: boolean) =>
    `flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 transition-colors ${
      isActive ? 'text-primary' : 'text-on-surface-variant'
    }`;

  return (
    <>
      {showMore && (
        <div
          className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
          onClick={() => setShowMore(false)}
        >
          <div
            className="fixed bottom-16 inset-x-0 z-50 bg-surface-container rounded-t-3xl border-t border-outline-variant shadow-2xl p-md animate-in slide-in-from-bottom-4"
            onClick={(e) => e.stopPropagation()}
          >
            {MORE_TABS.map((tab) => {
              const isActive = currentPage === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    onPageChange(tab.id);
                    setShowMore(false);
                  }}
                  className={`w-full flex items-center gap-md px-md py-sm rounded-xl transition-colors ${
                    isActive
                      ? 'bg-primary-container text-on-primary-container font-medium'
                      : 'text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
                  <span className="font-body-md">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 inset-x-0 z-40 h-16 bg-surface-container border-t border-outline-variant flex items-stretch select-none">
        {PRIMARY_TABS.map((tab) => {
          const isActive = currentPage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setShowMore(false);
                onPageChange(tab.id);
              }}
              className={tabClasses(isActive)}
            >
              <span className="material-symbols-outlined text-[20px]">{tab.icon}</span>
              <span className="font-label-sm text-[10px] leading-tight">{tab.label}</span>
            </button>
          );
        })}
        <button onClick={() => setShowMore((prev) => !prev)} className={tabClasses(isMoreActive || showMore)}>
          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
          <span className="font-label-sm text-[10px] leading-tight">Mais</span>
        </button>
      </nav>
    </>
  );
};