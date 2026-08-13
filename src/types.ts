export type PageId =
  | 'dashboard'
  | 'estoque'
  | 'tool-requests'
  | 'mechanic-boxes'
  | 'damage-loss'
  | 'audit-logs'
  | 'settings';

export type ToolStatus = 'available' | 'loaned' | 'repair' | 'lost';

export interface Category {
  id: string;
  name: string;
  codeLetter: string;
}

export interface ToolItem {
  id: string;
  code: string;
  qrCode: string;
  name: string;
  category: string;
  brand: string;
  location: string;
  status: ToolStatus;
  quantity: number;
  assignedTo?: string;
  assignedBay?: string;
  assignedPlate?: string;
  assignedPhotoUrl?: string;
  lastAuditDate?: string;
  photoUrl?: string;
}

export interface MechanicBox {
  id: string;
  boxNumber: string;
  mechanicName: string;
  mechanicId: string;
  team: 'Turno Alpha' | 'Turno Bravo' | 'Turno Noturno';
  supervisor: string;
  compliancePercentage: number;
  missingCount: number;
  missingItemsList: string[];
  status: 'complete' | 'incomplete';
  lastAudit: string;
}

export interface AuditLogItem {
  id: string;
  type: 'Empréstimo' | 'Devolução' | 'Dano' | 'Auditoria de Caixa' | 'Novo Ativo' | 'Manutenção' | 'Exclusão';
  title: string;
  timestamp: string;
  assetCode?: string;
  details: string;
  user: string;
  statusColor: 'primary' | 'error' | 'secondary' | 'tertiary';
  photoUrl?: string;
}

export interface Person {
  id: string;
  name: string;
  registration: string;
  role: string;
  sector: string;
  username: string;
  email: string;
  password: string;
  active: boolean;
  photoUrl?: string;
}

export interface AlertItem {
  id: string;
  title: string;
  subtitle: string;
  level: 'HIGH' | 'MED' | 'LOW';
  timestamp: string;
  type: 'incomplete_box';
}
