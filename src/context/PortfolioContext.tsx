import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { SolarPumpAsset, PhotoEvidenceItem } from '../types/asset';
import { INITIAL_ASSETS } from '../data/mockAssets';
import { buildCompleteDemoAsset, SCENARIO_PROFILES } from '../services/DemoAssetGenerator';

interface PortfolioMetrics {
  totalAssets: number;
  highConfidence: number;
  requireReview: number;
  anomaliesFlagged: number;
}

interface PortfolioContextType {
  assets: SolarPumpAsset[];
  selectedAssetId: string;
  selectedAsset: SolarPumpAsset;
  setSelectedAssetId: (id: string) => void;
  registerAsset: (newAsset: SolarPumpAsset) => void;
  generateDemoAsset: () => { asset: SolarPumpAsset; profileName: string; badgeLabel: string };
  getAssetById: (id: string) => SolarPumpAsset | undefined;
  updateAsset: (id: string, partial: Partial<SolarPumpAsset>) => void;
  addPhotoToAsset: (id: string, photo: PhotoEvidenceItem) => void;
  resetPortfolio: () => void;
  metrics: PortfolioMetrics;
  lastRegisteredAsset: SolarPumpAsset | null;
  clearLastRegisteredAsset: () => void;
}

const STORAGE_KEY_ASSETS = 'sankalp_portfolio_assets_v4';
const STORAGE_KEY_SCENARIO_IDX = 'sankalp_portfolio_scenario_idx';
const STORAGE_KEY_ID_COUNTER = 'sankalp_portfolio_id_counter';

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Make sure SOL-ASSAM-00214 is the canonical seeded default asset
const CANONICAL_SEED_ID = 'SOL-ASSAM-00214';

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initialize asset collection with persistence
  const [assets, setAssets] = useState<SolarPumpAsset[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ASSETS);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse stored assets from localStorage', e);
    }
    return INITIAL_ASSETS;
  });

  // 2. Selected Asset ID (Default to SOL-ASSAM-00214 as requested)
  const [selectedAssetId, setSelectedAssetId] = useState<string>(() => {
    // If SOL-ASSAM-00214 exists, select it by default
    const hasCanonical = INITIAL_ASSETS.some(a => a.id === CANONICAL_SEED_ID);
    return hasCanonical ? CANONICAL_SEED_ID : INITIAL_ASSETS[0].id;
  });

  // 3. Scenario index cycle tracker (0 to 4)
  const [scenarioIndex, setScenarioIndex] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SCENARIO_IDX);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  // 4. Next Asset ID Number (starts at 215)
  const [nextIdNumber, setNextIdNumber] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ID_COUNTER);
      if (stored) return parseInt(stored, 10);
    } catch {
      // fallback
    }
    // Calculate highest SOL-ASSAM-00xxx number in current assets
    let maxNum = 214;
    INITIAL_ASSETS.forEach(a => {
      const match = a.id.match(/SOL-ASSAM-00(\d+)/);
      if (match) {
        const val = parseInt(match[1], 10);
        if (val > maxNum) maxNum = val;
      }
    });
    return maxNum + 1;
  });

  // 5. Track last registered asset for confirmation modal/toast
  const [lastRegisteredAsset, setLastRegisteredAsset] = useState<SolarPumpAsset | null>(null);

  // Sync assets to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
    } catch (e) {
      console.warn('Failed to persist assets to localStorage', e);
    }
  }, [assets]);

  // Sync scenario index to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SCENARIO_IDX, scenarioIndex.toString());
    } catch {}
  }, [scenarioIndex]);

  // Sync counter to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_ID_COUNTER, nextIdNumber.toString());
    } catch {}
  }, [nextIdNumber]);

  // Resolve currently selected asset with fallback
  const selectedAsset = useMemo(() => {
    const found = assets.find(a => a.id === selectedAssetId);
    if (found) return found;
    const canonical = assets.find(a => a.id === CANONICAL_SEED_ID);
    return canonical || assets[0];
  }, [assets, selectedAssetId]);

  // Generate a new demo asset according to the 5 realistic scenarios
  const generateDemoAsset = useCallback(() => {
    const currentScenario = SCENARIO_PROFILES[scenarioIndex % SCENARIO_PROFILES.length];
    const asset = buildCompleteDemoAsset(scenarioIndex, nextIdNumber);

    // Advance scenario cycle for the next time Autofill is clicked
    setScenarioIndex(prev => (prev + 1) % SCENARIO_PROFILES.length);

    return {
      asset,
      profileName: currentScenario.profileName,
      badgeLabel: currentScenario.badgeLabel
    };
  }, [scenarioIndex, nextIdNumber]);

  // Register an asset into the central portfolio
  const registerAsset = useCallback((newAsset: SolarPumpAsset) => {
    setAssets(prev => {
      // Prevent duplicates with same ID: if exists, update it, otherwise prepend
      const existingIdx = prev.findIndex(a => a.id === newAsset.id);
      if (existingIdx >= 0) {
        const updated = [...prev];
        updated[existingIdx] = newAsset;
        return updated;
      }
      return [newAsset, ...prev];
    });

    // Advance ID counter so next generated asset has a unique sequential ID (e.g. 215 -> 216)
    const match = newAsset.id.match(/SOL-ASSAM-00(\d+)/);
    if (match) {
      const num = parseInt(match[1], 10);
      setNextIdNumber(prev => Math.max(prev + 1, num + 1));
    } else {
      setNextIdNumber(prev => prev + 1);
    }

    setSelectedAssetId(newAsset.id);
    setLastRegisteredAsset(newAsset);
  }, []);

  const getAssetById = useCallback((id: string) => {
    return assets.find(a => a.id === id);
  }, [assets]);

  const updateAsset = useCallback((id: string, partial: Partial<SolarPumpAsset>) => {
    setAssets(prev =>
      prev.map(a => (a.id === id ? { ...a, ...partial } : a))
    );
  }, []);

  const addPhotoToAsset = useCallback((id: string, photo: PhotoEvidenceItem) => {
    setAssets(prev =>
      prev.map(a => {
        if (a.id === id) {
          const updatedPhotos = [photo, ...a.photos];
          return {
            ...a,
            photos: updatedPhotos,
            trustScore: Math.min(100, a.trustScore + 3),
            evidenceChecklist: {
              ...a.evidenceChecklist,
              evidenceConfidence: Math.min(99, a.evidenceChecklist.evidenceConfidence + 4)
            }
          };
        }
        return a;
      })
    );
  }, []);

  const resetPortfolio = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY_ASSETS);
    localStorage.removeItem(STORAGE_KEY_SCENARIO_IDX);
    localStorage.removeItem(STORAGE_KEY_ID_COUNTER);
    setAssets(INITIAL_ASSETS);
    setSelectedAssetId(CANONICAL_SEED_ID);
    setScenarioIndex(0);
    setNextIdNumber(215);
    setLastRegisteredAsset(null);
  }, []);

  const clearLastRegisteredAsset = useCallback(() => {
    setLastRegisteredAsset(null);
  }, []);

  // Compute portfolio metrics dynamically based on initial baseline + newly registered assets
  const metrics = useMemo<PortfolioMetrics>(() => {
    // Initial seeded asset IDs
    const seededIds = new Set(INITIAL_ASSETS.map(a => a.id));
    
    // Count newly registered dynamic assets
    const dynamicAssets = assets.filter(a => !seededIds.has(a.id));
    const dynamicCount = dynamicAssets.length;

    let dynamicHighConfidence = 0;
    let dynamicReview = 0;
    let dynamicAnomalies = 0;

    dynamicAssets.forEach(a => {
      if (a.inspectionPriority === 'PRIORITY_1' || a.verificationStatus === 'ANOMALY') {
        dynamicAnomalies += 1;
      } else if (a.inspectionPriority === 'PRIORITY_2' || a.verificationStatus === 'UNVERIFIED') {
        dynamicReview += 1;
      } else {
        dynamicHighConfidence += 1;
      }
    });

    return {
      totalAssets: 1291 + dynamicCount,
      highConfidence: 1088 + dynamicHighConfidence,
      requireReview: 146 + dynamicReview,
      anomaliesFlagged: 57 + dynamicAnomalies
    };
  }, [assets]);

  const value = useMemo(() => ({
    assets,
    selectedAssetId,
    selectedAsset,
    setSelectedAssetId,
    registerAsset,
    generateDemoAsset,
    getAssetById,
    updateAsset,
    addPhotoToAsset,
    resetPortfolio,
    metrics,
    lastRegisteredAsset,
    clearLastRegisteredAsset
  }), [
    assets,
    selectedAssetId,
    selectedAsset,
    registerAsset,
    generateDemoAsset,
    getAssetById,
    updateAsset,
    addPhotoToAsset,
    resetPortfolio,
    metrics,
    lastRegisteredAsset,
    clearLastRegisteredAsset
  ]);

  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = (): PortfolioContextType => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
