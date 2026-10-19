import React, { useState, useEffect } from 'react';
import { Home, ChevronUp } from 'lucide-react';
import { SurveillanceProvider, useSurveillance } from './context/SurveillanceContext';
import { Navbar, Footer } from './components/NavbarFooter';
import { BerandaPage, TikusDashboardPage } from './components/PublicPages';
import {
  NyamukDashboardPage,
  PetaWilayahPage,
  LalatDashboardPage,
} from './components/NyamukAndMapPages';
import {
  LingkunganPage,
  InformasiPage,
  DataPage,
  TentangPage,
} from './components/InfoAndDataPages';
import { AdminDashboard } from './components/AdminDashboard';
import { LoginModal, RecordFormModal } from './components/Modals';

export function AppContent() {
  const {
    isAdmin,
    addTikusRecord,
    updateTikusRecord,
    deleteTikusRecord,
    addNyamukRecord,
    updateNyamukRecord,
    deleteNyamukRecord,
    addLalatRecord,
    updateLalatRecord,
    deleteLalatRecord,
  } = useSurveillance();

  const [activeTab, setActiveTabState] = useState<string>(
    () => window.location.hash.replace('#/', '').replace('#', '') || 'beranda'
  );
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [formType, setFormType] = useState<'tikus' | 'nyamuk' | 'lalat'>('tikus');
  const [editingRecord, setEditingRecord] = useState<any | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const h = window.location.hash.replace('#/', '').replace('#', '');
      if (h) setActiveTabState(h);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = (tab: string) => {
    setActiveTabState(tab);
    window.location.hash = `#/${tab}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCreateModal = (type: 'tikus' | 'nyamuk' | 'lalat') => {
    setFormType(type);
    setEditingRecord(null);
    setFormModalOpen(true);
  };

  const handleOpenEditModal = (type: 'tikus' | 'nyamuk' | 'lalat', record: any) => {
    setFormType(type);
    setEditingRecord(record);
    setFormModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-[#3A4EFB] selection:text-white relative">
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        openLoginModal={() => setLoginModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'beranda' && <BerandaPage onNavigate={handleNavigate} />}
        {activeTab === 'vektor/tikus' && (
          <TikusDashboardPage
            onEditRecord={isAdmin ? (r) => handleOpenEditModal('tikus', r) : undefined}
            onDeleteRecord={isAdmin ? (r) => deleteTikusRecord(r.id) : undefined}
          />
        )}
        {activeTab === 'vektor/nyamuk' && (
          <NyamukDashboardPage
            onEditRecord={isAdmin ? (r) => handleOpenEditModal('nyamuk', r) : undefined}
            onDeleteRecord={isAdmin ? (r) => deleteNyamukRecord(r.id) : undefined}
          />
        )}
        {(activeTab === 'vektor/lalat' || activeTab === 'vektor-lalat') && (
          <LalatDashboardPage
            onEditRecord={isAdmin ? (r) => handleOpenEditModal('lalat', r) : undefined}
            onDeleteRecord={isAdmin ? (r) => deleteLalatRecord(r.id) : undefined}
          />
        )}
        {activeTab === 'peta' && <PetaWilayahPage />}
        {activeTab === 'lingkungan' && <LingkunganPage />}
        {activeTab === 'informasi' && <InformasiPage />}
        {activeTab === 'data' && (
          <DataPage
            onEditRecord={isAdmin ? (r) => handleOpenEditModal('tikus', r) : undefined}
            onDeleteRecord={isAdmin ? (r) => deleteTikusRecord(r.id) : undefined}
          />
        )}
        {activeTab === 'tentang' && <TentangPage />}
        {activeTab.startsWith('admin') && (
          <AdminDashboard
            onOpenCreateModal={handleOpenCreateModal}
            onOpenEditModal={handleOpenEditModal}
            onOpenLoginModal={() => setLoginModalOpen(true)}
          />
        )}
      </main>

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 items-end">
        {activeTab !== 'beranda' && (
          <button
            onClick={() => handleNavigate('beranda')}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white/95 hover:bg-[#3A4EFB] text-slate-700 hover:text-white border border-slate-200/90 rounded-full shadow-lg backdrop-blur-md text-xs font-semibold transition-all hover:scale-105 group cursor-pointer"
            title="Kembali ke Layar Utama / Beranda"
          >
            <Home className="w-4 h-4 text-[#3A4EFB] group-hover:text-white group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Layar Utama</span>
          </button>
        )}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-[#3A4EFB] hover:bg-[#33A4FA] text-white rounded-full shadow-xl backdrop-blur-md text-xs font-semibold transition-all hover:scale-105 group border border-[#3A4EFB]/30 cursor-pointer"
            title="Kembali ke Bagian Atas"
          >
            <ChevronUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            <span className="hidden sm:inline">Kembali ke Atas</span>
          </button>
        )}
      </div>

      <Footer />

      <LoginModal
        isOpen={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        onSuccess={() => handleNavigate('admin')}
      />

      <RecordFormModal
        isOpen={formModalOpen}
        type={formType}
        initialRecord={editingRecord}
        onClose={() => setFormModalOpen(false)}
        onSaveTikus={(rec) => {
          if (rec.id) {
            updateTikusRecord(rec.id, rec);
          } else {
            addTikusRecord(rec);
          }
        }}
        onSaveNyamuk={(rec) => {
          if (rec.id) {
            updateNyamukRecord(rec.id, rec);
          } else {
            addNyamukRecord(rec);
          }
        }}
        onSaveLalat={(rec) => {
          if (rec.id) {
            updateLalatRecord(rec.id, rec);
          } else {
            addLalatRecord(rec);
          }
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <SurveillanceProvider>
      <AppContent />
    </SurveillanceProvider>
  );
}
