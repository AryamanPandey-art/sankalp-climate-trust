import React from 'react';
import { ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

export interface TourStep {
  id: number;
  title: string;
  tagline: string;
  script: string;
  actionView: 'landing' | 'dashboard' | 'register' | 'asset' | 'anomaly' | 'inspections' | 'simulator';
  targetAssetId?: string;
  autoVerify?: boolean;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: 1,
    title: '1. THE PROBLEM',
    tagline: 'Verification at scale is difficult',
    script: 'Rural climate assets are difficult to verify at scale. Physical inspections across remote villages cost more than the loan margin, while satellite imagery alone lacks ground truth.',
    actionView: 'landing'
  },
  {
    id: 2,
    title: '2. REGISTER',
    tagline: 'Multi-asset onboarding with instant synthetic demo',
    script: 'Lenders onboard newly financed pumps with equipment specs, borrower parcel coordinates, and installation geotags in seconds.',
    actionView: 'register'
  },
  {
    id: 3,
    title: '3. VERIFY',
    tagline: 'Evidence + GPS + Climate + Performance',
    script: 'Multi-evidence synthesis cross-references ground photos, 28m GPS offset, Sentinel satellite solar irradiance, and telemetry into an Asset Verification Confidence score.',
    actionView: 'asset',
    targetAssetId: 'SOL-ASSAM-00214',
    autoVerify: true
  },
  {
    id: 4,
    title: '4. UNDERSTAND',
    tagline: 'Expected vs Reported generation model',
    script: 'Under 5.4 kWh/m² irradiance, expected output is 5.8 kWh/day. Reported output is 5.7 kWh/day (-1.7% deviation) — status DIGITALLY VERIFIED, CONTINUOUS MONITORING.',
    actionView: 'asset',
    targetAssetId: 'SOL-ASSAM-00214'
  },
  {
    id: 5,
    title: '5. DETECT',
    tagline: 'Exception Case (Kamrup, Assam)',
    script: 'For asset SOL-ASSAM-00130, expected is 5.9 kWh/day while reported is 3.1 kWh/day (-47.5% deviation) alongside a 1,420m GPS discrepancy. Weather alone does not explain the deviation, triggering exception review.',
    actionView: 'anomaly',
    targetAssetId: 'SOL-ASSAM-00130'
  },
  {
    id: 6,
    title: '6. PRIORITIZE',
    tagline: 'Operations Dispatch Triage',
    script: 'Inspection Queue classifies priorities objectively: Priority 1 (Field Inspection Recommended), Priority 2 (Digital Re-verification / Photo Refresh), Priority 3 (Remote Monitoring).',
    actionView: 'inspections',
    targetAssetId: 'SOL-ASSAM-00130'
  },
  {
    id: 7,
    title: '7. SCALE',
    tagline: 'Illustrative Portfolio Simulation (1,291 Sample Assets)',
    script: 'Modeled across 1,291 sample assets: 1,088 digital-clearance candidates, 146 evidence refresh, and 57 exception cases prioritized for human inspection.',
    actionView: 'dashboard'
  },
  {
    id: 8,
    title: '8. IMPACT',
    tagline: 'Modeled Verification Economics',
    script: 'Modeled operational cost difference demonstrates potential savings by shifting from blanket visits to exception-based verification.',
    actionView: 'simulator'
  }
];

interface PitchTourBarProps {
  currentStepIndex: number;
  onSelectStep: (stepIndex: number) => void;
  onExitTour: () => void;
}

export const PitchTourBar: React.FC<PitchTourBarProps> = ({
  currentStepIndex,
  onSelectStep,
  onExitTour
}) => {
  const currentStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];

  return (
    <div className="w-full bg-slate-950 border-b border-emerald-500/30 px-4 py-2.5 shadow-2xl relative z-40 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/40 shrink-0">
            {currentStep.id}/{TOUR_STEPS.length}
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1 font-mono">
                <Sparkles className="w-3 h-3" /> Pitch Mode (3-Min Guided Flow)
              </span>
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">| {currentStep.tagline}</span>
            </div>
            <p className="text-xs text-slate-200 font-normal truncate max-w-xl">
              <strong className="text-white font-medium">{currentStep.title}:</strong> {currentStep.script}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectStep(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-800 transition"
            title="Previous Step"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="hidden lg:flex items-center gap-1 mx-1">
            {TOUR_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => onSelectStep(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentStepIndex
                    ? 'bg-emerald-400 w-5'
                    : idx < currentStepIndex
                    ? 'bg-emerald-600/60'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={step.title}
              />
            ))}
          </div>

          <button
            onClick={() => onSelectStep(Math.min(TOUR_STEPS.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === TOUR_STEPS.length - 1}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-950/50"
          >
            <span>Next Step</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onExitTour}
            className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 ml-1"
          >
            Exit Pitch
          </button>
        </div>
      </div>
    </div>
  );
};
