export interface LocationPoint {
  id: string;
  nama: string;
  wilayahKerja: string;
  kategori: string;
  latitude: number;
  longitude: number;
  deskripsi: string;
}

export interface TikusRecord {
  id: string;
  tanggal: string;
  start_date?: string;
  end_date?: string;
  periode?: number;
  tahun: number;
  bulan: number;
  wilayahKerja: string;
  lokasi: string;
  bangunan: string;
  zonasi: 'Perimeter' | 'Buffer' | string;
  latitude: number;
  longitude: number;
  jumlahPerangkap: number;
  jumlahTikusTertangkap: number;
  statusTangkapan?: 'Tertangkap' | 'Tidak Ditemukan' | string;
  jenisTikus: string;
  trapSuccess: number;
  pemeriksaanPinjal?: boolean;
  pemeriksaanEktoparasit?: boolean;
  statusPinjal?: 'Pinjal' | 'Nihil' | string;
  jenisPinjal?: 'Pinjal' | 'Nihil' | string;
  jenisEktoparasit?: 'Pinjal' | 'Nihil' | string;
  jumlahPinjal?: number;
  indeksPinjal?: number;
  keterangan: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NyamukRecord {
  id: string;
  tanggal: string;
  start_date?: string;
  end_date?: string;
  periode?: number;
  tahun: number;
  bulan: number;
  wilayahKerja: string;
  lokasi: string;
  zonasi: 'Perimeter' | 'Buffer' | string;
  latitude: number;
  longitude: number;
  jenisKegiatan: string;
  jenisNyamuk: string;
  aedes: string;
  subPilihan?: 'Jentik' | 'Nyamuk Dewasa' | string;
  jumlahBangunanDiperiksa?: number;
  jumlahBangunanPositif?: number;
  jumlahKontainerDiperiksa?: number;
  jumlahKontainerPositif?: number;
  houseIndex?: number;
  containerIndex?: number;
  breteauIndex?: number;
  angkaBebasJentik?: number;
  jumlahNyamukTertangkap?: number;
  jumlahAedesTertangkap?: number;
  durasiPenangkapanMenit?: number;
  restingRate?: number;
  jumlahHasilPencidukan: number;
  suhu?: number;
  kelembapan?: number;
  musim?: string;
  perilakuMasyarakat?: string;
  keterangan: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LalatRecord {
  id: string;
  tanggal: string;
  tahun: number;
  bulan: number;
  titikLokasi: string;
  jenisLalat: string;
  indeksLalat: number;
  statusIntervensi: 'Perlu Intervensi' | 'Tidak Perlu Intervensi';
  keterangan: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'SYNC' | string;
  target: 'TIKUS' | 'NYAMUK' | 'LALAT' | 'LOKASI' | 'SHEETS' | string;
  description: string;
}

export interface AdminUser {
  email: string;
  name: string;
  role: string;
}

export interface SyncStatus {
  lastSync: string | null;
  isSyncing: boolean;
  message: string;
  error?: string;
}

export interface GlobalFilter {
  tahun: string;
  bulan: string;
  periode: string;
  startDate: string;
  endDate: string;
  wilayahKerja: string;
  zonasi?: string;
  lokasi: string;
  jenisTikus?: string;
  statusPinjal?: string;
  jenisNyamuk?: string;
  jenisKegiatan?: string;
  aedesSubPilihan?: string;
  musim?: string;
}
