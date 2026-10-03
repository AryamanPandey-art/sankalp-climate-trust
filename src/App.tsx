import { useState } from 'react';
import type { PhotoEvidenceItem } from './types/asset';
import { Navbar } from './components/common/Navbar';
import { PitchTourBar, TOUR_STEPS } from './components/common/PitchTourBar';
import { SolarPumpScene } from './components/3d/SolarPumpScene';
import { CommandCenter } from './components/dashboard/CommandCenter';
import { AssetRegisterForm } from './components/registration/AssetRegisterForm';
import { AssetProfile } from './components/asset/AssetProfile';
import { AnomalyCenter } from './components/anomaly/AnomalyCenter';
import { InspectionQueue } from './components/inspections/InspectionQueue';
import { EfficiencySimulator } from './components/inspections/EfficiencySimulator';
import { VerificationModal } from './components/verification/VerificationModal';
import { ReportGenerator } from './components/reports/ReportGenerator';
import { PageTransition } from './components/motion/MotionSystem';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';

function AppContent() {
  const {
    assets,
    selectedAssetId,
    selectedAsset,
    setSelectedAssetId,
    addPhotoToAsset
  } = usePortfolio();

  const [currentTab, setCurrentTab] = useState<'landing' | 'dashboard' | 'register' | 'asset' | 'anomaly' | 'inspections' | 'simulator'>('landing');

  // Pitch Tour State
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [currentTourStepIndex, setCurrentTourStepIndex] = useState<number>(0);

  // Modals
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);

  // Handle tour step progression (8-step Pitch Mode)
  const handleSelectTourStep = (stepIndex: number) => {
    setCurrentTourStepIndex(stepIndex);
    const step = TOUR_STEPS[stepIndex];
    if (step) {
      setCurrentTab(step.actionView);
      if (step.targetAssetId) {
        setSelectedAssetId(step.targetAssetId);
      }
      if (step.autoVerify) {
        setIsVerificationModalOpen(true);
      } else {
        setIsVerificationModalOpen(false);
      }
      setIsReportModalOpen(false);
    }
  };

  const handleStartTour = () => {
    setIsTourActive(true);
    handleSelectTourStep(0);
  };

  const handleExitTour = () => {
    setIsTourActive(false);
    setIsVerificationModalOpen(false);
    setIsReportModalOpen(false);
  };

  // Add new photo evidence
  const handleAddPhotoToCurrentAsset = (photo: PhotoEvidenceItem) => {
    addPhotoToAsset(selectedAssetId, photo);
  };

  // Register new asset
  const handleRegisterSuccess = (newAsset: { id: string }) => {
    setSelectedAssetId(newAsset.id);
    setCurrentTab('asset');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col font-sans transition-colors duration-300 selection:bg-emerald-500 selection:text-white">
      {/* Live Pitch Tour Guided Bar */}
      {isTourActive && (
        <PitchTourBar
          currentStepIndex={currentTourStepIndex}
          onSelectStep={handleSelectTourStep}
          onExitTour={handleExitTour}
        />
      )}

      {/* Main Navbar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          if (tab !== 'asset') {
            setIsVerificationModalOpen(false);
            setIsReportModalOpen(false);
          }
        }}
        isTourActive={isTourActive}
        onToggleTour={() => {
          if (isTourActive) handleExitTour();
          else handleStartTour();
        }}
      />

      {/* Main View Area with Page Transitions */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {currentTab === 'landing' && (
            <PageTransition viewKey="landing">
              <SolarPumpScene
                onEnterDemo={() => {
                  setCurrentTab('dashboard');
                }}
                onWatchDemo={handleStartTour}
              />
            </PageTransition>
          )}

          {currentTab === 'dashboard' && (
            <PageTransition viewKey="dashboard">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <CommandCenter
                  assets={assets}
                  onSelectAsset={(id) => {
                    setSelectedAssetId(id);
                    setCurrentTab('asset');
                  }}
                  onOpenRegister={() => setCurrentTab('register')}
                />
              </div>
            </PageTransition>
          )}

          {currentTab === 'register' && (
            <PageTransition viewKey="register">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <AssetRegisterForm
                  onRegisterSuccess={handleRegisterSuccess}
                  onCancel={() => setCurrentTab('dashboard')}
                />
              </div>
            </PageTransition>
          )}

          {currentTab === 'asset' && selectedAsset && (
            <PageTransition viewKey={`asset-${selectedAssetId}`}>
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <AssetProfile
                  asset={selectedAsset}
                  onBack={() => setCurrentTab('dashboard')}
                  onRunVerificationModal={() => setIsVerificationModalOpen(true)}
                  onGenerateReport={() => setIsReportModalOpen(true)}
                  onAddPhoto={handleAddPhotoToCurrentAsset}
                />
              </div>
            </PageTransition>
          )}

          {currentTab === 'anomaly' && selectedAsset && (
            <PageTransition viewKey="anomaly">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <AnomalyCenter
                  asset={selectedAsset}
                  onSelectAction={(action) => {
                    if (action === 'schedule_inspection') {
                      setCurrentTab('inspections');
                    } else {
                      setCurrentTab('asset');
                    }
                  }}
                  onBackToDashboard={() => setCurrentTab('dashboard')}
                />
              </div>
            </PageTransition>
          )}

          {currentTab === 'inspections' && (
            <PageTransition viewKey="inspections">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <InspectionQueue
                  assets={assets}
                  onSelectAsset={(id) => {
                    setSelectedAssetId(id);
                    const a = assets.find((x) => x.id === id);
                    if (a && a.verificationStatus === 'ANOMALY') {
                      setCurrentTab('anomaly');
                    } else {
                      setCurrentTab('asset');
                    }
                  }}
                />
              </div>
            </PageTransition>
          )}

          {currentTab === 'simulator' && (
            <PageTransition viewKey="simulator">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
                <EfficiencySimulator />
              </div>
            </PageTransition>
          )}
        </AnimatePresence>
      </main>

      {/* Verification Sequence Modal */}
      <AnimatePresence>
        {isVerificationModalOpen && selectedAsset && (
          <VerificationModal
            asset={selectedAsset}
            onClose={() => setIsVerificationModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Printable Report Generator Modal */}
      <AnimatePresence>
        {isReportModalOpen && selectedAsset && (
          <ReportGenerator
            asset={selectedAsset}
            onClose={() => setIsReportModalOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border-subtle)] py-6 text-center text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-slate-900 dark:text-white font-semibold">RURAL CLIMATE ASSET TRUST</strong> — SANKALP by Satin Finserv 2026
          </div>
          <div>
            Prototype decision-support platform for low-cost rural solar pump verification.
          </div>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <AppContent />
      </PortfolioProvider>
    </ThemeProvider>
  );
}

export default App;
