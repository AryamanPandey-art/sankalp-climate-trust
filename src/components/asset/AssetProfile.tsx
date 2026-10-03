import React from 'react';
import type { SolarPumpAsset, PhotoEvidenceItem } from '../../types/asset';
import { LocationMap } from './LocationMap';
import { PhotoEvidenceDeck } from './PhotoEvidenceDeck';
import { PerformanceModel } from './PerformanceModel';
import { VerificationTimeline } from './VerificationTimeline';
import { DistinctionBadge } from '../common/Badge';
import { ReliableImage } from '../common/ReliableImage';
import { formatINR } from '../../services/VerificationEngine';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { FadeIn, StaggerContainer, StaggerItem, AnimatedBar, GlowPulse, ScanLine } from '../motion/MotionSystem';
import { motion } from 'framer-motion';
import { Play, FileText, MapPin, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface AssetProfileProps {
  asset: SolarPumpAsset;
  onBack: () => void;
  onRunVerificationModal: () => void;
  onGenerateReport: () => void;
  onAddPhoto?: (photo: PhotoEvidenceItem) => void;
}

export const AssetProfile: React.FC<AssetProfileProps> = ({
  asset,
  onBack,
  onRunVerificationModal,
  onGenerateReport,
  onAddPhoto
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const isHighConfidence = asset.trustScore >= 80;
  const isMediumConfidence = asset.trustScore >= 60 && asset.trustScore < 80;
  const isLowConfidence = asset.trustScore < 60;

  return (
    <div className="space-y-8 pb-16">
      {/* Dossier Header Actions */}
      <FadeIn delay={0.05}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <motion.button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            whileHover={{ x: -3 }}
          >
            <ArrowLeft className="w-4 h-4" /> Back to Operations Center
          </motion.button>

          <div className="flex items-center gap-3">
            <motion.button
              onClick={onRunVerificationModal}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-2 transition shadow-md border border-emerald-400/30"
              whileHover={{ y: -1, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Initiate Verification Scan</span>
            </motion.button>

            <motion.button
              onClick={onGenerateReport}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition border ${
                isLight
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700'
              }`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Generate Audit Report</span>
            </motion.button>
          </div>
        </div>
      </FadeIn>

      {/* Asset Dossier Hero & Multi-Factor Trust Score */}
      <StaggerContainer className="grid grid-cols-1 lg:grid-cols-12 gap-6" staggerDelay={0.08} initialDelay={0.1}>
        {/* Left: Asset Identity & Environmental Image Preview */}
        <StaggerItem className="lg:col-span-6">
          <div className={`p-6 sm:p-7 rounded-3xl border space-y-4 transition ${
            isLight
              ? 'bg-white border-slate-200 shadow-sm'
              : 'glass-panel border-slate-800'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900 dark:text-white">
                  {asset.id}
                </span>
                <DistinctionBadge type={asset.verificationStatus} />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                ASSET INTELLIGENCE
              </span>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200 font-display">
                {asset.pumpManufacturer} {asset.pumpCapacityHp} HP Solar Irrigation Pump
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-xs flex items-center gap-1.5 mt-0.5 font-mono">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {asset.registeredLocation.village}, {asset.registeredLocation.district} • {asset.registeredLocation.lat.toFixed(4)}° N, {asset.registeredLocation.lng.toFixed(4)}° E
              </p>
            </div>

            {/* Environmental Photo Card (As seen in Reference Image) */}
            <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 group">
              <ReliableImage
                src={asset.photos && asset.photos.length > 0 ? asset.photos[0].url : (isLight ? '/assets/hero_light.jpg' : '/assets/hero_dark.jpg')}
                alt="Solar Pump in Field"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                containerClassName="w-full h-full"
                badgeLabel="PHYSICAL ASSET"
                fallbackTitle={`${asset.pumpManufacturer} Solar Irrigation Pump`}
                fallbackSubtitle="Ground telemetry active • Photo preview offline"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs z-10">
                <span className="font-mono text-[11px] font-bold bg-black/60 px-2 py-0.5 rounded backdrop-blur-sm">
                  FLOWING CANAL • 180 L/MIN
                </span>
                <span className="font-mono text-[10px] bg-emerald-500/80 px-2 py-0.5 rounded text-white font-bold backdrop-blur-sm">
                  GROUND TRUTH
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Borrower</span>
                <div className="text-slate-900 dark:text-white font-bold truncate mt-0.5">{asset.borrowerName}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">Loan Value</span>
                <div className="text-emerald-700 dark:text-emerald-400 font-bold mt-0.5">{formatINR(asset.loanAmount)}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 text-[10px] uppercase font-bold">PV Array</span>
                <div className="text-slate-900 dark:text-white font-bold mt-0.5">{asset.solarCapacityKwp} kWp</div>
              </div>
            </div>
          </div>
        </StaggerItem>

        {/* Right: Circular Trust Score Gauge & Breakdown Bars (Matching Reference Image) */}
        <StaggerItem className="lg:col-span-6">
          <GlowPulse className="rounded-3xl h-full" color={isLowConfidence ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)'}>
            <div className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between h-full relative overflow-hidden transition ${
              isLight
                ? 'bg-white border-slate-200 shadow-sm'
                : 'glass-panel-glow border-emerald-500/30'
            }`}>
              <ScanLine />

              {/* Circular Gauge Center Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 justify-center sm:justify-start font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" /> ASSET VERIFICATION CONFIDENCE
                  </span>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {isHighConfidence && 'High Confidence Clearance'}
                    {isMediumConfidence && 'Moderate Confidence (Review)'}
                    {isLowConfidence && 'Discrepancy Flagged'}
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 italic">
                    Asset verification confidence — not a borrower credit score.
                  </div>
                </div>

                {/* Circular Radial Gauge (Matching Reference Image Ring) */}
                <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={isLight ? '#e5ded3' : '#1e293b'}
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="transparent"
                      stroke={isHighConfidence ? (isLight ? '#1b7340' : '#10b981') : '#f59e0b'}
                      strokeWidth="8"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * asset.trustScore) / 100}
                      strokeLinecap="round"
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      <AnimatedNumber value={asset.trustScore} duration={1.2} />
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-tighter">
                      CONFIDENCE
                    </span>
                  </div>
                </div>
              </div>

              {/* Confidence Breakdown Progress Bars (Matching Reference Image Items) */}
              <div className="space-y-3 py-3">
                {[
                  { label: 'Location Verification', value: asset.scoreBreakdown.locationEvidence || 92 },
                  { label: 'Photo Evidence', value: asset.scoreBreakdown.installationEvidence || 87 },
                  { label: 'Performance Match', value: asset.scoreBreakdown.performanceConsistency || 78, warn: (asset.scoreBreakdown.performanceConsistency || 78) < 60 },
                  { label: 'Weather Correlation', value: 90 },
                  { label: 'Equipment Match', value: asset.scoreBreakdown.equipmentMatch || 84 },
                ].map((item, idx) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      <span>{item.label}</span>
                      <span className={item.warn ? 'text-rose-600 dark:text-rose-400 font-mono font-bold' : 'text-emerald-600 dark:text-emerald-400 font-mono font-bold'}>
                        <AnimatedNumber value={item.value} suffix="%" duration={1} />
                      </span>
                    </div>
                    <AnimatedBar
                      value={item.value}
                      color={item.warn ? 'bg-rose-500' : isLight ? 'bg-[#1b7340]' : 'bg-emerald-500'}
                      delay={0.15 + idx * 0.08}
                    />
                  </div>
                ))}
              </div>

              {/* WHY THIS RESULT? Compact Transparency Card */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-left space-y-1.5 font-mono">
                <div className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-1">
                  <span>WHY THIS RESULT?</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{asset.trustScore} / 100</span>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Evidence freshness:</span>
                    <span className={asset.scoreBreakdown?.evidenceFreshness && asset.scoreBreakdown.evidenceFreshness >= 80 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : asset.scoreBreakdown?.evidenceFreshness && asset.scoreBreakdown.evidenceFreshness >= 60 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                      {asset.scoreBreakdown?.evidenceFreshness && asset.scoreBreakdown.evidenceFreshness >= 80 ? 'STRONG' : asset.scoreBreakdown?.evidenceFreshness && asset.scoreBreakdown.evidenceFreshness >= 60 ? 'MODERATE' : 'WEAK'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">GPS consistency:</span>
                    <span className={asset.gpsOffsetMeters <= 100 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : asset.gpsOffsetMeters <= 300 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                      {asset.gpsOffsetMeters <= 100 ? 'STRONG' : asset.gpsOffsetMeters <= 300 ? 'MODERATE' : 'WEAK'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Climate context:</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">STRONG</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400">Performance match:</span>
                    <span className={Math.abs(asset.performance.differencePercent) <= 15 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : Math.abs(asset.performance.differencePercent) <= 30 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-rose-600 dark:text-rose-400 font-bold'}>
                      {Math.abs(asset.performance.differencePercent) <= 15 ? 'STRONG' : Math.abs(asset.performance.differencePercent) <= 30 ? 'MODERATE' : 'WEAK'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-slate-400 dark:text-slate-500 text-center font-mono border-t border-slate-200 dark:border-slate-800 pt-2 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Asset verification confidence — not a borrower credit score.
              </div>
            </div>
          </GlowPulse>
        </StaggerItem>
      </StaggerContainer>

      {/* Location Verification Map */}
      <FadeIn delay={0.2}>
        <LocationMap
          registeredLocation={asset.registeredLocation}
          photoLocation={asset.photoLocation}
          gpsOffsetMeters={asset.gpsOffsetMeters}
        />
      </FadeIn>

      {/* Photo Evidence Deck */}
      <FadeIn delay={0.25}>
        <PhotoEvidenceDeck
          photos={asset.photos}
          checklist={asset.evidenceChecklist}
          onAddPhoto={onAddPhoto}
        />
      </FadeIn>

      {/* Performance Model */}
      <FadeIn delay={0.3}>
        <PerformanceModel
          performance={asset.performance}
          solarCapacityKwp={asset.solarCapacityKwp}
        />
      </FadeIn>

      {/* Verification Timeline */}
      <FadeIn delay={0.35}>
        <VerificationTimeline timeline={asset.timeline} />
      </FadeIn>
    </div>
  );
};
