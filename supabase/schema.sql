-- Schema de Tabelas para Inventário de Ferramentas - GVEL

-- 1. Tabela de Pessoas / Usuários
CREATE TABLE IF NOT EXISTS public.people (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    registration TEXT NOT NULL,
    role TEXT NOT NULL,
    sector TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    active BOOLEAN DEFAULT true,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela de Ferramentas / Ativos
CREATE TABLE IF NOT EXISTS public.tools (
    id TEXT PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    qr_code TEXT NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    brand TEXT NOT NULL,
    location TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('available', 'loaned', 'repair', 'lost')),
    assigned_to TEXT,
    assigned_bay TEXT,
    assigned_photo_url TEXT,
    last_audit_date DATE,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela de Caixas dos Mecânicos
CREATE TABLE IF NOT EXISTS public.mechanic_boxes (
    id TEXT PRIMARY KEY,
    box_number TEXT NOT NULL UNIQUE,
    mechanic_name TEXT NOT NULL,
    mechanic_id TEXT NOT NULL,
    team TEXT NOT NULL,
    supervisor TEXT NOT NULL,
    compliance_percentage INTEGER DEFAULT 100,
    missing_count INTEGER DEFAULT 0,
    missing_items_list JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL CHECK (status IN ('complete', 'incomplete')),
    last_audit TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela de Logs de Auditoria
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id TEXT PRIMARY KEY,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    asset_code TEXT,
    details TEXT NOT NULL,
    user_name TEXT NOT NULL,
    status_color TEXT NOT NULL,
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela de Alertas
CREATE TABLE IF NOT EXISTS public.alerts (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('HIGH', 'MED', 'LOW')),
    timestamp TEXT NOT NULL,
    type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar leitura pública (Políticas RLS simplificadas para operação)
ALTER TABLE public.people ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mechanic_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir acesso total a people" ON public.people FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso total a tools" ON public.tools FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso total a mechanic_boxes" ON public.mechanic_boxes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso total a audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Permitir acesso total a alerts" ON public.alerts FOR ALL USING (true) WITH CHECK (true);

-- Dados Iniciais (Seed Data)

-- Inserir Usuário Administrador Ricardo + Equipe
INSERT INTO public.people (id, name, registration, role, sector, username, email, password, active)
VALUES
('p-0', 'Ricardo Henrique', 'MAT-1001', 'Administrador', 'Gestão', 'ricardo_h', 'ricardo_h.16@hotmail.com', '15975321', true),
('p-1', 'J. Miller', 'MAT-8922', 'Mecânico', 'Turno Alpha', 'j.miller', 'j.miller@gvel.com', 'gvel123', true),
('p-2', 'S. Patel', 'MAT-7104', 'Mecânico', 'Turno Alpha', 's.patel', 's.patel@gvel.com', 'gvel123', true),
('p-3', 'D. Washington', 'MAT-9331', 'Supervisor', 'Turno Bravo', 'd.washington', 'd.washington@gvel.com', 'gvel123', true),
('p-4', 'M. Chen', 'MAT-5520', 'Mecânico', 'Turno Alpha', 'm.chen', 'm.chen@gvel.com', 'm.chen@gvel.com', true)
ON CONFLICT (id) DO NOTHING;

-- Inserir Ferramentas Iniciais
INSERT INTO public.tools (id, code, qr_code, name, category, brand, location, status, last_audit_date)
VALUES
('t-1', 'TL-P-4092', 'QR-P4092-MIL', 'Chave de Impacto Milwaukee 1/2"', 'Ferramentas Elétricas', 'Milwaukee', 'Almoxarifado Principal - Prateleira B3', 'available', '2026-08-01'),
('t-2', 'TL-D-1104', 'QR-D1104-SNP', 'Scanner Snap-On OBD2 PRO', 'Equip. de Diagnóstico', 'Snap-On', 'J. Smith (Baia 1)', 'loaned', '2026-08-04'),
('t-3', 'TL-H-8831', 'QR-H8831-CFT', 'Torquímetro 1/2" Drive', 'Ferramentas Manuais', 'Craftsman', 'Laboratório de Calibração', 'repair', '2026-07-28'),
('t-4', 'TL-P-2019', 'QR-P2019-DEW', 'Esmerilhadeira Angular DeWalt 20V', 'Ferramentas Elétricas', 'DeWalt', 'Almoxarifado Principal - Prateleira A1', 'available', '2026-08-02'),
('t-5', 'TL-S-5042', 'QR-S5042-MAC', 'Ferramenta Pneumática de Pinça de Freio Mac Tools', 'Automotivo Especializado', 'Mac Tools', 'S. Connor (Baia 3)', 'loaned', '2026-08-05')
ON CONFLICT (id) DO NOTHING;
