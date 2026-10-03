import React, { useState, useEffect, useCallback } from 'react';
import type { SolarPumpAsset } from '../../types/asset';
import { DistinctionBadge } from '../common/Badge';
import { ReliableImage } from '../common/ReliableImage';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  ShieldCheck,
  Loader2,
  X,
  MapPin,
  Camera,
  Cpu,
  Cloud,
  Zap,
  Activity,
  Target,
  Globe2,
  Compass,
  Navigation
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface VerificationModalProps {
  asset: SolarPumpAsset;
  onClose: () => void;
}

interface ScanPhase {
  id: number;
  label: string;
  subtitle: string;
  detail: string;
  icon: React.ReactNode;
  status: 'pending' | 'scanning' | 'completed';
  accentColor: string;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ asset, onClose }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeTab, setActiveTab] = useState<'scan' | 'satellite'>('scan');
  const [satelliteZoomLevel, setSatelliteZoomLevel] = useState<number>(4);

  const createPhases = useCallback((): ScanPhase[] => [
    {
      id: 1,
      label: 'SPATIAL VERIFICATION MODEL',
      subtitle: 'Prototype Spatial Verification & Coordinate Lock',
      detail: `Lat ${asset.registeredLocation.lat.toFixed(4)}° Lng ${asset.registeredLocation.lng.toFixed(4)}° — Ground Offset: ${asset.gpsOffsetMeters}m`,
      icon: <MapPin className="w-4 h-4" />,
      status: 'pending',
      accentColor: 'emerald',
    },
    {
      id: 2,
      label: 'HARDWARE GEOMETRY (CV)',
      subtitle: 'Prototype CV Module: Equipment Identification',
      detail: `${asset.pumpManufacturer} ${asset.pumpModel} — Dual-tilt array geometry matched`,
      icon: <Target className="w-4 h-4" />,
      status: 'pending',
      accentColor: 'cyan',
    },
    {
      id: 3,
      label: 'EQUIPMENT BENCHMARK MATCH',
      subtitle: 'Specification Cross-Reference',
      detail: `${asset.solarCapacityKwp} kWp PV rating | ${asset.pumpCapacityHp} HP pump motor | Serial: ${asset.id}`,
      icon: <Cpu className="w-4 h-4" />,
      status: 'pending',
      accentColor: 'indigo',
    },
    {
      id: 4,
      label: 'PROTOTYPE CV MODULE',
      subtitle: 'Photo & EXIF Metadata Verification',
      detail: `${asset.photos.length} photographic records analyzed — ${asset.evidenceChecklist.evidenceConfidence}% metadata confidence`,
      icon: <Camera className="w-4 h-4" />,
      status: 'pending',
      accentColor: 'violet',
    },
    {
      id: 5,
      label: 'PROTOTYPE CLIMATE-DATA LAYER',
      subtitle: 'Modeled Satellite Solar Irradiance Integration',
      detail: `Irradiance: ${asset.performance.solarIrradianceKwhM2} kWh/m²/day | Cloud: ${asset.performance.cloudCoverPercent}% | Ambient: ${asset.performance.ambientTempCelsius}°C`,
      icon: <Cloud className="w-4 h-4" />,
      status: 'pending',
      accentColor: 'amber',
    },
    {
      id: 6,
      label: 'DETERMINISTIC PERFORMANCE MODEL',
      subtitle: 'Thermodynamic Baseline vs Telemetry Log',
      detail: `Expected Model: ${asset.performance.expectedKwhPerDay} kWh/day → Reported: ${asset.performance.reportedKwhPerDay} kWh/day`,
      icon: <Zap className="w-4 h-4" />,
      status: 'pending',
      accentColor: 'teal',
    },
    {
      id: 7,
      label: 'ANOMALY RISK CLASSIFICATION',
      subtitle: 'Deviation Tolerance Assessment',
      detail: `Deviation: ${asset.performance.differencePercent}% — ${Math.abs(asset.performance.differencePercent) > 30 ? 'ANOMALOUS HARVEST PATTERN' : 'WITHIN TOLERANCE BAND'}`,
      icon: <Activity className="w-4 h-4" />,
      status: 'pending',
      accentColor: Math.abs(asset.performance.differencePercent) > 30 ? 'rose' : 'emerald',
    },
    {
      id: 8,
      label: 'SYNTHESIS & VERIFICATION CONFIDENCE',
      subtitle: 'Multi-Evidence Confidence Calculation',
      detail: `Confidence: ${asset.trustScore}/100 — ${asset.trustScore >= 80 ? 'DIGITALLY VERIFIED (MONITOR)' : asset.trustScore >= 60 ? 'RE-VERIFICATION REQUIRED' : 'FIELD INSPECTION RECOMMENDED'}`,
      icon: <ShieldCheck className="w-4 h-4" />,
      status: 'pending',
      accentColor: asset.trustScore >= 80 ? 'emerald' : asset.trustScore >= 60 ? 'amber' : 'rose',
    },
  ], [asset]);

  const [phases, setPhases] = useState<ScanPhase[]>(createPhases);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    if (currentPhaseIndex < phases.length) {
      setPhases((prev) =>
        prev.map((p, idx) =>
          idx === currentPhaseIndex ? { ...p, status: 'scanning' } : p
        )
      );

      setScanProgress((currentPhaseIndex / phases.length) * 100);

      const timer = setTimeout(() => {
        setPhases((prev) =>
          prev.map((p, idx) =>
            idx === currentPhaseIndex ? { ...p, status: 'completed' } : p
          )
        );
        setCurrentPhaseIndex((prev) => prev + 1);
      }, 700);

      return () => clearTimeout(timer);
    } else {
      setIsFinished(true);
      setScanProgress(100);
      if (asset.trustScore >= 75) {
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.55 },
            colors: ['#10b981', '#06b6d4', '#f59e0b'],
          });
        } catch {
          // ignore
        }
      }
    }
  }, [currentPhaseIndex, phases.length, asset.trustScore]);

  // Satellite zoom levels
  const zoomSteps = [
    { level: 1, name: 'NATIONAL LEVEL', scale: '1:5,000,000', label: 'India Subcontinent' },
    { level: 2, name: 'STATE LEVEL', scale: '1:1,000,000', label: `${asset.registeredLocation.state} State` },
    { level: 3, name: 'DISTRICT LEVEL', scale: '1:250,000', label: `${asset.registeredLocation.district} District` },
    { level: 4, name: 'VILLAGE LEVEL', scale: '1:50,000', label: `${asset.registeredLocation.village} Village` },
    { level: 5, name: 'PARCEL LEVEL', scale: '1:5,000', label: 'Registered Farm Boundary #412/A' },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={`rounded-3xl p-6 sm:p-7 max-w-5xl w-full border shadow-2xl relative overflow-hidden transition ${
          isLight
            ? 'bg-white border-slate-200'
            : 'glass-panel-glow border-emerald-500/40'
        }`}
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >
        {/* Progress scan bar */}
        <motion.div
          className="absolute top-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-cyan-400 to-emerald-500"
          initial={{ width: '0%' }}
          animate={{ width: `${scanProgress}%` }}
          transition={{ duration: 0.4 }}
        />

        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${
              isLight
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  DIGITAL ASSET VERIFICATION
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                  {asset.id}
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {asset.pumpManufacturer} {asset.pumpCapacityHp} HP Solar Irrigation
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: Scanning vs Satellite */}
            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setActiveTab('scan')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'scan'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                <span>Verification Scan</span>
              </button>

              <button
                onClick={() => setActiveTab('satellite')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition ${
                  activeTab === 'satellite'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>Prototype Spatial View</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 1: 8-Stage Digital Scan Sequence (2-Column Split View Matching Reference Image) */}
        {activeTab === 'scan' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: 3D Drone Holographic Scan Viewport (Matching Reference Image) */}
            <div className="lg:col-span-7 relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 aspect-[4/3] flex items-center justify-center group shadow-xl">
              <ReliableImage
                src={isLight ? '/assets/scan_light.jpg' : '/assets/scan_dark.jpg'}
                alt="Verification Holographic Scan"
                className="w-full h-full object-cover object-center"
                containerClassName="w-full h-full"
                badgeLabel="HOLOGRAPHIC SCAN"
                fallbackTitle="Asset Remote Sensing Viewport"
                fallbackSubtitle="Multispectral scan telemetry active • Render stream fallback"
                fallbackSrc={isLight ? '/assets/hero_light.jpg' : '/assets/hero_dark.jpg'}
              />

              {/* Top Floating Badge as seen in Reference Image */}
              <div className="absolute top-3 left-3 z-20">
                <div className={`px-3 py-1 rounded-full text-xs font-mono font-semibold flex items-center gap-1.5 backdrop-blur-md border shadow-lg ${
                  isLight
                    ? 'bg-white/90 text-[#1b7340] border-[#d4ccbf]'
                    : 'bg-[#090e17]/85 text-emerald-300 border-emerald-500/40'
                }`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span>Verifying Asset Location...</span>
                </div>
              </div>

              {/* Dynamic Scanning Laser Sweep */}
              <motion.div
                className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent pointer-events-none z-10"
                animate={{ top: ['15%', '85%', '15%'] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'linear' }}
              />

              {/* Dynamic Live Evidence Card (Evidence-Driven Reasoning) */}
              <div className="absolute bottom-3 inset-x-3 z-20 space-y-2 pointer-events-none">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPhaseIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="p-3 rounded-xl bg-slate-950/85 text-white backdrop-blur-md border border-emerald-500/30 font-mono text-[11px] shadow-xl"
                  >
                    <div className="flex items-center justify-between text-emerald-400 font-bold text-[10px] uppercase tracking-wider mb-1">
                      <span>{phases[Math.min(currentPhaseIndex, phases.length - 1)]?.label}</span>
                      <span>STAGE {Math.min(currentPhaseIndex + 1, phases.length)}/8</span>
                    </div>
                    <div className="text-slate-200 font-medium">
                      {phases[Math.min(currentPhaseIndex, phases.length - 1)]?.detail}
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Status Bar */}
                <div className="flex items-center justify-between text-[10px] font-mono px-2 py-1 rounded-lg bg-slate-950/70 text-slate-300 backdrop-blur-sm border border-white/5">
                  <span className="text-emerald-400">
                    GPS: {asset.registeredLocation.lat.toFixed(4)}°N, {asset.registeredLocation.lng.toFixed(4)}°E
                  </span>
                  <span>EVIDENCE-DRIVEN VERIFICATION</span>
                </div>
              </div>
            </div>

            {/* Right: Scanning Asset Checklist (Matching Reference Image) */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 font-display">
                  Scanning Asset...
                </h3>
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {Math.min(currentPhaseIndex, phases.length)} / {phases.length}
                </span>
              </div>

              <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
                {phases.map((phase) => (
                  <div
                    key={phase.id}
                    className={`p-2.5 rounded-xl border transition-all flex items-center gap-2.5 ${
                      phase.status === 'completed'
                        ? isLight
                          ? 'bg-slate-50/80 border-slate-200'
                          : 'bg-slate-900/80 border-slate-800'
                        : phase.status === 'scanning'
                        ? isLight
                          ? 'bg-emerald-50/80 border-emerald-300'
                          : 'bg-slate-900/60 border-emerald-500/40'
                        : isLight
                        ? 'bg-slate-50/30 border-slate-200/50 opacity-40'
                        : 'bg-slate-950/40 border-slate-800/40 opacity-40'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                      phase.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold'
                        : phase.status === 'scanning'
                        ? 'bg-emerald-500/20 text-emerald-500'
                        : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {phase.status === 'scanning' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                      ) : phase.status === 'completed' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {phase.label}
                      </div>
                      {phase.status === 'scanning' && (
                        <div className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 animate-pulse">
                          Processing verification...
                        </div>
                      )}
                    </div>

                    {phase.status === 'completed' && (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                        ✓
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Completion Result Banner */}
              <AnimatePresence>
                {isFinished && (
                  <motion.div
                    className={`p-4 rounded-2xl border text-center space-y-3 relative overflow-hidden ${
                      isLight
                        ? 'bg-emerald-50/90 border-emerald-200 text-slate-900'
                        : 'bg-emerald-950/40 border-emerald-500/40 text-white'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <div className="flex items-center justify-center gap-6">
                        <div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Verification Confidence</div>
                          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                            <AnimatedNumber value={asset.trustScore} duration={1} /> / 100
                          </div>
                        </div>
                        <div className="border-l border-slate-300 dark:border-slate-800 pl-6 text-left">
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">Triage Classification</div>
                          <DistinctionBadge type={asset.verificationStatus} size="sm" />
                        </div>
                      </div>
                    </div>

                    {/* WHY THIS RESULT? Compact Panel */}
                    <div className="p-3 rounded-xl bg-slate-900/90 dark:bg-slate-950/90 border border-slate-700/60 dark:border-slate-800 text-left space-y-2 font-mono">
                      <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider flex items-center justify-between border-b border-slate-800 pb-1">
                        <span>WHY THIS RESULT?</span>
                        <span className="text-emerald-400 font-bold">{asset.trustScore} / 100</span>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Evidence freshness</span>
                          <span className={asset.scoreBreakdown?.evidenceFreshness && asset.scoreBreakdown.evidenceFreshness >= 80 ? 'text-emerald-400 font-bold' : asset.scoreBreakdown?.evidenceFreshness && asset.scoreBreakdown.evidenceFreshness >= 60 ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'}>
                            {asset.scoreBreakdown?.evidenceFreshness && asset.scoreBreakdown.evidenceFreshness >= 80 ? 'STRONG' : asset.scoreBreakdown?.evidenceFreshness && asset.scoreBreakdown.evidenceFreshness >= 60 ? 'MODERATE' : 'WEAK'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">GPS consistency</span>
                          <span className={asset.gpsOffsetMeters <= 100 ? 'text-emerald-400 font-bold' : asset.gpsOffsetMeters <= 300 ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'}>
                            {asset.gpsOffsetMeters <= 100 ? 'STRONG' : asset.gpsOffsetMeters <= 300 ? 'MODERATE' : 'WEAK'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Climate context</span>
                          <span className="text-emerald-400 font-bold">STRONG</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Performance match</span>
                          <span className={Math.abs(asset.performance.differencePercent) <= 15 ? 'text-emerald-400 font-bold' : Math.abs(asset.performance.differencePercent) <= 30 ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold'}>
                            {Math.abs(asset.performance.differencePercent) <= 15 ? 'STRONG' : Math.abs(asset.performance.differencePercent) <= 30 ? 'MODERATE' : 'WEAK'}
                          </span>
                        </div>
                      </div>
                      <div className="text-[9px] text-slate-400 italic pt-1 border-t border-slate-800 text-center">
                        Asset Verification Confidence — not a borrower credit score.
                      </div>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition shadow-md"
                    >
                      Done & Close Inspection
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Tab 2: Satellite Multi-Scale Zoom Transition */}
        {activeTab === 'satellite' && (
          <div className="space-y-4">
            {/* Zoom Stage Bar */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              {zoomSteps.map((step) => (
                <button
                  key={step.level}
                  onClick={() => setSatelliteZoomLevel(step.level)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                    satelliteZoomLevel === step.level
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className="hidden sm:inline">{step.name}</span>
                  <span className="sm:hidden font-mono">L{step.level}</span>
                </button>
              ))}
            </div>

            {/* Satellite Imagery Simulation Canvas */}
            <div className="relative h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 flex items-center justify-center">
              {/* Synthetic Satellite Grid Canvas */}
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />

              {/* Lidar Scan Sweep Ring */}
              <motion.div
                className="absolute w-44 h-44 rounded-full border border-emerald-500/40"
                animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
              />

              {/* Coordinates Reticle */}
              <div className="relative z-10 flex flex-col items-center text-center space-y-2 p-4">
                <Compass className="w-8 h-8 text-emerald-400 animate-spin" style={{ animationDuration: '20s' }} />

                <div>
                  <span className="text-[10px] font-mono text-emerald-400 tracking-widest font-bold">
                    GEOSPATIAL CORRELATION
                  </span>
                  <div className="text-white font-bold text-base mt-0.5">
                    {zoomSteps[satelliteZoomLevel - 1].label}
                  </div>
                  <div className="text-slate-400 text-xs font-mono">
                    Scale {zoomSteps[satelliteZoomLevel - 1].scale} • Sentinel-2 Multispectral
                  </div>
                </div>

                {/* Ground vs Photo Vector Annotation */}
                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/40">
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Registered: {asset.registeredLocation.lat.toFixed(4)}°, {asset.registeredLocation.lng.toFixed(4)}°</span>
                  </div>

                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/40">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Offset: {asset.gpsOffsetMeters}m</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Geospatial Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Resolution Standard</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">0.5m/px High-Res</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Cadastral Boundary</span>
                <div className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">Matched (99.2%)</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
                <span className="text-slate-500 dark:text-slate-400">Last Overpass</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">18 Hours Ago</div>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};
