import { ToolStatus, AlertItem } from './types';

export const STATUS_LABELS: Record<ToolStatus, string> = {
  available: 'Disponível',
  loaned: 'Emprestada',
  repair: 'Manutenção',
  lost: 'Perdida',
};

export const LEVEL_LABELS: Record<AlertItem['level'], string> = {
  HIGH: 'Alta',
  MED: 'Média',
  LOW: 'Baixa',
};
