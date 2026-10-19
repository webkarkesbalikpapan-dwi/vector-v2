import React, { useState } from 'react';
import {
  Building2,
  Anchor,
  MapPin,
  CircleCheck,
  Download,
  CircleCheckBig,
  Building,
  Activity,
} from 'lucide-react';
import { WILAYAH_UTAMA_INFO, DEFAULT_LOCATIONS } from '../mockData';
import { useSurveillance } from '../context/SurveillanceContext';
import { FilterBar, DataTable } from './Widgets';
import { TikusRecord, NyamukRecord } from '../types';

export const LingkunganPage: React.FC = () => (
  <div className="space-y-8 pb-12 text-slate-800">
    <div className="border-b border-slate-200/80 pb-4">
      <div className="flex items-center gap-2 text-[#3A4EFB] text-xs font-semibold uppercase tracking-wider mb-1">
        <span>SANITASI LINGKUNGAN KARANTINA</span>
        <span className="text-slate-300">|</span>
        <span>BKK KELAS I BALIKPAPAN</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Lingkungan & Wilayah Kerja Karantina Kesehatan
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
        Pengawasan sanitasi lingkungan dalam rangka pencegahan keluar atau masuknya penyakit dan faktor risiko kesehatan masyarakat.
      </p>
    </div>

    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-[#3A4EFB]" />
        <span>Gambaran Umum Institusi</span>
      </h2>
      <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-5 rounded-xl border border-slate-200/80">
        <p>
          <strong className="text-slate-900">Balai Kekarantinaan Kesehatan Kelas I Balikpapan</strong> adalah Unit Pelaksana Teknis yang melaksanakan upaya mencegah dan menangkal keluar atau masuknya penyakit dan/atau faktor risiko kesehatan masyarakat di wilayah kerja pelabuhan, bandar udara, dan pos lintas batas darat negara.
        </p>
        <p>
          <strong className="text-[#3A4EFB]">Wilayah Kerja BKK (Wilker BKK)</strong> adalah unit kerja fungsional BKK di lingkungan pelabuhan, bandar udara, dan pos lintas batas darat negara.
        </p>
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Anchor className="w-5 h-5 text-[#3A4EFB]" />
          <span>Tiga Wilayah Kerja Pelabuhan Utama</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Balai Kekarantinaan Kesehatan Kelas I Balikpapan memiliki tiga wilayah kerja pelabuhan utama sebagai informasi umum:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {WILAYAH_UTAMA_INFO.map((w, idx) => (
          <div
            key={idx}
            className="p-6 bg-white border border-slate-200/90 rounded-2xl space-y-3 shadow-xs hover:border-[#3A4EFB]/40 transition-colors"
          >
            <div className="flex items-center gap-2 text-[#3A4EFB] font-bold text-base">
              <span>📍 {w.nama}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{w.deskripsi}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#3A4EFB]" />
          <span>5 Titik Operasional Surveilans Lapangan</span>
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Seluruh titik lokasi pemantauan lapangan Balai Kekarantinaan Kesehatan Kelas I Balikpapan:
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEFAULT_LOCATIONS.map((loc) => (
          <div
            key={loc.id}
            className="p-5 bg-white border border-slate-200/90 rounded-2xl space-y-2 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">{loc.nama}</span>
              <span className="text-[10px] text-[#3A4EFB] bg-[#3A4EFB]/10 px-2 py-0.5 rounded-full border border-[#3A4EFB]/20 font-medium">
                {loc.kategori}
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">{loc.deskripsi}</p>
            <div className="text-[11px] text-slate-400 font-mono pt-1.5 border-t border-slate-100">
              Wilayah Kerja: {loc.wilayahKerja}
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200">
            Zona Inti Karantina
          </span>
          <span className="text-xs text-slate-400 font-mono">Radius 0 - 50 Meter</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">Perimeter Area (Zona Perimeter)</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Wilayah langsung kontak dengan alat angkut (dermaga tambat kapal laut, terminal kedatangan dan keberangkatan penumpang).
        </p>
        <div className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100">
          <div className="flex items-start gap-1.5">
            <CircleCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Target Trap Success Tikus: <strong>0% (Nihil tikus)</strong>
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <CircleCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Target Angka Bebas Jentik (ABJ): <strong>100%</strong>
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <CircleCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Pemeriksaan rat-guard pada tali kapal sandar</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#3A4EFB] uppercase tracking-wider bg-[#3A4EFB]/10 px-2.5 py-1 rounded-full border border-[#3A4EFB]/20">
            Zona Penyangga Karantina
          </span>
          <span className="text-xs text-slate-400 font-mono">Radius 400 Meter</span>
        </div>
        <h3 className="text-lg font-bold text-slate-900">Buffer Area (Zona Penyangga)</h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Area sejauh 400 meter mengelilingi batas perimeter (area perkantoran, gudang peti kemas, terminal kargo, dan permukiman sekitar pelabuhan).
        </p>
        <div className="text-xs text-slate-600 space-y-1.5 pt-3 border-t border-slate-100">
          <div className="flex items-start gap-1.5">
            <CircleCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Standar Trap Success Tikus: <strong>&lt; 1%</strong>
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <CircleCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              Standar Angka Bebas Jentik (ABJ): <strong>≥ 95%</strong>
            </span>
          </div>
          <div className="flex items-start gap-1.5">
            <CircleCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
            <span>Surveilans berkala breeding site kontainer & ban bekas</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const InformasiPage: React.FC = () => (
  <div className="space-y-8 pb-12 text-slate-800">
    <div className="border-b border-slate-200/80 pb-4">
      <div className="flex items-center gap-2 text-[#3A4EFB] text-xs font-semibold uppercase tracking-wider mb-1">
        <span>INFORMASI SURVEILANS</span>
        <span className="text-slate-300">|</span>
        <span>BKK KELAS I BALIKPAPAN</span>
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
        Informasi & Standar Baku Mutu Surveilans
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
        Panduan teknis indikator entomologi dan reservoir vektor tikus dan nyamuk di wilayah kerja pelabuhan dan pos kekarantinaan kesehatan.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <span>🐀 Standar Baku Mutu Vektor Tikus & Pinjal</span>
        </div>
        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-semibold text-slate-900">1. Trap Success (Keberhasilan Penangkapan):</span>
            <p className="text-slate-500 mt-1">
              Rumus: (Jumlah Tikus Tertangkap / Jumlah Perangkap Terpasang) × 100%
            </p>
            <div className="mt-1 text-emerald-600 font-medium">• Perimeter Pelabuhan: 0% (Nihil tikus)</div>
            <div className="text-amber-600 font-medium">• Buffer Zone: &lt; 1% (Baku Mutu Pelabuhan Sehat)</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-semibold text-slate-900">2. Indeks Pinjal Umum (General Flea Index):</span>
            <p className="text-slate-500 mt-1">Rumus: Jumlah Pinjal Tertangkap / Jumlah Tikus Diperiksa</p>
            <div className="mt-1 text-emerald-600 font-medium">• Standar: Indeks &lt; 1 (Mencegah Risiko Pes)</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-semibold text-slate-900">3. Indeks Pinjal Khusus (Xenopsylla cheopis):</span>
            <p className="text-slate-500 mt-1">
              Rumus: Jumlah Pinjal Xenopsylla cheopis / Jumlah Tikus Tertangkap
            </p>
            <div className="mt-1 text-emerald-600 font-medium">• Standar: Indeks &lt; 1</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <span>🦟 Standar Baku Mutu Vektor Nyamuk Aedes</span>
        </div>
        <div className="space-y-3 text-xs text-slate-600">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-semibold text-slate-900">1. Angka Bebas Jentik (ABJ):</span>
            <p className="text-slate-500 mt-1">
              Rumus: (Jumlah Kontainer Bebas Jentik / Jumlah Kontainer Diperiksa) × 100%
            </p>
            <div className="mt-1 text-emerald-600 font-medium">
              • Baku Mutu Pelabuhan/Bandara Sehat: <strong>≥ 95%</strong>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-semibold text-slate-900">2. Container Index (CI):</span>
            <p className="text-slate-500 mt-1">
              Rumus: (Jumlah Kontainer Positif Jentik / Total Kontainer Diperiksa) × 100%
            </p>
            <div className="mt-1 text-emerald-600 font-medium">• Standar: &lt; 5%</div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-semibold text-slate-900">3. House Index (HI):</span>
            <p className="text-slate-500 mt-1">
              Rumus: (Bangunan/Fasilitas Positif Jentik / Total Bangunan Diperiksa) × 100%
            </p>
            <div className="mt-1 text-emerald-600 font-medium">• Perimeter: 0% • Buffer: &lt; 1%</div>
          </div>
        </div>
      </div>
    </div>

    <div className="p-6 sm:p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
      <h3 className="text-sm font-bold text-slate-900">Landasan Hukum & Rujukan Standar:</h3>
      <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
        <li>Undang-Undang Republik Indonesia Nomor 17 Tahun 2023 tentang Kesehatan.</li>
        <li>Peraturan Pemerintah Republik Indonesia Nomor 21 Tahun 2020 tentang PSBB / Kekarantinaan Kesehatan.</li>
        <li>
          Peraturan Menteri Kesehatan Republik Indonesia Nomor 2 Tahun 2023 tentang Peraturan Pelaksanaan Peraturan Pemerintah Nomor 66 Tahun 2014 tentang Kesehatan Lingkungan.
        </li>
        <li>
          Peraturan Menteri Kesehatan Republik Indonesia Nomor 10 Tahun 2023 tentang Organisasi dan Tata Kerja Balai Kekarantinaan Kesehatan.
        </li>
        <li>International Health Regulations (IHR 2005) World Health Organization (WHO).</li>
      </ul>
    </div>
  </div>
);

export const DataPage: React.FC<{
  onEditRecord?: (r: any) => void;
  onDeleteRecord?: (r: any) => void;
}> = ({ onEditRecord, onDeleteRecord }) => {
  const { filteredTikus, filteredNyamuk, filteredLalat, exportToCsv } = useSurveillance();
  const [activeType, setActiveType] = useState<'tikus' | 'nyamuk' | 'lalat'>('tikus');

  return (
    <div className="space-y-6 pb-12 text-slate-800">
      <div className="border-b border-slate-200/80 pb-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#3A4EFB] text-xs font-semibold uppercase tracking-wider mb-1">
            <span>PORTAL DATA TERBUKA</span>
            <span className="text-slate-300">|</span>
            <span>BKK KELAS I BALIKPAPAN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Data Surveilans Vektor Terpadu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Repositori data surveilans vektor penyakit karantina pelabuhan dan bandara. Pengguna umum dapat membaca dan mengekspor data yang telah dipublikasikan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => exportToCsv(activeType)}
            className="px-3.5 py-2 bg-[#3A4EFB] hover:bg-[#33A4FA] text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>
              Unduh CSV (
              {activeType === 'tikus'
                ? 'Tikus'
                : activeType === 'nyamuk'
                ? 'Nyamuk'
                : 'Lalat'}
              )
            </span>
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveType('tikus')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
            activeType === 'tikus'
              ? 'border-[#3A4EFB] text-[#3A4EFB] bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>🐀</span>
          <span>Data Surveilans Tikus ({filteredTikus.length})</span>
        </button>

        <button
          onClick={() => setActiveType('nyamuk')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
            activeType === 'nyamuk'
              ? 'border-[#33A4FA] text-[#33A4FA] bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>🦟</span>
          <span>Data Surveilans Nyamuk ({filteredNyamuk.length})</span>
        </button>

        <button
          onClick={() => setActiveType('lalat')}
          className={`px-4 py-2 text-xs font-semibold rounded-t-lg transition-colors flex items-center gap-2 border-b-2 cursor-pointer ${
            activeType === 'lalat'
              ? 'border-amber-600 text-amber-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <span>🪰</span>
          <span>Data Surveilans Lalat ({filteredLalat.length})</span>
        </button>
      </div>

      {activeType !== 'lalat' && (
        <FilterBar vectorType={activeType} showSpeciesFilter={true} showActivityFilter={false} />
      )}

      <DataTable
        type={activeType}
        data={
          activeType === 'tikus'
            ? filteredTikus
            : activeType === 'nyamuk'
            ? filteredNyamuk
            : filteredLalat
        }
        onEdit={onEditRecord}
        onDelete={onDeleteRecord}
      />

      <div className="p-5 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-600 space-y-1.5 shadow-xs">
        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
          <CircleCheckBig className="w-4 h-4 text-[#3A4EFB]" />
          <span>Kebijakan Transparansi Data Karantina Kesehatan</span>
        </div>
        <p className="leading-relaxed text-slate-500">
          Data yang ditampilkan pada tabel publik adalah catatan surveilans lapangan yang telah disetujui (visibilitas publik) oleh Petugas Surveilans Balai Kekarantinaan Kesehatan Kelas I Balikpapan.
        </p>
      </div>
    </div>
  );
};

export const TentangPage: React.FC = () => (
  <div className="max-w-5xl mx-auto space-y-12 pb-16 text-slate-800">
    <div className="text-center space-y-3 pt-4">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3A4EFB]/10 border border-[#3A4EFB]/20 text-[#3A4EFB] text-xs font-semibold">
        Profil Institusi & Mandat
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        Balai Kekarantinaan Kesehatan Kelas I Balikpapan
      </h1>
      <p className="text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
        Unit Pelaksana Teknis Kementerian Kesehatan Republik Indonesia yang bertugas mewujudkan ketahanan kesehatan di pintu masuk negara melalui pencegahan masuk dan keluarnya penyakit potensial wabah.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-4">
        <div className="w-10 h-10 rounded-xl bg-[#3A4EFB]/10 flex items-center justify-center text-[#3A4EFB]">
          <Building className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Tentang BKK Kelas I Balikpapan</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          Balai Kekarantinaan Kesehatan (BKK) Kelas I Balikpapan (sebelumnya bernama Kantor Kesehatan Pelabuhan / KKP Kelas II Balikpapan) merupakan garda terdepan pengawasan kekarantinaan kesehatan di wilayah Kalimantan Timur, khususnya Kota Balikpapan, Kabupaten Kutai Kartanegara, dan Kabupaten Paser.
        </p>
        <p className="text-xs text-slate-600 leading-relaxed">
          Melalui Peraturan Menteri Kesehatan RI No. 10 Tahun 2023, BKK mengemban amanat surveilans epidemiologi, pengendalian faktor risiko lingkungan, pengawasan alat angkut, orang, dan barang, serta kesiapsiagaan terhadap Kedaruratan Kesehatan Masyarakat yang Meresahkan Dunia (KKMMD / PHEIC).
        </p>
      </div>

      <div className="p-6 sm:p-8 bg-white border border-slate-200/90 rounded-2xl shadow-xs space-y-4">
        <div className="w-10 h-10 rounded-xl bg-[#33A4FA]/10 flex items-center justify-center text-[#33A4FA]">
          <Activity className="w-5 h-5" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Peran Strategis Sistem VECTO</h2>
        <p className="text-xs text-slate-600 leading-relaxed">
          VECTO dikembangkan sebagai instrumen digital pemantauan vektor reservoir penyakit karantina secara terpadu, berbasis bukti, dan transparan.
        </p>
        <ul className="space-y-2 text-xs text-slate-600">
          <li className="flex items-start gap-2">
            <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Surveilans Tikus & Pinjal:</strong> Monitoring kepadatan, trap success (≤1%), serta identifikasi indeks pinjal (Xenopsylla cheopis) secara berkala sepanjang tahun.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Surveilans Nyamuk Aedes:</strong> Pengendalian jentik di tempat penampungan air (ABJ ≥95%) serta resting nyamuk dewasa di perimeter dan buffer.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <CircleCheckBig className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Sinkronisasi Lapangan:</strong> Mendukung pencatatan tanggal fleksibel serta integrasi dengan Google Sheets untuk petugas karantina kesehatan.
            </span>
          </li>
        </ul>
      </div>
    </div>

    <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[#3A4EFB] text-xs font-bold uppercase tracking-wider">
          <Anchor className="w-4 h-4" />
          <span>Informasi Wilayah Kerja Pelabuhan</span>
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Cakupan 3 Wilayah Utama BKK Kelas I Balikpapan
        </h2>
        <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
          Informasi umum wilayah kerja pelabuhan BKK Kelas I Balikpapan secara garis besar mencakup 3 wilayah utama berikut:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {WILAYAH_UTAMA_INFO.map((w, idx) => (
          <div key={idx} className="p-5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-[#3A4EFB]/10 text-[#3A4EFB] font-mono font-bold text-xs flex items-center justify-center">
                0{idx + 1}
              </span>
              <h3 className="text-sm font-bold text-slate-900">{w.nama}</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{w.deskripsi}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="space-y-4">
      <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <MapPin className="w-4 h-4 text-[#3A4EFB]" />
        <span>5 Titik Operasional Surveilans Lapangan</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {DEFAULT_LOCATIONS.map((loc) => (
          <div
            key={loc.id}
            className="p-4 bg-white border border-slate-200/90 rounded-xl shadow-xs space-y-1.5"
          >
            <span className="text-[10px] font-bold text-[#3A4EFB] uppercase tracking-wider block">
              {loc.kategori}
            </span>
            <h3 className="text-sm font-bold text-slate-900">{loc.nama}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{loc.deskripsi}</p>
          </div>
        ))}
      </div>
    </section>

    <div className="p-6 sm:p-8 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
      <h2 className="text-base font-bold text-slate-900">Kantor Induk BKK Kelas I Balikpapan</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs text-slate-600">
        <div>
          <span className="font-semibold text-slate-900 block mb-1">Alamat:</span>
          <p>
            Jl. Yos Sudarso No. 1, Prapatan, Kec. Balikpapan Kota, Kota Balikpapan, Kalimantan Timur 76111
          </p>
        </div>
        <div>
          <span className="font-semibold text-slate-900 block mb-1">Telepon & Fax:</span>
          <p className="font-mono">(0542) 731110 / 731112</p>
        </div>
        <div>
          <span className="font-semibold text-slate-900 block mb-1">Surel Resmi:</span>
          <p className="font-mono text-[#3A4EFB]">bkk.balikpapan@kemkes.go.id</p>
        </div>
        <div>
          <span className="font-semibold text-slate-900 block mb-1">Website:</span>
          <p className="font-mono text-[#3A4EFB]">bkkbalikpapan.kemkes.go.id</p>
        </div>
      </div>
    </div>
  </div>
);
