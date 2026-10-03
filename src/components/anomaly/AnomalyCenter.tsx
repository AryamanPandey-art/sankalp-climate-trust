import React from 'react';
import type { SolarPumpAsset } from '../../types/asset';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { FadeIn, StaggerContainer, StaggerItem, DataPulse } from '../motion/MotionSystem';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  HelpCircle,
  ShieldAlert,
  Send,
  UserCheck,
  Sun,
  MapPin,
  Camera,
  Activity,
  ArrowLeft
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface AnomalyCenterProps {
  asset: SolarPumpAsset;
  onSelectAction: (action: 'request_photo' | 'schedule_inspection') => void;
  onBackToDashboard: () => void;
}

export const AnomalyCenter: React.FC<AnomalyCenterProps> = ({
  asset,
  onSelectAction,
  onBackToDashboard
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const anomalyData = asset.anomaly || {
    detectedDate: '2026-01-15',
    deviationPercent: asset.performance.differencePercent,
    potentialExplanations: [
      'Dust, sediment, or seasonal bio-soiling on photovoltaic panels',
      'Pump mechanical wear or borehole impeller silt clogging',
      'Reduced crop irrigation demand during non-peak cultivation cycle',
      'Sensor calibration shift or manual meter digit reporting typo',
      'Geotag coordinate discrepancy or secondary parcel deployment requiring ground re-verification'
    ],
    recommendedAction: 'Schedule technical verification',
    responsibleAiNote: 'Weather alone does not explain the deviation. High irradiance and low cloud cover indicate that weather conditions are unlikely to fully account for the observed performance gap. Human verification is prioritized without inferring borrower misconduct.'
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Navigation & Header */}
      <FadeIn>
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Operations Center
          </button>
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 font-bold">
              ACTIVE ANOMALY DOSSIER
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-bold">{asset.id}</span>
          </div>
        </div>
      </FadeIn>

      {/* Hero Anomaly Story Banner */}
      <FadeIn delay={0.05}>
        <div className={`p-6 sm:p-8 rounded-3xl border relative overflow-hidden transition ${
          isLight
            ? 'bg-gradient-to-br from-rose-50/90 via-amber-50/50 to-white border-rose-200 shadow-xl shadow-rose-950/5'
            : 'glass-panel-warning border-rose-500/40 shadow-2xl shadow-rose-950/30'
        }`}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4">
              <motion.div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border relative ${
                  isLight
                    ? 'bg-rose-100 border-rose-300 text-rose-700'
                    : 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                }`}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >
                <AlertTriangle className="w-7 h-7" />
                <DataPulse color="#f43f5e" size={8} className="absolute -top-1 -right-1" />
              </motion.div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-rose-600 dark:text-rose-400">
                  Performance Deviation Detected
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                  Output Significantly Below Irradiance Potential
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-xl">
                  {asset.borrowerName} • {asset.pumpManufacturer} {asset.pumpCapacityHp} HP • {asset.registeredLocation.village}, {asset.registeredLocation.district}
                </p>
              </div>
            </div>

            <div className="flex items-baseline gap-2 self-start md:self-auto p-4 rounded-2xl bg-white/70 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Net Deviation
                </div>
                <div className="text-3xl sm:text-4xl font-black text-rose-600 dark:text-rose-400 font-mono">
                  <AnimatedNumber value={asset.performance.differencePercent} decimals={1} suffix="%" duration={1.5} />
                </div>
              </div>
            </div>
          </div>

          {/* Three Key Metrics Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/80">
            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Expected Generation
              </span>
              <div className="text-2xl font-black text-sky-600 dark:text-cyan-400 font-mono mt-1">
                <AnimatedNumber value={asset.performance.expectedKwhPerDay} decimals={1} suffix=" kWh/day" />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Satellite solar model ({asset.performance.solarIrradianceKwhM2} kWh/m²)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Reported Generation
              </span>
              <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono mt-1">
                <AnimatedNumber value={asset.performance.reportedKwhPerDay} decimals={1} suffix=" kWh/day" />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Borrower telemetry / mobile meter log
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                GPS Ground Offset
              </span>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono mt-1">
                <AnimatedNumber value={asset.gpsOffsetMeters} suffix=" meters" />
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400">
                Photo geotag vs registered farmland
              </span>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Story Contextualization Grid */}
      <FadeIn delay={0.15}>
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Multi-Source Evidence Contextualization
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Climate Context */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-wider font-mono">
                <Sun className="w-4 h-4" /> 1. Climate & Atmospheric Verification
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                WEATHER ALONE DOES NOT EXPLAIN THE DEVIATION
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                High irradiance and low cloud cover indicate that weather conditions are unlikely to fully account for the observed performance gap. Satellite records confirm clear sky conditions with <strong>{asset.performance.solarIrradianceKwhM2} kWh/m²</strong> solar potential and minimal cloud cover ({asset.performance.cloudCoverPercent}%).
              </p>
            </div>

            {/* 2. Location Context */}
            <div className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border space-y-2 ${
              asset.gpsOffsetMeters > 200
                ? 'border-amber-400/60 dark:border-amber-500/40'
                : 'border-slate-200 dark:border-slate-800'
            }`}>
              <div className={`flex items-center gap-2 font-bold text-xs uppercase tracking-wider font-mono ${
                asset.gpsOffsetMeters > 200 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                <MapPin className="w-4 h-4" /> 2. Geospatial Correlation
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                {asset.gpsOffsetMeters > 200
                  ? 'SIGNIFICANT LOCATION DISCREPANCY DETECTED'
                  : 'Ground Coordinates Consistent'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {asset.gpsOffsetMeters > 200
                  ? `Current geotag differs from the registered parcel by approximately ${asset.gpsOffsetMeters.toLocaleString()}m. Location evidence requires re-verification before digital clearance.`
                  : `Geotagged EXIF coordinates show a ground offset of only ${asset.gpsOffsetMeters}m from the registered parcel boundary in ${asset.registeredLocation.village}.`}
              </p>
            </div>

            {/* 3. Photo Evidence Context */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-sky-600 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider font-mono">
                <Camera className="w-4 h-4" /> 3. Visual Photographic Evidence
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                Hardware Physically Present — Meter Photo Outdated
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Initial installation photos verify solar panel framing, mounting, and controller serial number match. However, the last telemetry meter photo was submitted 38 days ago, requiring an evidence refresh.
              </p>
            </div>

            {/* 4. Historical Performance Context */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-wider font-mono">
                <Activity className="w-4 h-4" /> 4. Temporal Trend Analysis
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                REQUIRES TECHNICAL VERIFICATION
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Historical records demonstrate steady seasonal output until recent cycles, when output dropped by {Math.abs(asset.performance.differencePercent).toFixed(1)}%. Possible contributors include panel soiling, pump degradation, telemetry issues or localized environmental conditions.
              </p>
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Responsible AI Decision Assessment */}
      <FadeIn delay={0.2}>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            <ShieldAlert className="w-4 h-4" /> Responsible AI Decision-Support Guidance
          </div>

          <blockquote className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border-l-4 border-emerald-500 text-xs sm:text-sm text-emerald-900 dark:text-emerald-300 font-medium leading-relaxed">
            "{anomalyData.responsibleAiNote}"
          </blockquote>

          <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            <strong>Mandatory Policy Notice:</strong> An asset performance anomaly does not equate to borrower insolvency or default. Automated adverse actions are prohibited. Decision support guides inspection prioritization.
          </div>
        </div>
      </FadeIn>

      {/* Plausible Root Causes */}
      <FadeIn delay={0.25}>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-sky-500" /> Plausible Root Causes Ranked by Probability
          </h3>

          <StaggerContainer className="space-y-2.5" staggerDelay={0.08} initialDelay={0.1}>
            {anomalyData.potentialExplanations.map((explanation, idx) => (
              <StaggerItem key={idx}>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-center gap-3 text-xs text-slate-700 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 transition">
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 text-sky-600 dark:text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                    {idx + 1}
                  </div>
                  <span className="font-medium">{explanation}</span>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </FadeIn>

      {/* Recommended Action & Dispatch Options */}
      <FadeIn delay={0.3}>
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Operational Resolution Pathways
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <motion.button
              onClick={() => onSelectAction('request_photo')}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/80 hover:bg-white dark:hover:bg-slate-800/90 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left transition space-y-2 group shadow-sm"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  Tier 1 Digital Resolution (Low Cost)
                </span>
                <Send className="w-4 h-4 text-emerald-500 group-hover:translate-x-1 transition" />
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                Request Prompt Evidence Refresh
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Send an automated verification WhatsApp/SMS link to borrower to submit fresh timestamped photos of the solar inverter reading and borehole discharge.
              </p>
            </motion.button>

            <motion.button
              onClick={() => onSelectAction('schedule_inspection')}
              className="p-5 rounded-2xl bg-rose-50/50 dark:bg-slate-950/80 hover:bg-rose-50 dark:hover:bg-slate-800/90 border border-rose-200 dark:border-slate-700 hover:border-rose-500 text-left transition space-y-2 group shadow-sm"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                  Tier 2 Physical Dispatch (Priority 1)
                </span>
                <UserCheck className="w-4 h-4 text-rose-500 group-hover:translate-x-1 transition" />
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white">
                Assign Ground Auditor Inspection
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Dispatch regional field inspection officer to execute on-site hardware diagnosis, panel multimeter check, and well flow test.
              </p>
            </motion.button>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};
