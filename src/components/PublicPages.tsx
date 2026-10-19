import React, { useMemo, useState } from 'react';
import {
  ArrowRight,
  MapPin,
  ChevronRight,
  Anchor,
  Activity,
  Shield,
  CalendarCheck,
  ShieldCheck,
  Building2,
  Bug,
} from 'lucide-react';
import { useSurveillance } from '../context/SurveillanceContext';
import {
  WILAYAH_UTAMA_INFO,
  DEFAULT_LOCATIONS,
  MONTHS_ID,
  WILAYAH_KERJA_LIST,
} from '../mockData';
import {
  FilterBar,
  StatCard,
  LineAreaChart,
  DonutChart,
  HorizontalBarChart,
  DataTable,
} from './Widgets';
import { MapView } from './MapView';
import { TikusRecord } from '../types';

export const BerandaPage: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { homeStats } = useSurveillance();

  return (
    <div className="space-y-16 pb-16 text-slate-800">
      <section className="pt-8 sm:pt-14 max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200/90 text-slate-700 text-xs font-semibold tracking-wide shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#3A4EFB] animate-pulse" />
          <span>Sistem Informasi Surveilans Vektor Pelabuhan & Bandara</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            VECTO <span className="text-[#3A4EFB]">BKK Balikpapan</span>
          </h1>
          <p className="text-lg sm:text-xl font-medium text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Monitoring terpadu vektor tikus, indeks pinjal, dan nyamuk Aedes di seluruh wilayah kerja pintu masuk negara.
          </p>
        </div>

        <p className="text-sm text-slate-500 max-w-xl mx-auto leading-relaxed">
          Platform intelijen kesehatan lingkungan Balai Kekarantinaan Kesehatan Kelas I Balikpapan untuk deteksi dini faktor risiko karantina kesehatan.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            onClick={() => onNavigate('peta')}
            className="px-8 py-3.5 rounded-xl bg-[#3A4EFB] hover:bg-[#33A4FA] text-white text-sm font-bold shadow-md shadow-[#3A4EFB]/20 hover:shadow-lg transition-all flex items-center gap-2.5 group cursor-pointer"
          >
            <span>Jelajahi Peta & Data Surveilans</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-200/80">
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {homeStats.totalWilayahKerja}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Lokasi Spesifik</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-[#3A4EFB] font-mono">Real-Time</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Tanggal Fleksibel</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {homeStats.totalTitikSurveilans}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Titik Surveilans Aktif</div>
          </div>
          <div className="p-3 text-center">
            <div className="text-xl sm:text-2xl font-extrabold text-[#33A4FA] font-mono">Tikus, Nyamuk & Lalat</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Fokus Vektor Utama</div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#3A4EFB]" />
              <span>Peta Distribusi Surveilans Lapangan</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Pemetaan interaktif titik live-trap tikus dan pencidukan jentik Aedes pada 5 lokasi spesifik.
            </p>
          </div>
          <button
            onClick={() => onNavigate('peta')}
            className="text-xs font-semibold text-[#3A4EFB] hover:text-[#33A4FA] flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>Buka Mode Interaktif Lengkap</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <FilterBar vectorType="all" showSpeciesFilter={false} />

        <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-sm bg-white">
          <MapView heightClass="h-[520px]" showLayerControls={true} />
        </div>
      </section>

      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 space-y-8 shadow-xs">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#3A4EFB] text-xs font-bold uppercase tracking-wider">
            <Anchor className="w-4 h-4 text-[#3A4EFB]" />
            <span>Informasi Umum Wilayah Kerja Pelabuhan</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Cakupan 3 Wilayah Utama Pelabuhan BKK Kelas I Balikpapan
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
            Wilayah kerja pelabuhan Balai Kekarantinaan Kesehatan Kelas I Balikpapan secara umum mencakup{' '}
            <strong>3 wilayah utama</strong> berikut. Tiga wilayah ini ditampilkan sebagai informasi umum institusional dalam bentuk tulisan:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WILAYAH_UTAMA_INFO.map((w, idx) => (
            <div
              key={idx}
              className="p-6 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3 hover:border-[#3A4EFB]/30 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#3A4EFB]/10 border border-[#3A4EFB]/20 flex items-center justify-center text-[#3A4EFB] text-xs font-bold font-mono">
                  0{idx + 1}
                </div>
                <h3 className="text-base font-bold text-slate-900">{w.nama}</h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{w.deskripsi}</p>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase text-slate-800 tracking-wider">
                5 Titik Lokasi Spesifik Pemantauan Lapangan
              </span>
              <p className="text-xs text-slate-500 mt-0.5">Opsi filter operasional mencakup 5 lokasi berikut:</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {DEFAULT_LOCATIONS.map((loc) => (
              <div
                key={loc.id}
                className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-[#3A4EFB]/40 transition-colors shadow-xs"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#3A4EFB]" />
                  <span className="text-[10px] font-semibold text-slate-500">{loc.kategori}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 leading-snug">{loc.nama}</h4>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{loc.deskripsi}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#3A4EFB]/10 flex items-center justify-center text-[#3A4EFB]">
            <Activity className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Pemantauan Terpadu Tikus & Pinjal</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Menghitung indeks kepadatan tikus (trap success ≤ 1%) dan pemeriksaan indeks pinjal (Xenopsylla) untuk mencegah risiko Pes di lingkungan pelabuhan.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#33A4FA]/10 flex items-center justify-center text-[#33A4FA]">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Surveilans Nyamuk Aedes</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Pengendalian vektor demam berdarah & arbovirus melalui pencidukan jentik kontainer (ABJ ≥ 95%) dan resting nyamuk dewasa di perimeter & buffer.
          </p>
        </div>

        <div className="p-6 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Pencatatan Tanggal Fleksibel</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mendukung rentang tanggal hari pertama & terakhir pemasangan trap tikus, serta satu tanggal presisi untuk surveilans nyamuk lapangan.
          </p>
        </div>
      </section>

      <LalatSection onNavigate={onNavigate} />

      <AdminLoginSection onNavigate={onNavigate} />
    </div>
  );
};

const LalatSection: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { filteredLalat } = useSurveillance();
  const [selectedTitik, setSelectedTitik] = useState<string>('ALL');

  const titikOptions = useMemo(() => {
    return Array.from(new Set(filteredLalat.map((r) => r.titikLokasi)));
  }, [filteredLalat]);

  const displayedLalat = useMemo(() => {
    if (selectedTitik === 'ALL') return filteredLalat;
    return filteredLalat.filter((r) => r.titikLokasi === selectedTitik);
  }, [filteredLalat, selectedTitik]);

  return (
    <section
      id="lalat-section"
      className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
            <Bug className="w-3.5 h-3.5" />
            <span>SECTION SURVEILANS LALAT</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Indeks Kepadatan Lalat di Titik Pelabuhan & Bandara
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Menampilkan tanggal pemeriksaan, titik pelabuhan atau bandara, jenis lalat, indeks lalat, serta keterangan hasil indeks perlu intervensi atau tidak.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedTitik}
            onChange={(e) => setSelectedTitik(e.target.value)}
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-[#3A4EFB]"
          >
            <option value="ALL">Semua Titik Pelabuhan / Bandara</option>
            {titikOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <button
            onClick={() => onNavigate('vektor-lalat')}
            className="px-3.5 py-2 bg-[#3A4EFB] hover:bg-[#33A4FA] text-white font-semibold rounded-xl text-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>Buka Halaman Lalat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Titik Pelabuhan atau Bandara</th>
              <th className="py-3 px-4">Jenis Lalat</th>
              <th className="py-3 px-4">Indeks Lalat</th>
              <th className="py-3 px-4">Keterangan Hasil Indeks (Perlu Intervensi / Tidak)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {displayedLalat.map((item) => {
              const perluIntervensi =
                item.statusIntervensi === 'Perlu Intervensi' || item.indeksLalat > 2;
              return (
                <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                    {item.tanggal}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {item.titikLokasi}
                  </td>
                  <td className="py-3 px-4 italic font-serif text-slate-900 whitespace-nowrap">
                    {item.jenisLalat || 'Musca domestica'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`font-mono font-bold text-sm ${
                        perluIntervensi ? 'text-rose-600' : 'text-emerald-600'
                      }`}
                    >
                      {item.indeksLalat}
                    </span>{' '}
                    <span className="text-[11px] text-slate-400">ekor/flygrill</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-col gap-1">
                      <span
                        className={`inline-flex items-center w-fit px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          perluIntervensi
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {perluIntervensi ? 'Perlu Intervensi' : 'Tidak Perlu Intervensi'}
                      </span>
                      {item.keterangan && (
                        <span className="text-[11px] text-slate-500">{item.keterangan}</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {displayedLalat.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-400">
                  Belum ada data indeks lalat pada filter ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

const AdminLoginSection: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { isAdmin, adminUser, loginAdmin, logoutAdmin } = useSurveillance();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const res = loginAdmin(username, password);
      setLoading(false);
      if (res.success) {
        setUsername('');
        setPassword('');
        onNavigate('admin');
      } else {
        setError(res.error || 'Username atau password tidak valid.');
      }
    }, 250);
  };

  return (
    <section
      id="admin-login-section"
      className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs relative overflow-hidden"
    >
      <div className="absolute -right-12 -bottom-12 w-56 h-56 bg-[#3A4EFB]/5 rounded-full blur-2xl pointer-events-none" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#3A4EFB]/10 border border-[#3A4EFB]/20 text-[#3A4EFB] text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>PORTAL OTORISASI ADMINISTRATOR</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Section Login Admin & Pengelolaan Data Surveilans
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
            Area khusus Administrator BKK Kelas I Balikpapan untuk melakukan input data surveilans vektor (Tikus & Pinjal serta Nyamuk Aedes), pembaruan titik koordinat wilayah kerja, impor/ekspor dataset CSV, sinkronisasi Google Sheets, dan pemantauan log audit.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#3A4EFB]/10 text-[#3A4EFB] flex items-center justify-center shrink-0 font-bold text-xs">
                01
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Manajemen CRUD & CSV</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Tambah, ubah, hapus, dan impor rekaman surveilans lapangan secara real-time.
                </div>
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xs">
                02
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900">Akses Terproteksi</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  Hanya dapat diakses oleh akun resmi Administrator yang terverifikasi.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5">
          {isAdmin ? (
            <div className="bg-slate-50 border border-emerald-200 rounded-2xl p-6 space-y-4 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Sesi Admin Aktif
                </span>
                <span className="text-[11px] font-mono text-slate-500">Role: Administrator</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{adminUser?.name}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{adminUser?.email}</p>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex-1 px-4 py-2.5 bg-[#3A4EFB] hover:bg-[#33A4FA] text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Buka Panel Admin</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={logoutAdmin}
                  className="px-4 py-2.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 font-semibold rounded-xl text-xs transition-all cursor-pointer"
                >
                  Keluar Sesi
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50/90 border border-slate-200 rounded-2xl p-6 shadow-xs">
              <div className="mb-4 pb-3 border-b border-slate-200/80 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Formulir Login Admin</h3>
                  <p className="text-[11px] text-slate-500">Masukkan kredensial otorisasi admin</p>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-slate-200/70 text-slate-700 font-mono text-[10px] font-semibold">
                  ADMIN ONLY
                </span>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3.5">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-medium">
                    {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username Admin
                  </label>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masukkan username admin"
                    autoComplete="username"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Password Admin
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan password admin"
                      autoComplete="current-password"
                      className="w-full bg-white border border-slate-300 rounded-xl pl-3.5 pr-16 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-slate-500 hover:text-[#3A4EFB] px-1.5 py-0.5 rounded cursor-pointer"
                    >
                      {showPassword ? 'Sembunyi' : 'Lihat'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#3A4EFB] hover:bg-[#33A4FA] text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? 'Memverifikasi Otorisasi...' : 'Masuk ke Panel Admin'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export const TikusDashboardPage: React.FC<{
  onEditRecord?: (r: TikusRecord) => void;
  onDeleteRecord?: (r: TikusRecord) => void;
}> = ({ onEditRecord, onDeleteRecord }) => {
  const { filteredTikus } = useSurveillance();
  const [selectedLoc, setSelectedLoc] = useState('all');

  const locFiltered = useMemo(
    () => (selectedLoc === 'all' ? filteredTikus : filteredTikus.filter((e) => e.wilayahKerja === selectedLoc)),
    [filteredTikus, selectedLoc]
  );

  const summary = useMemo(() => {
    const totalPerangkap = filteredTikus.reduce((acc, t) => acc + t.jumlahPerangkap, 0);
    const totalTertangkap = filteredTikus.reduce((acc, t) => acc + t.jumlahTikusTertangkap, 0);
    const trapSuccess = totalPerangkap > 0 ? Number(((totalTertangkap / totalPerangkap) * 100).toFixed(2)) : 0;
    const uniqueLokasi = new Set(filteredTikus.map((e) => `${e.wilayahKerja}-${e.lokasi}`)).size;
    const totalPinjalChecked = filteredTikus.length;
    const totalWithPinjal = filteredTikus.filter(
      (e) => (e.statusPinjal === 'Pinjal' || e.jenisEktoparasit === 'Pinjal') && (e.jumlahPinjal || 0) > 0
    ).length;

    return {
      totalPerangkap,
      totalTertangkap,
      trapSuccess,
      uniqueLokasi,
      totalPinjalChecked,
      totalWithPinjal,
    };
  }, [filteredTikus]);

  const monthlyTrend = useMemo(
    () =>
      MONTHS_ID.map((mName, idx) => {
        const mNum = idx + 1;
        const mItems = filteredTikus.filter((e) =>
          e.bulan ? e.bulan === mNum : new Date(e.end_date || e.start_date || e.tanggal).getMonth() + 1 === mNum
        );
        const caught = mItems.reduce((acc, t) => acc + t.jumlahTikusTertangkap, 0);
        const traps = mItems.reduce((acc, t) => acc + t.jumlahPerangkap, 0);
        const ts = traps > 0 ? Number(((caught / traps) * 100).toFixed(1)) : 0;
        return {
          month: mNum,
          label: mName.slice(0, 3),
          value: caught,
          secondaryValue: ts,
        };
      }),
    [filteredTikus]
  );

  const wilkerDistribution = useMemo(() => {
    const map = new Map<string, { traps: number; caught: number }>();
    WILAYAH_KERJA_LIST.forEach((wk) => map.set(wk, { traps: 0, caught: 0 }));
    filteredTikus.forEach((t) => {
      const cur = map.get(t.wilayahKerja) || { traps: 0, caught: 0 };
      cur.traps += t.jumlahPerangkap;
      cur.caught += t.jumlahTikusTertangkap;
      map.set(t.wilayahKerja, cur);
    });
    return Array.from(map.entries()).map(([wk, val]) => ({
      category: wk.replace('Pelabuhan ', 'Pel. ').replace('Pos Bandara SAMSS Balikpapan', 'Bandara SAMS'),
      primaryValue: val.traps,
      secondaryValue: val.caught,
    }));
  }, [filteredTikus]);

  const speciesSegments = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredTikus.forEach((t) => {
      if (t.jenisTikus && t.jenisTikus !== '-' && t.jumlahTikusTertangkap > 0) {
        counts[t.jenisTikus] = (counts[t.jenisTikus] || 0) + t.jumlahTikusTertangkap;
      }
    });
    const colors: Record<string, string> = {
      'Rattus norvegicus': '#3A4EFB',
      'Rattus tanezumi': '#33A4FA',
      'Mus musculus': '#f59e0b',
      'Rattus exulans': '#10b981',
      'Bandicota indica': '#8b5cf6',
    };
    return Object.entries(counts).map(([label, value]) => ({
      label,
      value,
      color: colors[label] || '#94a3b8',
    }));
  }, [filteredTikus]);

  const pinjalSegments = useMemo(() => {
    const pos = filteredTikus.filter((e) => (e.jumlahPinjal || 0) > 0).length;
    const neg = filteredTikus.length - pos;
    return [
      { label: 'Ditemukan Pinjal (Positif)', value: pos, color: '#3A4EFB' },
      { label: 'Bebas Pinjal (Nihil)', value: Math.max(0, neg), color: '#10b981' },
    ];
  }, [filteredTikus]);

  const locDetail = useMemo(() => {
    const traps = locFiltered.reduce((acc, t) => acc + t.jumlahPerangkap, 0);
    const caught = locFiltered.reduce((acc, t) => acc + t.jumlahTikusTertangkap, 0);
    return {
      traps,
      caught,
      success: traps > 0 ? Number(((caught / traps) * 100).toFixed(2)) : 0,
      pinjalCount: locFiltered.reduce((acc, t) => acc + (t.jumlahPinjal || 0), 0),
      buildings: Array.from(new Set(locFiltered.map((e) => e.bangunan).filter(Boolean))),
    };
  }, [locFiltered]);

  return (
    <div className="space-y-8 pb-12 text-slate-800">
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-[#3A4EFB] text-xs font-semibold uppercase tracking-wider mb-1">
          <span>VEKTOR RESERVOIR</span>
          <span className="text-slate-300">|</span>
          <span>BKK KELAS I BALIKPAPAN</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Dashboard Surveilans Tikus & Pinjal
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
          Pemantauan terpadu kepadatan tikus (trap success), sebaran spesies rodent, serta indeks pinjal (Xenopsylla) pada rentang tanggal penyebaran perangkap di 5 lokasi spesifik pelabuhan/bandara.
        </p>
      </div>

      <FilterBar vectorType="tikus" showSpeciesFilter={true} />

      <section className="space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-600 flex items-center justify-between">
          <span>Ringkasan Indikator Surveilans Tikus</span>
          <span className="text-[11px] text-[#3A4EFB] font-mono">
            Baku Mutu: Trap Success ≤ 1%, Indeks Pinjal &lt; 1
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <StatCard
            label="Total Perangkap"
            value={summary.totalPerangkap}
            unit="trap"
            subtext="Live-trap terpasang"
          />
          <StatCard
            label="Tikus Tertangkap"
            value={summary.totalTertangkap}
            unit={summary.totalTertangkap === 0 ? '' : 'ekor'}
            subtext={summary.totalTertangkap === 0 ? 'Status: "Tidak Ditemukan"' : 'Spesimen tertangkap'}
            tone={summary.totalTertangkap === 0 ? 'success' : 'normal'}
          />
          <StatCard
            label="Trap Success"
            value={`${summary.trapSuccess}%`}
            unit=""
            subtext={
              summary.trapSuccess <= 1 ? 'Memenuhi baku mutu (≤1%)' : 'Melebihi baku mutu (>1%)'
            }
            tone={summary.trapSuccess <= 1 ? 'success' : 'warning'}
          />
          <StatCard
            label="Titik Surveilans"
            value={summary.uniqueLokasi}
            unit="titik"
            subtext="Titik pemasangan trap"
          />
          <StatCard
            label="Tikus dengan Pinjal"
            value={summary.totalWithPinjal}
            unit="ekor"
            subtext={`${
              summary.totalPinjalChecked > 0
                ? ((summary.totalWithPinjal / summary.totalPinjalChecked) * 100).toFixed(1)
                : 0
            }% terdeteksi pinjal`}
            tone={summary.totalWithPinjal > 0 ? 'warning' : 'normal'}
          />
        </div>

        {summary.totalTertangkap === 0 && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 animate-in fade-in duration-150">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="font-bold">Indikator Surveilans: Tikus "Tidak Ditemukan"</span>
              <span className="text-emerald-700 font-normal">| Trap Success 0.00% pada filter terpilih</span>
            </div>
            <span className="text-[11px] font-semibold bg-white px-2.5 py-0.5 rounded-full border border-emerald-300 text-emerald-700 shadow-2xs font-mono">
              Baku Mutu Terpenuhi (≤ 1%)
            </span>
          </div>
        )}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LineAreaChart
            title="Tren Kepadatan Tikus & Trap Success"
            subtitle="Distribusi jumlah tikus tertangkap dan persentase Trap Success berdasarkan waktu surveilans"
            data={monthlyTrend}
            metricLabel="Tikus Tertangkap"
            secondaryMetricLabel="Trap Success (%)"
            color="#3A4EFB"
            secondaryColor="#33A4FA"
          />
        </div>
        <div>
          <DonutChart
            title="Komposisi Spesies Tikus"
            subtitle="Proporsi rodent tertangkap di pelabuhan"
            segments={speciesSegments}
            centerLabel="Tikus"
          />
        </div>
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <HorizontalBarChart
            title="Sebaran Perangkap pada 5 Lokasi Spesifik"
            subtitle="Perbandingan live-trap dipasang vs spesimen tikus tertangkap"
            groups={wilkerDistribution}
            primaryLabel="Perangkap Dipasang"
            secondaryLabel="Tikus Tertangkap"
            primaryColor="#3A4EFB"
            secondaryColor="#33A4FA"
          />
        </div>
        <div>
          <DonutChart
            title="Temuan Pinjal pada Tikus"
            subtitle="Pemeriksaan spesimen positif vs nihil pinjal"
            segments={pinjalSegments}
            centerLabel="Periksa"
          />
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#3A4EFB]" />
            <h2 className="text-base font-bold text-slate-900">Peta Sebaran Titik Perangkap Tikus</h2>
          </div>
          <span className="text-xs text-slate-500">Fokus Layer Tikus & Wilker BKK</span>
        </div>
        <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs bg-white">
          <MapView heightClass="h-[460px]" forceVectorLayer="tikus" showLayerControls={true} />
        </div>
      </section>

      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#3A4EFB]" />
              <span>Detail Surveilans per Lokasi Kerja</span>
            </h3>
            <p className="text-xs text-slate-500">
              Eksplorasi bangunan, keberhasilan trap, dan temuan pinjal spesifik per pos/pelabuhan
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600">Pilih Lokasi:</label>
            <select
              value={selectedLoc}
              onChange={(e) => setSelectedLoc(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB] cursor-pointer"
            >
              <option value="all">Semua 5 Lokasi Spesifik</option>
              {WILAYAH_KERJA_LIST.map((wk) => (
                <option key={wk} value={wk}>
                  {wk}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block">Total Trap Terpasang</span>
            <span className="text-xl font-bold font-mono text-slate-900">{locDetail.traps}</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block">Tikus Tertangkap</span>
            <span className="text-xl font-bold font-mono text-[#3A4EFB]">{locDetail.caught}</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block">Trap Success</span>
            <span className="text-xl font-bold font-mono text-slate-900">{locDetail.success}%</span>
          </div>
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block">Temuan Pinjal (Spesimen)</span>
            <span className="text-xl font-bold font-mono text-[#3A4EFB]">{locDetail.pinjalCount} pinjal</span>
          </div>
        </div>

        {locDetail.buildings.length > 0 && (
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-700 block mb-2">
              Fasilitas / Bangunan Terpantau:
            </span>
            <div className="flex flex-wrap gap-2">
              {locDetail.buildings.map((b, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-lg"
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="space-y-3">
        <DataTable type="tikus" data={filteredTikus} onEdit={onEditRecord} onDelete={onDeleteRecord} />
      </section>
    </div>
  );
};
