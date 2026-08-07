import { ToolItem, MechanicBox, AuditLogItem, AlertItem, Person } from '../types';

export const INITIAL_TOOLS: ToolItem[] = [
  {
    id: 't-1',
    code: 'TL-P-4092',
    qrCode: 'QR-P4092-MIL',
    name: 'Chave de Impacto Milwaukee 1/2"',
    category: 'Ferramentas Elétricas',
    brand: 'Milwaukee',
    location: 'Almoxarifado Principal - Prateleira B3',
    status: 'available',
    lastAuditDate: '2026-08-01',
  },
  {
    id: 't-2',
    code: 'TL-D-1104',
    qrCode: 'QR-D1104-SNP',
    name: 'Scanner Snap-On OBD2 PRO',
    category: 'Equip. de Diagnóstico',
    brand: 'Snap-On',
    location: 'J. Smith (Baia 1)',
    status: 'loaned',
    assignedTo: 'J. Smith (Baia 1)',
    lastAuditDate: '2026-08-04'
  },
  {
    id: 't-3',
    code: 'TL-H-8831',
    qrCode: 'QR-H8831-CFT',
    name: 'Torquímetro 1/2" Drive',
    category: 'Ferramentas Manuais',
    brand: 'Craftsman',
    location: 'Laboratório de Calibração',
    status: 'repair',
    lastAuditDate: '2026-07-28',
  },
  {
    id: 't-4',
    code: 'TL-P-2019',
    qrCode: 'QR-P2019-DEW',
    name: 'Esmerilhadeira Angular DeWalt 20V',
    category: 'Ferramentas Elétricas',
    brand: 'DeWalt',
    location: 'Almoxarifado Principal - Prateleira A1',
    status: 'available',
    lastAuditDate: '2026-08-02'
  },
  {
    id: 't-5',
    code: 'TL-S-5042',
    qrCode: 'QR-S5042-MAC',
    name: 'Ferramenta Pneumática de Pinça de Freio Mac Tools',
    category: 'Automotivo Especializado',
    brand: 'Mac Tools',
    location: 'S. Connor (Baia 3)',
    status: 'loaned',
    assignedTo: 'S. Connor (M-08)',
    lastAuditDate: '2026-08-05'
  },
  {
    id: 't-6',
    code: 'TL-H-3301',
    qrCode: 'QR-H3301-SNP',
    name: 'Jogo de Soquetes Snap-On Master (Métrico)',
    category: 'Ferramentas Manuais',
    brand: 'Snap-On',
    location: 'Caixa #402-A',
    status: 'lost',
    lastAuditDate: '2026-08-05'
  },
  {
    id: 't-7',
    code: 'TL-D-9920',
    qrCode: 'QR-D9920-FLK',
    name: 'Multímetro Industrial Fluke 87V',
    category: 'Equip. de Diagnóstico',
    brand: 'Fluke',
    location: 'J. Miller (M-12)',
    status: 'loaned',
    assignedTo: 'J. Miller (M-12)',
    lastAuditDate: '2026-08-04'
  },
  {
    id: 't-8',
    code: 'TL-P-1102',
    qrCode: 'QR-P1102-IR',
    name: 'Chave de Impacto Pneumática Pesada Ingersoll Rand',
    category: 'Ferramentas Elétricas',
    brand: 'Ingersoll Rand',
    location: 'A. Reyes (M-03)',
    status: 'loaned',
    assignedTo: 'A. Reyes (M-03)',
    lastAuditDate: '2026-08-06'
  }
];

