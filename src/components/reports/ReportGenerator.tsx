import React from 'react';
import type { SolarPumpAsset } from '../../types/asset';
import { DistinctionBadge } from '../common/Badge';
import { formatINR } from '../../services/VerificationEngine';
import { Printer, X, FileText, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ReportGeneratorProps {
  asset: SolarPumpAsset;
  onClose: () => void;
}

export const ReportGenerator: React.FC<ReportGeneratorProps> = ({ asset, onClose }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const handlePrint = () => {
    window.print();
  };

  const isAnomalous = Math.abs(asset.performance.differencePercent) > 25 || asset.verificationStatus === 'ANOMALY';
  const isGpsMismatch = asset.gpsOffsetMeters > 100;
  const isPhotoStale = asset.evidenceChecklist.evidenceConfidence < 75;

  const recommendation = isAnomalous
    ? {
        tier: 'PRIORITY 1',
        title: 'Field Inspection Recommended',
        action: 'Dispatch regional field engineer to inspect pump hardware and electrical wiring.',
        badgeColor: 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/30'
      }
    : isGpsMismatch || isPhotoStale
    ? {
        tier: 'PRIORITY 2',
        title: 'Digital Re-Verification & Evidence Refresh',
        action: 'Trigger SMS evidence refresh prompt for updated geotagged photos and serial plate verification.',
        badgeColor: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
      }
    : {
        tier: 'PRIORITY 3',
        title: 'Continuous Remote Monitoring',
        action: 'Asset cleared for digital monitoring. No physical dispatch required.',
        badgeColor: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
      };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className={`rounded-3xl max-w-4xl w-full border shadow-2xl my-8 overflow-hidden transition ${
        isLight
          ? 'bg-white border-slate-200 text-slate-900'
          : 'bg-slate-900 border-slate-800 text-slate-100'
      }`}>
        
        {/* Modal Action Bar (Hidden during print) */}
        <div className={`p-4 border-b flex items-center justify-between print:hidden ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-slate-950 border-slate-800'
        }`}>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Asset Verification Dossier • {asset.id}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
            >
              <Printer className="w-3.5 h-3.5" /> Print / Save PDF
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Document Content */}
        <div className={`p-8 space-y-6 print:text-slate-900 print:bg-white font-sans text-xs ${
          isLight ? 'bg-white text-slate-900' : 'bg-slate-950 text-slate-100'
        }`}>
          
          {/* Document Header */}
          <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-5 print:border-slate-300">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-black tracking-tight text-slate-900 dark:text-white print:text-slate-900 font-display">
                  RURAL CLIMATE ASSET TRUST
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold uppercase">
                  SANKALP 2026
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 font-medium">
                Comprehensive Verification & Decision-Support Audit Dossier
              </p>
              <div className="text-[10px] text-amber-600 dark:text-amber-400 font-mono mt-1 font-semibold">
                [ILLUSTRATIVE DEMO AUDIT • PROTOTYPE DECISION SUPPORT]
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400 text-base">{asset.id}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Audit Timestamp: 20 Feb 2026</div>
              <div className="text-[10px] text-slate-400 font-mono">Status: {asset.verificationStatus}</div>
            </div>
          </div>

          {/* 1. Executive Summary */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white print:text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
              <span>1. Executive Summary</span>
              <span className="text-[10px] font-mono text-slate-400">SYNTHESIS</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 print:bg-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="text-xs text-slate-700 dark:text-slate-300">
                  Asset <strong className="font-mono text-slate-900 dark:text-white">{asset.id}</strong> ({asset.pumpCapacityHp} HP {asset.pumpManufacturer}) operated by <strong className="text-slate-900 dark:text-white">{asset.borrowerName}</strong> in <strong>{asset.registeredLocation.village}, {asset.registeredLocation.district}</strong>.
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {isAnomalous
                    ? 'Harvest deviation of ' + asset.performance.differencePercent + '% detected under adequate solar irradiance. Physical inspection prioritized to protect capital.'
                    : isGpsMismatch
                    ? 'Geographic offset of ' + asset.gpsOffsetMeters + 'm exceeds standard 100m threshold. Location re-verification recommended.'
                    : 'Evidence, geographic boundary, and generation models are mathematically consistent. Clear for continuous digital monitoring.'}
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-3 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-800 pt-2 sm:pt-0 sm:pl-4">
                <div className="text-center sm:text-right">
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Confidence</div>
                  <div className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">{asset.trustScore}/100</div>
                </div>
                <DistinctionBadge type={asset.verificationStatus} size="sm" />
              </div>
            </div>
          </div>

          {/* 2. Asset & Borrower Details */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white print:text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
              <span>2. Asset & Financing Profile</span>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">REPORTED</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Borrower</span>
                <strong className="text-slate-900 dark:text-white print:text-slate-900 text-xs truncate block mt-0.5">{asset.borrowerName}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Loan Principal</span>
                <strong className="text-emerald-700 dark:text-emerald-400 font-mono text-xs block mt-0.5">{formatINR(asset.loanAmount)}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Financing Date</span>
                <strong className="text-slate-800 dark:text-slate-200 font-mono text-xs block mt-0.5">{asset.financingDate}</strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 block text-[10px] uppercase font-semibold">Hardware Type</span>
                <strong className="text-slate-800 dark:text-slate-200 text-xs block mt-0.5">{asset.pumpCapacityHp} HP {asset.pumpManufacturer}</strong>
              </div>
            </div>
          </div>

          {/* 3. Evidence Summary */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white print:text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
              <span>3. Ground Evidence Summary</span>
              <span className="text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-1.5 py-0.5 rounded">VERIFIED</span>
            </h3>
            <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Photographic Records</span>
                <strong className="text-slate-900 dark:text-white text-xs">{asset.photos.length} geotagged image(s)</strong>
                <div className="text-[10px] text-slate-400 mt-0.5">EXIF timestamps validated</div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Evidence Quality Score</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-mono text-xs">{asset.evidenceChecklist.evidenceConfidence}%</strong>
                <div className="text-[10px] text-slate-400 mt-0.5">Checklist verification pass</div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Hardware Evidence</span>
                <strong className="text-slate-900 dark:text-white text-xs">Pump & PV Array Visible</strong>
                <div className="text-[10px] text-slate-400 mt-0.5">Civil mount verified</div>
              </div>
            </div>
          </div>

          {/* 4. Location Verification */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white print:text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
              <span>4. Geospatial Location Audit</span>
              <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded ${isGpsMismatch ? 'bg-amber-500/10 text-amber-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                {isGpsMismatch ? 'LOCATION MISMATCH' : 'LOCATION CONSISTENT'}
              </span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block">Registered Coordinates</span>
                <strong className="font-mono text-xs text-slate-800 dark:text-slate-200 block mt-0.5">
                  {asset.registeredLocation.lat.toFixed(4)}°N, {asset.registeredLocation.lng.toFixed(4)}°E
                </strong>
                <div className="text-[10px] text-slate-400">{asset.registeredLocation.village}, {asset.registeredLocation.district}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block">Evidence Photo Coordinates</span>
                <strong className="font-mono text-xs text-slate-800 dark:text-slate-200 block mt-0.5">
                  {asset.photoLocation ? `${asset.photoLocation.lat.toFixed(4)}°N, ${asset.photoLocation.lng.toFixed(4)}°E` : 'Pending EXIF Tag'}
                </strong>
                <div className="text-[10px] text-slate-400">Mobile EXIF GPS</div>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
                <span className="text-slate-500 text-[10px] uppercase block">Ground Spatial Offset</span>
                <strong className={`font-mono text-xs block mt-0.5 ${isGpsMismatch ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                  {asset.gpsOffsetMeters} meters
                </strong>
                <div className="text-[10px] text-slate-400">{isGpsMismatch ? 'Exceeds 100m tolerance band' : 'Within 100m farm parcel boundary'}</div>
              </div>
            </div>
          </div>

          {/* 5. Performance Analysis */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white print:text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
              <span>5. Energy Generation & Climate Modeling</span>
              <span className="text-[9px] font-mono text-sky-600 dark:text-cyan-400 font-semibold bg-sky-500/10 px-1.5 py-0.5 rounded">ESTIMATED vs REPORTED</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Modeled Expected Output</span>
                <strong className="text-sky-600 dark:text-cyan-400 font-mono text-xs block mt-0.5">{asset.performance.expectedKwhPerDay} kWh/day</strong>
                <div className="text-[10px] text-slate-400">Solar irradiance model</div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Reported Generation</span>
                <strong className="text-slate-900 dark:text-white font-mono text-xs block mt-0.5">{asset.performance.reportedKwhPerDay} kWh/day</strong>
                <div className="text-[10px] text-slate-400">Inverter/meter telemetry</div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Solar Irradiance</span>
                <strong className="text-slate-800 dark:text-slate-200 font-mono text-xs block mt-0.5">{asset.performance.solarIrradianceKwhM2} kWh/m²/day</strong>
                <div className="text-[10px] text-slate-400">Satellite solar feed</div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Ambient Temperature</span>
                <strong className="text-slate-800 dark:text-slate-200 font-mono text-xs block mt-0.5">{asset.performance.ambientTempCelsius}°C</strong>
                <div className="text-[10px] text-slate-400">Cloud cover: {asset.performance.cloudCoverPercent}%</div>
              </div>
            </div>
          </div>

          {/* 6. Anomaly Assessment */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white print:text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
              <span>6. Anomaly Assessment & Variation Analysis</span>
              <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded ${isAnomalous ? 'bg-rose-500/10 text-rose-600' : 'bg-emerald-500/10 text-emerald-600'}`}>
                {isAnomalous ? 'ANOMALY DETECTED' : 'WITHIN TOLERANCE'}
              </span>
            </h3>
            <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
              isAnomalous
                ? 'bg-rose-500/5 border-rose-500/30'
                : 'bg-emerald-500/5 border-emerald-500/30'
            }`}>
              {isAnomalous ? (
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-bold text-xs">
                  Performance Deviation: <span className="font-mono">{asset.performance.differencePercent > 0 ? `+${asset.performance.differencePercent}%` : `${asset.performance.differencePercent}%`}</span>
                </div>
                <div className="text-[11px] text-slate-600 dark:text-slate-300">
                  {isAnomalous
                    ? 'Observed harvest is significantly below the thermodynamic model under clear sky irradiance. Satellite weather correlation confirms solar insolation was optimal, suggesting possible contributing signals: mechanical wear, wiring degradation, localized shading, or pump clogging.'
                    : 'Reported harvest tracks expected thermodynamic baseline within nominal ±10% variation. Weather conditions fully explain minor variance.'}
                </div>
              </div>
            </div>
          </div>

          {/* 7. Verification Confidence */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white print:text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
              <span>7. Asset Verification Confidence</span>
              <span className="text-[9px] font-mono text-slate-400">PROTOTYPE CONFIDENCE MODEL</span>
            </h3>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-slate-600 dark:text-slate-400 font-semibold uppercase">
                  COMPUTED VERIFICATION CONFIDENCE
                </div>
                <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {asset.trustScore} / 100
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 italic mt-1">
                  Asset verification confidence — not a borrower credit score.
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[10px] w-full sm:w-auto">
                <div className="p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-slate-400">Location</div>
                  <div className="font-bold font-mono text-slate-800 dark:text-slate-200">{asset.scoreBreakdown.locationEvidence}%</div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-slate-400">Photo Evidence</div>
                  <div className="font-bold font-mono text-slate-800 dark:text-slate-200">{asset.scoreBreakdown.installationEvidence}%</div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-slate-400">Performance</div>
                  <div className="font-bold font-mono text-slate-800 dark:text-slate-200">{asset.scoreBreakdown.performanceConsistency}%</div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-slate-400">Equipment</div>
                  <div className="font-bold font-mono text-slate-800 dark:text-slate-200">{asset.scoreBreakdown.equipmentMatch}%</div>
                </div>
                <div className="p-2 rounded bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-center">
                  <div className="text-slate-400">Freshness</div>
                  <div className="font-bold font-mono text-slate-800 dark:text-slate-200">{asset.scoreBreakdown.evidenceFreshness ?? 90}%</div>
                </div>
              </div>
            </div>
          </div>

          {/* 8. Inspection Recommendation */}
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white print:text-slate-900 uppercase tracking-wider text-xs border-b border-slate-200 dark:border-slate-800 pb-1 flex items-center justify-between">
              <span>8. Operational Inspection Recommendation</span>
              <span className="text-[10px] font-mono text-slate-400">ACTION DISPATCH</span>
            </h3>
            <div className={`p-4 rounded-xl border flex items-center justify-between gap-4 ${recommendation.badgeColor}`}>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-current/10">
                    {recommendation.tier}
                  </span>
                  <strong className="text-xs uppercase tracking-wide">{recommendation.title}</strong>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {recommendation.action}
                </p>
              </div>
              <DistinctionBadge type={asset.verificationStatus} size="lg" />
            </div>
          </div>

          {/* 9. Responsible Verification Note */}
          <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white print:text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>9. Responsible Verification & Decision Support Note</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 space-y-1 leading-relaxed">
              <p>
                <strong>Methodology & Scope Boundaries:</strong> This dossier was generated as an operational decision-support tool for lenders financing rural climate infrastructure. It synthesizes user-provided installation photos, device EXIF geotags, satellite solar irradiance, and reported kWh harvest data.
              </p>
              <p>
                <strong>Non-Credit Guarantee:</strong> This report <em>does not</em> calculate borrower creditworthiness, predict debt default probability, guarantee equipment mechanical longevity, or replace every on-site physical inspection. It prioritizes which assets require field intervention vs remote continuous monitoring.
              </p>
            </div>
          </div>

          {/* Sign-off footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
            <div>Rural Climate Asset Trust • SANKALP 2026 Climate Edition Prototype</div>
            <div>Illustrative Synthetic Data • Decision-Support Architecture</div>
          </div>

        </div>

      </div>
    </div>
  );
};
