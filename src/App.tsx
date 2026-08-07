import React, { useEffect, useState } from 'react';
import { PageId, ToolItem, MechanicBox, AuditLogItem, AlertItem, ToolStatus, Person } from './types';
import {
  INITIAL_TOOLS,
  INITIAL_MECHANIC_BOXES,
  INITIAL_AUDIT_LOGS,
  INITIAL_ALERTS,
  INITIAL_PEOPLE,
} from './data/initialData';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SplashScreen } from './components/SplashScreen';
import { LockScreen } from './components/LockScreen';
import { DashboardView } from './components/DashboardView';
import { EstoqueView } from './components/EstoqueView';
import { ToolRequestsView } from './components/ToolRequestsView';
import { MechanicBoxesView } from './components/MechanicBoxesView';
import { DamageLossView } from './components/DamageLossView';
import { AuditLogsView } from './components/AuditLogsView';
import { SettingsView } from './components/SettingsView';
import { QRScannerModal } from './components/QRScannerModal';

import { supabase } from './lib/supabase';

export default function App() {
  const [currentUser, setCurrentUser] = useState<Person | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [showScanner, setShowScanner] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('toolcontrol-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Application Data States
  const [tools, setTools] = useState<ToolItem[]>(INITIAL_TOOLS);
  const [mechanicBoxes, setMechanicBoxes] = useState<MechanicBox[]>(INITIAL_MECHANIC_BOXES);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(INITIAL_AUDIT_LOGS);
  const [alerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [people, setPeople] = useState<Person[]>(() => {
    const saved = localStorage.getItem('toolcontrol-people');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const hasRicardo = parsed.some(
            (p: Person) => p.email.toLowerCase() === 'ricardo_h.16@hotmail.com'
          );
          if (!hasRicardo) {
            return [INITIAL_PEOPLE[0], ...parsed];
          }
          return parsed;
        }
      } catch (e) {
        // fallback to INITIAL_PEOPLE
      }
    }
    return INITIAL_PEOPLE;
  });

  // Supabase Data Sync Effect
  useEffect(() => {
    async function loadSupabaseData() {
      try {
        const { data: dbPeople } = await supabase.from('people').select('*');
        if (dbPeople && dbPeople.length > 0) {
          const mappedPeople: Person[] = dbPeople.map((p) => ({
            id: p.id,
            name: p.name,
            registration: p.registration,
            role: p.role,
            sector: p.sector,
            username: p.username,
            email: p.email,
            password: p.password,
            active: p.active,
            photoUrl: p.photo_url,
          }));
          setPeople(mappedPeople);
        }

        const { data: dbTools } = await supabase.from('tools').select('*');
        if (dbTools && dbTools.length > 0) {
          const mappedTools: ToolItem[] = dbTools.map((t) => ({
            id: t.id,
            code: t.code,
            qrCode: t.qr_code,
            name: t.name,
            category: t.category,
            brand: t.brand,
            location: t.location,
            status: t.status,
            assignedTo: t.assigned_to,
            assignedBay: t.assigned_bay,
            assignedPhotoUrl: t.assigned_photo_url,
            lastAuditDate: t.last_audit_date,
            photoUrl: t.photo_url,
          }));
          setTools(mappedTools);
        }
      } catch (err) {
        // Fallback to local data on offline or connection error
      }
    }

    loadSupabaseData();
  }, []);

  useEffect(() => {
    localStorage.setItem('toolcontrol-people', JSON.stringify(people));
  }, [people]);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Log Helper
  const addAuditLog = (
    type: AuditLogItem['type'],
    title: string,
    details: string,
    assetCode?: string,
    statusColor: AuditLogItem['statusColor'] = 'primary',
    photoUrl?: string
  ) => {
    const newLog: AuditLogItem = {
      id: `log-${Date.now()}`,
      type,
      title,
      timestamp: 'agora mesmo',
      assetCode,
      details,
      user: currentUser?.name || 'OPERADOR-42',
      statusColor,
      photoUrl,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Handlers
  const handleAddTool = (newToolData: Omit<ToolItem, 'id'>) => {
    const newTool: ToolItem = {
      ...newToolData,
      id: `t-${Date.now()}`,
    };
    setTools((prev) => [newTool, ...prev]);
    addAuditLog('Novo Ativo', 'Novo Ativo Adicionado', `${newTool.name} (${newTool.code}) registrado no estoque`, newTool.code, 'tertiary');
    showToast(`Ferramenta cadastrada: ${newTool.name} (${newTool.code})`);
  };

  const handleUpdateToolStatus = (toolId: string, newStatus: ToolStatus, location?: string) => {
    setTools((prev) =>
      prev.map((t) => {
        if (t.id === toolId) {
          return {
            ...t,
            status: newStatus,
            location: location || t.location,
            assignedTo: newStatus === 'available' ? undefined : t.assignedTo,
          };
        }
        return t;
      })
    );
  };

  const handleAuditBox = (boxId: string, updatedBox: Partial<MechanicBox>) => {
    setMechanicBoxes((prev) =>
      prev.map((b) => (b.id === boxId ? { ...b, ...updatedBox } : b))
    );
    const targetBox = mechanicBoxes.find((b) => b.id === boxId);
    if (targetBox) {
      addAuditLog(
        'Auditoria de Caixa',
        'Auditoria de Caixa Concluída',
        `${targetBox.boxNumber} verificada (${updatedBox.compliancePercentage}% de conformidade)`,
        targetBox.boxNumber,
        'secondary'
      );
      showToast(`Auditoria salva para ${targetBox.boxNumber}`);
    }
  };

  const handleRegisterBox = (newBoxData: Omit<MechanicBox, 'id'>) => {
    const newBox: MechanicBox = {
      ...newBoxData,
      id: `box-${Date.now()}`,
    };
    setMechanicBoxes((prev) => [newBox, ...prev]);
    addAuditLog(
      'Auditoria de Caixa',
      'Nova Caixa Registrada',
      `${newBox.boxNumber} registrada para ${newBox.mechanicName}`,
      newBox.boxNumber,
      'secondary'
    );
    showToast(`${newBox.boxNumber} registrada para ${newBox.mechanicName}`);
  };

  const handleAddPerson = (newPersonData: Omit<Person, 'id'>) => {
    const newPerson: Person = {
      ...newPersonData,
      id: `p-${Date.now()}`,
    };
    setPeople((prev) => [newPerson, ...prev]);
    showToast(`Pessoa cadastrada: ${newPerson.name} (usuário: ${newPerson.username})`);
  };

  const handleUpdatePerson = (id: string, updates: Partial<Person>) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    showToast('Cadastro atualizado.');
  };

  const handleTogglePersonActive = (id: string) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === id ? { ...p, active: !p.active } : p))
    );
  };

  const handleRequestTools = (
    toolIds: string[],
    requesterName: string,
    requesterBay: string,
    proofPhotoUrl: string
  ) => {
    const requestedTools = tools.filter((t) => toolIds.includes(t.id));
    const assignedTo = requesterBay ? `${requesterName} (${requesterBay})` : requesterName;

    setTools((prev) =>
      prev.map((t) =>
        toolIds.includes(t.id)
          ? {
              ...t,
              status: 'loaned',
              assignedTo,
              assignedBay: requesterBay || undefined,
              assignedPhotoUrl: proofPhotoUrl,
            }
          : t
      )
    );

    requestedTools.forEach((t) => {
      addAuditLog(
        'Empréstimo',
        'Ferramenta Solicitada',
        `${t.name} (${t.code}) retirada por ${assignedTo}`,
        t.code,
        'primary',
        proofPhotoUrl
      );
    });

    showToast(
      requestedTools.length === 1
        ? `${requestedTools[0].name} liberada para ${requesterName}`
        : `${requestedTools.length} ferramentas liberadas para ${requesterName}`
    );
  };

  const handleReportIncident = (toolId: string, type: 'damaged' | 'lost', notes: string) => {
    const targetTool = tools.find((t) => t.id === toolId);
    if (targetTool) {
      handleUpdateToolStatus(toolId, type === 'damaged' ? 'repair' : 'lost');
      addAuditLog(
        'Dano',
        type === 'damaged' ? 'Dano Reportado' : 'Perda Reportada',
        `${targetTool.name}: ${notes || 'Ocorrência registrada'}`,
        targetTool.code,
        'error'
      );
      showToast(`Ocorrência registrada para ${targetTool.name}`);
    }
  };

  const handleScanResult = (code: string) => {
    showToast(`Código escaneado: ${code}`);
  };

  const handleNavigateToAlert = () => {
    setCurrentPage('mechanic-boxes');
  };

  const handleRegisterFace = async (personId: string, photoUrl: string) => {
    setPeople((prev) =>
      prev.map((p) => (p.id === personId ? { ...p, photoUrl } : p))
    );

    try {
      await supabase.from('people').update({ photo_url: photoUrl }).eq('id', personId);
    } catch (e) {
      // fallback to local state
    }

    showToast('Biometria facial cadastrada com sucesso!');
  };

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  if (!currentUser) {
    return (
      <LockScreen
        people={people}
        onRegisterFace={handleRegisterFace}
        onUnlock={(user) => {
          setCurrentUser(user);
          setCurrentPage('tool-requests');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md flex">
      {/* Toast Overlay */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary-container border border-primary text-on-primary-container px-lg py-md rounded-xl shadow-2xl font-label-md flex items-center gap-md animate-in slide-in-from-bottom-5">
          <span className="material-symbols-outlined text-primary text-[22px]">info</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        alertCount={alerts.length}
      />

      {/* Main Container */}
      <div className="pl-64 w-full flex flex-col min-h-screen">
        {/* Top Header */}
        <Header
          alerts={alerts}
          onNavigateToAlert={handleNavigateToAlert}
          currentUser={currentUser}
          onLock={() => setCurrentUser(null)}
        />

        {/* View Router */}
        <main className="relative pt-16 w-full flex-1">
          {currentPage === 'dashboard' && (
            <DashboardView
              onNavigate={setCurrentPage}
              auditLogs={auditLogs}
              onOpenScanner={() => setShowScanner(true)}
            />
          )}

          {currentPage === 'estoque' && (
            <EstoqueView
              tools={tools}
              onAddTool={handleAddTool}
              onUpdateToolStatus={handleUpdateToolStatus}
            />
          )}

          {currentPage === 'tool-requests' && (
            <ToolRequestsView
              tools={tools}
              mechanicNames={people.filter((p) => p.active).map((p) => p.name)}
              onRequestTools={handleRequestTools}
            />
          )}

          {currentPage === 'mechanic-boxes' && (
            <MechanicBoxesView
              boxes={mechanicBoxes}
              onAuditBox={handleAuditBox}
              onRegisterBox={handleRegisterBox}
            />
          )}

          {currentPage === 'damage-loss' && (
            <DamageLossView
              tools={tools}
              onReportIncident={handleReportIncident}
            />
          )}

          {currentPage === 'audit-logs' && (
            <AuditLogsView logs={auditLogs} />
          )}

          {currentPage === 'settings' && (
            <SettingsView
              isDarkMode={isDarkMode}
              onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
              people={people}
              onAddPerson={handleAddPerson}
              onUpdatePerson={handleUpdatePerson}
              onTogglePersonActive={handleTogglePersonActive}
            />
          )}
        </main>
      </div>

      {/* Interactive Barcode/QR Scanner Modal */}
      {showScanner && (
        <QRScannerModal
          onClose={() => setShowScanner(false)}
          onScanResult={handleScanResult}
        />
      )}
    </div>
  );
}
