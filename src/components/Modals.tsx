import React, { useState, useEffect } from 'react';
import {
  Shield,
  X,
  TriangleAlert,
  Calendar,
  CircleCheck,
  Bug,
  Droplet,
  Activity,
  CloudSun,
  Save,
} from 'lucide-react';
import { useSurveillance } from '../context/SurveillanceContext';
import {
  WILAYAH_KERJA_LIST,
  TIKUS_SPECIES_LIST,
  LALAT_SPECIES_LIST,
  LALAT_PELABUHAN_LIST,
  LALAT_BANDARA_LIST,
  MUSIM_LIST,
  PERILAKU_MASYARAKAT_LIST,
} from '../mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { loginAdmin } = useSurveillance();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setTimeout(() => {
      const res = loginAdmin(username, password);
      setLoading(false);
      if (res.success) {
        onSuccess();
        onClose();
        setUsername('');
        setPassword('');
      } else {
        setError(res.error || 'Username atau kata sandi tidak valid.');
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in duration-150">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#3A4EFB]/10 border border-[#3A4EFB]/30 flex items-center justify-center text-[#3A4EFB]">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Login Administrator</h3>
              <p className="text-xs text-slate-500">Petugas Surveilans BKK Balikpapan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-2 text-rose-700 text-xs">
              <TriangleAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Username Admin
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username admin"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Kata Sandi (Password)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold bg-[#3A4EFB] hover:bg-[#33A4FA] text-white rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Memverifikasi...' : 'Masuk Sistem'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface RecordFormModalProps {
  isOpen: boolean;
  type: 'tikus' | 'nyamuk' | 'lalat';
  initialRecord: any | null;
  onClose: () => void;
  onSaveTikus: (data: any) => void;
  onSaveNyamuk: (data: any) => void;
  onSaveLalat?: (data: any) => void;
}

