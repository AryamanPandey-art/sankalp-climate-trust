import React, { useState } from 'react';
import type { SolarPumpAsset, VerificationStatus } from '../../types/asset';
import { usePortfolio } from '../../context/PortfolioContext';
import { PlusCircle, Sparkles, ArrowRight, CheckCircle2, Eye, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface AssetRegisterFormProps {
  onRegisterSuccess: (newAsset: SolarPumpAsset) => void;
  onCancel: () => void;
}

export const AssetRegisterForm: React.FC<AssetRegisterFormProps> = ({
  onRegisterSuccess,
  onCancel
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { generateDemoAsset, registerAsset } = usePortfolio();

  // Active scenario metadata tag
  const [activeScenarioLabel, setActiveScenarioLabel] = useState<string | null>(null);
  const [autofillPulseKey, setAutofillPulseKey] = useState<number>(0);
  
  // Registered success transition state
  const [registeredAsset, setRegisteredAsset] = useState<SolarPumpAsset | null>(null);

  // Template of full generated asset to preserve rich telemetry, photos, and performance
  const [assetTemplate, setAssetTemplate] = useState<SolarPumpAsset | null>(null);

  const [formData, setFormData] = useState({
    borrowerName: 'Pabitra Hazarika',
    assetId: 'SOL-ASSAM-00215',
    pumpManufacturer: 'Shakti Pumps Ltd',
    pumpModel: 'SP-5HP-DC Submersible',
    pumpCapacityHp: 5.0,
    solarCapacityKwp: 4.8,
    installationDate: '2026-01-10',
    village: 'Sarthebari',
    district: 'Barpeta',
    state: 'Assam',
    latitude: 26.3214,
    longitude: 91.0042,
    loanAmount: 185000,
    financingDate: '2026-01-05',
    installerName: 'Pragjyotish Solar Solutions',
    expectedDailyHours: 7.5,
    evidenceStatus: 'VERIFIED' as VerificationStatus,
    evidenceNotes: 'Geotagged photographic records uploaded'
  });

  const handleAutofillDemo = () => {
    const { asset, profileName, badgeLabel } = generateDemoAsset();
    
    setAssetTemplate(asset);
    setActiveScenarioLabel(`${profileName} • ${badgeLabel}`);
    setAutofillPulseKey(prev => prev + 1);

    setFormData({
      borrowerName: asset.borrowerName,
      assetId: asset.id,
      pumpManufacturer: asset.pumpManufacturer,
      pumpModel: asset.pumpModel,
      pumpCapacityHp: asset.pumpCapacityHp,
      solarCapacityKwp: asset.solarCapacityKwp,
      installationDate: asset.financingDate,
      village: asset.registeredLocation.village,
      district: asset.registeredLocation.district,
      state: asset.registeredLocation.state,
      latitude: asset.registeredLocation.lat,
      longitude: asset.registeredLocation.lng,
      loanAmount: asset.loanAmount,
      financingDate: asset.financingDate,
      installerName: asset.installerName,
      expectedDailyHours: asset.expectedDailyHours,
      evidenceStatus: asset.verificationStatus,
      evidenceNotes: asset.inspectionPriority === 'PRIORITY_1'
        ? 'Performance deviation flagged (-38% below satellite model)'
        : asset.inspectionPriority === 'PRIORITY_2'
        ? 'Quarterly evidence refresh due / GPS correlation review'
        : 'All 5 evidence parameters verified within normal tolerance'
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let fullAsset: SolarPumpAsset;

    if (assetTemplate && assetTemplate.id === formData.assetId) {
      // Use the coherent rich asset template updated with any manual edits
      fullAsset = {
        ...assetTemplate,
        borrowerName: formData.borrowerName,
        loanAmount: formData.loanAmount,
        financingDate: formData.financingDate,
        pumpManufacturer: formData.pumpManufacturer,
        pumpModel: formData.pumpModel,
        pumpCapacityHp: formData.pumpCapacityHp,
        solarCapacityKwp: formData.solarCapacityKwp,
        expectedDailyHours: formData.expectedDailyHours,
        installerName: formData.installerName,
        registeredLocation: {
          lat: formData.latitude,
          lng: formData.longitude,
          village: formData.village,
          district: formData.district,
          state: formData.state
        }
      };
    } else {
      // Build coherent asset object
      const expectedKwh = Number((formData.solarCapacityKwp * 5.42 * 0.78).toFixed(1));
      const reportedKwh = Number((expectedKwh * 0.95).toFixed(1));

      fullAsset = {
        id: formData.assetId,
        borrowerName: formData.borrowerName,
        loanAmount: formData.loanAmount,
        financingDate: formData.financingDate,
        pumpManufacturer: formData.pumpManufacturer,
        pumpModel: formData.pumpModel,
        pumpCapacityHp: formData.pumpCapacityHp,
        solarCapacityKwp: formData.solarCapacityKwp,
        expectedDailyHours: formData.expectedDailyHours,
        installerName: formData.installerName,
        registeredLocation: {
          lat: formData.latitude,
          lng: formData.longitude,
          village: formData.village,
          district: formData.district,
          state: formData.state
        },
        photoLocation: {
          lat: formData.latitude + 0.0003,
          lng: formData.longitude + 0.0003,
          village: formData.village,
          district: formData.district,
          state: formData.state
        },
        gpsOffsetMeters: 38,
        trustScore: 88,
        scoreBreakdown: {
          installationEvidence: 92,
          locationEvidence: 96,
          equipmentMatch: 90,
          performanceConsistency: 88,
          evidenceFreshness: 90
        },
        verificationStatus: formData.evidenceStatus,
        inspectionPriority: formData.evidenceStatus === 'ANOMALY' ? 'PRIORITY_1' : formData.evidenceStatus === 'UNVERIFIED' ? 'PRIORITY_2' : 'PRIORITY_3',
        evidenceChecklist: {
          equipmentVisible: true,
          solarPanelVisible: true,
          locationMetadataAvailable: true,
          timestampAvailable: true,
          serialNumberVisible: true,
          evidenceConfidence: 91
        },
        photos: [
          {
            id: `p-${formData.assetId}-1`,
            type: 'panel',
            title: 'Solar PV Array & Irrigation Pump',
            url: '/assets/evidence/photo1_hero.jpg',
            uploadedAt: new Date().toISOString(),
            status: 'passed',
            notes: 'Geotagged installation view showing the solar array, mounting structure, pump outlet and surrounding agricultural field.'
          }
        ],
        performance: {
          expectedKwhPerDay: expectedKwh,
          reportedKwhPerDay: reportedKwh,
          differencePercent: -5.0,
          solarIrradianceKwhM2: 5.42,
          ambientTempCelsius: 28.0,
          cloudCoverPercent: 10,
          operatingHoursReported: formData.expectedDailyHours,
          statusText: 'WITHIN EXPECTED RANGE',
          historical7Days: [
            { date: '25 Feb', expected: expectedKwh, reported: reportedKwh },
            { date: '26 Feb', expected: expectedKwh, reported: reportedKwh },
            { date: '27 Feb', expected: expectedKwh, reported: reportedKwh },
            { date: '28 Feb', expected: expectedKwh, reported: reportedKwh },
            { date: '01 Mar', expected: expectedKwh, reported: reportedKwh },
            { date: '02 Mar', expected: expectedKwh, reported: reportedKwh },
            { date: '03 Mar', expected: expectedKwh, reported: reportedKwh }
          ]
        },
        timeline: [
          {
            id: `t-${formData.assetId}-1`,
            date: 'TODAY',
            title: 'Asset registered',
            description: `Registered for borrower ${formData.borrowerName}.`,
            type: 'info'
          }
        ],
        lastEvidenceDate: new Date().toISOString().split('T')[0]
      };
    }

    // Register into Central Portfolio
    registerAsset(fullAsset);
    setRegisteredAsset(fullAsset);
  };

  const inputClass = isLight
    ? "w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-none transition shadow-sm"
    : "w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none transition";
  const labelClass = "block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1";
  const sectionClass = "text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 relative">
      {/* Success Modal / Transition Overlay */}
      <AnimatePresence>
        {registeredAsset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className={`p-8 rounded-3xl border shadow-2xl max-w-md w-full text-center space-y-5 ${
                isLight ? 'bg-white border-emerald-200 text-slate-900' : 'glass-panel-glow border-emerald-500/40 text-white'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-mono">
                  ✓ ASSET REGISTERED
                </span>
                <h2 className="text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
                  {registeredAsset.id}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {registeredAsset.borrowerName} • {registeredAsset.registeredLocation.village}, {registeredAsset.registeredLocation.district}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/20 text-xs text-left space-y-1">
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Portfolio Status:</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold">ADDED TO PORTFOLIO</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Verification Trust:</span>
                  <span className="text-slate-900 dark:text-white font-bold">{registeredAsset.trustScore}/100</span>
                </div>
                <div className="flex justify-between font-mono">
                  <span className="text-slate-500 dark:text-slate-400">Inspection Priority:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{registeredAsset.inspectionPriority}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onRegisterSuccess(registeredAsset)}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Asset Profile</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRegisteredAsset(null);
                    handleAutofillDemo();
                  }}
                  className={`py-3 px-4 rounded-xl text-xs font-semibold border transition ${
                    isLight ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200' : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5 inline mr-1" />
                  <span>Register Another</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-2">
            <PlusCircle className="w-3.5 h-3.5" /> Multi-Asset Onboarding Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-display">
            Register Solar Irrigation Pump
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Onboard new rural borrower assets into the verifiable climate portfolio.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
          {activeScenarioLabel && (
            <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-semibold">
              {activeScenarioLabel}
            </span>
          )}

          <motion.button
            type="button"
            onClick={handleAutofillDemo}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition border shadow-sm ${
              isLight
                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Autofill Demo Asset</span>
          </motion.button>
        </div>
      </div>

      <motion.form
        key={autofillPulseKey}
        initial={{ opacity: 0.85 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        onSubmit={handleSubmit}
        className={`p-6 sm:p-8 space-y-8 rounded-3xl border transition ${
          isLight ? 'bg-white border-slate-200 shadow-sm' : 'glass-panel border-slate-800'
        }`}
      >
        {/* 1. Borrower & Loan Information */}
        <div className="space-y-4">
          <h3 className={sectionClass}>
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> 1. Borrower & Loan Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Borrower / Farmer Name</label>
              <input
                type="text"
                required
                value={formData.borrowerName}
                onChange={(e) => setFormData({ ...formData, borrowerName: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Asset ID (Unique Identifier)</label>
              <input
                type="text"
                required
                value={formData.assetId}
                onChange={(e) => setFormData({ ...formData, assetId: e.target.value })}
                className={`${inputClass} font-mono font-bold text-emerald-600 dark:text-emerald-400`}
              />
            </div>

            <div>
              <label className={labelClass}>Loan Amount (₹)</label>
              <input
                type="number"
                required
                value={formData.loanAmount}
                onChange={(e) => setFormData({ ...formData, loanAmount: Number(e.target.value) })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Financing Date</label>
              <input
                type="date"
                required
                value={formData.financingDate}
                onChange={(e) => setFormData({ ...formData, financingDate: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Installer / Vendor</label>
              <input
                type="text"
                required
                value={formData.installerName}
                onChange={(e) => setFormData({ ...formData, installerName: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* 2. Solar Pump Specifications */}
        <div className="space-y-4">
          <h3 className={sectionClass}>
            <span className="w-2 h-2 rounded-full bg-cyan-500" /> 2. Solar Pump Specifications
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Pump Manufacturer</label>
              <input
                type="text"
                required
                value={formData.pumpManufacturer}
                onChange={(e) => setFormData({ ...formData, pumpManufacturer: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Pump Model</label>
              <input
                type="text"
                required
                value={formData.pumpModel}
                onChange={(e) => setFormData({ ...formData, pumpModel: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Pump Capacity (HP)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.pumpCapacityHp}
                onChange={(e) => setFormData({ ...formData, pumpCapacityHp: Number(e.target.value) })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Solar Panel Capacity (kWp)</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.solarCapacityKwp}
                onChange={(e) => setFormData({ ...formData, solarCapacityKwp: Number(e.target.value) })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Expected Daily Operating Hours</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.expectedDailyHours}
                onChange={(e) => setFormData({ ...formData, expectedDailyHours: Number(e.target.value) })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Installation Date</label>
              <input
                type="date"
                required
                value={formData.installationDate}
                onChange={(e) => setFormData({ ...formData, installationDate: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* 3. Geographic Parcel Location */}
        <div className="space-y-4">
          <h3 className={sectionClass}>
            <span className="w-2 h-2 rounded-full bg-indigo-500" /> 3. Geographic Parcel Location
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Village / Settlement</label>
              <input
                type="text"
                required
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>District</label>
              <input
                type="text"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>State</label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Latitude</label>
              <input
                type="number"
                step="0.0001"
                required
                value={formData.latitude}
                onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Longitude</label>
              <input
                type="number"
                step="0.0001"
                required
                value={formData.longitude}
                onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* 4. Evidence Status & Verification Initial State */}
        <div className="space-y-4">
          <h3 className={sectionClass}>
            <span className="w-2 h-2 rounded-full bg-amber-500" /> 4. Evidence Status & Initial Verification State
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Initial Evidence Status</label>
              <select
                value={formData.evidenceStatus}
                onChange={(e) => setFormData({ ...formData, evidenceStatus: e.target.value as any })}
                className={inputClass}
              >
                <option value="VERIFIED">VERIFIED (Evidence Complete & Correlated)</option>
                <option value="UNVERIFIED">UNVERIFIED (Review Required / Partial Evidence)</option>
                <option value="ANOMALY">ANOMALY (Performance / GPS Discrepancy Flagged)</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Evidence Status Notes</label>
              <input
                type="text"
                value={formData.evidenceNotes}
                onChange={(e) => setFormData({ ...formData, evidenceNotes: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-4 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="px-7 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition transform hover:-translate-y-0.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Register & Add to Portfolio</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

      </motion.form>
    </div>
  );
};