export const INITIAL_MECHANIC_BOXES: MechanicBox[] = [
  {
    id: 'box-1',
    boxNumber: 'Caixa #402-A',
    mechanicName: 'J. Miller',
    mechanicId: 'MAT-8922',
    team: 'Turno Alpha',
    supervisor: 'Supervisor Vance',
    compliancePercentage: 88,
    missingCount: 3,
    missingItemsList: ['Soquete Sextavado 10mm', 'Chave Dinamométrica 1/4"', 'Extensão de Catraca 3/8"'],
    status: 'incomplete',
    lastAudit: 'Início do turno'
  },
  {
    id: 'box-2',
    boxNumber: 'Caixa #114-B',
    mechanicName: 'S. Patel',
    mechanicId: 'MAT-7104',
    team: 'Turno Alpha',
    supervisor: 'Supervisor Vance',
    compliancePercentage: 100,
    missingCount: 0,
    missingItemsList: [],
    status: 'complete',
    lastAudit: 'há 2h'
  },
  {
    id: 'box-3',
    boxNumber: 'Caixa #209-C',
    mechanicName: 'D. Washington',
    mechanicId: 'MAT-9331',
    team: 'Turno Bravo',
    supervisor: 'Supervisor Hayes',
    compliancePercentage: 100,
    missingCount: 0,
    missingItemsList: [],
    status: 'complete',
    lastAudit: 'Ontem'
  },
  {
    id: 'box-4',
    boxNumber: 'Caixa #311-A',
    mechanicName: 'M. Chen',
    mechanicId: 'MAT-5520',
    team: 'Turno Alpha',
    supervisor: 'Supervisor Vance',
    compliancePercentage: 95,
    missingCount: 1,
    missingItemsList: ['Manômetro de Linha Pneumática'],
    status: 'incomplete',
    lastAudit: 'há 3h'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [
  {
    id: 'log-1',
    type: 'Empréstimo',
    title: 'Ferramenta Emprestada',
    timestamp: 'há 2min',
    assetCode: 'T-449',
    details: 'Torquímetro T-449 para OPR-42',
    user: 'OPERADOR-42',
    statusColor: 'primary'
  },
  {
    id: 'log-2',
    type: 'Dano',
    title: 'Dano Reportado',
    timestamp: 'há 15min',
    assetCode: 'AC-102',
    details: 'Vazamento reportado no Compressor de Ar AC-102',
    user: 'J. Miller',
    statusColor: 'error'
  },
  {
    id: 'log-3',
    type: 'Auditoria de Caixa',
    title: 'Auditoria de Caixa',
    timestamp: 'há 1h',
    assetCode: 'Caixa-099',
    details: 'Caixa-099 verificada 100% completa por SYS-ADMIN',
    user: 'SYS-ADMIN',
    statusColor: 'secondary'
  },
  {
    id: 'log-4',
    type: 'Novo Ativo',
    title: 'Novo Ativo Adicionado',
    timestamp: 'há 3h',
    assetCode: 'D-01',
    details: 'Tablet de Diagnóstico D-01 registrado na frota',
    user: 'OPERADOR-42',
    statusColor: 'tertiary'
  },
  {
    id: 'log-5',
    type: 'Devolução',
    title: 'Ferramenta Devolvida',
    timestamp: 'há 4h',
    assetCode: 'I-22',
    details: 'Parafusadeira de Impacto I-22 devolvida por OPR-11',
    user: 'OPR-11',
    statusColor: 'primary'
  }
];

export const INITIAL_PEOPLE: Person[] = [
  {
    id: 'p-0',
    name: 'Ricardo Luz',
    registration: 'MAT-1001',
    role: 'Administrador',
    sector: 'Gestão',
    username: 'ricardo_h',
    email: 'ricardo_h.16@hotmail.com',
    password: '15975321',
    active: true,
  },
  {
    id: 'p-1',
    name: 'J. Miller',
    registration: 'MAT-8922',
    role: 'Mecânico',
    sector: 'Turno Alpha',
    username: 'j.miller',
    email: 'j.miller@gvel.com',
    password: 'gvel123',
    active: true,
  },
  {
    id: 'p-2',
    name: 'S. Patel',
    registration: 'MAT-7104',
    role: 'Mecânico',
    sector: 'Turno Alpha',
    username: 's.patel',
    email: 's.patel@gvel.com',
    password: 'gvel123',
    active: true,
  },
  {
    id: 'p-3',
    name: 'D. Washington',
    registration: 'MAT-9331',
    role: 'Supervisor',
    sector: 'Turno Bravo',
    username: 'd.washington',
    email: 'd.washington@gvel.com',
    password: 'gvel123',
    active: true,
  },
  {
    id: 'p-4',
    name: 'M. Chen',
    registration: 'MAT-5520',
    role: 'Mecânico',
    sector: 'Turno Alpha',
    username: 'm.chen',
    email: 'm.chen@gvel.com',
    password: 'gvel123',
    active: true,
  },
];

export const INITIAL_ALERTS: AlertItem[] = [
  {
    id: 'alert-1',
    title: 'Caixa-042 (J. Doe)',
    subtitle: 'Faltando: Chave 10mm',
    level: 'HIGH',
    timestamp: 'há 10min',
    type: 'incomplete_box'
  },
  {
    id: 'alert-2',
    title: 'Caixa-018 (M. Smith)',
    subtitle: 'Faltando: Chave Dinamométrica',
    level: 'MED',
    timestamp: 'há 30min',
    type: 'incomplete_box'
  }
];