export const RecordFormModal: React.FC<RecordFormModalProps> = ({
  isOpen,
  type,
  initialRecord,
  onClose,
  onSaveTikus,
  onSaveNyamuk,
  onSaveLalat,
}) => {
  const [wilayahKerja, setWilayahKerja] = useState('Pelabuhan Laut Balikpapan');
  const [lokasi, setLokasi] = useState('');
  const [zonasi, setZonasi] = useState<'Perimeter' | 'Buffer'>('Perimeter');
  const [latitude, setLatitude] = useState('-1.2778');
  const [longitude, setLongitude] = useState('116.8042');
  const [keterangan, setKeterangan] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [singleDate, setSingleDate] = useState('');

  // Tikus fields
  const [bangunan, setBangunan] = useState('');
  const [jumlahPerangkap, setJumlahPerangkap] = useState('50');
  const [jumlahTikusTertangkap, setJumlahTikusTertangkap] = useState('0');
  const [jenisTikus, setJenisTikus] = useState('Rattus norvegicus');
  const [statusPinjal, setStatusPinjal] = useState<'Pinjal' | 'Nihil'>('Pinjal');
  const [jumlahPinjal, setJumlahPinjal] = useState('0');

  // Nyamuk fields
  const [subPilihan, setSubPilihan] = useState<'Jentik' | 'Nyamuk Dewasa'>('Jentik');
  const [jumlahBangunanDiperiksa, setJumlahBangunanDiperiksa] = useState('80');
  const [jumlahBangunanPositif, setJumlahBangunanPositif] = useState('2');
  const [jumlahKontainerDiperiksa, setJumlahKontainerDiperiksa] = useState('50');
  const [jumlahKontainerPositif, setJumlahKontainerPositif] = useState('3');
  const [jumlahHasilPencidukan, setJumlahHasilPencidukan] = useState('10');
  const [jumlahNyamukTertangkap, setJumlahNyamukTertangkap] = useState('20');
  const [jumlahAedesTertangkap, setJumlahAedesTertangkap] = useState('14');
  const [durasiPenangkapanMenit, setDurasiPenangkapanMenit] = useState('60');
  const [suhu, setSuhu] = useState('29.5');
  const [kelembapan, setKelembapan] = useState('78');
  const [musim, setMusim] = useState<'Kemarau' | 'Penghujan' | 'Pancaroba'>('Penghujan');
  const [perilakuMasyarakat, setPerilakuMasyarakat] = useState('Menampung Air Hujan');

  // Lalat fields
  const [titikLokasiLalat, setTitikLokasiLalat] = useState('Pelabuhan Laut Balikpapan');
  const [jenisLalat, setJenisLalat] = useState('Musca domestica');
  const [indeksLalat, setIndeksLalat] = useState('1.4');
  const [statusIntervensiLalat, setStatusIntervensiLalat] = useState<
    'Perlu Intervensi' | 'Tidak Perlu Intervensi'
  >('Tidak Perlu Intervensi');

  useEffect(() => {
    if (initialRecord) {
      const d = initialRecord.tanggal || new Date().toISOString().split('T')[0];
      setSingleDate(d);
      setStartDate(initialRecord.start_date || d);
      setEndDate(initialRecord.end_date || d);
      setWilayahKerja(initialRecord.wilayahKerja || 'Pelabuhan Laut Balikpapan');
      setLokasi(initialRecord.lokasi || '');
      setZonasi(initialRecord.zonasi || 'Perimeter');
      setLatitude((initialRecord.latitude ?? -1.2778).toString());
      setLongitude((initialRecord.longitude ?? 116.8042).toString());
      setKeterangan(initialRecord.keterangan || '');
      setIsPublic(initialRecord.isPublic ?? true);

      if (type === 'tikus') {
        setBangunan(initialRecord.bangunan || '');
        setJumlahPerangkap((initialRecord.jumlahPerangkap ?? 50).toString());
        setJumlahTikusTertangkap((initialRecord.jumlahTikusTertangkap ?? 0).toString());
        setJenisTikus(initialRecord.jenisTikus || 'Rattus norvegicus');
        setStatusPinjal(initialRecord.statusPinjal || initialRecord.jenisPinjal || 'Pinjal');
        setJumlahPinjal((initialRecord.jumlahPinjal ?? 0).toString());
      } else if (type === 'nyamuk') {
        setSubPilihan(
          initialRecord.subPilihan ||
            (initialRecord.jenisKegiatan?.includes('Dewasa') ? 'Nyamuk Dewasa' : 'Jentik')
        );
        setJumlahBangunanDiperiksa((initialRecord.jumlahBangunanDiperiksa ?? 80).toString());
        setJumlahBangunanPositif((initialRecord.jumlahBangunanPositif ?? 2).toString());
        setJumlahKontainerDiperiksa((initialRecord.jumlahKontainerDiperiksa ?? 50).toString());
        setJumlahKontainerPositif((initialRecord.jumlahKontainerPositif ?? 3).toString());
        setJumlahHasilPencidukan((initialRecord.jumlahHasilPencidukan ?? 10).toString());
        setJumlahNyamukTertangkap((initialRecord.jumlahNyamukTertangkap ?? 20).toString());
        setJumlahAedesTertangkap((initialRecord.jumlahAedesTertangkap ?? 14).toString());
        setDurasiPenangkapanMenit((initialRecord.durasiPenangkapanMenit ?? 60).toString());
        setSuhu((initialRecord.suhu ?? 29.5).toString());
        setKelembapan((initialRecord.kelembapan ?? 78).toString());
        setMusim(initialRecord.musim || 'Penghujan');
        setPerilakuMasyarakat(initialRecord.perilakuMasyarakat || 'Menampung Air Hujan');
      } else if (type === 'lalat') {
        setTitikLokasiLalat(
          initialRecord.titikLokasi || 'Pelabuhan Laut Balikpapan'
        );
        setJenisLalat(initialRecord.jenisLalat || 'Musca domestica');
        setIndeksLalat((initialRecord.indeksLalat ?? 1.4).toString());
        setStatusIntervensiLalat(
          initialRecord.statusIntervensi ||
            (Number(initialRecord.indeksLalat) > 2
              ? 'Perlu Intervensi'
              : 'Tidak Perlu Intervensi')
        );
      }
    } else {
      const today = new Date().toISOString().split('T')[0];
      setSingleDate(today);
      setStartDate(today);
      setEndDate(today);
      setWilayahKerja('Pelabuhan Laut Balikpapan');
      setLokasi('');
      setBangunan('');
      setZonasi('Perimeter');
      setJumlahPerangkap('50');
      setJumlahTikusTertangkap('0');
      setJenisTikus('Rattus norvegicus');
      setStatusPinjal('Nihil');
      setJumlahPinjal('0');
      setSubPilihan('Jentik');
      setJumlahBangunanDiperiksa('80');
      setJumlahBangunanPositif('2');
      setJumlahKontainerDiperiksa('50');
      setJumlahKontainerPositif('3');
      setJumlahHasilPencidukan('8');
      setJumlahNyamukTertangkap('20');
      setJumlahAedesTertangkap('14');
      setDurasiPenangkapanMenit('60');
      setSuhu('29.5');
      setKelembapan('78');
      setMusim('Penghujan');
      setPerilakuMasyarakat('Menampung Air Hujan');
      setTitikLokasiLalat('Pelabuhan Laut Balikpapan');
      setJenisLalat('Musca domestica');
      setIndeksLalat('1.4');
      setStatusIntervensiLalat('Tidak Perlu Intervensi');
      setKeterangan('');
    }
  }, [initialRecord, type, isOpen]);

  if (!isOpen) return null;

  const numPerangkap = parseInt(jumlahPerangkap) || 0;
  const numTikus = parseInt(jumlahTikusTertangkap) || 0;
  const calcTrapSuccess = numPerangkap > 0 ? Number(((numTikus / numPerangkap) * 100).toFixed(2)) : 0;
  const isNihilTikus = numTikus === 0;

  const numBangunan = parseInt(jumlahBangunanDiperiksa) || 0;
  const numBangunanPos = parseInt(jumlahBangunanPositif) || 0;
  const numKontainer = parseInt(jumlahKontainerDiperiksa) || 0;
  const numKontainerPos = parseInt(jumlahKontainerPositif) || 0;

  const calcHI = numBangunan > 0 ? Number(((numBangunanPos / numBangunan) * 100).toFixed(2)) : 0;
  const calcCI = numKontainer > 0 ? Number(((numKontainerPos / numKontainer) * 100).toFixed(2)) : 0;
  const calcBI = numBangunan > 0 ? Number(((numKontainerPos / numBangunan) * 100).toFixed(2)) : 0;
  const calcABJ =
    numBangunan > 0 ? Number((((numBangunan - numBangunanPos) / numBangunan) * 100).toFixed(2)) : 100;

  const numNyamuk = parseInt(jumlahNyamukTertangkap) || 0;
  const numAedes = parseInt(jumlahAedesTertangkap) || 0;
  const durasiJam = (parseInt(durasiPenangkapanMenit) || 60) / 60;
  const calcRestingRate = durasiJam > 0 ? Number((numAedes / durasiJam).toFixed(2)) : 0;

  const handleStartChange = (val: string) => {
    setStartDate(val);
    if (!endDate || endDate < val) setEndDate(val);
  };

  const handleEndChange = (val: string) => {
    setEndDate(val);
    if (startDate && val < startDate) setStartDate(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'tikus') {
      const d = endDate || startDate || new Date().toISOString().split('T')[0];
      const dt = new Date(d);
      const tahun = dt.getFullYear();
      const bulan = dt.getMonth() + 1;
      const pinjalCount = statusPinjal === 'Nihil' ? 0 : parseInt(jumlahPinjal) || 0;
      const indeksPinjal = numTikus > 0 ? Number((pinjalCount / numTikus).toFixed(2)) : 0;

      onSaveTikus({
        id: initialRecord?.id,
        tanggal: d,
        start_date: startDate || d,
        end_date: endDate || d,
        tahun,
        bulan,
        wilayahKerja,
        lokasi,
        bangunan,
        zonasi,
        latitude: parseFloat(latitude) || -1.2778,
        longitude: parseFloat(longitude) || 116.8042,
        jumlahPerangkap: numPerangkap,
        jumlahTikusTertangkap: numTikus,
        statusTangkapan: numTikus === 0 ? 'Tidak Ditemukan' : 'Tertangkap',
        jenisTikus,
        trapSuccess: calcTrapSuccess,
        statusPinjal,
        jenisPinjal: statusPinjal,
        pemeriksaanPinjal: true,
        jumlahPinjal: pinjalCount,
        indeksPinjal,
        keterangan,
        isPublic,
      });
    } else if (type === 'nyamuk') {
      const d = singleDate || new Date().toISOString().split('T')[0];
      const dt = new Date(d);
      const tahun = dt.getFullYear();
      const bulan = dt.getMonth() + 1;
      const suhuNum = parseFloat(suhu) || 29.5;
      const kelembapanNum = parseFloat(kelembapan) || 78;

      onSaveNyamuk({
        id: initialRecord?.id,
        tanggal: d,
        start_date: d,
        end_date: d,
        tahun,
        bulan,
        wilayahKerja,
        lokasi: '-',
        zonasi,
        latitude: parseFloat(latitude) || -1.2778,
        longitude: parseFloat(longitude) || 116.8042,
        jenisKegiatan: '-',
        jenisNyamuk: 'Aedes',
        aedes: 'Aedes',
        subPilihan: 'Jentik',
        jumlahBangunanDiperiksa: numBangunan,
        jumlahBangunanPositif: numBangunanPos,
        jumlahKontainerDiperiksa: numKontainer,
        jumlahKontainerPositif: numKontainerPos,
        houseIndex: calcHI,
        containerIndex: calcCI,
        breteauIndex: calcBI,
        angkaBebasJentik: calcABJ,
        jumlahHasilPencidukan: parseInt(jumlahHasilPencidukan) || numKontainerPos,
        suhu: suhuNum,
        kelembapan: kelembapanNum,
        musim,
        perilakuMasyarakat,
        keterangan,
        isPublic,
      });
    } else if (type === 'lalat' && onSaveLalat) {
      const d = singleDate || new Date().toISOString().split('T')[0];
      const dt = new Date(d);
      const tahun = dt.getFullYear();
      const bulan = dt.getMonth() + 1;
      const idxVal = parseFloat(indeksLalat) || 0;

      onSaveLalat({
        id: initialRecord?.id,
        tanggal: d,
        tahun,
        bulan,
        titikLokasi: titikLokasiLalat.trim() || 'Pelabuhan Laut Balikpapan',
        jenisLalat: jenisLalat || 'Musca domestica',
        indeksLalat: idxVal,
        statusIntervensi: statusIntervensiLalat,
        keterangan:
          keterangan.trim() ||
          (statusIntervensiLalat === 'Perlu Intervensi'
            ? 'Indeks lalat melebihi baku mutu (> 2) — Perlu Intervensi pengendalian lalat'
            : 'Indeks lalat memenuhi baku mutu (<= 2) — Tidak Perlu Intervensi'),
        isPublic,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-slate-800 animate-in fade-in duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3A4EFB]" />
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                {initialRecord ? 'Edit Catatan Surveilans' : 'Tambah Entri Surveilans Baru'}
              </h2>
              <p className="text-xs text-[#3A4EFB] font-semibold">
                {type === 'tikus'
                  ? 'Vektor Reservoir: Tikus & Pinjal'
                  : type === 'nyamuk'
                  ? 'Vektor Nyamuk Aedes (Pemeriksaan Bangunan, Container & Indeks HI, CI, BI)'
                  : 'Surveilans Indeks Lalat di Titik Pelabuhan / Bandara'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto">
          {type === 'tikus' ? (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <Calendar className="w-3.5 h-3.5 text-[#3A4EFB]" />
                  Rentang Tanggal Penyebaran Perangkap Tikus
                </label>
                <span className="text-[11px] font-semibold text-[#3A4EFB] bg-[#3A4EFB]/10 px-2.5 py-0.5 rounded-md">
                  Tanggal Fleksibel (start_date & end_date)
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Hari Pertama Penyebaran Perangkap
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => handleStartChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                    start_date
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Hari Terakhir Penyebaran Perangkap
                  </label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => handleEndChange(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                    end_date
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wide">
                  <Calendar className="w-3.5 h-3.5 text-[#3A4EFB]" />
                  Tanggal Pelaksanaan Surveilans {type === 'lalat' ? 'Lalat' : 'Nyamuk'}
                </label>
                <span className="text-[11px] font-semibold text-[#3A4EFB] bg-[#3A4EFB]/10 px-2.5 py-0.5 rounded-md">
                  Cukup Satu Tanggal Pilihan
                </span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Pelaksanaan Surveilans
                </label>
                <input
                  type="date"
                  required
                  value={singleDate}
                  onChange={(e) => setSingleDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
                />
                <span className="text-[10px] text-slate-500 mt-0.5 block font-mono">
                  tanggal surveilans (tunggal)
                </span>
              </div>
            </div>
          )}

          {type !== 'lalat' && (
            <>
              <div className={`grid grid-cols-1 ${type === 'tikus' ? 'sm:grid-cols-2' : ''} gap-3`}>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Wilayah Kerja (5 Lokasi Pelabuhan)
                  </label>
                  <select
                    value={wilayahKerja}
                    onChange={(e) => setWilayahKerja(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
                  >
                    {WILAYAH_KERJA_LIST.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
                {type === 'tikus' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Titik Lokasi Spesifik
                    </label>
                    <input
                      type="text"
                      required
                      value={lokasi}
                      onChange={(e) => setLokasi(e.target.value)}
                      placeholder="Contoh: Dermaga Semayang / Gudang Kargo"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Zona Area Karantina
                  </label>
                  <select
                    value={zonasi}
                    onChange={(e) => setZonasi(e.target.value as 'Perimeter' | 'Buffer')}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
                  >
                    <option value="Perimeter">Perimeter (Area Inti)</option>
                    <option value="Buffer">Buffer (Area Penyangga)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Latitude (Input Teks)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    value={latitude}
                    onChange={(e) => setLatitude(e.target.value)}
                    placeholder="-1.2778"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Longitude (Input Teks)
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    required
                    value={longitude}
                    onChange={(e) => setLongitude(e.target.value)}
                    placeholder="116.8042"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
                  />
                </div>
              </div>
            </>
          )}

          {type === 'lalat' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Pilih Lokasi Pelabuhan atau Bandara
                  </label>
                  <select
                    value={titikLokasiLalat}
                    onChange={(e) => setTitikLokasiLalat(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#3A4EFB]"
                  >
                    <optgroup label="Pilihan Pelabuhan (Laut & Pos Pelabuhan)">
                      {LALAT_PELABUHAN_LIST.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Pilihan Bandara (Bandar Udara)">
                      {LALAT_BANDARA_LIST.map((loc) => (
                        <option key={loc} value={loc}>
                          {loc}
                        </option>
                      ))}
                    </optgroup>
                    {!LALAT_PELABUHAN_LIST.includes(titikLokasiLalat) &&
                      !LALAT_BANDARA_LIST.includes(titikLokasiLalat) &&
                      titikLokasiLalat && (
                        <optgroup label="Lokasi Lainnya">
                          <option value={titikLokasiLalat}>{titikLokasiLalat}</option>
                        </optgroup>
                      )}
                  </select>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Pilih pelabuhan (Balikpapan, Kuala Samboja, Tana Paser, Kampung Baru) atau bandara (SAMSS Balikpapan)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Lalat
                  </label>
                  <select
                    value={jenisLalat}
                    onChange={(e) => setJenisLalat(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 italic font-serif focus:outline-none focus:border-[#3A4EFB]"
                  >
                    {LALAT_SPECIES_LIST.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Indeks Lalat (ekor/flygrill)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min={0}
                    required
                    value={indeksLalat}
                    onChange={(e) => {
                      const val = e.target.value;
                      setIndeksLalat(val);
                      const num = parseFloat(val);
                      if (!isNaN(num)) {
                        setStatusIntervensiLalat(
                          num > 2 ? 'Perlu Intervensi' : 'Tidak Perlu Intervensi'
                        );
                      }
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB]"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Baku mutu kepadatan lalat: &le; 2.0 (Tidak Perlu Intervensi), &gt; 2.0 (Perlu Intervensi)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Hasil Indeks (Perlu Intervensi / Tidak)
                  </label>
                  <select
                    value={statusIntervensiLalat}
                    onChange={(e) =>
                      setStatusIntervensiLalat(
                        e.target.value as 'Perlu Intervensi' | 'Tidak Perlu Intervensi'
                      )
                    }
                    className={`w-full border rounded-lg px-3 py-2 text-xs font-bold focus:outline-none ${
                      statusIntervensiLalat === 'Perlu Intervensi'
                        ? 'bg-rose-50 border-rose-300 text-rose-700'
                        : 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    }`}
                  >
                    <option value="Tidak Perlu Intervensi">
                      Tidak Perlu Intervensi (Indeks &le; 2)
                    </option>
                    <option value="Perlu Intervensi">
                      Perlu Intervensi (Indeks &gt; 2)
                    </option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {type === 'tikus' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  Parameter Tangkapan Tikus & Status
                </span>
                {isNihilTikus ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 animate-pulse">
                    <CircleCheck className="w-3 h-3 text-emerald-600" />
                    Status: &quot;Tidak Ditemukan&quot;
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                    <TriangleAlert className="w-3 h-3 text-amber-600" />
                    Status: Tertangkap ({numTikus} Ekor)
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bangunan / Fasilitas
                  </label>
                  <input
                    type="text"
                    value={bangunan}
                    onChange={(e) => setBangunan(e.target.value)}
                    placeholder="Gudang Logistik / Kantor Operasional"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Spesies Tikus (Target Karantina)
                  </label>
                  <select
                    value={jenisTikus}
                    onChange={(e) => setJenisTikus(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB]"
                  >
                    {TIKUS_SPECIES_LIST.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Perangkap (Input Teks)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={jumlahPerangkap}
                    onChange={(e) => setJumlahPerangkap(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="Contoh: 50"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Ketik angka perangkap manual
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Tertangkap (Input Teks)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={jumlahTikusTertangkap}
                    onChange={(e) =>
                      setJumlahTikusTertangkap(e.target.value.replace(/[^0-9]/g, ''))
                    }
                    placeholder="0"
                    className={`w-full bg-white border rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none ${
                      isNihilTikus
                        ? 'border-emerald-300 text-emerald-700 focus:border-emerald-500'
                        : 'border-slate-300 text-[#3A4EFB] focus:border-[#3A4EFB]'
                    }`}
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Ketik 0 → Otomatis &quot;Tidak Ditemukan&quot;
                  </span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trap Success Terkalkulasi
                  </label>
                  <div className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold font-mono text-[#3A4EFB] flex items-center justify-between">
                    <span>{calcTrapSuccess}%</span>
                    <span className="text-[10px] text-slate-400 font-normal">Baku mutu ≤ 1%</span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Kalkulasi otomatis
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Pinjal (Hanya Pinjal)
                  </label>
                  <select
                    value={statusPinjal}
                    onChange={(e) => {
                      const val = e.target.value as 'Pinjal' | 'Nihil';
                      setStatusPinjal(val);
                      if (val === 'Nihil') setJumlahPinjal('0');
                    }}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB]"
                  >
                    <option value="Pinjal">Ditemukan Pinjal (Positif)</option>
                    <option value="Nihil">Bebas Pinjal (Nihil)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jumlah Pinjal (Input Teks)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={statusPinjal === 'Nihil'}
                    value={statusPinjal === 'Nihil' ? '0' : jumlahPinjal}
                    onChange={(e) => setJumlahPinjal(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="0"
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono disabled:bg-slate-100 disabled:opacity-60 focus:outline-none focus:border-[#3A4EFB]"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Ketik manual jumlah pinjal
                  </span>
                </div>
              </div>
            </div>
          )}

          {type === 'nyamuk' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Bug className="w-4 h-4 text-[#3A4EFB]" />
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Data Pemeriksaan Bangunan, Container &amp; Indeks Entomologi (HI, CI, BI)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#3A4EFB] bg-[#3A4EFB]/10 px-2.5 py-0.5 rounded-md">
                  Kalkulasi Otomatis HI, CI, BI
                </span>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jumlah Bangunan yang Diperiksa
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={jumlahBangunanDiperiksa}
                      onChange={(e) =>
                        setJumlahBangunanDiperiksa(e.target.value.replace(/[^0-9]/g, ''))
                      }
                      placeholder="Contoh: 80"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jumlah Container yang Diperiksa
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={jumlahKontainerDiperiksa}
                      onChange={(e) =>
                        setJumlahKontainerDiperiksa(e.target.value.replace(/[^0-9]/g, ''))
                      }
                      placeholder="Contoh: 50"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jumlah Bangunan yang Positif (+)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={jumlahBangunanPositif}
                      onChange={(e) =>
                        setJumlahBangunanPositif(e.target.value.replace(/[^0-9]/g, ''))
                      }
                      placeholder="Contoh: 2"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Container yang Positif (+)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      required
                      value={jumlahKontainerPositif}
                      onChange={(e) =>
                        setJumlahKontainerPositif(e.target.value.replace(/[^0-9]/g, ''))
                      }
                      placeholder="Contoh: 3"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB]"
                    />
                  </div>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                      House Index (HI)
                    </span>
                    <span className="text-sm font-extrabold text-[#3A4EFB] font-mono">
                      {calcHI}%
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                      Container Index (CI)
                    </span>
                    <span className="text-sm font-extrabold text-[#33A4FA] font-mono">
                      {calcCI}%
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                      Breteau Index (BI)
                    </span>
                    <span className="text-sm font-extrabold text-amber-600 font-mono">
                      {calcBI}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">
                      ABJ (Bebas Jentik)
                    </span>
                    <span
                      className={`text-sm font-extrabold font-mono ${
                        calcABJ >= 95 ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {calcABJ}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center gap-1.5 mb-2.5">
                  <CloudSun className="w-3.5 h-3.5 text-[#3A4EFB]" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                    Faktor Risiko Lingkungan & Perilaku Masyarakat
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Suhu Udara (°C)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={suhu}
                      onChange={(e) => setSuhu(e.target.value)}
                      placeholder="29.5"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kelembaban Udara (%)
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={kelembapan}
                      onChange={(e) => setKelembapan(e.target.value)}
                      placeholder="78"
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 font-mono focus:outline-none focus:border-[#3A4EFB]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Musim (Kemarau/Penghujan/Pancaroba)
                    </label>
                    <select
                      value={musim}
                      onChange={(e) =>
                        setMusim(e.target.value as 'Kemarau' | 'Penghujan' | 'Pancaroba')
                      }
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB]"
                    >
                      {MUSIM_LIST.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Perilaku Masyarakat
                    </label>
                    <select
                      value={perilakuMasyarakat}
                      onChange={(e) => setPerilakuMasyarakat(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB]"
                    >
                      {PERILAKU_MASYARAKAT_LIST.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Keterangan Operasional Lapangan
            </label>
            <textarea
              rows={2}
              value={keterangan}
              onChange={(e) => setKeterangan(e.target.value)}
              placeholder="Catatan kondisi sanitasi kontainer, jenis tempat perkembangbiakan..."
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
            />
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-slate-300 text-[#3A4EFB] focus:ring-[#3A4EFB]"
              />
              <span>Tampilkan pada dashboard publik</span>
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-[#3A4EFB] hover:bg-[#33A4FA] text-white rounded-lg shadow-xs transition-colors flex items-center space-x-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Catatan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
