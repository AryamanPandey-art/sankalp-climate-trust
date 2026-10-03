import React, { useState, useEffect } from 'react';
import type { PerformanceData } from '../../types/asset';
import { DistinctionBadge } from '../common/Badge';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { FadeIn, StaggerContainer, StaggerItem, MetricReveal } from '../motion/MotionSystem';
import { motion } from 'framer-motion';
import { ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Area, AreaChart } from 'recharts';
import { Sun, Cloud, Thermometer, Zap, Info, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface PerformanceModelProps {
  performance: PerformanceData;
  solarCapacityKwp: number;
}

export const PerformanceModel: React.FC<PerformanceModelProps> = ({
  performance,
  solarCapacityKwp
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const isAnomaly = performance.differencePercent < -30;
  const [chartVisible, setChartVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setChartVisible(true), 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`p-5 sm:p-6 rounded-2xl border space-y-6 transition-all duration-300 ${
      isLight
        ? isAnomaly
          ? 'bg-rose-50/40 border-rose-200 shadow-sm'
          : 'bg-white border-slate-200/80 shadow-sm'
        : isAnomaly
        ? 'glass-panel border-rose-500/30'
        : 'glass-panel border-slate-800'
    }`}>
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-500" /> Expected vs Reported Generation Model
              </h3>
              <DistinctionBadge type="ESTIMATED" label="SATELLITE DERIVED" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Continuous correlation between satellite solar irradiance, ambient temperature derating, and reported telemetry.
            </p>
          </div>

          <div>
            {isAnomaly ? (
              <motion.span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <AlertTriangle className="w-3.5 h-3.5" /> DEVIATION FLAG (<AnimatedNumber value={performance.differencePercent} decimals={1} suffix="%" />)
              </motion.span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> NORMAL HARVEST BAND (<AnimatedNumber value={performance.differencePercent} decimals={1} suffix="%" />)
              </span>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Environmental & Telemetry Parameter Cards */}
      <StaggerContainer className="grid grid-cols-2 sm:grid-cols-4 gap-3" staggerDelay={0.06} initialDelay={0.1}>
        <StaggerItem>
          <MetricReveal delay={0.05}>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-500" /> Solar Irradiance
              </div>
              <div className="text-slate-900 dark:text-white font-mono font-bold text-base mt-1">
                <AnimatedNumber value={performance.solarIrradianceKwhM2} decimals={2} /> <span className="text-xs text-slate-400 font-normal">kWh/m²</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Peak sun hours index</div>
            </div>
          </MetricReveal>
        </StaggerItem>

        <StaggerItem>
          <MetricReveal delay={0.1}>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Thermometer className="w-3.5 h-3.5 text-rose-500" /> Ambient Temp
              </div>
              <div className="text-slate-900 dark:text-white font-mono font-bold text-base mt-1">
                <AnimatedNumber value={performance.ambientTempCelsius} decimals={1} suffix="°C" />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Thermal derating (-0.4%/°C)</div>
            </div>
          </MetricReveal>
        </StaggerItem>

        <StaggerItem>
          <MetricReveal delay={0.15}>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Cloud className="w-3.5 h-3.5 text-sky-500" /> Cloud Cover
              </div>
              <div className="text-slate-900 dark:text-white font-mono font-bold text-base mt-1">
                <AnimatedNumber value={performance.cloudCoverPercent} suffix="%" />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Atmospheric clarity index</div>
            </div>
          </MetricReveal>
        </StaggerItem>

        <StaggerItem>
          <MetricReveal delay={0.2}>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
              <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-500" /> Panel Capacity
              </div>
              <div className="text-slate-900 dark:text-white font-mono font-bold text-base mt-1">
                <AnimatedNumber value={solarCapacityKwp} decimals={1} /> <span className="text-xs text-slate-400 font-normal">kWp</span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Installed peak rating</div>
            </div>
          </MetricReveal>
        </StaggerItem>
      </StaggerContainer>

      {/* Comparison Hero Card */}
      <FadeIn delay={0.2}>
        <div className="p-5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                EXPECTED OUTPUT
              </span>
              <DistinctionBadge type="ESTIMATED" size="sm" />
            </div>
            <div className="text-3xl font-black text-sky-600 dark:text-cyan-400 font-mono">
              <AnimatedNumber value={performance.expectedKwhPerDay} decimals={1} duration={1.2} />{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">kWh/day</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Irradiance × Array Size × 78% Standard System Efficiency
            </p>
          </div>

          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                REPORTED OUTPUT
              </span>
              <DistinctionBadge type="REPORTED" size="sm" />
            </div>
            <div className={`text-3xl font-black font-mono ${isAnomaly ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-white'}`}>
              <AnimatedNumber value={performance.reportedKwhPerDay} decimals={1} duration={1.2} />{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">kWh/day</span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Inverter IoT telemetry or ground meter photo log
            </p>
          </div>

          <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-3 sm:pt-0 sm:pl-4">
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              PERFORMANCE VARIATION
            </span>
            <div className={`text-3xl font-black font-mono ${isAnomaly ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
              <AnimatedNumber
                value={performance.differencePercent}
                decimals={1}
                prefix={performance.differencePercent > 0 ? '+' : ''}
                suffix="%"
                duration={1.5}
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {isAnomaly ? '⚠ Exceeds -30% deviation threshold' : '✓ Normal tolerance band (±15%)'}
            </p>
          </div>
        </div>
      </FadeIn>

      {/* 7-Day Contextualized Historical Chart */}
      <FadeIn delay={0.3}>
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <span>7-Day Generation Trend vs Satellite Expected Model</span>
            <div className="flex items-center gap-4 text-[11px] font-normal">
              <span className="flex items-center gap-1.5 text-sky-600 dark:text-cyan-400 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500 dark:bg-cyan-400" /> Expected Model
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className={`w-2.5 h-2.5 rounded-full ${isAnomaly ? 'bg-rose-500' : 'bg-emerald-500'}`} /> Reported Output
              </span>
            </div>
          </div>

          <div className="w-full h-60 rounded-xl bg-slate-50/70 dark:bg-slate-950/60 p-3 border border-slate-200 dark:border-slate-800">
            {chartVisible && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performance.historical7Days}>
                  <defs>
                    <linearGradient id="gradExpected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isLight ? '#0284c7' : '#06b6d4'} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={isLight ? '#0284c7' : '#06b6d4'} stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="gradReported" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={isAnomaly ? '#f43f5e' : isLight ? '#16a34a' : '#10b981'} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={isAnomaly ? '#f43f5e' : isLight ? '#16a34a' : '#10b981'} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={isLight ? '#e2e8f0' : '#1e293b'} />
                  <XAxis dataKey="date" stroke={isLight ? '#64748b' : '#64748b'} fontSize={11} />
                  <YAxis stroke={isLight ? '#64748b' : '#64748b'} fontSize={11} domain={[0, 8]} unit=" kWh" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: isLight ? '#ffffff' : '#0f172a',
                      borderColor: isLight ? '#cbd5e1' : '#334155',
                      borderRadius: '12px',
                      fontSize: '12px',
                      color: isLight ? '#0f172a' : '#ffffff',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="expected"
                    stroke={isLight ? '#0284c7' : '#06b6d4'}
                    strokeWidth={2.5}
                    fill="url(#gradExpected)"
                    dot={{ r: 3, fill: isLight ? '#0284c7' : '#06b6d4' }}
                    name="Expected (kWh)"
                  />
                  <Area
                    type="monotone"
                    dataKey="reported"
                    stroke={isAnomaly ? '#f43f5e' : isLight ? '#16a34a' : '#10b981'}
                    strokeWidth={2.5}
                    fill="url(#gradReported)"
                    dot={{ r: 3, fill: isAnomaly ? '#f43f5e' : isLight ? '#16a34a' : '#10b981' }}
                    name="Reported (kWh)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Explanatory Context Footer: Contextual Anomaly Reasoning */}
      <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 dark:text-slate-200">Contextual Anomaly Reasoning:</strong> Performance divergence indicates mechanical or environmental divergence (e.g. localized cloud cover, panel soiling, pump maintenance, or seasonal dry aquifer)—<strong className="text-slate-800 dark:text-slate-200">never assumed credit default</strong>. It provides objective data to prioritize low-cost digital evidence refreshes or targeted physical audits.
        </p>
      </div>
    </div>
  );
};
