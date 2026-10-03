import React, { useState } from 'react';
import type { SolarPumpAsset } from '../../types/asset';
import { DistinctionBadge } from '../common/Badge';
import { formatINR } from '../../services/VerificationEngine';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { FadeIn, StaggerContainer, StaggerItem, MetricReveal, DataPulse } from '../motion/MotionSystem';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Search,
  Plus,
  MapPin,
  Zap,
  Activity,
  ChevronRight,
  Globe2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';
import { ReliableImage } from '../common/ReliableImage';
import { PortfolioFunnelSimulation } from './PortfolioFunnelSimulation';
import { ResponsibleVerificationPanel } from './ResponsibleVerificationPanel';
import { IntelligenceArchitecturePanel } from './IntelligenceArchitecturePanel';

interface CommandCenterProps {
  assets: SolarPumpAsset[];
  onSelectAsset: (assetId: string) => void;
  onOpenRegister: () => void;
}

const createMapPinIcon = (status: string, isLight: boolean) => {
  const color =
    status === 'ANOMALY'
      ? isLight ? '#c05638' : '#f43f5e'
      : status === 'PARTIAL'
      ? isLight ? '#c07a10' : '#f59e0b'
      : isLight ? '#235327' : '#10b981';

  return L.divIcon({
    className: 'custom-portfolio-marker',
    html: `
      <div style="
        background: ${color};
        width: 14px;
        height: 14px;
        border-radius: 50%;
        border: 2px solid ${isLight ? '#ffffff' : '#070a0e'};
        box-shadow: 0 0 10px ${color};
      "></div>
    `,
    iconSize: [14, 14],
    iconAnchor: [7, 7]
  });
};

