import React from 'react';
import type { SolarPumpAsset } from '../../types/asset';
import { DistinctionBadge } from '../common/Badge';
import { FadeIn, StaggerContainer, StaggerItem, DataPulse } from '../motion/MotionSystem';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';

interface InspectionQueueProps {
  assets: SolarPumpAsset[];
  onSelectAsset: (assetId: string) => void;
}

export const InspectionQueue: React.FC<InspectionQueueProps> = ({ assets, onSelectAsset }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { metrics } = usePortfolio();

  const priority1Assets = assets.filter((a) => a.inspectionPriority === 'PRIORITY_1');
  const priority2Assets = assets.filter((a) => a.inspectionPriority === 'PRIORITY_2');
  const priority3Assets = assets.filter((a) => a.inspectionPriority === 'PRIORITY_3');

  return (
    <div className="space-y-8 pb-16">
      {/* Central Economic Value Proposition Banner */}
      <FadeIn>
        <div className={`p-6 sm:p-8 rounded-3xl border text-center space-y-3 relative overflow-hidden transition ${
          isLight
            ? 'bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 border-emerald-200/80 shadow-sm'
            : 'glass-panel-glow border-emerald-500/30'
        }`}>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold relative">
            <Zap className="w-3.5 h-3.5" /> RISK-BASED INSPECTION TRIAGE
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight relative font-display">
            Don't inspect everything.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-300 dark:to-cyan-400">
              Inspect what the data tells you to inspect.
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm max-w-2xl mx-auto relative leading-relaxed">
            By prioritizing anomalous signatures and relying on low-cost digital verification for normal assets, lenders can focus physical inspection resources on genuine operational risk.
          </p>
          <div className="text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest pt-1">
            Illustrative Decision Support Architecture • Triage Threshold: -30% Deviation
          </div>
        </div>
      </FadeIn>

      {/* Portfolio Triage Semantic Alignment Ribbon */}
      <FadeIn delay={0.08}>
        <div className={`p-4 rounded-2xl border flex flex-wrap items-center justify-around gap-4 text-center ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800'
        }`}>
          <div>
            <div className="text-xl font-black font-mono text-slate-900 dark:text-white">{metrics.totalAssets.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 font-medium">Assets Monitored</div>
          </div>
          <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <div>
            <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">{metrics.highConfidence.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 font-medium">High Confidence</div>
          </div>
          <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <div>
            <div className="text-xl font-black font-mono text-amber-600 dark:text-amber-400">{metrics.requireReview.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 font-medium">Require Review</div>
          </div>
          <div className="h-7 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block" />
          <div>
            <div className="text-xl font-black font-mono text-rose-600 dark:text-rose-400">{metrics.anomaliesFlagged.toLocaleString()}</div>
            <div className="text-[11px] text-slate-500 font-medium">Anomalies Flagged</div>
          </div>
        </div>
      </FadeIn>

      {/* Priority 1: Physical Ground Inspection Queue */}
      <FadeIn delay={0.1}>
        <div className={`p-6 rounded-3xl border space-y-4 transition ${
          isLight
            ? 'bg-rose-50/30 border-rose-200 shadow-sm'
            : 'glass-panel border-rose-500/30'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-700 dark:text-rose-400 font-extrabold text-xs border border-rose-500/40 relative">
                PRIORITY 1
                <DataPulse color="#f43f5e" size={6} className="absolute -top-1 -right-1" />
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                IMMEDIATE FIELD PHYSICAL AUDIT DISPATCH
              </h3>
            </div>
            <span className="text-xs text-rose-600 dark:text-rose-400 font-bold">
              {priority1Assets.length} Assets Flagged
            </span>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.08} initialDelay={0.15}>
            {priority1Assets.map((asset) => (
              <StaggerItem key={asset.id}>
                <motion.div
                  onClick={() => onSelectAsset(asset.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition space-y-3 group ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-rose-400 shadow-sm'
                      : 'bg-slate-900/90 border-slate-800 hover:border-rose-500/50'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-rose-600 dark:group-hover:text-rose-400 transition font-mono">
                        {asset.id}
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{asset.borrowerName} • {asset.registeredLocation.district}</div>
                    </div>
                    <DistinctionBadge type="ANOMALY" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
                    <div>
                      <div className="text-slate-500">Risk Factor</div>
                      <div className="text-rose-600 dark:text-rose-400 font-bold">Performance Anomaly</div>
                    </div>
                    <div>
                      <div className="text-slate-500">GPS Offset</div>
                      <div className="text-amber-600 dark:text-amber-400 font-bold font-mono">{asset.gpsOffsetMeters}m</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Action Required</div>
                      <div className="text-slate-900 dark:text-white font-bold">Ground Audit</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Deviation: <strong className="text-rose-600 dark:text-rose-400 font-mono">{asset.performance.differencePercent}%</strong>
                    </span>
                    <span className="text-rose-600 dark:text-rose-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition text-xs">
                      Examine Anomaly <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </FadeIn>

      {/* Priority 2: Digital Re-Verification Queue */}
      <FadeIn delay={0.2}>
        <div className={`p-6 rounded-3xl border space-y-4 transition ${
          isLight
            ? 'bg-amber-50/30 border-amber-200 shadow-sm'
            : 'glass-panel border-amber-500/30'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-400 font-extrabold text-xs border border-amber-500/40">
                PRIORITY 2
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                DIGITAL RE-VERIFICATION & PHOTO REFRESH
              </h3>
            </div>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">
              {priority2Assets.length} Assets Pending Evidence
            </span>
          </div>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={0.08} initialDelay={0.25}>
            {priority2Assets.map((asset) => (
              <StaggerItem key={asset.id}>
                <motion.div
                  onClick={() => onSelectAsset(asset.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition space-y-3 group ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-amber-400 shadow-sm'
                      : 'bg-slate-900/90 border-slate-800 hover:border-amber-500/50'
                  }`}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-amber-600 dark:group-hover:text-amber-400 transition font-mono">
                        {asset.id}
                      </span>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{asset.borrowerName} • {asset.registeredLocation.district}</div>
                    </div>
                    <DistinctionBadge type="UNVERIFIED" label="PARTIAL EVIDENCE" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] p-3 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80">
                    <div>
                      <div className="text-slate-500">Evidence State</div>
                      <div className="text-amber-600 dark:text-amber-400 font-bold">Photo Overdue</div>
                    </div>
                    <div>
                      <div className="text-slate-500">GPS Offset</div>
                      <div className="text-slate-700 dark:text-slate-300 font-bold font-mono">{asset.gpsOffsetMeters}m</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Action Required</div>
                      <div className="text-slate-900 dark:text-white font-bold">SMS Refresh Prompt</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                      Verification Confidence: <strong className="text-amber-600 dark:text-amber-400 font-mono">{asset.trustScore}/100</strong>
                    </span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition text-xs">
                      Review Evidence <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </FadeIn>

      {/* Priority 3: Low Risk Clearance Queue */}
      <FadeIn delay={0.3}>
        <div className={`p-6 rounded-3xl border space-y-4 transition ${
          isLight
            ? 'bg-emerald-50/20 border-emerald-200 shadow-sm'
            : 'glass-panel border-emerald-500/20'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-extrabold text-xs border border-emerald-500/40">
                PRIORITY 3
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                CONTINUOUS DIGITAL MONITORING
              </h3>
            </div>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold">
              {priority3Assets.length} Assets Cleared
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <div className="text-slate-600 dark:text-slate-300">
                High-confidence assets eligible for remote monitoring under configured verification policy. All <strong>{priority3Assets.length}</strong> Priority 3 assets exhibit consistent solar generation models, verified GPS geotags, and fresh photo evidence.
              </div>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono shrink-0 hidden sm:inline">
              Digital Clearance
            </span>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};
