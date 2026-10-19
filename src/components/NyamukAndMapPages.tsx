import React, { useMemo, useState } from 'react';
import {
  MapPin,
  Activity,
  Droplet,
  Bug,
  CloudSun,
  Thermometer,
  Users,
} from 'lucide-react';
import { useSurveillance } from '../context/SurveillanceContext';
import { MONTHS_ID, WILAYAH_KERJA_LIST, LALAT_SPECIES_LIST } from '../mockData';
import {
  FilterBar,
  StatCard,
  ComboBarLineChart,
  DataTable,
} from './Widgets';
import { MapView } from './MapView';
import { NyamukRecord, LalatRecord } from '../types';

export const NyamukDashboardPage: React.FC<{
  onEditRecord?: (r: NyamukRecord) => void;
  onDeleteRecord?: (r: NyamukRecord) => void;
}> = ({ onEditRecord, onDeleteRecord }) => {
  const { filteredNyamuk } = useSurveillance();

  const jentikSummary = useMemo(() => {
    const bDiperiksa = filteredNyamuk.reduce((acc, r) => acc + (r.jumlahBangunanDiperiksa ?? 80), 0);
    const bPositif = filteredNyamuk.reduce((acc, r) => acc + (r.jumlahBangunanPositif ?? 2), 0);
    const kDiperiksa = filteredNyamuk.reduce((acc, r) => acc + (r.jumlahKontainerDiperiksa ?? 50), 0);
    const kPositif = filteredNyamuk.reduce((acc, r) => acc + (r.jumlahKontainerPositif ?? 3), 0);
    return {
      totalBangunanDiperiksa: bDiperiksa,
      totalBangunanPositif: bPositif,
      totalKontainerDiperiksa: kDiperiksa,
      totalKontainerPositif: kPositif,
      hi: bDiperiksa > 0 ? Number(((bPositif / bDiperiksa) * 100).toFixed(2)) : 0,
      ci: kDiperiksa > 0 ? Number(((kPositif / kDiperiksa) * 100).toFixed(2)) : 0,
      bi: bDiperiksa > 0 ? Number(((kPositif / bDiperiksa) * 100).toFixed(2)) : 0,
      abj: bDiperiksa > 0 ? Number((((bDiperiksa - bPositif) / bDiperiksa) * 100).toFixed(2)) : 97,
    };
  }, [filteredNyamuk]);

  const envRisk = useMemo(() => {
    const list = filteredNyamuk;
    const suhus = list.map((e) => e.suhu).filter((s): s is number => typeof s === 'number' && !isNaN(s));
    const avgSuhu = suhus.length > 0 ? Number((suhus.reduce((a, b) => a + b, 0) / suhus.length).toFixed(1)) : 29.8;

    const rhs = list
      .map((e) => e.kelembapan)
      .filter((k): k is number => typeof k === 'number' && !isNaN(k));
    const avgKelembapan = rhs.length > 0 ? Number((rhs.reduce((a, b) => a + b, 0) / rhs.length).toFixed(1)) : 76.5;

    const musimCounts: Record<string, number> = { Kemarau: 0, Penghujan: 0, Pancaroba: 0 };
    list.forEach((e) => {
      const m = e.musim || 'Penghujan';
      musimCounts[m] = (musimCounts[m] || 0) + 1;
    });

    const perilakuCounts: Record<string, number> = {
      'Menampung Air Hujan': 0,
      'Enggan Melakukan 3M': 0,
      'Rutin Menguras Kontainer': 0,
      'Baik (Melakukan 3M Plus)': 0,
    };
    list.forEach((e) => {
      const p = e.perilakuMasyarakat || 'Menampung Air Hujan';
      perilakuCounts[p] = (perilakuCounts[p] || 0) + 1;
    });

    return { avgSuhu, avgKelembapan, musimCounts, perilakuCounts };
  }, [filteredNyamuk]);

  const monthLabels = useMemo(() => MONTHS_ID.map((m) => m.slice(0, 3)), []);
  const wilkerLabels = useMemo(
    () =>
      WILAYAH_KERJA_LIST.map((wk) =>
        wk
          .replace('Pelabuhan Laut ', 'Pel. ')
          .replace('Pos Bandara SAMSS Balikpapan', 'Bandara SAMS')
          .replace('Pelabuhan ', 'Pel. ')
      ),
    []
  );

  const bangunanChart = useMemo(() => {
    const diperiksa = Array(12).fill(0);
    const positif = Array(12).fill(0);
    filteredNyamuk.forEach((r) => {
      const idx = (r.bulan ? r.bulan - 1 : new Date(r.tanggal).getMonth()) % 12;
      diperiksa[idx] += r.jumlahBangunanDiperiksa ?? 80;
      positif[idx] += r.jumlahBangunanPositif ?? 2;
    });
    return {
      barSeries: [{ name: 'Jumlah Bangunan Diperiksa', data: diperiksa, color: '#3A4EFB', unit: 'unit' }],
      lineSeries: [{ name: 'Jumlah Bangunan Positif (+)', data: positif, color: '#f43f5e', unit: 'unit' }],
    };
  }, [filteredNyamuk]);

  const kontainerChart = useMemo(() => {
    const diperiksa = Array(12).fill(0);
    const positif = Array(12).fill(0);
    filteredNyamuk.forEach((r) => {
      const idx = (r.bulan ? r.bulan - 1 : new Date(r.tanggal).getMonth()) % 12;
      diperiksa[idx] += r.jumlahKontainerDiperiksa ?? 50;
      positif[idx] += r.jumlahKontainerPositif ?? 3;
    });
    return {
      barSeries: [{ name: 'Jumlah Container Diperiksa', data: diperiksa, color: '#33A4FA', unit: 'kontainer' }],
      lineSeries: [{ name: 'Container Positif (+)', data: positif, color: '#e11d48', unit: 'kontainer' }],
    };
  }, [filteredNyamuk]);

  const indeksWilkerChart = useMemo(() => {
    const hiArr: number[] = [];
    const ciArr: number[] = [];
    const biArr: number[] = [];
    const abjArr: number[] = [];

    WILAYAH_KERJA_LIST.forEach((wk) => {
      const items = filteredNyamuk.filter((e) => e.wilayahKerja === wk);
      if (items.length === 0) {
        hiArr.push(0);
        ciArr.push(0);
        biArr.push(0);
        abjArr.push(100);
      } else {
        const bDip = items.reduce((a, b) => a + (b.jumlahBangunanDiperiksa ?? 80), 0);
        const bPos = items.reduce((a, b) => a + (b.jumlahBangunanPositif ?? 2), 0);
        const kDip = items.reduce((a, b) => a + (b.jumlahKontainerDiperiksa ?? 50), 0);
        const kPos = items.reduce((a, b) => a + (b.jumlahKontainerPositif ?? 3), 0);
        hiArr.push(bDip > 0 ? Number(((bPos / bDip) * 100).toFixed(2)) : 0);
        ciArr.push(kDip > 0 ? Number(((kPos / kDip) * 100).toFixed(2)) : 0);
        biArr.push(bDip > 0 ? Number(((kPos / bDip) * 100).toFixed(2)) : 0);
        abjArr.push(bDip > 0 ? Number((((bDip - bPos) / bDip) * 100).toFixed(2)) : 100);
      }
    });

    return {
      barSeries: [
        { name: 'House Index (HI %)', data: hiArr, color: '#3A4EFB', unit: '%' },
        { name: 'Container Index (CI %)', data: ciArr, color: '#33A4FA', unit: '%' },
      ],
      lineSeries: [
        { name: 'Breteau Index (BI)', data: biArr, color: '#f59e0b', unit: '' },
        { name: 'Angka Bebas Jentik (ABJ %)', data: abjArr, color: '#10b981', unit: '%' },
      ],
    };
  }, [filteredNyamuk]);

  return (
    <div className="space-y-8 pb-12 text-slate-800">
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-[#3A4EFB] text-xs font-semibold uppercase tracking-wider mb-1">
          <span>SURVEILANS VEKTOR NYAMUK AEDES</span>
          <span className="text-slate-300">|</span>
          <span>BKK KELAS I BALIKPAPAN</span>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Dashboard Analisis Vektor Nyamuk Aedes
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              Pemantauan pemeriksaan bangunan dan container beserta nilai House Index (HI), Container Index (CI), Breteau Index (BI), serta faktor risiko lingkungan (suhu, kelembaban, dan musim) di 5 wilayah kerja pelabuhan/bandara.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl bg-[#3A4EFB]/10 px-4 py-2.5 border border-[#3A4EFB]/20 text-[#3A4EFB] text-xs font-bold">
            <Bug className="w-4 h-4" />
            <span>Indeks Entomologi: HI, CI &amp; BI</span>
          </div>
        </div>
      </div>

      <FilterBar vectorType="nyamuk" showSpeciesFilter={false} showActivityFilter={false} />

      <div className="space-y-8 animate-in fade-in duration-200">
        <section className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-[#3A4EFB]" />
              Ringkasan Pemeriksaan Bangunan, Container &amp; Indeks Entomologi (HI, CI, BI)
            </span>
            <span className="text-[11px] text-[#3A4EFB] font-mono">
              Baku Mutu: HI &lt; 5%, CI &lt; 5%, BI &le; 20, ABJ &ge; 95%
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            <StatCard
              label="Jumlah Bangunan Diperiksa"
              value={jentikSummary.totalBangunanDiperiksa}
              unit="unit"
              subtext="Total bangunan diperiksa"
            />
            <StatCard
              label="Jumlah Container Diperiksa"
              value={jentikSummary.totalKontainerDiperiksa}
              unit="tpa"
              subtext="Total container diperiksa"
            />
            <StatCard
              label="Jumlah Bangunan Positif (+)"
              value={jentikSummary.totalBangunanPositif}
              unit="unit"
              subtext="Bangunan positif (+)"
              tone={jentikSummary.totalBangunanPositif > 5 ? 'warning' : 'normal'}
            />
            <StatCard
              label="Container Positif (+)"
              value={jentikSummary.totalKontainerPositif}
              unit="tpa"
              subtext="Container positif (+)"
              tone={jentikSummary.totalKontainerPositif > 8 ? 'warning' : 'normal'}
            />
            <StatCard
              label="House Index (HI)"
              value={`${jentikSummary.hi}%`}
              unit=""
              subtext={jentikSummary.hi <= 5 ? 'Aman (≤5%)' : 'Tinggi (>5%)'}
              tone={jentikSummary.hi <= 5 ? 'success' : 'warning'}
            />
            <StatCard
              label="Container Index (CI)"
              value={`${jentikSummary.ci}%`}
              unit=""
              subtext={jentikSummary.ci <= 5 ? 'Aman (≤5%)' : 'Tinggi (>5%)'}
              tone={jentikSummary.ci <= 5 ? 'success' : 'warning'}
            />
            <StatCard
              label="Breteau Index (BI)"
              value={jentikSummary.bi}
              unit=""
              subtext="Container (+)/100 bangunan"
              tone={jentikSummary.bi <= 20 ? 'success' : 'warning'}
            />
            <StatCard
              label="ABJ (Bebas Jentik)"
              value={`${jentikSummary.abj}%`}
              unit=""
              subtext={jentikSummary.abj >= 95 ? 'Memenuhi baku mutu' : 'Di bawah baku mutu'}
              tone={jentikSummary.abj >= 95 ? 'success' : 'danger'}
            />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#3A4EFB]" />
            <h2 className="text-base font-bold text-slate-900">
              Grafik Pemeriksaan Bangunan, Container &amp; Nilai HI, CI, BI
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComboBarLineChart
              title="Jumlah Bangunan yang Diperiksa & Jumlah Bangunan Positif (+)"
              subtitle="Grafik batang (bangunan diperiksa) vs grafik garis (bangunan positif +) per bulan"
              categories={monthLabels}
              barSeries={bangunanChart.barSeries}
              lineSeries={bangunanChart.lineSeries}
              height={290}
            />
            <ComboBarLineChart
              title="Jumlah Container yang Diperiksa & Container Positif (+)"
              subtitle="Grafik batang (container diperiksa) vs grafik garis (container positif +) per bulan"
              categories={monthLabels}
              barSeries={kontainerChart.barSeries}
              lineSeries={kontainerChart.lineSeries}
              height={290}
            />
          </div>

          <ComboBarLineChart
            title="Nilai House Index (HI), Container Index (CI), Breteau Index (BI) & ABJ pada 5 Wilayah Kerja"
            subtitle="Grafik batang (HI & CI) dipadukan dengan grafik garis tren (BI & ABJ) di setiap pintu masuk pelabuhan"
            categories={wilkerLabels}
            barSeries={indeksWilkerChart.barSeries}
            lineSeries={indeksWilkerChart.lineSeries}
            height={310}
          />
        </section>
      </div>

      <section className="space-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudSun className="w-5 h-5 text-[#3A4EFB]" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Informasi Faktor Risiko Lingkungan &amp; Perilaku Masyarakat
              </h2>
              <p className="text-xs text-slate-500">
                Pengaruh parameter mikroklimat (suhu, kelembaban, musim) dan sanitasi masyarakat terhadap perkembangbiakan vektor Aedes
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[#3A4EFB]/10 text-[#3A4EFB]">
            Surveilans Lingkungan BKK
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Suhu Udara</span>
              <Thermometer className="w-4 h-4 text-rose-500" />
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">{envRisk.avgSuhu}</span>
              <span className="text-xs font-semibold text-slate-500">°C (Rata-rata)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Rentang suhu optimal perkembangbiakan jentik Aedes adalah 28°C–32°C. Suhu hangat mempercepat siklus gonotropik nyamuk dewasa.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Kelembaban Udara (RH)</span>
              <Droplet className="w-4 h-4 text-[#33A4FA]" />
            </div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-extrabold text-slate-900 font-mono">{envRisk.avgKelembapan}</span>
              <span className="text-xs font-semibold text-slate-500">% (Rata-rata)</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Kelembaban relatif di atas 70% menjaga viabilitas telur Aedes pada dinding kontainer kering hingga berbulan-bulan.
            </p>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Distribusi Musim</span>
              <CloudSun className="w-4 h-4 text-amber-500" />
            </div>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between items-center">
                <span>Musim Penghujan:</span>
                <span className="font-mono font-bold text-[#3A4EFB]">
                  {envRisk.musimCounts.Penghujan} catatan
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Musim Pancaroba:</span>
                <span className="font-mono font-bold text-amber-600">
                  {envRisk.musimCounts.Pancaroba} catatan
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Musim Kemarau:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {envRisk.musimCounts.Kemarau} catatan
                </span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Perilaku Masyarakat</span>
              <Users className="w-4 h-4 text-[#3A4EFB]" />
            </div>
            <div className="space-y-1.5 text-xs text-slate-700">
              <div className="flex justify-between items-center" title="Menampung Air Hujan">
                <span className="truncate pr-1">Menampung Air Hujan:</span>
                <span className="font-mono font-bold text-rose-600">
                  {envRisk.perilakuCounts['Menampung Air Hujan'] || 0}
                </span>
              </div>
              <div className="flex justify-between items-center" title="Enggan Melakukan 3M">
                <span className="truncate pr-1">Enggan 3M:</span>
                <span className="font-mono font-bold text-amber-600">
                  {envRisk.perilakuCounts['Enggan Melakukan 3M'] || 0}
                </span>
              </div>
              <div className="flex justify-between items-center" title="Baik / 3M Plus">
                <span className="truncate pr-1">Melakukan 3M Plus:</span>
                <span className="font-mono font-bold text-emerald-600">
                  {envRisk.perilakuCounts['Baik (Melakukan 3M Plus)'] || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#3A4EFB]" />
            <h2 className="text-base font-bold text-slate-900">
              Peta Sebaran Titik Surveilans Vektor Nyamuk Aedes
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Layer Nyamuk &amp; 5 Wilayah Kerja BKK</span>
        </div>
        <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs bg-white">
          <MapView heightClass="h-[460px]" forceVectorLayer="nyamuk" showLayerControls={true} />
        </div>
      </section>

      <section className="space-y-3">
        <DataTable
          type="nyamuk"
          data={filteredNyamuk}
          onEdit={onEditRecord}
          onDelete={onDeleteRecord}
        />
      </section>
    </div>
  );
};

export const PetaWilayahPage: React.FC = () => {
  const { filteredTikus, filteredNyamuk, locations } = useSurveillance();
  const [layerMode, setLayerMode] = useState<'all' | 'tikus' | 'nyamuk'>('all');

  return (
    <div className="space-y-6 pb-12 pt-2 text-slate-800">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white border border-slate-200/90 p-2.5 rounded-2xl shadow-xs">
        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => setLayerMode('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              layerMode === 'all'
                ? 'bg-[#3A4EFB] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Semua Vektor (Tikus & Nyamuk)
          </button>
          <button
            onClick={() => setLayerMode('tikus')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              layerMode === 'tikus'
                ? 'bg-[#3A4EFB] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>🐀</span>
            <span>Khusus Tikus ({filteredTikus.length})</span>
          </button>
          <button
            onClick={() => setLayerMode('nyamuk')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              layerMode === 'nyamuk'
                ? 'bg-[#33A4FA] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>🦟</span>
            <span>Khusus Nyamuk ({filteredNyamuk.length})</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono pr-2">
          {locations.length} Lokasi Wilayah Kerja • {filteredTikus.length + filteredNyamuk.length} Titik Data Terpilih
        </div>
      </div>

      <FilterBar vectorType={layerMode === 'all' ? 'all' : layerMode} showSpeciesFilter={layerMode !== 'all'} />

      <div className="rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs bg-white">
        <MapView heightClass="h-[640px]" forceVectorLayer={layerMode} showLayerControls={true} />
      </div>

      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[#3A4EFB]" />
          <span>Detail Lokasi Wilayah Kerja BKK Kelas I Balikpapan</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locations.map((loc) => {
            const tCount = filteredTikus.filter((e) => e.wilayahKerja === loc.wilayahKerja).length;
            const nCount = filteredNyamuk.filter((e) => e.wilayahKerja === loc.wilayahKerja).length;
            return (
              <div
                key={loc.id}
                className="p-5 bg-white border border-slate-200/90 rounded-2xl space-y-2 shadow-xs hover:border-[#3A4EFB]/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <span className="font-bold text-slate-900 text-sm truncate" title={loc.nama}>
                    📍 {loc.nama}
                  </span>
                  <span className="text-[10px] text-[#3A4EFB] bg-[#3A4EFB]/10 px-2 py-0.5 rounded-full border border-[#3A4EFB]/20 shrink-0 font-medium">
                    {loc.kategori}
                  </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">{loc.deskripsi}</p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-mono">
                  <span>
                    🐀 Tikus: <strong>{tCount}</strong> titik
                  </span>
                  <span>
                    🦟 Nyamuk: <strong>{nCount}</strong> titik
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const LalatDashboardPage: React.FC<{
  onEditRecord?: (r: LalatRecord) => void;
  onDeleteRecord?: (r: LalatRecord) => void;
}> = ({ onEditRecord, onDeleteRecord }) => {
  const { filteredLalat } = useSurveillance();
  const [selectedTitik, setSelectedTitik] = useState<string>('ALL');
  const [selectedJenisLalat, setSelectedJenisLalat] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const titikOptions = useMemo(() => {
    const set = new Set(filteredLalat.map((r) => r.titikLokasi));
    return Array.from(set);
  }, [filteredLalat]);

  const displayedLalat = useMemo(() => {
    return filteredLalat.filter((r) => {
      if (selectedTitik !== 'ALL' && r.titikLokasi !== selectedTitik) return false;
      if (selectedJenisLalat !== 'ALL' && (r.jenisLalat || 'Musca domestica') !== selectedJenisLalat) return false;
      if (selectedStatus !== 'ALL' && r.statusIntervensi !== selectedStatus) return false;
      return true;
    });
  }, [filteredLalat, selectedTitik, selectedJenisLalat, selectedStatus]);

  const summary = useMemo(() => {
    const total = displayedLalat.length;
    const perluIntervensi = displayedLalat.filter(
      (r) => r.statusIntervensi === 'Perlu Intervensi' || r.indeksLalat > 2
    ).length;
    const tidakPerlu = total - perluIntervensi;
    const avgIndeks =
      total > 0
        ? Number(
            (
              displayedLalat.reduce((acc, r) => acc + r.indeksLalat, 0) / total
            ).toFixed(2)
          )
        : 0;
    return { total, perluIntervensi, tidakPerlu, avgIndeks };
  }, [displayedLalat]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold mb-2">
            <Bug className="w-3.5 h-3.5" />
            Surveilans Kepadatan Lalat
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Section Surveilans Lalat Pelabuhan & Bandara
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Data indeks kepadatan lalat di titik pelabuhan atau bandara, jenis lalat, tanggal pemeriksaan, serta keterangan hasil indeks perlu intervensi atau tidak (Baku Mutu &le; 2).
          </p>
        </div>
      </div>

      {/* Ringkasan Indeks Lalat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Titik Pemeriksaan"
          value={summary.total}
          unit="titik"
          subtext="Total pengukuran indeks lalat"
          tone="normal"
        />
        <StatCard
          label="Rata-rata Indeks Lalat"
          value={summary.avgIndeks}
          unit="ekor/flygrill"
          subtext="Baku mutu kepadatan <= 2.0"
          tone={summary.avgIndeks > 2 ? 'danger' : 'success'}
        />
        <StatCard
          label="Perlu Intervensi"
          value={summary.perluIntervensi}
          unit="titik"
          subtext="Indeks lalat > 2 (Melewati baku mutu)"
          tone={summary.perluIntervensi > 0 ? 'danger' : 'success'}
        />
        <StatCard
          label="Tidak Perlu Intervensi"
          value={summary.tidakPerlu}
          unit="titik"
          subtext="Indeks lalat <= 2 (Memenuhi syarat)"
          tone="success"
        />
      </div>

      {/* Filter Sederhana Titik Pelabuhan/Bandara, Jenis Lalat & Status Intervensi */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Titik Pelabuhan / Bandara
            </label>
            <select
              value={selectedTitik}
              onChange={(e) => setSelectedTitik(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="ALL">Semua Titik Pelabuhan / Bandara</option>
              {titikOptions.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Jenis Lalat
            </label>
            <select
              value={selectedJenisLalat}
              onChange={(e) => setSelectedJenisLalat(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="ALL">Semua Jenis Lalat</option>
              {LALAT_SPECIES_LIST.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Keterangan Hasil Indeks
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-teal-600"
            >
              <option value="ALL">Semua Status Intervensi</option>
              <option value="Perlu Intervensi">Perlu Intervensi (&gt; 2)</option>
              <option value="Tidak Perlu Intervensi">Tidak Perlu Intervensi (&le; 2)</option>
            </select>
          </div>
        </div>

        {(selectedTitik !== 'ALL' || selectedJenisLalat !== 'ALL' || selectedStatus !== 'ALL') && (
          <button
            onClick={() => {
              setSelectedTitik('ALL');
              setSelectedJenisLalat('ALL');
              setSelectedStatus('ALL');
            }}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Reset Filter
          </button>
        )}
      </div>

      {/* Tabel Data Indeks Lalat */}
      <DataTable
        type="lalat"
        data={displayedLalat}
        onEdit={onEditRecord ? (r: any) => onEditRecord(r as LalatRecord) : undefined}
        onDelete={onDeleteRecord ? (r: any) => onDeleteRecord(r as LalatRecord) : undefined}
      />
    </div>
  );
};

