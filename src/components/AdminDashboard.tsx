import React, { useState } from 'react';
import {
  Plus,
  MapPin,
  Activity,
  FileSpreadsheet,
  Clock,
  Upload,
  Download,
  Eye,
  EyeOff,
  PenLine,
  Trash2,
  RefreshCw,
  CircleCheck,
  TriangleAlert,
} from 'lucide-react';
import { useSurveillance } from '../context/SurveillanceContext';
import { WILAYAH_KERJA_LIST } from '../mockData';
import { TikusRecord, NyamukRecord, LalatRecord } from '../types';

interface AdminDashboardProps {
  onOpenCreateModal: (type: 'tikus' | 'nyamuk' | 'lalat') => void;
  onOpenEditModal: (type: 'tikus' | 'nyamuk' | 'lalat', record: any) => void;
  onOpenLoginModal: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenCreateModal,
  onOpenEditModal,
  onOpenLoginModal,
}) => {
  const {
    isAdmin,
    adminUser,
    tikusData,
    nyamukData,
    lalatData,
    locations,
    auditLogs,
    deleteTikusRecord,
    deleteNyamukRecord,
    deleteLalatRecord,
    updateTikusRecord,
    updateNyamukRecord,
    updateLalatRecord,
    addLocation,
    deleteLocation,
    sheetUrl,
    setSheetUrl,
    syncStatus,
    syncWithGoogleSheet,
    importDataFromText,
    exportToCsv,
    resetToDefaultData,
    loginAdmin,
  } = useSurveillance();

  const [activeSubTab, setActiveSubTab] = useState<
    'tikus' | 'nyamuk' | 'lalat' | 'lokasi' | 'pemeriksaan' | 'sheets' | 'logs'
  >('tikus');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetType, setDeleteTargetType] = useState<'tikus' | 'nyamuk' | 'lalat' | 'lokasi' | null>(null);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importType, setImportType] = useState<'tikus' | 'nyamuk' | 'lalat'>('tikus');
  const [csvText, setCsvText] = useState('');
  const [importFeedback, setImportFeedback] = useState<string | null>(null);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [newLocNama, setNewLocNama] = useState('');
  const [newLocWilker, setNewLocWilker] = useState(WILAYAH_KERJA_LIST[0]);
  const [newLocKategori, setNewLocKategori] = useState('Pelabuhan Laut');
  const [newLocLat, setNewLocLat] = useState('-1.2778');
  const [newLocLng, setNewLocLng] = useState('116.8042');
  const [newLocDesc, setNewLocDesc] = useState('');

  if (!isAdmin) {
    const handleInlineLogin = (e: React.FormEvent) => {
      e.preventDefault();
      setLoginError(null);
      setLoginLoading(true);
      setTimeout(() => {
        const res = loginAdmin(loginUsername, loginPassword);
        setLoginLoading(false);
        if (!res.success) {
          setLoginError(res.error || 'Username atau password salah.');
        } else {
          setLoginUsername('');
          setLoginPassword('');
        }
      }, 250);
    };

    return (
      <div className="max-w-lg mx-auto my-10 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden text-slate-800">
        <div className="p-6 bg-slate-50 border-b border-slate-200 flex items-center space-x-3.5">
          <div className="w-11 h-11 bg-[#3A4EFB]/10 border border-[#3A4EFB]/25 rounded-xl flex items-center justify-center text-[#3A4EFB] shrink-0">
            <TriangleAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#3A4EFB] block">
              OTORISASI ADMINISTRATOR VECTO
            </span>
            <h2 className="text-lg font-extrabold text-slate-900">
              Section Login Admin BKK Balikpapan
            </h2>
          </div>
        </div>

        <form onSubmit={handleInlineLogin} className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Halaman pengelolaan data surveilans vektor, titik lokasi, dan sinkronisasi spreadsheet ini diproteksi. Silakan masuk menggunakan akun resmi <strong>Admin</strong>.
          </p>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2 text-rose-700 text-xs">
              <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Username Admin
            </label>
            <input
              type="text"
              required
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              placeholder="Masukkan username admin"
              autoComplete="username"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password Admin
            </label>
            <div className="relative">
              <input
                type={showLoginPass ? 'text' : 'password'}
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
              />
              <button
                type="button"
                onClick={() => setShowLoginPass(!showLoginPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onOpenLoginModal}
              className="text-[11px] font-semibold text-slate-500 hover:text-[#3A4EFB] transition-colors cursor-pointer"
            >
              Gunakan Modal Popup
            </button>
            <button
              type="submit"
              disabled={loginLoading}
              className="px-6 py-2.5 bg-[#3A4EFB] hover:bg-[#33A4FA] text-white rounded-xl text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? 'Memverifikasi...' : 'Masuk sebagai Admin'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      <div className="border-b border-slate-200/80 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#3A4EFB] text-xs font-semibold uppercase tracking-wider mb-1">
            <span className="w-2 h-2 rounded-full bg-[#3A4EFB] animate-pulse" />
            <span>PANEL ADMINISTRASI & PENGELOLAAN DATA</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Admin Dashboard Vecto
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Masuk sebagai: <strong className="text-slate-800">{adminUser?.name}</strong> ({adminUser?.email})
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              onOpenCreateModal(
                activeSubTab === 'nyamuk'
                  ? 'nyamuk'
                  : activeSubTab === 'lalat'
                  ? 'lalat'
                  : 'tikus'
              )
            }
            className="px-4 py-2 bg-[#3A4EFB] hover:bg-[#33A4FA] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>
              Tambah Data{' '}
              {activeSubTab === 'nyamuk'
                ? 'Nyamuk'
                : activeSubTab === 'lalat'
                ? 'Lalat'
                : 'Tikus'}
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('tikus')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'tikus'
              ? 'bg-[#3A4EFB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🐀</span>
          <span>Data Tikus ({tikusData.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('nyamuk')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'nyamuk'
              ? 'bg-[#3A4EFB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🦟</span>
          <span>Data Nyamuk ({nyamukData.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('lalat')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'lalat'
              ? 'bg-[#3A4EFB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <span>🪰</span>
          <span>Data Lalat ({lalatData.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('lokasi')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'lokasi'
              ? 'bg-[#3A4EFB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Data Lokasi ({locations.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('pemeriksaan')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'pemeriksaan'
              ? 'bg-[#3A4EFB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Pemeriksaan Pinjal</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sheets')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'sheets'
              ? 'bg-[#3A4EFB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Google Sheets</span>
        </button>

        <button
          onClick={() => setActiveSubTab('logs')}
          className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'logs'
              ? 'bg-[#3A4EFB] text-white shadow-xs'
              : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Log Audit ({auditLogs.length})</span>
        </button>
      </div>

      {activeSubTab === 'tikus' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Manajemen Data Surveilans Tikus</h3>
              <p className="text-xs text-slate-500">
                Total {tikusData.length} entri tercatat dalam database sistem.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setImportType('tikus');
                  setImportModalOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#3A4EFB]" />
                <span>Import CSV</span>
              </button>
              <button
                onClick={() => exportToCsv('tikus')}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#3A4EFB]" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Tanggal</th>
                  <th className="px-3 py-2.5">Wilayah</th>
                  <th className="px-3 py-2.5">Lokasi / Bangunan</th>
                  <th className="px-3 py-2.5">Spesies</th>
                  <th className="px-3 py-2.5 text-right">Trap</th>
                  <th className="px-3 py-2.5 text-right">Tertangkap</th>
                  <th className="px-3 py-2.5 text-center">Pinjal</th>
                  <th className="px-3 py-2.5 text-center">Visibilitas</th>
                  <th className="px-3 py-2.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tikusData.map((e: TikusRecord) => (
                  <tr key={e.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2 font-mono text-[11px] text-slate-800">
                      {e.start_date && e.end_date ? `${e.start_date} s/d ${e.end_date}` : e.tanggal}
                    </td>
                    <td className="px-3 py-2 font-medium text-slate-900">{e.wilayahKerja}</td>
                    <td
                      className="px-3 py-2 max-w-xs truncate"
                      title={`${e.lokasi} - ${e.bangunan}`}
                    >
                      {e.lokasi} ({e.bangunan || '-'})
                    </td>
                    <td className="px-3 py-2 italic font-serif text-slate-900">{e.jenisTikus}</td>
                    <td className="px-3 py-2 text-right font-mono">{e.jumlahPerangkap}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">
                      {e.jumlahTikusTertangkap === 0 ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          0 (Tidak Ditemukan)
                        </span>
                      ) : (
                        <span className="font-mono font-semibold text-[#3A4EFB]">
                          {e.jumlahTikusTertangkap} ekor
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 text-center text-slate-700">
                      {e.statusPinjal ||
                        e.jenisPinjal ||
                        (e.jumlahPinjal && e.jumlahPinjal > 0 ? 'Pinjal' : 'Nihil')}{' '}
                      {e.jumlahPinjal ? `(${e.jumlahPinjal})` : ''}
                    </td>
                    <td className="px-3 py-2 text-center">
                      <button
                        onClick={() => updateTikusRecord(e.id, { isPublic: !e.isPublic })}
                        className="text-xs text-slate-400 hover:text-slate-800 cursor-pointer"
                        title={
                          e.isPublic ? 'Publik: Klik untuk ubah privat' : 'Privat: Klik untuk publikasikan'
                        }
                      >
                        {e.isPublic ? (
                          <Eye className="w-3.5 h-3.5 text-emerald-600 inline" />
                        ) : (
                          <EyeOff className="w-3.5 h-3.5 text-slate-400 inline" />
                        )}
                      </button>
                    </td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => onOpenEditModal('tikus', e)}
                          className="p-1 text-slate-400 hover:text-[#3A4EFB] cursor-pointer"
                          title="Edit"
                        >
                          <PenLine className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setDeleteTargetId(e.id);
                            setDeleteTargetType('tikus');
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'nyamuk' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Manajemen Data Surveilans Nyamuk</h3>
              <p className="text-xs text-slate-500">
                Total {nyamukData.length} entri pemeriksaan bangunan, container, dan indeks entomologi (HI, CI, BI).
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setImportType('nyamuk');
                  setImportModalOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#3A4EFB]" />
                <span>Import CSV</span>
              </button>
              <button
                onClick={() => exportToCsv('nyamuk')}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#3A4EFB]" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">Tanggal</th>
                  <th className="px-3 py-2.5">Wilayah & Zona</th>
                  <th className="px-3 py-2.5 text-right">Bangunan Diperiksa</th>
                  <th className="px-3 py-2.5 text-right">Container Diperiksa</th>
                  <th className="px-3 py-2.5 text-right">Bangunan (+)</th>
                  <th className="px-3 py-2.5 text-right">Container (+)</th>
                  <th className="px-3 py-2.5 text-right">HI (%)</th>
                  <th className="px-3 py-2.5 text-right">CI (%)</th>
                  <th className="px-3 py-2.5 text-right">BI</th>
                  <th className="px-3 py-2.5 text-center">ABJ (%)</th>
                  <th className="px-3 py-2.5 text-right">Suhu (°C)</th>
                  <th className="px-3 py-2.5 text-right">Kelembaban (%)</th>
                  <th className="px-3 py-2.5 text-center">Musim</th>
                  <th className="px-3 py-2.5 text-center">Visibilitas</th>
                  <th className="px-3 py-2.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {nyamukData.map((e: NyamukRecord) => {
                  const bDip = e.jumlahBangunanDiperiksa ?? 80;
                  const cDip = e.jumlahKontainerDiperiksa ?? 50;
                  const bPos = e.jumlahBangunanPositif ?? 2;
                  const cPos = e.jumlahKontainerPositif ?? 3;
                  const hiVal =
                    e.houseIndex !== undefined
                      ? e.houseIndex
                      : bDip > 0
                        ? Number(((bPos / bDip) * 100).toFixed(2))
                        : 0;
                  const ciVal =
                    e.containerIndex !== undefined
                      ? e.containerIndex
                      : cDip > 0
                        ? Number(((cPos / cDip) * 100).toFixed(2))
                        : 0;
                  const biVal =
                    e.breteauIndex !== undefined
                      ? e.breteauIndex
                      : bDip > 0
                        ? Number(((cPos / bDip) * 100).toFixed(2))
                        : 0;
                  const abjVal =
                    e.angkaBebasJentik !== undefined
                      ? e.angkaBebasJentik
                      : bDip > 0
                        ? Number((((bDip - bPos) / bDip) * 100).toFixed(2))
                        : 95;
                  return (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2 font-mono text-[11px] text-slate-800 whitespace-nowrap">
                        {e.tanggal}
                      </td>
                      <td className="px-3 py-2 font-medium text-slate-900 whitespace-nowrap">
                        <div>{e.wilayahKerja}</div>
                        <span className="text-[10px] text-slate-500">Zona {e.zonasi}</span>
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-semibold text-slate-800">
                        {bDip}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-semibold text-slate-800">
                        {cDip}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-rose-600">
                        {bPos}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-rose-600">
                        {cPos}
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-[#3A4EFB]">
                        {hiVal}%
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-[#33A4FA]">
                        {ciVal}%
                      </td>
                      <td className="px-3 py-2 text-right font-mono font-bold text-amber-600">
                        {biVal}
                      </td>
                      <td className="px-3 py-2 text-center font-mono font-semibold text-emerald-700">
                        {abjVal}%
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-slate-800">
                        {e.suhu ?? 29.5}°C
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-slate-800">
                        {e.kelembapan ?? 78}%
                      </td>
                      <td className="px-3 py-2 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            e.musim === 'Kemarau'
                              ? 'bg-amber-50 text-amber-700 border-amber-200'
                              : e.musim === 'Pancaroba'
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : 'bg-sky-50 text-sky-700 border-sky-200'
                          }`}
                        >
                          {e.musim || 'Penghujan'}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => updateNyamukRecord(e.id, { isPublic: !e.isPublic })}
                          className="text-xs text-slate-400 hover:text-slate-800 cursor-pointer"
                          title={
                            e.isPublic
                              ? 'Publik: Klik untuk ubah privat'
                              : 'Privat: Klik untuk publikasikan'
                          }
                        >
                          {e.isPublic ? (
                            <Eye className="w-3.5 h-3.5 text-emerald-600 inline" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-slate-400 inline" />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-2 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => onOpenEditModal('nyamuk', e)}
                            className="p-1 text-slate-400 hover:text-[#3A4EFB] cursor-pointer"
                            title="Edit"
                          >
                            <PenLine className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTargetId(e.id);
                              setDeleteTargetType('nyamuk');
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'lalat' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Manajemen Data Surveilans Lalat
              </h3>
              <p className="text-xs text-slate-500">
                Data indeks lalat di titik pelabuhan atau bandara, jenis lalat, tanggal pemeriksaan, serta keterangan hasil indeks perlu intervensi atau tidak.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setImportType('lalat');
                  setImportModalOpen(true);
                }}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5 text-[#3A4EFB]" />
                <span>Import CSV</span>
              </button>
              <button
                onClick={() => exportToCsv('lalat')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs text-slate-700 flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span>Export CSV</span>
              </button>
              <button
                onClick={() => onOpenCreateModal('lalat')}
                className="px-3 py-1.5 bg-[#3A4EFB] hover:bg-[#33A4FA] text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Input Lalat Baru</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-y border-slate-200 text-slate-500 uppercase text-[10px]">
                  <th className="px-3 py-2.5">Tanggal</th>
                  <th className="px-3 py-2.5">Titik Pelabuhan atau Bandara</th>
                  <th className="px-3 py-2.5">Jenis Lalat</th>
                  <th className="px-3 py-2.5 text-right">Indeks Lalat</th>
                  <th className="px-3 py-2.5">Keterangan Hasil Indeks (Perlu Intervensi / Tidak)</th>
                  <th className="px-3 py-2.5 text-center">Visibilitas</th>
                  <th className="px-3 py-2.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {lalatData.map((e) => {
                  const perluIntervensi =
                    e.statusIntervensi === 'Perlu Intervensi' || e.indeksLalat > 2;
                  return (
                    <tr key={e.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-mono text-slate-600 whitespace-nowrap">
                        {e.tanggal}
                      </td>
                      <td className="px-3 py-2.5 font-semibold text-slate-900">
                        {e.titikLokasi}
                      </td>
                      <td className="px-3 py-2.5 italic font-serif text-slate-900 whitespace-nowrap">
                        {e.jenisLalat || 'Musca domestica'}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono whitespace-nowrap">
                        <span
                          className={`font-bold ${
                            perluIntervensi ? 'text-rose-600' : 'text-emerald-600'
                          }`}
                        >
                          {e.indeksLalat}
                        </span>{' '}
                        <span className="text-[10px] text-slate-400">ekor/flygrill</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-col gap-0.5">
                          <span
                            className={`inline-flex items-center w-fit px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                              perluIntervensi
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {perluIntervensi ? 'Perlu Intervensi' : 'Tidak Perlu Intervensi'}
                          </span>
                          {e.keterangan && (
                            <span className="text-[11px] text-slate-500">{e.keterangan}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <button
                          onClick={() => updateLalatRecord(e.id, { isPublic: !e.isPublic })}
                          className="text-xs text-slate-400 hover:text-slate-800 cursor-pointer"
                          title={
                            e.isPublic
                              ? 'Publik: Klik untuk ubah privat'
                              : 'Privat: Klik untuk publikasikan'
                          }
                        >
                          {e.isPublic ? (
                            <Eye className="w-3.5 h-3.5 text-emerald-600 inline" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5 text-slate-400 inline" />
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-2.5 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => onOpenEditModal('lalat', e)}
                            className="p-1 text-slate-400 hover:text-[#3A4EFB] cursor-pointer"
                            title="Edit"
                          >
                            <PenLine className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTargetId(e.id);
                              setDeleteTargetType('lalat');
                            }}
                            className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'lokasi' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#3A4EFB]" />
              <span>Kelola Titik Lokasi & Wilayah Kerja</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Daftar titik lokasi pelabuhan, bandar udara, dan pos karantina untuk pemetaan di Leaflet.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (newLocNama.trim()) {
                addLocation({
                  nama: newLocNama,
                  wilayahKerja: newLocWilker,
                  kategori: newLocKategori,
                  latitude: parseFloat(newLocLat) || -1.2778,
                  longitude: parseFloat(newLocLng) || 116.8042,
                  deskripsi: newLocDesc || 'Titik pengawasan karantina kesehatan',
                });
                setNewLocNama('');
                setNewLocDesc('');
              }
            }}
            className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
          >
            <div className="text-xs font-semibold uppercase text-[#3A4EFB]">Tambah Titik Lokasi Baru</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Nama Titik / Pelabuhan
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Terminal Penumpang Somber"
                  value={newLocNama}
                  onChange={(e) => setNewLocNama(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Wilayah Kerja</label>
                <select
                  value={newLocWilker}
                  onChange={(e) => setNewLocWilker(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB]"
                >
                  {WILAYAH_KERJA_LIST.map((wk) => (
                    <option key={wk} value={wk}>
                      {wk}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Kategori Fasilitas
                </label>
                <select
                  value={newLocKategori}
                  onChange={(e) => setNewLocKategori(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB]"
                >
                  <option value="Pelabuhan Laut">Pelabuhan Laut</option>
                  <option value="Bandara Udara">Bandara Udara</option>
                  <option value="Pelabuhan Penyeberangan">Pelabuhan Penyeberangan</option>
                  <option value="Wilker Karantina">Wilker Karantina</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Latitude</label>
                <input
                  type="text"
                  required
                  value={newLocLat}
                  onChange={(e) => setNewLocLat(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Longitude</label>
                <input
                  type="text"
                  required
                  value={newLocLng}
                  onChange={(e) => setNewLocLng(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Deskripsi Singkat
                </label>
                <input
                  type="text"
                  value={newLocDesc}
                  placeholder="Keterangan operasional..."
                  onChange={(e) => setNewLocDesc(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-1.5 bg-[#3A4EFB] hover:bg-[#33A4FA] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simpan Titik Lokasi</span>
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {locations.map((loc) => (
              <div
                key={loc.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between"
              >
                <div>
                  <div className="font-semibold text-slate-900 text-xs">{loc.nama}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {loc.wilayahKerja} | {loc.kategori}
                  </div>
                  <div className="text-[10px] font-mono text-[#3A4EFB] mt-1">
                    {loc.latitude}, {loc.longitude}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setDeleteTargetId(loc.id);
                    setDeleteTargetType('lokasi');
                  }}
                  className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                  title="Hapus lokasi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'pemeriksaan' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#3A4EFB]" />
              <span>Pemeriksaan Pinjal & Sampel Vektor</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekapitulasi pengujian identifikasi pinjal (Xenopsylla cheopis) pada tikus tertangkap.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <span className="font-bold text-slate-800 text-xs">Identifikasi Temuan Pinjal Tikus</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {tikusData.map((e) => (
                <div
                  key={e.id}
                  className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-slate-900">{e.lokasi}</div>
                    <div className="text-[11px] text-slate-500">
                      {e.start_date || e.tanggal} • {e.jenisTikus}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[#3A4EFB] font-bold">
                      {e.statusPinjal || e.jenisPinjal || 'Pinjal'}
                    </span>
                    {e.jumlahPinjal !== undefined && e.jumlahPinjal > 0 && (
                      <div className="text-[10px] text-slate-500 font-mono">
                        {e.jumlahPinjal} pinjal (Indeks: {e.indeksPinjal})
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'sheets' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-5 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#3A4EFB]" />
              <span>Integrasi Google Sheets Surveilans BKK Balikpapan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Hubungkan sistem dengan spreadsheet lembar kerja untuk pembaruan data secara berkala.
            </p>
          </div>

          <div className="space-y-3 max-w-2xl">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Tautan Sumber Spreadsheet (Google Sheets Public CSV / Published Link):
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sheetUrl}
                  onChange={(e) => setSheetUrl(e.target.value)}
                  placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB]"
                />
                <button
                  onClick={() => syncWithGoogleSheet()}
                  disabled={syncStatus.isSyncing}
                  className="px-4 py-2 bg-[#3A4EFB] hover:bg-[#33A4FA] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncStatus.isSyncing ? 'animate-spin' : ''}`} />
                  <span>{syncStatus.isSyncing ? 'Menyinkronkan...' : 'Sinkronisasi'}</span>
                </button>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <CircleCheck className="w-4 h-4 text-emerald-600" />
                <span>Status Koneksi: {syncStatus.message}</span>
              </div>
              {syncStatus.lastSync && (
                <div className="text-[11px] text-slate-500">
                  Waktu sinkronisasi terakhir: {syncStatus.lastSync}
                </div>
              )}
              {syncStatus.error && <div className="text-rose-600 text-[11px] pt-1">{syncStatus.error}</div>}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={resetToDefaultData}
                className="text-xs text-slate-500 hover:text-[#3A4EFB] underline transition-colors cursor-pointer"
              >
                Muat ulang ke dataset acuan standar BKK Balikpapan
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'logs' && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Log Audit Aktivitas Sistem</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Riwayat lengkap penambahan, pengeditan, penghapusan, dan sinkronisasi data oleh pengguna admin.
            </p>
          </div>

          <div className="space-y-2">
            {auditLogs.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-xs">Belum ada aktivitas tercatat.</div>
            ) : (
              auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start justify-between text-xs"
                >
                  <div>
                    <div className="text-slate-900 font-medium">{log.description}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      Pengguna: <span className="text-[#3A4EFB] font-semibold">{log.user}</span> • Target:{' '}
                      <span className="font-mono text-slate-700">{log.target}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0 ml-3">
                    {new Date(log.timestamp).toLocaleString('id-ID')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-600">
              <TriangleAlert className="w-6 h-6" />
              <h4 className="text-base font-bold text-slate-900">Konfirmasi Hapus Data</h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Apakah Anda yakin ingin menghapus baris data ini? Tindakan ini tidak dapat dibatalkan dan akan tercatat pada log audit sistem.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setDeleteTargetId(null);
                  setDeleteTargetType(null);
                }}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (deleteTargetId && deleteTargetType) {
                    if (deleteTargetType === 'tikus') deleteTikusRecord(deleteTargetId);
                    else if (deleteTargetType === 'nyamuk') deleteNyamukRecord(deleteTargetId);
                    else if (deleteTargetType === 'lalat') deleteLalatRecord(deleteTargetId);
                    else if (deleteTargetType === 'lokasi') deleteLocation(deleteTargetId);
                    setDeleteTargetId(null);
                    setDeleteTargetType(null);
                  }
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
              >
                Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {importModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="text-base font-bold text-slate-900">
                Import Data CSV Surveilans{' '}
                {importType === 'tikus'
                  ? 'Tikus'
                  : importType === 'nyamuk'
                  ? 'Nyamuk'
                  : 'Lalat'}
              </h4>
              <button
                onClick={() => setImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!csvText.trim()) return;
                const res = importDataFromText(importType, csvText);
                if (res.success) {
                  setImportFeedback(`Berhasil mengimpor ${res.count} baris data ${importType}!`);
                  setTimeout(() => {
                    setImportModalOpen(false);
                    setCsvText('');
                    setImportFeedback(null);
                  }, 1500);
                } else {
                  setImportFeedback(`Gagal: ${res.error || 'Periksa format file CSV'}`);
                }
              }}
              className="space-y-3"
            >
              <p className="text-xs text-slate-600">Tempel teks CSV atau format data kolom di bawah ini:</p>
              <textarea
                rows={7}
                required
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder={
                  importType === 'tikus'
                    ? 'Tanggal,Wilayah,Lokasi,Bangunan,Lat,Lng,Traps,Caught,Species,Pinjal\n2026-03-01,Pelabuhan Laut Balikpapan,Dermaga 2,Gudang, -1.2778, 116.8042, 50, 2, Rattus norvegicus, Pinjal'
                    : importType === 'nyamuk'
                    ? 'Tanggal,Wilayah,Lokasi,Lat,Lng,Kegiatan,Species,Hasil\n2026-03-01,Pelabuhan Laut Balikpapan,Drainase,-1.2778,116.8042,Pencidukan Jentik,Aedes,5'
                    : 'Tanggal,TitikLokasi,JenisLalat,IndeksLalat,StatusIntervensi,Keterangan\n2026-03-01,Pelabuhan Laut Balikpapan,Musca domestica,1.4,Tidak Perlu Intervensi,Indeks lalat aman'
                }
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB]"
              />
              {importFeedback && (
                <div
                  className={`p-2.5 rounded-lg text-xs ${
                    importFeedback.startsWith('Berhasil')
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {importFeedback}
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setImportModalOpen(false)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#3A4EFB] hover:bg-[#33A4FA] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  Proses Import
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
