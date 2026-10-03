import type { SolarPumpAsset, VerificationStatus, InspectionPriorityLevel, ScoreBreakdown } from '../types/asset';

/**
 * Haversine formula to compute ground distance in meters between two lat/lng coordinates
 */
export function calculateGpsDistanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Expected Performance Model for Solar Irrigation Pump
 */
export function estimateExpectedDailyKwh(
  solarCapacityKwp: number,
  solarIrradianceKwhM2: number = 5.42,
  systemEfficiency: number = 0.78
): number {
  const estimated = solarCapacityKwp * solarIrradianceKwhM2 * systemEfficiency;
  return Number(estimated.toFixed(1));
}

/**
 * Prototype Verification Confidence Calculator based on weighted evidence parameters
 * Asset verification confidence — not a borrower credit score.
 */
export function calculateTrustScore(asset: Partial<SolarPumpAsset>): {
  totalScore: number;
  breakdown: ScoreBreakdown;
  status: VerificationStatus;
  inspectionPriority: InspectionPriorityLevel;
} {
  const gpsOffset = asset.gpsOffsetMeters ?? 42;
  let locationEvidence = 100;
  if (gpsOffset > 100) {
    locationEvidence = Math.max(20, Math.round(100 - (gpsOffset - 100) / 20));
  }

  const photosCount = asset.photos?.length ?? 0;
  let installationEvidence = Math.min(95, photosCount * 23);
  if (photosCount >= 3) installationEvidence = 92;

  const equipmentMatch = asset.evidenceChecklist?.serialNumberVisible ? 98 : 88;

  const diff = asset.performance?.differencePercent ?? -6.9;
  let performanceConsistency = 92;
  if (Math.abs(diff) > 40) {
    performanceConsistency = 42;
  } else if (Math.abs(diff) > 15) {
    performanceConsistency = 68;
  } else {
    performanceConsistency = Math.max(75, Math.round(100 - Math.abs(diff) * 2));
  }

  const evidenceFreshness = 91;

  const totalScore = Math.round(
    installationEvidence * 0.25 +
    locationEvidence * 0.25 +
    equipmentMatch * 0.20 +
    performanceConsistency * 0.20 +
    evidenceFreshness * 0.10
  );

  let status: VerificationStatus = 'VERIFIED';
  let priority: InspectionPriorityLevel = 'PRIORITY_3';

  if (Math.abs(diff) > 30 || gpsOffset > 1000) {
    status = 'ANOMALY';
    priority = 'PRIORITY_1';
  } else if (totalScore < 75 || photosCount < 2) {
    status = 'PARTIAL';
    priority = 'PRIORITY_2';
  }

  return {
    totalScore,
    breakdown: {
      installationEvidence,
      locationEvidence,
      equipmentMatch,
      performanceConsistency,
      evidenceFreshness
    },
    status,
    inspectionPriority: priority
  };
}

/**
 * Format currency in Indian Rupees (INR)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}
