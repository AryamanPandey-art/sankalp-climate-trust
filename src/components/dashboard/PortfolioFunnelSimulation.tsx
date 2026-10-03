import React from 'react';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { RefreshCw, AlertTriangle, ArrowRight, Layers, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePortfolio } from '../../context/PortfolioContext';

export const PortfolioFunnelSimulation: React.FC = () => {
  const { theme } = useTheme();
  const { metrics } = usePortfolio();
  const isLight = theme === 'light';

  const monitorCount = metrics.highConfidence;
  const reverifyCount = metrics.requireReview;
  const inspectCount = metrics.anomaliesFlagged;
  const totalCount = metrics.totalAssets;

  const monitorPct = ((monitorCount / totalCount) * 100).toFixed(1);
  const reverifyPct = ((reverifyCount / totalCount) * 100).toFixed(1);
  const inspectPct = ((inspectCount / totalCount) * 100).toFixed(1);

  return (
    <div className={`p-6 sm:p-7 rounded-3xl border space-y-6 transition ${
      isLight
        ? 'bg-white border-slate-200 shadow-sm text-slate-900'
        : 'glass-panel border-slate-800 text-slate-100'
    }`}>
      {/* Header with explicit illustrative notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono flex items-center gap-1.5">
              <Layers className="w-4 h-4" /> PORTFOLIO VERIFICATION AT SCALE
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-semibold uppercase">
              ILLUSTRATIVE PORTFOLIO SIMULATION
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Exception-based operational verification: multi-signal digital intelligence filters low-risk rural assets.
          </p>
        </div>

        <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
          Portfolio Scale: <strong className="text-slate-900 dark:text-white font-bold">{totalCount} SAMPLE ASSETS</strong>
        </div>
      </div>

      {/* Visual Funnel / Pipeline Flow */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-widest text-center mb-3">
          VERIFICATION SYNTHESIS FUNNEL
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-mono font-medium">
          <span className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold">
            {totalCount} SAMPLE ASSETS
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border border-cyan-500/30">
            DIGITAL EVIDENCE
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3 py-1.5 rounded-xl bg-violet-500/10 text-violet-700 dark:text-violet-400 border border-violet-500/30">
            CLIMATE + LOCATION
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-500/30">
            PERFORMANCE ANALYSIS
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-bold">
            CONFIDENCE SYNTHESIS
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 font-bold">
            EXCEPTIONS ONLY
          </span>
        </div>
      </div>

      {/* 3 Scalability Triage Output Buckets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bucket 1: Digital-Clearance Candidates */}
        <div className={`p-4 rounded-2xl border space-y-2 transition ${
          isLight
            ? 'bg-emerald-50/60 border-emerald-200'
            : 'bg-emerald-950/20 border-emerald-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> DIGITAL-CLEARANCE CANDIDATES
            </span>
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400">
              {monitorPct}%
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
            <AnimatedNumber value={monitorCount} duration={1.2} />
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            ACTION: CONTINUOUS MONITORING
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            High confidence evidence & matching performance. Eligible for remote monitoring under configured verification policy.
          </p>
        </div>

        {/* Bucket 2: Evidence Refresh */}
        <div className={`p-4 rounded-2xl border space-y-2 transition ${
          isLight
            ? 'bg-amber-50/60 border-amber-200'
            : 'bg-amber-950/20 border-amber-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <RefreshCw className="w-3.5 h-3.5" /> EVIDENCE REFRESH
            </span>
            <span className="text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400">
              {reverifyPct}%
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
            <AnimatedNumber value={reverifyCount} duration={1.2} />
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            ACTION: DIGITAL EVIDENCE REFRESH
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Overdue photo, moderate GPS offset (&gt;100m), or pending baseline. Automated prompt issued for digital re-verification.
          </p>
        </div>

        {/* Bucket 3: Exception Cases */}
        <div className={`p-4 rounded-2xl border space-y-2 transition ${
          isLight
            ? 'bg-rose-50/60 border-rose-200'
            : 'bg-rose-950/20 border-rose-500/30'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> EXCEPTION CASES
            </span>
            <span className="text-[10px] font-mono font-bold text-rose-600 dark:text-rose-400">
              {inspectPct}%
            </span>
          </div>
          <div className="text-3xl font-black font-mono text-slate-900 dark:text-white">
            <AnimatedNumber value={inspectCount} duration={1.2} />
          </div>
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
            ACTION: HUMAN AUDIT DISPATCH
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
            Significant generation gap or geospatial discrepancy. Prioritizes human inspection without inferring borrower misconduct.
          </p>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono text-center border-t border-slate-200 dark:border-slate-800/80 pt-3">
        Illustrative scenario based on configurable assumptions; not a measured field outcome or validated Satin Finserv saving.
      </div>
    </div>
  );
};