export const CommandCenter: React.FC<CommandCenterProps> = ({
  assets,
  onSelectAsset,
  onOpenRegister
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'PARTIAL' | 'ANOMALY'>('ALL');
  const [sortBy] = useState<'score' | 'id' | 'borrower'>('score');
  const { metrics } = usePortfolio();

  const highConfidencePct = ((metrics.highConfidence / metrics.totalAssets) * 100).toFixed(1);
  const requireReviewPct = ((metrics.requireReview / metrics.totalAssets) * 100).toFixed(1);
  const anomaliesFlaggedPct = ((metrics.anomaliesFlagged / metrics.totalAssets) * 100).toFixed(1);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      asset.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.registeredLocation.district.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.pumpManufacturer.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || asset.verificationStatus === statusFilter;

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'score') return b.trustScore - a.trustScore;
    if (sortBy === 'borrower') return a.borrowerName.localeCompare(b.borrowerName);
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Operations Room Header */}
      <FadeIn delay={0.05}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                Climate Asset Operations Center
              </h1>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 uppercase tracking-wider font-mono">
                ILLUSTRATIVE PORTFOLIO SIMULATION • {metrics.totalAssets} SAMPLE ASSETS
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Operational decision-support, geospatial verification, and risk-stratified audit triage for rural solar pumps.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={onOpenRegister}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-2 transition shadow-md border border-emerald-400/20"
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              <span>Register New Pump</span>
            </motion.button>
          </div>
        </div>
      </FadeIn>

      {/* Portfolio Metric Cards with Spatial Hierarchy */}
      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.08} initialDelay={0.1}>
        {/* 1. Primary Hero: Assets Monitored */}
        <StaggerItem>
          <MetricReveal delay={0.05}>
            <div className={`p-5 rounded-2xl border transition relative overflow-hidden group ${
              isLight
                ? 'bg-[#edf7ef] border-[#d2e8d7] shadow-sm'
                : 'bg-[#0f1726]/80 border-slate-800 hover:border-slate-700'
            }`}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Zap className="w-4 h-4 text-emerald-500" />
                </div>
                <span className="text-[11px] font-bold text-slate-400">Sample Units</span>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  <AnimatedNumber value={metrics.totalAssets} duration={1.2} />
                </span>
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Sample Assets Monitored
              </div>
            </div>
          </MetricReveal>
        </StaggerItem>

        {/* 2. High Confidence (Verified) */}
        <StaggerItem>
          <MetricReveal delay={0.1}>
            <div className={`p-5 rounded-2xl border transition relative overflow-hidden group ${
              isLight
                ? 'bg-[#edf7fc] border-[#cfe6f5] shadow-sm'
                : 'bg-[#0f1726]/80 border-cyan-500/20 hover:border-cyan-500/40'
            }`}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-500/20">
                  <ShieldCheck className="w-4 h-4 text-sky-500" />
                </div>
                <span className="text-[11px] font-bold text-sky-600 dark:text-sky-400">{highConfidencePct}%</span>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  <AnimatedNumber value={metrics.highConfidence} duration={1.2} />
                </span>
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Digital-Clearance Candidates
              </div>
            </div>
          </MetricReveal>
        </StaggerItem>

        {/* 3. Under Review */}
        <StaggerItem>
          <MetricReveal delay={0.15}>
            <div className={`p-5 rounded-2xl border transition relative overflow-hidden group ${
              isLight
                ? 'bg-[#fdf7ea] border-[#f7e5c3] shadow-sm'
                : 'bg-[#0f1726]/80 border-amber-500/20 hover:border-amber-500/40'
            }`}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
                  <FileCheck className="w-4 h-4 text-amber-500" />
                </div>
                <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">{requireReviewPct}%</span>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  <AnimatedNumber value={metrics.requireReview} duration={1.2} />
                </span>
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Evidence Refresh Cases
              </div>
            </div>
          </MetricReveal>
        </StaggerItem>

        {/* 4. Anomalies Flagged */}
        <StaggerItem>
          <MetricReveal delay={0.2}>
            <div className={`p-5 rounded-2xl border transition relative overflow-hidden group ${
              isLight
                ? 'bg-[#fcf0f0] border-[#f6d3d3] shadow-sm'
                : 'bg-[#0f1726]/80 border-rose-500/20 hover:border-rose-500/40'
            }`}>
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-500/20 relative">
                  <AlertTriangle className="w-4 h-4 text-rose-500" />
                  <DataPulse color="#f43f5e" size={6} className="absolute -top-0.5 -right-0.5" />
                </div>
                <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400">{anomaliesFlaggedPct}%</span>
              </div>
              <div className="mt-3">
                <span className="text-3xl font-black text-slate-900 dark:text-white font-mono">
                  <AnimatedNumber value={metrics.anomaliesFlagged} duration={1.2} />
                </span>
              </div>
              <div className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                Exception Cases Flagged
              </div>
            </div>
          </MetricReveal>
        </StaggerItem>
      </StaggerContainer>

      {/* Illustrative Portfolio Scale & Funnel Simulation */}
      <FadeIn delay={0.22}>
        <PortfolioFunnelSimulation />
      </FadeIn>

      {/* Spatial Operations Intelligence: Map + Verification States Breakdown */}
      <FadeIn delay={0.25}>
        <div className={`p-6 rounded-3xl border space-y-4 transition ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'glass-panel border-slate-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 font-display">
                <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Regional Asset Distribution & Verification Clusters
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Geospatial distribution across rural farming belts with live verification confidence.
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className={`w-2.5 h-2.5 rounded-full ${isLight ? 'bg-[#235327]' : 'bg-[#10b981]'}`} /> Verified
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className={`w-2.5 h-2.5 rounded-full ${isLight ? 'bg-[#c07a10]' : 'bg-[#f59e0b]'}`} /> Review
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className={`w-2.5 h-2.5 rounded-full ${isLight ? 'bg-[#c05638]' : 'bg-[#f43f5e]'}`} /> Anomaly
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Interactive Portfolio Map with Overlay Dossier Card and Legend */}
            <div className={`lg:col-span-8 h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative z-10 ${
              isLight ? 'light-map' : 'dark-map'
            }`}>
              <MapContainer
                center={[26.4421, 92.0345]}
                zoom={8}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {assets.map((asset) => (
                  <Marker
                    key={asset.id}
                    position={[asset.registeredLocation.lat, asset.registeredLocation.lng]}
                    icon={createMapPinIcon(asset.verificationStatus, isLight)}
                    eventHandlers={{
                      click: () => onSelectAsset(asset.id)
                    }}
                  >
                    <Popup>
                      <div className="text-xs space-y-1">
                        <strong className="text-slate-900">{asset.id}</strong>
                        <div>{asset.borrowerName} • {asset.pumpCapacityHp} HP</div>
                        <div className="font-bold text-emerald-600">Verification Confidence: {asset.trustScore}/100</div>
                        <div className="text-[10px] text-slate-500">{asset.registeredLocation.village}, {asset.registeredLocation.district}</div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Floating Assam Regional Focus Dossier Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[400] pointer-events-auto">
                <div className={`p-2.5 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center gap-3 transition-all hover:scale-105 ${
                  isLight
                    ? 'bg-white/95 border-[#e2dcce] text-[#18221b]'
                    : 'bg-[#0b1320]/90 border-white/10 text-white'
                }`}>
                  <div className="w-16 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-300 dark:border-slate-700">
                    <ReliableImage
                      src={isLight ? '/assets/hero_light.jpg' : '/assets/hero_dark.jpg'}
                      alt="Assam Solar Assets"
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                      badgeLabel="REGIONAL CLUSTER"
                      fallbackTitle="Regional Asset Cluster"
                      fallbackSubtitle="Active cluster telemetry"
                    />
                  </div>
                  <div className="pr-2">
                    <div className="text-xs font-bold font-display">Assam Regional Cluster</div>
                    <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      342 assets
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      92% operational
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Legend (Bottom Left - Matching Reference Image) */}
              <div className={`absolute bottom-3 left-3 z-[400] p-2.5 rounded-xl border backdrop-blur-md text-[11px] space-y-1 shadow-lg ${
                isLight
                  ? 'bg-white/90 border-[#e3dcd0] text-[#18221b]'
                  : 'bg-[#090e17]/85 border-white/10 text-slate-200'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]" />
                  <span>Operational</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]" />
                  <span>Require Review</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]" />
                  <span>Anomaly</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                  <span>Inspection Scheduled</span>
                </div>
              </div>
            </div>

            {/* Live Weather & Performance Panel (Right Side - Matching Reference Image) */}
            <div className={`lg:col-span-4 p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition ${
              isLight
                ? 'bg-white border-slate-200 shadow-sm'
                : 'glass-panel border-slate-800'
            }`}>
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2 font-display">
                    <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    PROTOTYPE CLIMATE & PERFORMANCE
                  </h3>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-500/10">
                    PROTOTYPE PORTFOLIO FEED
                  </span>
                </div>

                {/* India Regional Heat Map Visual Representation */}
                <div className="my-4 relative h-36 rounded-xl overflow-hidden flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-emerald-500/5 via-sky-500/5 to-amber-500/5">
                  <svg className="w-32 h-32 opacity-80" viewBox="0 0 100 100" fill="none">
                    <path
                      d="M45 10 C50 15, 60 15, 65 20 C70 25, 75 35, 70 45 C65 55, 75 65, 70 75 C65 85, 55 90, 50 95 C45 90, 35 85, 30 75 C25 65, 30 55, 35 45 C40 35, 35 25, 40 20 Z"
                      fill={isLight ? 'url(#grad-light)' : 'url(#grad-dark)'}
                      stroke={isLight ? '#1b7340' : '#10b981'}
                      strokeWidth="1.5"
                    />
                    <defs>
                      <linearGradient id="grad-dark" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" stopOpacity="0.6" />
                        <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
                      </linearGradient>
                      <linearGradient id="grad-light" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#86efac" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#fde047" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 bg-white/70 dark:bg-slate-900/70 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                      SIMULATED TELEMETRY GRID
                    </span>
                  </div>
                </div>

                {/* Weather Breakdown Stats (Matching Reference Image) */}
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">High Solar</span>
                    </div>
                    <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">1,028 assets</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Partial Cloud</span>
                    </div>
                    <span className="font-mono font-bold text-amber-600 dark:text-amber-400">188 assets</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
                      <span className="font-semibold text-slate-800 dark:text-slate-200">Rainy</span>
                    </div>
                    <span className="font-mono font-bold text-cyan-600 dark:text-cyan-400">75 assets</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span>SIMULATED METEOROLOGICAL FEED</span>
                <span className="text-emerald-500 font-mono">● PROTOTYPE</span>
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Asset Portfolio Table */}
      <FadeIn delay={0.35}>
        <div className={`rounded-3xl border overflow-hidden transition ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'glass-panel border-slate-800'
        }`}>
          {/* Table Search & Filters */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search Asset ID, Borrower, District..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
              {(['ALL', 'VERIFIED', 'PARTIAL', 'ANOMALY'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    statusFilter === filter
                      ? 'bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {filter === 'ALL' ? 'All Units' : filter === 'PARTIAL' ? 'Require Review' : filter.charAt(0) + filter.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Table Data */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 sm:px-6">Asset ID & Borrower</th>
                  <th className="py-3.5 px-4">Location</th>
                  <th className="py-3.5 px-4">Pump Specs</th>
                  <th className="py-3.5 px-4">Verification</th>
                  <th className="py-3.5 px-4">Performance</th>
                  <th className="py-3.5 px-4 text-center">Verification Confidence</th>
                  <th className="py-3.5 px-4 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-slate-800/60 text-xs">
                {filteredAssets.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => onSelectAsset(asset.id)}
                    className="hover:bg-slate-50/90 dark:hover:bg-slate-800/40 cursor-pointer transition group"
                  >
                    <td className="py-4 px-4 sm:px-6">
                      <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition flex items-center gap-1.5 font-mono">
                        <DataPulse
                          color={asset.verificationStatus === 'ANOMALY' ? '#f43f5e' : asset.verificationStatus === 'PARTIAL' ? '#f59e0b' : '#10b981'}
                          size={6}
                        />
                        {asset.id}
                      </div>
                      <div className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                        {asset.borrowerName} • {formatINR(asset.loanAmount)}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {asset.registeredLocation.district}, {asset.registeredLocation.state}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {asset.registeredLocation.village} (Offset: {asset.gpsOffsetMeters}m)
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="text-slate-800 dark:text-slate-200 font-medium">{asset.pumpCapacityHp} HP {asset.pumpManufacturer}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">{asset.solarCapacityKwp} kWp Solar Panel</div>
                    </td>

                    <td className="py-4 px-4">
                      <DistinctionBadge type={asset.verificationStatus} />
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1.5 font-mono font-bold">
                        <Activity className={`w-3.5 h-3.5 ${asset.performance.differencePercent < -30 ? 'text-rose-500' : 'text-emerald-500'}`} />
                        <span className={asset.performance.differencePercent < -30 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-800 dark:text-slate-200'}>
                          {asset.performance.reportedKwhPerDay} / {asset.performance.expectedKwhPerDay} kWh
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400">
                        Dev: {asset.performance.differencePercent > 0 ? `+${asset.performance.differencePercent}%` : `${asset.performance.differencePercent}%`}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-center">
                      <span className={`inline-flex items-center justify-center px-2.5 py-1 rounded-xl font-mono font-bold text-sm ${
                        asset.trustScore >= 80
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                          : asset.trustScore >= 60
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30'
                          : 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30'
                      }`}>
                        {asset.trustScore}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 text-xs font-semibold transition">
                        View <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>

      {/* Technical Pipeline Visualization */}
      <FadeIn delay={0.3}>
        <IntelligenceArchitecturePanel />
      </FadeIn>

      {/* Responsible Verification & Scope Boundaries */}
      <FadeIn delay={0.35}>
        <ResponsibleVerificationPanel />
      </FadeIn>
    </div>
  );
};
