import React from 'react';
import { XCircle, CheckCircle2, Scale } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const ResponsibleVerificationPanel: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className={`p-6 sm:p-7 rounded-3xl border space-y-5 transition ${
      isLight
        ? 'bg-white border-slate-200 shadow-sm text-slate-900'
        : 'glass-panel border-slate-800 text-slate-100'
    }`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
            <Scale className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white font-mono flex items-center gap-1.5">
              RESPONSIBLE VERIFICATION
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Clear scope boundaries for ethical, transparent decision-support in rural climate finance.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 font-semibold self-start sm:self-auto">
          DECISION SUPPORT ONLY
        </span>
      </div>

      {/* 2-Column Side-by-Side: DOES NOT vs DOES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* DOES NOT Column */}
        <div className={`p-4 rounded-2xl border space-y-3 ${
          isLight
            ? 'bg-rose-50/40 border-rose-200/80'
            : 'bg-rose-950/15 border-rose-500/20'
        }`}>
          <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider font-mono">
            <XCircle className="w-4 h-4" />
            <span>THIS SYSTEM DOES NOT:</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
              <span><strong>Determine borrower creditworthiness</strong> or underwrite credit.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
              <span><strong>Infer repayment or default risk</strong> from asset harvest fluctuations.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
              <span><strong>Guarantee physical equipment functionality</strong> indefinitely.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
              <span><strong>Treat satellite imagery as ground truth</strong> without local context.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-rose-500 font-bold shrink-0 mt-0.5">✕</span>
              <span><strong>Replace every physical inspection</strong> where human eyes are required.</span>
            </li>
          </ul>
        </div>

        {/* DOES Column */}
        <div className={`p-4 rounded-2xl border space-y-3 ${
          isLight
            ? 'bg-emerald-50/40 border-emerald-200/80'
            : 'bg-emerald-950/15 border-emerald-500/20'
        }`}>
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>THIS SYSTEM DOES:</span>
          </div>
          <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
              <span><strong>Synthesize available asset evidence</strong> (photos, EXIF, telemetry).</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
              <span><strong>Estimate verification confidence</strong> using transparent rules & models.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
              <span><strong>Identify geospatial inconsistencies</strong> against registered farmland boundaries.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
              <span><strong>Detect performance anomalies</strong> by correlating weather with kWh harvest.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold shrink-0 mt-0.5">✓</span>
              <span><strong>Prioritize human inspections</strong> so operations teams inspect exceptions first.</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono text-center border-t border-slate-200 dark:border-slate-800 pt-3">
        Asset verification confidence — not a borrower credit score.
      </div>
    </div>
  );
};
