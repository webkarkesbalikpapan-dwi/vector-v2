import React, { useState, useMemo } from 'react';
import {
  Filter,
  Bug,
  Calendar,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Layers,
  Search,
  FileSpreadsheet,
  Download,
  ArrowUpDown,
  PenLine,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useSurveillance } from '../context/SurveillanceContext';
import { WILAYAH_KERJA_LIST, TIKUS_SPECIES_LIST, MUSIM_LIST } from '../mockData';
import { TikusRecord, NyamukRecord, LalatRecord } from '../types';

interface FilterBarProps {
  vectorType?: 'all' | 'tikus' | 'nyamuk' | 'lalat';
  showSpeciesFilter?: boolean;
  showActivityFilter?: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  vectorType = 'all',
  showSpeciesFilter = true,
}) => {
  const { globalFilter, setGlobalFilter, resetFilter, availableYears } = useSurveillance();
  const [showDateRange, setShowDateRange] = useState(false);

  const hasActiveFilter =
    globalFilter.tahun !== 'all' ||
    (globalFilter.zonasi && globalFilter.zonasi !== 'Semua Zona' && globalFilter.zonasi !== 'all') ||
    !!globalFilter.startDate ||
    !!globalFilter.endDate ||
    globalFilter.wilayahKerja !== 'all' ||
    (vectorType !== 'nyamuk' && globalFilter.lokasi !== 'all' && !!globalFilter.lokasi) ||
    (vectorType === 'tikus' && globalFilter.jenisTikus && globalFilter.jenisTikus !== 'all') ||
    (vectorType === 'tikus' && globalFilter.statusPinjal && globalFilter.statusPinjal !== 'all') ||
    (vectorType === 'nyamuk' && globalFilter.aedesSubPilihan && globalFilter.aedesSubPilihan !== 'all') ||
    (vectorType === 'nyamuk' && globalFilter.musim && globalFilter.musim !== 'all');

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 shadow-xs text-slate-800 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3A4EFB]/10 flex items-center justify-center text-[#3A4EFB]">
            <Filter className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Filter Interaktif Surveilans
              </span>
              {vectorType === 'nyamuk' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3A4EFB]/10 text-[#3A4EFB] border border-[#3A4EFB]/20">
                  <Bug className="w-3 h-3" /> Vektor Utama: Aedes
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              {vectorType === 'nyamuk'
                ? 'Saring data vektor Aedes berdasarkan Tahun, Zona Area (Perimeter/Buffer), Wilayah Kerja, dan Musim.'
                : 'Saring data reservoir tikus & pinjal berdasarkan Zona Area, Wilayah Kerja, dan rentang tanggal fleksibel.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowDateRange(!showDateRange)}
            className={`flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
              showDateRange || globalFilter.startDate || globalFilter.endDate
                ? 'bg-[#3A4EFB]/10 border-[#3A4EFB] text-[#3A4EFB]'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#3A4EFB]" />
            <span>Rentang Tanggal</span>
            {showDateRange ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {hasActiveFilter && (
            <button
              onClick={resetFilter}
              className="flex items-center space-x-1.5 text-xs text-rose-600 hover:text-white font-semibold px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 transition-all shadow-2xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>
          )}
        </div>
      </div>

      {showDateRange && (
        <div className="mb-4 p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center gap-3 text-xs animate-in fade-in duration-150">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#3A4EFB]" />
            Rentang Waktu:
          </span>
          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium">Dari:</label>
            <input
              type="date"
              value={globalFilter.startDate || ''}
              onChange={(e) => setGlobalFilter((prev) => ({ ...prev, startDate: e.target.value }))}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-medium">Sampai:</label>
            <input
              type="date"
              value={globalFilter.endDate || ''}
              onChange={(e) => setGlobalFilter((prev) => ({ ...prev, endDate: e.target.value }))}
              className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
            />
          </div>
          {(globalFilter.startDate || globalFilter.endDate) && (
            <button
              type="button"
              onClick={() => setGlobalFilter((prev) => ({ ...prev, startDate: '', endDate: '' }))}
              className="text-[11px] text-rose-600 font-semibold underline ml-auto hover:text-rose-800 cursor-pointer"
            >
              Hapus Rentang
            </button>
          )}
        </div>
      )}

      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${
          vectorType === 'nyamuk' ? 'md:grid-cols-4' : 'md:grid-cols-3 lg:grid-cols-6'
        } gap-3`}
      >
        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tahun Surveilans</label>
          <select
            value={globalFilter.tahun}
            onChange={(e) => setGlobalFilter((prev) => ({ ...prev, tahun: e.target.value }))}
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
          >
            <option value="all">Semua Tahun</option>
            {availableYears.map((yr) => (
              <option key={yr} value={yr.toString()}>
                {yr}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#3A4EFB]" />
              Filter Zona Area
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Karantina</span>
          </label>
          <select
            value={globalFilter.zonasi || 'Semua Zona'}
            onChange={(e) => setGlobalFilter((prev) => ({ ...prev, zonasi: e.target.value }))}
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-medium focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
          >
            <option value="Semua Zona">Semua Zona</option>
            <option value="Perimeter">Perimeter (Area Inti)</option>
            <option value="Buffer">Buffer (Area Penyangga)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-700 mb-1">Wilayah Kerja (5 Lokasi)</label>
          <select
            value={globalFilter.wilayahKerja}
            onChange={(e) => setGlobalFilter((prev) => ({ ...prev, wilayahKerja: e.target.value }))}
            className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
          >
            <option value="all">Seluruh 5 Lokasi Pelabuhan</option>
            {WILAYAH_KERJA_LIST.map((wk) => (
              <option key={wk} value={wk}>
                {wk}
              </option>
            ))}
          </select>
        </div>

        {showSpeciesFilter && vectorType === 'tikus' && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Jenis Tikus</label>
            <select
              value={globalFilter.jenisTikus || 'all'}
              onChange={(e) => setGlobalFilter((prev) => ({ ...prev, jenisTikus: e.target.value }))}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
            >
              <option value="all">Semua Jenis Tikus</option>
              {TIKUS_SPECIES_LIST.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>
        )}

        {vectorType === 'tikus' && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Status Pinjal</label>
            <select
              value={globalFilter.statusPinjal || 'all'}
              onChange={(e) => setGlobalFilter((prev) => ({ ...prev, statusPinjal: e.target.value }))}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
            >
              <option value="all">Semua Status Pinjal</option>
              <option value="Pinjal">Ditemukan Pinjal (Positif)</option>
              <option value="Nihil">Bebas Pinjal (Nihil)</option>
            </select>
          </div>
        )}

        {vectorType === 'nyamuk' && (
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Musim (Kemarau / Penghujan / Pancaroba)
            </label>
            <select
              value={globalFilter.musim || 'all'}
              onChange={(e) => setGlobalFilter((prev) => ({ ...prev, musim: e.target.value }))}
              className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
            >
              <option value="all">Semua Musim</option>
              {MUSIM_LIST.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        )}

        {vectorType !== 'nyamuk' && (
          <div className={vectorType === 'all' ? 'col-span-1 sm:col-span-2' : ''}>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">Cari Lokasi / Bangunan</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Contoh: Dermaga, Gudang, Kargo..."
                value={globalFilter.lokasi === 'all' ? '' : globalFilter.lokasi}
                onChange={(e) => setGlobalFilter((prev) => ({ ...prev, lokasi: e.target.value }))}
                className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subtext?: string;
  icon?: React.ReactNode;
  tone?: 'normal' | 'danger' | 'warning' | 'success';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  subtext,
  icon,
  tone = 'normal',
}) => {
  const borderBg = (() => {
    switch (tone) {
      case 'danger':
        return 'border-rose-200 bg-rose-50/70';
      case 'warning':
        return 'border-amber-200 bg-amber-50/70';
      case 'success':
        return 'border-emerald-200 bg-emerald-50/70';
      default:
        return 'border-slate-200/90 bg-white hover:border-[#3A4EFB]/40';
    }
  })();

  const textCol = (() => {
    switch (tone) {
      case 'danger':
        return 'text-rose-600';
      case 'warning':
        return 'text-amber-700';
      case 'success':
        return 'text-emerald-700';
      default:
        return 'text-slate-900';
    }
  })();

  return (
    <div className={`p-4 rounded-xl border ${borderBg} shadow-xs flex flex-col justify-between transition-all`}>
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500 tracking-wide">{label}</span>
        {icon && <div className="text-slate-400 shrink-0 ml-2">{icon}</div>}
      </div>
      <div className="mt-2 flex items-baseline gap-1.5">
        <span className={`text-2xl font-black font-mono tracking-tight ${textCol}`}>{value}</span>
        {unit && <span className="text-xs font-semibold text-slate-500 font-sans">{unit}</span>}
      </div>
      {subtext && (
        <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
          <span className="truncate">{subtext}</span>
        </div>
      )}
    </div>
  );
};

interface LineAreaChartProps {
  title: string;
  subtitle?: string;
  data: { label: string; value: number; secondaryValue?: number }[];
  metricLabel: string;
  secondaryMetricLabel?: string;
  unit?: string;
  color?: string;
  secondaryColor?: string;
}

export const LineAreaChart: React.FC<LineAreaChartProps> = ({
  title,
  subtitle,
  data,
  metricLabel,
  secondaryMetricLabel,
  unit = '',
  color = '#3A4EFB',
  secondaryColor = '#33A4FA',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const pad = { top: 20, right: 30, bottom: 35, left: 45 };
  const w = 640 - pad.left - pad.right;
  const h = 240 - pad.top - pad.bottom;

  const allVals = data.flatMap((d) => [d.value, d.secondaryValue ?? 0]);
  const maxVal = Math.ceil(Math.max(...allVals, 5) * 1.15);

  const getX = (idx: number) => (data.length <= 1 ? pad.left + w / 2 : pad.left + (idx / (data.length - 1)) * w);
  const getY = (val: number) => pad.top + h - (val / maxVal) * h;

  const pointsStr = data.map((d, i) => `${getX(i)},${getY(d.value)}`).join(' ');
  const areaPoints = `${pad.left},${getY(0)} ${pointsStr} ${getX(data.length - 1)},${getY(0)}`;
  const secPointsStr = secondaryMetricLabel
    ? data.map((d, i) => `${getX(i)},${getY(d.secondaryValue ?? 0)}`).join(' ')
    : '';
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(maxVal * t));

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-3 text-xs text-slate-600">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
            <span className="font-medium">{metricLabel}</span>
          </div>
          {secondaryMetricLabel && (
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
              <span className="font-medium">{secondaryMetricLabel}</span>
            </div>
          )}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox="0 0 640 240" className="w-full h-auto min-w-[500px]" preserveAspectRatio="none">
          {yTicks.map((tick, i) => {
            const y = getY(tick);
            return (
              <g key={i}>
                <line
                  x1={pad.left}
                  y1={y}
                  x2={640 - pad.right}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={pad.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#94a3b8"
                  fontSize="10"
                  fontFamily="sans-serif"
                >
                  {tick}
                </text>
              </g>
            );
          })}
          <polygon fill={color} fillOpacity="0.08" points={areaPoints} />
          {secondaryMetricLabel && (
            <polyline
              fill="none"
              stroke={secondaryColor}
              strokeWidth="2"
              strokeDasharray="4 3"
              strokeLinecap="round"
              strokeLinejoin="round"
              points={secPointsStr}
            />
          )}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pointsStr}
          />
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.value);
            const isHov = hoveredIdx === i;
            return (
              <g
                key={i}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {isHov && (
                  <line
                    x1={cx}
                    y1={pad.top}
                    x2={cx}
                    y2={240 - pad.bottom}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHov ? 6 : 4}
                  fill="#ffffff"
                  stroke={color}
                  strokeWidth="2.5"
                  className="transition-all"
                />
                {secondaryMetricLabel && (
                  <circle
                    cx={cx}
                    cy={getY(d.secondaryValue ?? 0)}
                    r={isHov ? 5 : 3.5}
                    fill="#ffffff"
                    stroke={secondaryColor}
                    strokeWidth="2"
                  />
                )}
                <text
                  x={cx}
                  y={240 - pad.bottom + 15}
                  textAnchor="middle"
                  fill={isHov ? '#0f172a' : '#64748b'}
                  fontWeight={isHov ? 'bold' : 'normal'}
                  fontSize="10"
                >
                  {d.label.slice(0, 3)}
                </text>
                {isHov && (
                  <g transform={`translate(${cx > 540 ? cx - 90 : cx + 10}, ${cy - 35})`}>
                    <rect
                      x="0"
                      y="0"
                      width="90"
                      height={secondaryMetricLabel ? '46' : '32'}
                      rx="6"
                      fill="#1e293b"
                      stroke="#334155"
                      strokeWidth="1"
                    />
                    <text x="8" y="14" fill="#94a3b8" fontSize="9" fontWeight="600">
                      {d.label}
                    </text>
                    <text x="8" y="26" fill="#ffffff" fontSize="10" fontWeight="bold">
                      {metricLabel}: {d.value} {unit}
                    </text>
                    {secondaryMetricLabel && (
                      <text x="8" y="39" fill={secondaryColor} fontSize="9">
                        {secondaryMetricLabel}: {d.secondaryValue}
                      </text>
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

interface DonutChartProps {
  title: string;
  subtitle?: string;
  segments: { label: string; value: number; color: string }[];
  centerLabel?: string;
}

export const DonutChart: React.FC<DonutChartProps> = ({ title, subtitle, segments, centerLabel }) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const circumference = 2 * Math.PI * 87;
  let cumulative = 0;

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col justify-between">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-auto py-2">
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            <circle cx={100} cy={100} r={87} stroke="#f1f5f9" strokeWidth={26} fill="transparent" />
            {total === 0 ? (
              <circle cx={100} cy={100} r={87} stroke="#e2e8f0" strokeWidth={26} fill="transparent" />
            ) : (
              segments.map((seg, i) => {
                const ratio = seg.value / total;
                const dashArray = `${circumference * ratio} ${circumference * (1 - ratio)}`;
                const dashOffset = -circumference * cumulative;
                cumulative += ratio;
                const isHov = hoveredIdx === i;
                return (
                  <circle
                    key={i}
                    cx={100}
                    cy={100}
                    r={87}
                    stroke={seg.color}
                    strokeWidth={isHov ? 30 : 26}
                    strokeDasharray={dashArray}
                    strokeDashoffset={dashOffset}
                    fill="transparent"
                    className="transition-all duration-200 cursor-pointer"
                    onMouseEnter={() => setHoveredIdx(i)}
                    onMouseLeave={() => setHoveredIdx(null)}
                  />
                );
              })
            )}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-black font-mono text-slate-900">
              {hoveredIdx === null ? total : segments[hoveredIdx].value}
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              {hoveredIdx === null ? centerLabel || 'Total' : segments[hoveredIdx].label.split(' ')[0]}
            </span>
          </div>
        </div>

        <div className="space-y-2 text-xs w-full sm:w-auto">
          {segments.map((seg, i) => {
            const pct = total > 0 ? ((seg.value / total) * 100).toFixed(1) : 0;
            return (
              <div
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className={`flex items-center justify-between sm:justify-start gap-3 p-1.5 rounded-lg cursor-pointer transition-colors ${
                  hoveredIdx === i ? 'bg-slate-100 font-semibold text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: seg.color }} />
                  <span className="truncate max-w-[140px] text-slate-800">{seg.label}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-slate-900 mr-1.5">{seg.value}</span>
                  <span className="text-[11px] text-slate-500">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

interface HorizontalBarChartProps {
  title: string;
  subtitle?: string;
  groups: { category: string; primaryValue: number; secondaryValue?: number }[];
  primaryLabel: string;
  secondaryLabel?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export const HorizontalBarChart: React.FC<HorizontalBarChartProps> = ({
  title,
  subtitle,
  groups,
  primaryLabel,
  secondaryLabel,
  primaryColor = '#3A4EFB',
  secondaryColor = '#33A4FA',
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const maxVal = Math.max(...groups.flatMap((g) => [g.primaryValue, g.secondaryValue ?? 0]), 10);

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center space-x-3 text-xs text-slate-600">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: primaryColor }} />
            <span className="font-medium">{primaryLabel}</span>
          </div>
          {secondaryLabel && (
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: secondaryColor }} />
              <span className="font-medium">{secondaryLabel}</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3.5">
        {groups.map((g, i) => {
          const isHov = hoveredIdx === i;
          const pPct = (g.primaryValue / maxVal) * 100;
          const sPct = g.secondaryValue === undefined ? 0 : (g.secondaryValue / maxVal) * 100;
          return (
            <div
              key={i}
              className={`p-2.5 rounded-lg transition-colors ${isHov ? 'bg-slate-50' : ''}`}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold text-slate-800">{g.category}</span>
                <div className="flex items-center space-x-2 font-mono">
                  <span className="text-[#3A4EFB] font-bold">{g.primaryValue}</span>
                  {g.secondaryValue !== undefined && (
                    <>
                      <span className="text-slate-300">/</span>
                      <span className="text-[#33A4FA] font-bold">{g.secondaryValue}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(pPct, 2)}%`, backgroundColor: primaryColor }}
                  />
                </div>
                {g.secondaryValue !== undefined && (
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.max(sPct, 2)}%`, backgroundColor: secondaryColor }}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

interface ComboBarLineChartProps {
  title: string;
  subtitle?: string;
  categories: string[];
  barSeries?: { name: string; data: number[]; color: string; unit?: string }[];
  lineSeries?: { name: string; data: number[]; color: string; unit?: string; dashArray?: string }[];
  height?: number;
}

export const ComboBarLineChart: React.FC<ComboBarLineChartProps> = ({
  title,
  subtitle,
  categories,
  barSeries = [],
  lineSeries = [],
  height = 280,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const pad = { top: 30, right: 35, bottom: 40, left: 50 };
  const w = 680 - pad.left - pad.right;
  const h = height - pad.top - pad.bottom;

  const allBars = barSeries.flatMap((s) => s.data);
  const allLines = lineSeries.flatMap((s) => s.data);
  const maxVal = Math.ceil(Math.max(Math.max(...allBars, 0), Math.max(...allLines, 0), 10) * 1.15);

  const getX = (idx: number) => {
    const step = w / categories.length;
    return pad.left + idx * step + step / 2;
  };
  const getY = (val: number) => pad.top + h - (val / maxVal) * h;

  const catStep = w / categories.length;
  const numBars = barSeries.length;
  const barWidth = Math.min(22, (catStep * 0.65) / (numBars || 1));
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((t) => Math.round(maxVal * t));

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs transition-all">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">{title}</h3>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
          {barSeries.map((s, i) => (
            <div key={`b-${i}`} className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-xs" style={{ backgroundColor: s.color }} />
              <span className="font-medium text-slate-700">{s.name} (Batang)</span>
            </div>
          ))}
          {lineSeries.map((s, i) => (
            <div key={`l-${i}`} className="flex items-center space-x-1.5">
              <span className="w-4 h-1 rounded-full" style={{ backgroundColor: s.color }} />
              <span className="w-2 h-2 rounded-full border border-white" style={{ backgroundColor: s.color }} />
              <span className="font-medium text-slate-700">{s.name} (Garis)</span>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 680 ${height}`} className="w-full h-auto min-w-[540px]" preserveAspectRatio="none">
          {yTicks.map((tick, i) => {
            const y = getY(tick);
            return (
              <g key={i}>
                <line x1={pad.left} y1={y} x2={680 - pad.right} y2={y} stroke="#f1f5f9" strokeDasharray="4 4" />
                <text
                  x={pad.left - 8}
                  y={y + 4}
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="end"
                  fontFamily="sans-serif"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {categories.map((_, idx) => {
            const cx = getX(idx);
            const startX = cx - (numBars * barWidth) / 2;
            return (
              <g key={`cat-${idx}`}>
                {barSeries.map((s, bIdx) => {
                  const val = s.data[idx] ?? 0;
                  const bx = startX + bIdx * barWidth + 1;
                  const by = getY(val);
                  const bh = pad.top + h - by;
                  return (
                    <rect
                      key={`bar-${idx}-${bIdx}`}
                      x={bx}
                      y={by}
                      width={Math.max(1, barWidth - 2)}
                      height={Math.max(0, bh)}
                      fill={s.color}
                      rx="2"
                      className="transition-all duration-300 opacity-90 hover:opacity-100"
                    />
                  );
                })}
                <rect
                  x={cx - catStep / 2}
                  y={pad.top}
                  width={catStep}
                  height={h}
                  fill={hoveredIdx === idx ? 'rgba(58, 78, 251, 0.04)' : 'transparent'}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              </g>
            );
          })}

          {lineSeries.map((s, lIdx) => {
            const pts = categories.map((_, idx) => `${getX(idx)},${getY(s.data[idx] ?? 0)}`).join(' ');
            return (
              <g key={`line-group-${lIdx}`}>
                <polyline
                  points={pts}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={s.dashArray}
                />
                {categories.map((_, idx) => {
                  const cx = getX(idx);
                  const val = s.data[idx] ?? 0;
                  const cy = getY(val);
                  return (
                    <circle
                      key={`pt-${lIdx}-${idx}`}
                      cx={cx}
                      cy={cy}
                      r={hoveredIdx === idx ? 5.5 : 3.5}
                      fill="#ffffff"
                      stroke={s.color}
                      strokeWidth="2.5"
                      className="transition-all duration-150 pointer-events-none"
                    />
                  );
                })}
              </g>
            );
          })}

          {categories.map((cat, idx) => (
            <text
              key={`xlabel-${idx}`}
              x={getX(idx)}
              y={height - pad.bottom + 18}
              fill={hoveredIdx === idx ? '#3A4EFB' : '#64748b'}
              fontWeight={hoveredIdx === idx ? '700' : '500'}
              fontSize="10"
              textAnchor="middle"
              fontFamily="sans-serif"
            >
              {cat}
            </text>
          ))}
        </svg>
      </div>

      {hoveredIdx !== null && (
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in duration-100">
          <div className="font-bold text-slate-900">{categories[hoveredIdx]}</div>
          <div className="flex flex-wrap items-center gap-4">
            {barSeries.map((s, i) => (
              <div key={`tip-b-${i}`} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600">{s.name}:</span>
                <span className="font-mono font-bold text-slate-900">
                  {s.data[hoveredIdx] ?? 0} {s.unit || ''}
                </span>
              </div>
            ))}
            {lineSeries.map((s, i) => (
              <div key={`tip-l-${i}`} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="text-slate-600">{s.name}:</span>
                <span className="font-mono font-bold text-slate-900">
                  {s.data[hoveredIdx] ?? 0} {s.unit || ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface DataTableProps {
  type: 'tikus' | 'nyamuk' | 'lalat';
  data: (TikusRecord | NyamukRecord | LalatRecord)[];
  onEdit?: (record: any) => void;
  onDelete?: (record: any) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ type, data, onEdit, onDelete }) => {
  const { isAdmin, exportToCsv } = useSurveillance();
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState<'tanggal' | 'wilayahKerja'>('tanggal');
  const [sortAsc, setSortAsc] = useState(false);

  const sortedData = useMemo(() => {
    let list = [...data];
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter((item: any) =>
        type === 'tikus'
          ? item.lokasi.toLowerCase().includes(q) ||
            item.wilayahKerja.toLowerCase().includes(q) ||
            item.jenisTikus?.toLowerCase().includes(q) ||
            item.bangunan?.toLowerCase().includes(q) ||
            (item.keterangan && item.keterangan.toLowerCase().includes(q))
          : type === 'nyamuk'
            ? item.wilayahKerja.toLowerCase().includes(q) ||
              item.zonasi?.toLowerCase().includes(q) ||
              item.musim?.toLowerCase().includes(q) ||
              (item.keterangan && item.keterangan.toLowerCase().includes(q))
            : item.titikLokasi?.toLowerCase().includes(q) ||
              item.jenisLalat?.toLowerCase().includes(q) ||
              item.statusIntervensi?.toLowerCase().includes(q) ||
              (item.keterangan && item.keterangan.toLowerCase().includes(q))
      );
    }

    list.sort((a: any, b: any) => {
      let va = sortField === 'wilayahKerja' && type === 'lalat' ? a.titikLokasi : a[sortField];
      let vb = sortField === 'wilayahKerja' && type === 'lalat' ? b.titikLokasi : b[sortField];
      if (typeof va === 'string') {
        va = va.toLowerCase();
        vb = (vb || '').toLowerCase();
      }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });

    return list;
  }, [data, searchTerm, sortField, sortAsc, type]);

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginated = sortedData.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (field: 'tanggal' | 'wilayahKerja') => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-xs text-slate-800">
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#3A4EFB]/10 flex items-center justify-center text-[#3A4EFB]">
            <FileSpreadsheet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {type === 'tikus'
                ? 'Tabel Data Surveilans Tikus & Pinjal'
                : type === 'nyamuk'
                  ? 'Tabel Data Surveilans Nyamuk Aedes'
                  : 'Tabel Data Surveilans Indeks Lalat'}
            </h3>
            <span className="text-xs text-slate-500">Menampilkan {sortedData.length} baris data tersaring</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative">
            <input
              type="text"
              placeholder={
                type === 'tikus'
                  ? 'Cari lokasi, wilayah, atau catatan...'
                  : type === 'nyamuk'
                    ? 'Cari wilayah kerja, zona, musim, atau catatan...'
                    : 'Cari titik pelabuhan/bandara atau keterangan...'
              }
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-48 sm:w-64 bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#3A4EFB] focus:ring-1 focus:ring-[#3A4EFB]"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
          </div>
          <button
            onClick={() => exportToCsv(type)}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#3A4EFB] hover:bg-[#33A4FA] text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            title="Ekspor data ke format CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600 border-b border-slate-200">
            {type === 'tikus' ? (
              <tr>
                <th
                  className="px-4 py-3 cursor-pointer hover:text-slate-900"
                  onClick={() => toggleSort('tanggal')}
                >
                  <div className="flex items-center gap-1">
                    <span>Rentang Tanggal Perangkap</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 cursor-pointer hover:text-slate-900"
                  onClick={() => toggleSort('wilayahKerja')}
                >
                  <div className="flex items-center gap-1">
                    <span>Wilayah Kerja</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3">Lokasi</th>
                <th className="px-4 py-3">Bangunan</th>
                <th className="px-4 py-3">Jenis Tikus</th>
                <th className="px-4 py-3 text-right">Perangkap</th>
                <th className="px-4 py-3 text-right">Hasil Tangkapan</th>
                <th className="px-4 py-3 text-right">Trap Success</th>
                <th className="px-4 py-3 text-center">Pinjal</th>
                {isAdmin && <th className="px-4 py-3 text-center">Aksi Admin</th>}
              </tr>
            ) : type === 'nyamuk' ? (
              <tr>
                <th
                  className="px-4 py-3 cursor-pointer hover:text-slate-900"
                  onClick={() => toggleSort('tanggal')}
                >
                  <div className="flex items-center gap-1">
                    <span>Tanggal Surveilans</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 cursor-pointer hover:text-slate-900"
                  onClick={() => toggleSort('wilayahKerja')}
                >
                  <div className="flex items-center gap-1">
                    <span>Wilayah Kerja & Zona</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3 text-right">Jumlah Bangunan Diperiksa</th>
                <th className="px-4 py-3 text-right">Jumlah Container Diperiksa</th>
                <th className="px-4 py-3 text-right">Jumlah Bangunan (+)</th>
                <th className="px-4 py-3 text-right">Container (+)</th>
                <th className="px-4 py-3 text-right">House Index (HI)</th>
                <th className="px-4 py-3 text-right">Container Index (CI)</th>
                <th className="px-4 py-3 text-right">Breteau Index (BI)</th>
                <th className="px-4 py-3 text-right">ABJ (%)</th>
                <th className="px-4 py-3 text-right">Suhu (°C)</th>
                <th className="px-4 py-3 text-right">Kelembaban (%)</th>
                <th className="px-4 py-3">Musim</th>
                {isAdmin && <th className="px-4 py-3 text-center">Aksi Admin</th>}
              </tr>
            ) : (
              <tr>
                <th
                  className="px-4 py-3 cursor-pointer hover:text-slate-900"
                  onClick={() => toggleSort('tanggal')}
                >
                  <div className="flex items-center gap-1">
                    <span>Tanggal</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  className="px-4 py-3 cursor-pointer hover:text-slate-900"
                  onClick={() => toggleSort('wilayahKerja')}
                >
                  <div className="flex items-center gap-1">
                    <span>Titik Pelabuhan atau Bandara</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="px-4 py-3">Jenis Lalat</th>
                <th className="px-4 py-3 text-right">Indeks Lalat</th>
                <th className="px-4 py-3">Keterangan Hasil Indeks (Perlu Intervensi / Tidak)</th>
                {isAdmin && <th className="px-4 py-3 text-center">Aksi Admin</th>}
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 15 : 14} className="px-4 py-10 text-center text-slate-400">
                  Tidak ada data surveilans yang cocok dengan kriteria filter saat ini.
                </td>
              </tr>
            ) : (
              paginated.map((item: any) => {
                const dateLabel =
                  item.start_date && item.end_date && item.start_date !== item.end_date
                    ? `${item.start_date} s/d ${item.end_date}`
                    : item.start_date || item.tanggal;

                if (type === 'tikus') {
                  const e = item as TikusRecord;
                  const hasPinjal = (e.jumlahPinjal || 0) > 0 || e.statusPinjal === 'Pinjal';
                  return (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#3A4EFB]" />
                          <span>{dateLabel}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="font-semibold text-slate-900 block truncate max-w-[170px]"
                          title={e.wilayahKerja}
                        >
                          {e.wilayahKerja}
                        </span>
                        <span className="text-[10px] text-slate-500">{e.zonasi}</span>
                      </td>
                      <td className="px-4 py-3 max-w-[140px] truncate" title={e.lokasi}>
                        {e.lokasi}
                      </td>
                      <td className="px-4 py-3 max-w-[130px] truncate text-slate-600" title={e.bangunan}>
                        {e.bangunan || '-'}
                      </td>
                      <td className="px-4 py-3 italic font-serif text-slate-900">{e.jenisTikus}</td>
                      <td className="px-4 py-3 text-right font-mono">{e.jumlahPerangkap}</td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        {e.jumlahTikusTertangkap === 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            0 (Tidak Ditemukan)
                          </span>
                        ) : (
                          <span className="font-mono font-bold text-[#3A4EFB]">{e.jumlahTikusTertangkap} ekor</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold font-mono ${
                            e.trapSuccess <= 1
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {e.trapSuccess.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {hasPinjal ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#3A4EFB]/10 text-[#3A4EFB] border border-[#3A4EFB]/20">
                            Pinjal (+{e.jumlahPinjal || 1})
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500">
                            Nihil
                          </span>
                        )}
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1.5">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(e)}
                                className="p-1 rounded text-slate-500 hover:text-[#3A4EFB] hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Edit catatan"
                              >
                                <PenLine className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(e)}
                                className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Hapus catatan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                } else if (type === 'nyamuk') {
                  const e = item as NyamukRecord;
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
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#3A4EFB]" />
                          <span>{e.tanggal}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className="font-semibold text-slate-900 block truncate max-w-[170px]"
                          title={e.wilayahKerja}
                        >
                          {e.wilayahKerja}
                        </span>
                        <span
                          className={`inline-block text-[10px] px-1.5 py-0.2 rounded font-medium ${
                            e.zonasi === 'Perimeter' ? 'bg-indigo-50 text-indigo-700' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          Zona {e.zonasi}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800">
                        {bDip}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-semibold text-slate-800">
                        {cDip}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-rose-600">
                        {bPos}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-rose-600">
                        {cPos}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#3A4EFB]">
                        {hiVal}%
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#33A4FA]">
                        {ciVal}%
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-amber-600">
                        {biVal}
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                            abjVal >= 95
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}
                        >
                          {abjVal}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap font-mono text-xs font-semibold text-slate-800">
                        {e.suhu ?? 29.5}°C
                      </td>
                      <td className="px-4 py-3 text-right whitespace-nowrap font-mono text-xs font-semibold text-slate-800">
                        {e.kelembapan ?? 78}%
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
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
                        <span className="block text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                          {e.perilakuMasyarakat || '3M'}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1.5">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(e)}
                                className="p-1 rounded text-slate-500 hover:text-[#3A4EFB] hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Edit catatan"
                              >
                                <PenLine className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(e)}
                                className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Hapus catatan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                } else {
                  const e = item as LalatRecord;
                  const perluIntervensi =
                    e.statusIntervensi === 'Perlu Intervensi' || e.indeksLalat > 2;
                  return (
                    <tr key={e.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap font-mono text-[11px] text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-[#3A4EFB]" />
                          <span>{e.tanggal}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="font-semibold text-slate-900">{e.titikLokasi}</span>
                      </td>
                      <td className="px-4 py-3 italic font-serif text-slate-900 whitespace-nowrap">
                        {e.jenisLalat || 'Musca domestica'}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-sm text-[#3A4EFB]">
                        {e.indeksLalat}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                              perluIntervensi
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}
                          >
                            {perluIntervensi ? 'Perlu Intervensi' : 'Tidak Perlu Intervensi'}
                          </span>
                          {e.keterangan && (
                            <span className="text-xs text-slate-600">{e.keterangan}</span>
                          )}
                        </div>
                      </td>
                      {isAdmin && (
                        <td className="px-4 py-3 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center space-x-1.5">
                            {onEdit && (
                              <button
                                onClick={() => onEdit(e)}
                                className="p-1 rounded text-slate-500 hover:text-[#3A4EFB] hover:bg-slate-100 transition-colors cursor-pointer"
                                title="Edit catatan"
                              >
                                <PenLine className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {onDelete && (
                              <button
                                onClick={() => onDelete(e)}
                                className="p-1 rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                                title="Hapus catatan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                }
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 bg-slate-50">
        <div className="flex items-center space-x-2">
          <span>Tampilkan:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="bg-white border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:border-[#3A4EFB]"
          >
            <option value={5}>5 baris</option>
            <option value={10}>10 baris</option>
            <option value={25}>25 baris</option>
            <option value={50}>50 baris</option>
          </select>
          <span>dari {sortedData.length} entri</span>
        </div>

        <div className="flex items-center space-x-2">
          <span>
            Halaman {page} dari {totalPages}
          </span>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
