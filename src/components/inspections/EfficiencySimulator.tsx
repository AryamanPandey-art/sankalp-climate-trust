import React, { useState } from 'react';
import { formatINR } from '../../services/VerificationEngine';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { FadeIn, StaggerContainer, StaggerItem, GlowPulse } from '../motion/MotionSystem';
import { motion } from 'framer-motion';
import { Calculator, TrendingDown, Sliders, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export const EfficiencySimulator: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [totalAssets, setTotalAssets] = useState<number>(1000);
  const [costPerInspection, setCostPerInspection] = useState<number>(2500);
  const [percentInspectionRequired, setPercentInspectionRequired] = useState<number>(18);
  const digitalFeePerAsset = 120;

  const traditionalTotalCost = totalAssets * costPerInspection;

  const physicalVisitsCount = Math.round(totalAssets * (percentInspectionRequired / 100));
  const physicalCostWithPlatform = physicalVisitsCount * costPerInspection;
  const digitalFeeTotal = totalAssets * digitalFeePerAsset;
  const platformTotalCost = physicalCostWithPlatform + digitalFeeTotal;

  const netSavingsRupees = traditionalTotalCost - platformTotalCost;
  const netSavingsPercent = Number(((netSavingsRupees / traditionalTotalCost) * 100).toFixed(1));

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-semibold mb-2">
              <Calculator className="w-3.5 h-3.5" /> ILLUSTRATIVE OPERATIONAL SIMULATION
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
              Modeled Potential Savings
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Simulate hypothetical operational cost reduction by shifting from uniform physical audits to risk-stratified digital verification.
            </p>
          </div>

          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 uppercase tracking-wider self-start sm:self-auto font-mono">
            ILLUSTRATIVE PORTFOLIO SIMULATION
          </span>
        </div>
      </FadeIn>

      {/* Sliders */}
      <FadeIn delay={0.1}>
        <div className={`p-6 sm:p-8 rounded-3xl border space-y-6 transition ${
          isLight
            ? 'bg-white border-slate-200 shadow-sm'
            : 'glass-panel border-slate-800'
        }`}>
          <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Configurable Portfolio Assumptions
          </h3>

          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={0.08} initialDelay={0.15}>
            <StaggerItem>
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Total Portfolio Assets</label>
                  <motion.span
                    className="font-bold text-slate-900 dark:text-white font-mono"
                    key={totalAssets}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {totalAssets.toLocaleString()}
                  </motion.span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="50"
                  value={totalAssets}
                  onChange={(e) => setTotalAssets(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-200 dark:bg-slate-800 cursor-pointer h-1.5"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>100 units</span>
                  <span>5,000 units</span>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Physical Audit Cost</label>
                  <motion.span
                    className="font-bold text-emerald-700 dark:text-emerald-400 font-mono"
                    key={costPerInspection}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {formatINR(costPerInspection)}
                  </motion.span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={costPerInspection}
                  onChange={(e) => setCostPerInspection(Number(e.target.value))}
                  className="w-full accent-emerald-500 bg-slate-200 dark:bg-slate-800 cursor-pointer h-1.5"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>₹500 / audit</span>
                  <span>₹5,000 / audit</span>
                </div>
              </div>
            </StaggerItem>

            <StaggerItem>
              <div className="space-y-2 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
                <div className="flex justify-between items-center text-xs">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Anomalous / Priority %</label>
                  <motion.span
                    className="font-bold text-amber-700 dark:text-amber-400 font-mono"
                    key={percentInspectionRequired}
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {percentInspectionRequired}%
                  </motion.span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={percentInspectionRequired}
                  onChange={(e) => setPercentInspectionRequired(Number(e.target.value))}
                  className="w-full accent-amber-500 bg-slate-200 dark:bg-slate-800 cursor-pointer h-1.5"
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>5% priority</span>
                  <span>50% priority</span>
                </div>
              </div>
            </StaggerItem>
          </StaggerContainer>
        </div>
      </FadeIn>

      {/* Cost Comparison */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6" staggerDelay={0.1} initialDelay={0.2}>
        <StaggerItem>
          <div className={`p-6 rounded-3xl border space-y-4 h-full transition ${
            isLight
              ? 'bg-white border-slate-200 shadow-sm'
              : 'glass-panel border-slate-800'
          }`}>
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
              TRADITIONAL AUDIT MODEL (BLIND 100% VISITS)
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Physical Inspections Conducted</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{totalAssets.toLocaleString()} visits (100%)</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Cost per Inspection</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{formatINR(costPerInspection)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Digital Verification Cost</span>
                <span className="font-mono text-slate-400">₹0</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">TOTAL ESTIMATED COST</span>
              <span className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
                {formatINR(traditionalTotalCost)}
              </span>
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <GlowPulse className="rounded-3xl h-full">
            <div className={`p-6 rounded-3xl border space-y-4 h-full transition ${
              isLight
                ? 'bg-emerald-50/50 border-emerald-200 shadow-sm'
                : 'glass-panel-glow border-emerald-500/30'
            }`}>
              <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2 flex items-center justify-between">
                <span>RURAL CLIMATE ASSET TRUST MODEL</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">OPTIMIZED</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Priority Physical Visits</span>
                  <span className="font-mono font-bold text-amber-700 dark:text-amber-400">{physicalVisitsCount.toLocaleString()} visits ({percentInspectionRequired}%)</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Physical Inspection Expenses</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{formatINR(physicalCostWithPlatform)}</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Digital Verification Platform Fee</span>
                  <span className="font-mono font-bold text-cyan-700 dark:text-cyan-400">{formatINR(digitalFeeTotal)} (₹120/asset)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-baseline">
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">OPTIMIZED PORTFOLIO COST</span>
                <span className="text-2xl font-black text-emerald-700 dark:text-emerald-400 font-mono">
                  {formatINR(platformTotalCost)}
                </span>
              </div>
            </div>
          </GlowPulse>
        </StaggerItem>
      </StaggerContainer>

      {/* Net Savings Result Card */}
      <FadeIn delay={0.3}>
        <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-6 transition ${
          isLight
            ? 'bg-gradient-to-r from-emerald-100/60 via-teal-50/50 to-white border-emerald-300 shadow-sm'
            : 'glass-panel-glow border-emerald-500/40'
        }`}>
          <div className="space-y-1 text-center sm:text-left">
            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center justify-center sm:justify-start gap-1.5 font-mono">
              <TrendingDown className="w-4 h-4" /> ILLUSTRATIVE OPERATIONAL SIMULATION
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-mono">
              {formatINR(netSavingsRupees)}
            </h2>
            <div className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider font-mono">
              MODELED COST DIFFERENCE
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 pt-1">
              Illustrative scenario based on configurable assumptions; not a measured field outcome or validated Satin Finserv saving.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center shrink-0 min-w-48">
            <div className="text-xs text-slate-600 dark:text-slate-300 font-semibold font-mono">
              PORTFOLIO IMPACT
            </div>
            <div className="text-4xl font-black text-emerald-700 dark:text-emerald-400 font-mono mt-1">
              <AnimatedNumber value={netSavingsPercent} decimals={1} suffix="%" duration={1.2} />
            </div>
            <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold uppercase tracking-wider mt-0.5 font-mono">
              MODELED PORTFOLIO COST DIFFERENCE
            </div>
          </div>
        </div>
      </FadeIn>

      {/* Methodology Disclaimer */}
      <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 dark:text-slate-200">Illustrative Scenario Disclaimer:</strong> Illustrative scenario based on configurable assumptions; not a measured field outcome or validated Satin Finserv saving. Model demonstrates operational verification logic only.
        </p>
      </div>
    </div>
  );
};
