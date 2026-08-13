import { ToolItem, MechanicBox, AuditLogItem, AlertItem, Person, Category } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Ferramentas Elétricas', codeLetter: 'P' },
  { id: 'cat-2', name: 'Ferramentas Manuais', codeLetter: 'H' },
  { id: 'cat-3', name: 'Equip. de Diagnóstico', codeLetter: 'D' },
  { id: 'cat-4', name: 'Automotivo Especializado', codeLetter: 'S' },
];

export const INITIAL_TOOLS: ToolItem[] = [];

export const INITIAL_MECHANIC_BOXES: MechanicBox[] = [];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [];

export const INITIAL_PEOPLE: Person[] = [
  {
    id: 'p-0',
    name: 'Ricardo Henrique',
    registration: 'MAT-1001',
    role: 'Administrador',
    sector: 'Gestão',
    username: 'ricardo_h',
    email: 'ricardo_h.16@hotmail.com',
    password: '15975321',
    active: true,
  },
];

export const INITIAL_ALERTS: AlertItem[] = [];