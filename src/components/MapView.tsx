import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Search, Compass, Layers } from 'lucide-react';
import { useSurveillance } from '../context/SurveillanceContext';

interface MapViewProps {
  heightClass?: string;
  focusWilayah?: string;
  forceVectorLayer?: 'all' | 'tikus' | 'nyamuk';
  showLayerControls?: boolean;
}

export const MapView: React.FC<MapViewProps> = ({
  heightClass = 'h-[500px]',
  focusWilayah,
  forceVectorLayer = 'all',
  showLayerControls = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const { filteredTikus, filteredNyamuk, locations, globalFilter } = useSurveillance();

  const [layers, setLayers] = useState({
    tikusSurveilans: forceVectorLayer !== 'nyamuk',
    nyamukSurveilans: forceVectorLayer !== 'tikus',
    perangkapTikus: forceVectorLayer !== 'nyamuk',
    pencidukanNyamuk: forceVectorLayer !== 'tikus',
    wilkerBkk: true,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const defaultCenter: [number, number] = [-1.3, 116.7];

  useEffect(() => {
    setLayers((prev) => ({
      ...prev,
      tikusSurveilans: forceVectorLayer !== 'nyamuk',
      nyamukSurveilans: forceVectorLayer !== 'tikus',
      perangkapTikus: forceVectorLayer !== 'nyamuk',
      pencidukanNyamuk: forceVectorLayer !== 'tikus',
    }));
  }, [forceVectorLayer]);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 9,
      zoomControl: false,
      attributionControl: true,
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'topright' }).addTo(map);

    const group = L.layerGroup().addTo(map);
    layerGroupRef.current = group;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();
    const bounds = L.latLngBounds([]);

    if (layers.wilkerBkk) {
      locations.forEach((loc) => {
        if (
          (focusWilayah && loc.wilayahKerja !== focusWilayah) ||
          (globalFilter.wilayahKerja !== 'all' && loc.wilayahKerja !== globalFilter.wilayahKerja)
        ) {
          return;
        }

        const icon = L.divIcon({
          html: `
            <div style="background-color: #0f766e; color: white; border-radius: 9999px; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 14px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); border: 2px solid #ffffff;">
              ⚓
            </div>
          `,
          className: 'bkk-wilker-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        });

        const marker = L.marker([loc.latitude, loc.longitude], { icon });
        const popupHtml = `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 200px; color: #0f172a;">
            <div style="font-weight: 700; color: #0f766e; font-size: 13px; margin-bottom: 2px;">
              ${loc.nama}
            </div>
            <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">
              Wilker: <strong>${loc.wilayahKerja}</strong> | ${loc.kategori}
            </div>
            <p style="margin: 0; color: #334155;">${loc.deskripsi}</p>
          </div>
        `;
        marker.bindPopup(popupHtml);
        marker.addTo(group);
        bounds.extend([loc.latitude, loc.longitude]);
      });
    }

    if (layers.tikusSurveilans || layers.perangkapTikus) {
      filteredTikus.forEach((e) => {
        if (focusWilayah && e.wilayahKerja !== focusWilayah) return;

        const html = `
          <div style="background-color: ${
            e.zonasi === 'Perimeter' ? '#d97706' : '#b45309'
          }; color: white; border-radius: 8px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 13px; box-shadow: 0 3px 6px rgba(0,0,0,0.35); border: 2px solid #ffffff;">
            🐀
          </div>
        `;
        const icon = L.divIcon({
          html,
          className: 'tikus-marker',
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          popupAnchor: [0, -13],
        });

        const marker = L.marker([e.latitude, e.longitude], { icon });
        const popupHtml = `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 240px; color: #0f172a;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
              <span style="font-weight: 700; color: #b45309;">🐀 Titik Surveilans Tikus</span>
              <span style="font-size: 10px; background: ${
                e.zonasi === 'Perimeter' ? '#fee2e2; color: #991b1b' : '#e0f2fe; color: #0369a1'
              }; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                ${e.zonasi}
              </span>
            </div>
            <div style="font-weight: 600; color: #0f172a; margin-bottom: 2px;">${e.lokasi}</div>
            <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">Bangunan: ${e.bangunan} | ${
          e.wilayahKerja
        }</div>
            <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 6px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="color: #64748b; padding: 2px 0;">Tanggal:</td>
                <td style="font-weight: 600; text-align: right;">${e.tanggal}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="color: #64748b; padding: 2px 0;">Trap Dipasang:</td>
                <td style="font-weight: 600; text-align: right;">${e.jumlahPerangkap} trap</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="color: #64748b; padding: 2px 0;">Tertangkap:</td>
                <td style="font-weight: 600; text-align: right;">${e.jumlahTikusTertangkap} ekor (${
          e.trapSuccess
        }%)</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="color: #64748b; padding: 2px 0;">Spesies Tikus:</td>
                <td style="font-style: italic; font-weight: 600; text-align: right;">${e.jenisTikus}</td>
              </tr>
              <tr>
                <td style="color: #64748b; padding: 2px 0;">Temuan Pinjal:</td>
                <td style="font-weight: 600; text-align: right;">
                  ${e.statusPinjal || e.jenisPinjal || e.jenisEktoparasit || 'Nihil'}${
          e.jumlahPinjal ? ` (${e.jumlahPinjal} pinjal)` : ''
        }
                </td>
              </tr>
            </table>
            <div style="font-size: 10px; color: #475569; background: #f8fafc; padding: 4px; border-radius: 4px; border: 1px solid #e2e8f0;">
              ${e.keterangan}
            </div>
          </div>
        `;
        marker.bindPopup(popupHtml);
        marker.addTo(group);
        bounds.extend([e.latitude, e.longitude]);
      });
    }

    if (layers.nyamukSurveilans || layers.pencidukanNyamuk) {
      filteredNyamuk.forEach((e) => {
        if (focusWilayah && e.wilayahKerja !== focusWilayah) return;

        const html = `
          <div style="background-color: ${
            e.jumlahHasilPencidukan > 0 ? '#0284c7' : '#0d9488'
          }; color: white; border-radius: 8px; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; font-size: 13px; box-shadow: 0 3px 6px rgba(0,0,0,0.35); border: 2px solid #ffffff;">
            🦟
          </div>
        `;
        const icon = L.divIcon({
          html,
          className: 'nyamuk-marker',
          iconSize: [26, 26],
          iconAnchor: [13, 13],
          popupAnchor: [0, -13],
        });

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

        const marker = L.marker([e.latitude, e.longitude], { icon });
        const popupHtml = `
          <div style="font-family: inherit; font-size: 12px; line-height: 1.4; min-width: 240px; color: #0f172a;">
            <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 6px;">
              <span style="font-weight: 700; color: #0284c7;">🦟 Titik Surveilans Nyamuk Aedes</span>
              <span style="font-size: 10px; background: ${
                e.zonasi === 'Perimeter' ? '#fee2e2; color: #991b1b' : '#e0f2fe; color: #0369a1'
              }; padding: 2px 6px; border-radius: 4px; font-weight: 600;">
                ${e.zonasi}
              </span>
            </div>
            <div style="font-weight: 600; color: #0f172a; margin-bottom: 6px;">Wilker: ${e.wilayahKerja}</div>
            <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 6px;">
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="color: #64748b; padding: 2px 0;">Tanggal:</td>
                <td style="font-weight: 600; text-align: right;">${e.tanggal}</td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="color: #64748b; padding: 2px 0;">Bangunan Diperiksa / (+):</td>
                <td style="font-weight: 600; text-align: right;">${bDip} unit / <span style="color: #e11d48;">${bPos} (+)</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="color: #64748b; padding: 2px 0;">Container Diperiksa / (+):</td>
                <td style="font-weight: 600; text-align: right;">${cDip} tpa / <span style="color: #e11d48;">${cPos} (+)</span></td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="color: #64748b; padding: 2px 0;">HI / CI / BI:</td>
                <td style="font-weight: 700; text-align: right; color: #3A4EFB;">
                  HI: ${hiVal}% | CI: ${ciVal}% | BI: ${biVal}
                </td>
              </tr>
              <tr style="border-bottom: 1px solid #f1f5f9;">
                <td style="color: #64748b; padding: 2px 0;">Angka Bebas Jentik:</td>
                <td style="font-weight: 600; text-align: right; color: ${
                  abjVal >= 95 ? '#15803d' : '#b45309'
                };">
                  ${abjVal}%
                </td>
              </tr>
              <tr>
                <td style="color: #64748b; padding: 2px 0;">Lingkungan:</td>
                <td style="font-weight: 600; text-align: right;">
                  ${e.suhu ?? 29.5}°C | ${e.kelembapan ?? 78}% | ${e.musim || 'Penghujan'}
                </td>
              </tr>
            </table>
            <div style="font-size: 10px; color: #475569; background: #f8fafc; padding: 4px; border-radius: 4px; border: 1px solid #e2e8f0;">
              ${e.keterangan}
            </div>
          </div>
        `;
        marker.bindPopup(popupHtml);
        marker.addTo(group);
        bounds.extend([e.latitude, e.longitude]);
      });
    }

    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [filteredTikus, filteredNyamuk, locations, layers, focusWilayah, globalFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;
    const q = searchQuery.toLowerCase();

    const locMatch = locations.find(
      (l) => l.nama.toLowerCase().includes(q) || l.wilayahKerja.toLowerCase().includes(q)
    );
    if (locMatch) {
      mapInstanceRef.current.flyTo([locMatch.latitude, locMatch.longitude], 15, { duration: 1.2 });
      return;
    }

    const tikusMatch = filteredTikus.find(
      (t) => t.lokasi.toLowerCase().includes(q) || t.bangunan.toLowerCase().includes(q)
    );
    if (tikusMatch) {
      mapInstanceRef.current.flyTo([tikusMatch.latitude, tikusMatch.longitude], 16, { duration: 1.2 });
      return;
    }

    const nyamukMatch = filteredNyamuk.find((n) => n.lokasi.toLowerCase().includes(q));
    if (nyamukMatch) {
      mapInstanceRef.current.flyTo([nyamukMatch.latitude, nyamukMatch.longitude], 16, { duration: 1.2 });
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-200/90 shadow-sm bg-slate-50">
      <div className="absolute top-3 left-3 z-[1000] flex flex-wrap items-center gap-2 max-w-[calc(100%-60px)]">
        <form onSubmit={handleSearch} className="relative flex items-center">
          <input
            type="text"
            placeholder="Cari pelabuhan, bandara, atau lokasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 sm:w-64 bg-white/95 text-slate-800 placeholder-slate-400 text-xs px-3 py-2 pl-8 rounded-lg border border-slate-300 shadow-md backdrop-blur-md focus:outline-none focus:border-[#3A4EFB]"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5 pointer-events-none" />
        </form>
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo(defaultCenter, 9, { duration: 1 });
            }
          }}
          className="p-2 bg-white/95 hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-300 shadow-md backdrop-blur-md transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
          title="Kembali ke tampilan awal Balikpapan"
        >
          <Compass className="w-3.5 h-3.5 text-[#3A4EFB]" />
          <span className="hidden sm:inline">Reset Pusat</span>
        </button>
      </div>

      {showLayerControls && (
        <div className="absolute top-14 left-3 z-[1000] bg-white/95 p-2.5 rounded-lg border border-slate-200 shadow-md backdrop-blur-md text-xs space-y-1.5 max-w-xs text-slate-800">
          <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider flex items-center gap-1 mb-1">
            <Layers className="w-3 h-3 text-[#3A4EFB]" />
            <span>Layer Surveilans</span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 text-[11px]">
              <input
                type="checkbox"
                checked={layers.tikusSurveilans}
                onChange={(e) => setLayers((prev) => ({ ...prev, tikusSurveilans: e.target.checked }))}
                className="rounded border-slate-300 text-[#3A4EFB] focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#3A4EFB]" />
                Titik Tikus
              </span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 text-[11px]">
              <input
                type="checkbox"
                checked={layers.nyamukSurveilans}
                onChange={(e) => setLayers((prev) => ({ ...prev, nyamukSurveilans: e.target.checked }))}
                className="rounded border-slate-300 text-[#33A4FA] focus:ring-0"
              />
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#33A4FA]" />
                Titik Nyamuk
              </span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 text-[11px]">
              <input
                type="checkbox"
                checked={layers.perangkapTikus}
                onChange={(e) => setLayers((prev) => ({ ...prev, perangkapTikus: e.target.checked }))}
                className="rounded border-slate-300 text-[#3A4EFB] focus:ring-0"
              />
              <span className="text-slate-600">Perangkap</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 text-[11px]">
              <input
                type="checkbox"
                checked={layers.pencidukanNyamuk}
                onChange={(e) => setLayers((prev) => ({ ...prev, pencidukanNyamuk: e.target.checked }))}
                className="rounded border-slate-300 text-[#33A4FA] focus:ring-0"
              />
              <span className="text-slate-600">Pencidukan</span>
            </label>
            <label className="flex items-center space-x-1.5 cursor-pointer text-slate-700 text-[11px] col-span-2 pt-1 border-t border-slate-100">
              <input
                type="checkbox"
                checked={layers.wilkerBkk}
                onChange={(e) => setLayers((prev) => ({ ...prev, wilkerBkk: e.target.checked }))}
                className="rounded border-slate-300 text-[#3A4EFB] focus:ring-0"
              />
              <span className="flex items-center gap-1 text-[#3A4EFB] font-medium">
                <span>⚓</span>
                Wilker / Pelabuhan BKK
              </span>
            </label>
          </div>
        </div>
      )}

      <div ref={mapContainerRef} className={`w-full ${heightClass} z-0`} />

      <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 border border-slate-200 px-3 py-1.5 rounded-lg shadow-md backdrop-blur-md text-[11px] text-slate-700 flex flex-wrap items-center gap-3">
        <span className="font-semibold text-slate-900">Legenda:</span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#3A4EFB] border border-white" />
          Wilker BKK
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#33A4FA] border border-white" />
          Perangkap Tikus
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-[#E3FF3B] border border-slate-400" />
          Pencidukan Aedes
        </span>
      </div>
    </div>
  );
};
