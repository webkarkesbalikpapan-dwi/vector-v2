import React, { useState } from 'react';
import {
  ChevronDown,
  MapPin,
  Layers,
  LogOut,
  Lock,
  Menu,
  X,
  Shield,
  Phone,
  Mail,
  Globe,
} from 'lucide-react';
import { useSurveillance } from '../context/SurveillanceContext';
import { KemenkesLogo, BkkLogo } from './Logos';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openLoginModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, openLoginModal }) => {
  const { isAdmin, logoutAdmin } = useSurveillance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [vektorDropdownOpen, setVektorDropdownOpen] = useState(false);

  const handleNav = (tab: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setVektorDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 border-b border-slate-200/90 text-slate-800 shadow-xs backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div
            onClick={() => handleNav('beranda')}
            className="flex items-center space-x-3 cursor-pointer group py-1 select-none"
          >
            <div className="flex items-center space-x-2 shrink-0">
              <KemenkesLogo className="w-11 h-11 shrink-0" />
              <BkkLogo className="w-11 h-11 shrink-0" />
            </div>
            <div className="border-l border-slate-200 pl-3">
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-mono group-hover:text-[#3A4EFB] transition-colors">
                  VECTO
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#3A4EFB] bg-[#3A4EFB]/10 px-2 py-0.5 rounded-full border border-[#3A4EFB]/20">
                  Surveilans
                </span>
              </div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center space-x-1">
            <button
              onClick={() => handleNav('beranda')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'beranda'
                  ? 'bg-[#3A4EFB] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Beranda
            </button>

            <div className="relative">
              <button
                onClick={() => setVektorDropdownOpen(!vektorDropdownOpen)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1 cursor-pointer ${
                  activeTab.startsWith('vektor')
                    ? 'bg-[#3A4EFB] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>Vektor</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {vektorDropdownOpen && (
                <div
                  onMouseLeave={() => setVektorDropdownOpen(false)}
                  className="absolute left-0 mt-1.5 w-60 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-slate-800 text-xs overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                >
                  <button
                    onClick={() => handleNav('vektor/tikus')}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors cursor-pointer"
                  >
                    <span className="text-base">🐀</span>
                    <div>
                      <div className="font-bold text-slate-900">Surveilans Tikus</div>
                      <div className="text-[11px] text-slate-500">Kepadatan & Indeks Pinjal</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleNav('vektor/nyamuk')}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors border-t border-slate-100 cursor-pointer"
                  >
                    <span className="text-base">🦟</span>
                    <div>
                      <div className="font-bold text-slate-900">Surveilans Nyamuk</div>
                      <div className="text-[11px] text-slate-500">Fokus Spesies Aedes</div>
                    </div>
                  </button>
                  <button
                    onClick={() => handleNav('vektor/lalat')}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-50 flex items-center space-x-2.5 transition-colors border-t border-slate-100 cursor-pointer"
                  >
                    <span className="text-base">🪰</span>
                    <div>
                      <div className="font-bold text-slate-900">Surveilans Lalat</div>
                      <div className="text-[11px] text-slate-500">Indeks Lalat Pelabuhan & Bandara</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNav('peta')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer ${
                activeTab === 'peta'
                  ? 'bg-[#3A4EFB] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className={`w-3.5 h-3.5 ${activeTab === 'peta' ? 'text-white' : 'text-[#3A4EFB]'}`} />
              <span>Peta Wilayah</span>
            </button>

            <button
              onClick={() => handleNav('lingkungan')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'lingkungan'
                  ? 'bg-[#3A4EFB] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Lingkungan
            </button>

            <button
              onClick={() => handleNav('informasi')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'informasi'
                  ? 'bg-[#3A4EFB] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Informasi
            </button>

            <button
              onClick={() => handleNav('data')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'data'
                  ? 'bg-[#3A4EFB] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Data
            </button>

            <button
              onClick={() => handleNav('tentang')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'tentang'
                  ? 'bg-[#3A4EFB] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Tentang Vecto
            </button>

            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className={`ml-2 px-3 py-2 text-xs font-bold rounded-lg transition-colors border flex items-center space-x-1.5 cursor-pointer ${
                  activeTab.startsWith('admin')
                    ? 'bg-[#3A4EFB] text-white border-[#3A4EFB]'
                    : 'bg-[#3A4EFB]/10 text-[#3A4EFB] border-[#3A4EFB]/30 hover:bg-[#3A4EFB] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Panel Admin</span>
              </button>
            )}
          </nav>

          <div className="hidden lg:flex items-center space-x-2">
            {isAdmin ? (
              <button
                onClick={logoutAdmin}
                className="px-3.5 py-2 text-xs font-semibold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
                title="Keluar dari sesi admin"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Admin</span>
              </button>
            ) : (
              <button
                onClick={openLoginModal}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-[#3A4EFB] bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center space-x-1.5 cursor-pointer"
                title="Login khusus Admin BKK"
              >
                <Lock className="w-3.5 h-3.5 text-[#3A4EFB]" />
                <span>Login Admin</span>
              </button>
            )}
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => handleNav('beranda')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
              activeTab === 'beranda' ? 'bg-[#3A4EFB] text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Beranda
          </button>
          <button
            onClick={() => handleNav('vektor/tikus')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2 ${
              activeTab === 'vektor/tikus' ? 'bg-[#3A4EFB] text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>🐀</span>
            <span>Surveilans Tikus & Pinjal</span>
          </button>
          <button
            onClick={() => handleNav('vektor/nyamuk')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2 ${
              activeTab === 'vektor/nyamuk' ? 'bg-[#3A4EFB] text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>🦟</span>
            <span>Surveilans Nyamuk Aedes</span>
          </button>
          <button
            onClick={() => handleNav('vektor/lalat')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2 ${
              activeTab === 'vektor/lalat' ? 'bg-[#3A4EFB] text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>🪰</span>
            <span>Surveilans Lalat</span>
          </button>
          <button
            onClick={() => handleNav('peta')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold flex items-center space-x-2 ${
              activeTab === 'peta' ? 'bg-[#3A4EFB] text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <MapPin className="w-4 h-4 text-[#3A4EFB]" />
            <span>Peta Wilayah</span>
          </button>
          <button
            onClick={() => handleNav('lingkungan')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
              activeTab === 'lingkungan' ? 'bg-[#3A4EFB] text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Faktor Lingkungan
          </button>
          <button
            onClick={() => handleNav('informasi')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
              activeTab === 'informasi' ? 'bg-[#3A4EFB] text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Informasi Institusi
          </button>
          <button
            onClick={() => handleNav('data')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
              activeTab === 'data' ? 'bg-[#3A4EFB] text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Tabel Data Surveilans
          </button>
          <button
            onClick={() => handleNav('tentang')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-semibold ${
              activeTab === 'tentang' ? 'bg-[#3A4EFB] text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            Tentang Vecto
          </button>

          {isAdmin && (
            <button
              onClick={() => handleNav('admin')}
              className={`w-full text-left px-3.5 py-2.5 rounded-lg text-xs font-bold flex items-center space-x-2 ${
                activeTab.startsWith('admin') ? 'bg-[#3A4EFB] text-white' : 'bg-[#3A4EFB]/10 text-[#3A4EFB]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Panel Manajemen Admin</span>
            </button>
          )}

          <div className="pt-3 border-t border-slate-200">
            {isAdmin ? (
              <button
                onClick={logoutAdmin}
                className="w-full text-center px-4 py-2.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100"
              >
                Keluar dari Akun Admin
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal();
                }}
                className="w-full text-center px-4 py-2.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 hover:bg-slate-200"
              >
                Login Petugas Karantina
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-slate-100 border-t border-slate-200 text-slate-600 text-xs">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-1">
          <div className="flex items-center space-x-2">
            <KemenkesLogo className="w-9 h-9" />
            <BkkLogo className="w-9 h-9" />
          </div>
          <div>
            <span className="text-sm font-bold text-slate-900 block font-mono">VECTO BKK BALIKPAPAN</span>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              Sistem Intelijen Surveilans Vektor Karantina Kesehatan Pelabuhan & Bandar Udara.
            </p>
          </div>
          <div className="pt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-[10px] text-slate-700 font-medium">
              <Shield className="w-3 h-3 text-[#3A4EFB]" />
              Standar Kemenkes RI
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Cakupan Wilayah Kerja</h4>
          <ul className="space-y-1.5 text-slate-500 text-[11px]">
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3A4EFB]" />
              <span>Pelabuhan Laut Balikpapan (Semayang)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3A4EFB]" />
              <span>Pos Bandara SAMSS Balikpapan</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3A4EFB]" />
              <span>Pos Pelabuhan Kampung Baru</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3A4EFB]" />
              <span>Pelabuhan Kuala Samboja (Kukar)</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3A4EFB]" />
              <span>Pelabuhan Tana Paser (Pondong)</span>
            </li>
          </ul>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Parameter Baku Mutu</h4>
          <div className="space-y-2 text-[11px] text-slate-500">
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="font-semibold text-slate-900">Trap Success Tikus</div>
              <div>Standar: ≤ 1% di perimeter & buffer</div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="font-semibold text-slate-900">Angka Bebas Jentik (ABJ)</div>
              <div>Standar: ≥ 95% bebas jentik Aedes</div>
            </div>
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 space-y-1">
              <div className="font-semibold text-slate-900">Indeks Kepadatan Lalat</div>
              <div>Standar: ≤ 2 ekor/flygrill (Tidak Perlu Intervensi)</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Kantor Induk Balikpapan</h4>
          <div className="space-y-1.5 text-[11px] text-slate-500 leading-relaxed">
            <p className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#3A4EFB] shrink-0 mt-0.5" />
              <span>Jl. Yos Sudarso No. 1, Prapatan, Balikpapan Kota 76111</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#3A4EFB] shrink-0" />
              <span>(0542) 731110 / 731112</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#3A4EFB] shrink-0" />
              <span>bkk.balikpapan@kemkes.go.id</span>
            </p>
            <p className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#3A4EFB] shrink-0" />
              <a
                href="https://bkkbalikpapan.kemkes.go.id"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#3A4EFB] transition-colors"
              >
                bkkbalikpapan.kemkes.go.id
              </a>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} Balai Kekarantinaan Kesehatan Kelas I Balikpapan — Kementerian Kesehatan RI.
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-slate-400">VECTO Surveillance v2.3</span>
        </div>
      </div>
    </div>
  </footer>
);
