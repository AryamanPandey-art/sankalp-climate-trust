import React from 'react';
import { Cpu, ArrowDown, Camera, MapPin, Cloud, Zap, ShieldCheck, Activity } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const IntelligenceArchitecturePanel: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`p-6 sm:p-7 rounded-3xl border space-y-6 transition ${
      isLight
        ? 'bg-white border-slate-200 shadow-sm text-slate-900'
        : 'glass-panel border-slate-800 text-slate-100'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
              HOW THE INTELLIGENCE WORKS
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Technical pipeline architecture: multi-signal synthesis and anomaly detection.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 font-semibold self-start sm:self-auto">
          PROTOTYPE ARCHITECTURE
        </span>
      </div>

      {/* Pipeline Diagram */}
      <div className="space-y-4">
        {/* Tier 1: Input Ingestion */}
        <div className="text-center">
          <div className="inline-block p-2.5 px-6 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs font-bold shadow-sm">
            ASSET DATA INGESTION (SPECS • BORROWER PROFILE • PARCEL COORDS)
          </div>
        </div>

        <div className="flex justify-center text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 2: 4 Input Ingestion Signals */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 font-bold font-mono text-[11px]">
              <Camera className="w-3.5 h-3.5" /> COMPUTER VISION
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              [Prototype CV]
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Hardware detection & serial sticker OCR extraction.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-bold font-mono text-[11px]">
              <MapPin className="w-3.5 h-3.5" /> GEO / LOCATION
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              [Spatial Buffer]
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              EXIF geotag vs cadastral registered parcel (100m threshold).
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold font-mono text-[11px]">
              <Cloud className="w-3.5 h-3.5" /> CLIMATE DATA
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              [Simulated Climate]
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Satellite solar irradiance (kWh/m²) & ambient cloud cover.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold font-mono text-[11px]">
              <Zap className="w-3.5 h-3.5" /> PERFORMANCE DATA
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
              [Telemetry Feed]
            </div>
            <p className="text-[11px] text-slate-600 dark:text-slate-300">
              Reported kWh harvest & pump running hours telemetry.
            </p>
          </div>
        </div>

        <div className="flex justify-center text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 3: Performance Modeling */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="font-mono text-[10px] uppercase font-bold text-indigo-600 dark:text-indigo-400">
              STEP 2: THERMODYNAMIC PERFORMANCE MODEL
            </span>
            <div className="font-bold text-slate-900 dark:text-white">
              Expected Output = kWp × Irradiance × System Efficiency (78%)
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-semibold border border-indigo-500/20">
            Deterministic Physics Model
          </span>
        </div>

        <div className="flex justify-center text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 4: Anomaly Detection Engine */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="font-mono text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1 justify-center sm:justify-start">
              <Activity className="w-3.5 h-3.5" /> STEP 3: ANOMALY ENGINE
            </span>
            <div className="font-bold text-slate-900 dark:text-white">
              Deviation Analysis: |Reported - Expected| / Expected
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400 font-mono text-[10px] font-semibold border border-rose-500/20">
            Prototype Anomaly Model
          </span>
        </div>

        <div className="flex justify-center text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 5: Synthesis & Verification Confidence */}
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="font-mono text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-center sm:justify-start">
              <ShieldCheck className="w-3.5 h-3.5" /> STEP 4: VERIFICATION CONFIDENCE (0-100)
            </span>
            <div className="font-bold text-slate-900 dark:text-white">
              Transparent multi-signal rule scoring (Evidence + Location + Freshness + Performance)
            </div>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-semibold">
            Rule/Model-Based Confidence
          </span>
        </div>

        <div className="flex justify-center text-slate-400">
          <ArrowDown className="w-4 h-4" />
        </div>

        {/* Tier 6: Final Triage Action */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs font-mono font-bold">
          <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
            MONITOR
            <div className="text-[10px] font-normal text-slate-500 mt-0.5">High Confidence</div>
          </div>
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400">
            RE-VERIFY
            <div className="text-[10px] font-normal text-slate-500 mt-0.5">Refresh Evidence</div>
          </div>
          <div className="p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-400">
            INSPECT
            <div className="text-[10px] font-normal text-slate-500 mt-0.5">Field Audit</div>
          </div>
        </div>
      </div>
    </div>
  );
};
