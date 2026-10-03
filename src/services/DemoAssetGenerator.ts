import type { SolarPumpAsset, PhotoEvidenceItem, TimelineEvent } from '../types/asset';
import { estimateExpectedDailyKwh } from './VerificationEngine';

export interface DemoScenarioDefinition {
  profileName: string;
  badgeLabel: string;
  borrowerName: string;
  village: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  pumpManufacturer: string;
  pumpModel: string;
  pumpCapacityHp: number;
  solarCapacityKwp: number;
  loanAmount: number;
  installerName: string;
  installationDate: string;
  expectedDailyHours: number;
  gpsOffsetMeters: number;
  trustScore: number;
  verificationStatus: 'VERIFIED' | 'UNVERIFIED' | 'ANOMALY';
  inspectionPriority: 'PRIORITY_1' | 'PRIORITY_2' | 'PRIORITY_3';
  differencePercent: number;
  cloudCoverPercent: number;
  ambientTempCelsius: number;
  solarIrradianceKwhM2: number;
  evidenceConfidence: number;
  photoOverdue: boolean;
  scoreBreakdown: {
    installationEvidence: number;
    locationEvidence: number;
    equipmentMatch: number;
    performanceConsistency: number;
    evidenceFreshness: number;
  };
  anomalyReason?: string;
}

export const SCENARIO_PROFILES: DemoScenarioDefinition[] = [
  // PROFILE 1 — HEALTHY (Priority 3, Confidence 88%, deviation within +-5%)
  {
    profileName: 'PROFILE 1 — HEALTHY',
    badgeLabel: 'Healthy • High Confidence',
    borrowerName: 'Ranjit Gogoi',
    village: 'Moranhat',
    district: 'Sivasagar',
    state: 'Assam',
    lat: 27.1852,
    lng: 94.9310,
    pumpManufacturer: 'Tata Power Solar Ltd',
    pumpModel: 'TPS-5HP High Efficiency',
    pumpCapacityHp: 5.0,
    solarCapacityKwp: 4.8,
    loanAmount: 185000,
    installerName: 'Brahmaputra Solar Energy',
    installationDate: '2025-10-12',
    expectedDailyHours: 7.8,
    gpsOffsetMeters: 24,
    trustScore: 88,
    verificationStatus: 'VERIFIED',
    inspectionPriority: 'PRIORITY_3',
    differencePercent: -2.1,
    cloudCoverPercent: 12,
    ambientTempCelsius: 28.5,
    solarIrradianceKwhM2: 5.48,
    evidenceConfidence: 88,
    photoOverdue: false,
    scoreBreakdown: {
      installationEvidence: 96,
      locationEvidence: 100,
      equipmentMatch: 95,
      performanceConsistency: 92,
      evidenceFreshness: 90
    }
  },

  // PROFILE 2 — PHOTO REFRESH (Priority 2, Confidence 65-80%, photo overdue)
  {
    profileName: 'PROFILE 2 — PHOTO REFRESH',
    badgeLabel: 'Photo Evidence Overdue',
    borrowerName: 'Monoj Baruah',
    village: 'Dhekiajuli',
    district: 'Sonitpur',
    state: 'Assam',
    lat: 26.7025,
    lng: 92.5014,
    pumpManufacturer: 'Shakti Pumps Ltd',
    pumpModel: 'SP-3HP Submersible DC',
    pumpCapacityHp: 3.0,
    solarCapacityKwp: 3.2,
    loanAmount: 142000,
    installerName: 'Pragjyotish Solar Solutions',
    installationDate: '2025-06-20',
    expectedDailyHours: 6.5,
    gpsOffsetMeters: 48,
    trustScore: 72,
    verificationStatus: 'UNVERIFIED',
    inspectionPriority: 'PRIORITY_2',
    differencePercent: -8.4,
    cloudCoverPercent: 22,
    ambientTempCelsius: 27.2,
    solarIrradianceKwhM2: 5.15,
    evidenceConfidence: 68,
    photoOverdue: true,
    scoreBreakdown: {
      installationEvidence: 65,
      locationEvidence: 88,
      equipmentMatch: 82,
      performanceConsistency: 80,
      evidenceFreshness: 45
    }
  },

  // PROFILE 3 — PERFORMANCE ANOMALY (Priority 1, Confidence 45-65%, deviation -25% to -45%)
  {
    profileName: 'PROFILE 3 — PERFORMANCE ANOMALY',
    badgeLabel: 'Performance Anomaly Flagged',
    borrowerName: 'Nandita Bora',
    village: 'Titabor',
    district: 'Jorhat',
    state: 'Assam',
    lat: 26.6021,
    lng: 94.1950,
    pumpManufacturer: 'Kirloskar Brothers Solar',
    pumpModel: 'KB-5HP Deep Well Borewell',
    pumpCapacityHp: 5.0,
    solarCapacityKwp: 5.0,
    loanAmount: 195000,
    installerName: 'Assam Green Energy Co-op',
    installationDate: '2025-07-15',
    expectedDailyHours: 7.2,
    gpsOffsetMeters: 36,
    trustScore: 52,
    verificationStatus: 'ANOMALY',
    inspectionPriority: 'PRIORITY_1',
    differencePercent: -38.5,
    cloudCoverPercent: 15,
    ambientTempCelsius: 29.8,
    solarIrradianceKwhM2: 5.52,
    evidenceConfidence: 86,
    photoOverdue: false,
    scoreBreakdown: {
      installationEvidence: 85,
      locationEvidence: 92,
      equipmentMatch: 90,
      performanceConsistency: 35,
      evidenceFreshness: 80
    },
    anomalyReason: 'Output 38.5% below satellite reference irradiance model. Possible solar panel soiling or pump motor blockage.'
  },

  // PROFILE 4 — GPS MISMATCH (Priority 2, Confidence 55-75%, GPS offset >100m)
  {
    profileName: 'PROFILE 4 — GPS MISMATCH',
    badgeLabel: 'GPS Offset Discrepancy (>100m)',
    borrowerName: 'Bikash Phukan',
    village: 'Mayong',
    district: 'Morigaon',
    state: 'Assam',
    lat: 26.2410,
    lng: 92.0520,
    pumpManufacturer: 'Falcon Pumps Pvt Ltd',
    pumpModel: 'FP-5HP Agricultural DC',
    pumpCapacityHp: 5.0,
    solarCapacityKwp: 4.8,
    loanAmount: 178000,
    installerName: 'Eastern Solar Infrastructure',
    installationDate: '2025-09-08',
    expectedDailyHours: 7.0,
    gpsOffsetMeters: 168,
    trustScore: 63,
    verificationStatus: 'UNVERIFIED',
    inspectionPriority: 'PRIORITY_2',
    differencePercent: -5.6,
    cloudCoverPercent: 18,
    ambientTempCelsius: 28.1,
    solarIrradianceKwhM2: 5.35,
    evidenceConfidence: 74,
    photoOverdue: false,
    scoreBreakdown: {
      installationEvidence: 82,
      locationEvidence: 48,
      equipmentMatch: 86,
      performanceConsistency: 84,
      evidenceFreshness: 76
    }
  },

  // PROFILE 5 — NEW INSTALLATION (Priority 2, Confidence 70-85%, limited telemetry history)
  {
    profileName: 'PROFILE 5 — NEW INSTALLATION',
    badgeLabel: 'New Commissioning • Baseline Pending',
    borrowerName: 'Anamika Hazarika',
    village: 'Boko',
    district: 'Kamrup',
    state: 'Assam',
    lat: 25.9815,
    lng: 91.2240,
    pumpManufacturer: 'Jain Irrigation Systems',
    pumpModel: 'Jain-3HP Solar Submersible',
    pumpCapacityHp: 3.0,
    solarCapacityKwp: 3.2,
    loanAmount: 135000,
    installerName: 'Pragjyotish Solar Solutions',
    installationDate: '2026-02-15',
    expectedDailyHours: 6.8,
    gpsOffsetMeters: 31,
    trustScore: 78,
    verificationStatus: 'UNVERIFIED',
    inspectionPriority: 'PRIORITY_2',
    differencePercent: -4.2,
    cloudCoverPercent: 14,
    ambientTempCelsius: 27.8,
    solarIrradianceKwhM2: 5.38,
    evidenceConfidence: 80,
    photoOverdue: false,
    scoreBreakdown: {
      installationEvidence: 88,
      locationEvidence: 94,
      equipmentMatch: 85,
      performanceConsistency: 72,
      evidenceFreshness: 98
    }
  }
];

export function buildCompleteDemoAsset(
  scenarioIndex: number,
  assetIdNumber: number
): SolarPumpAsset {
  const scenario = SCENARIO_PROFILES[scenarioIndex % SCENARIO_PROFILES.length];
  const assetId = `SOL-ASSAM-00${assetIdNumber}`;

  const expectedKwh = estimateExpectedDailyKwh(scenario.solarCapacityKwp, scenario.solarIrradianceKwhM2);
  const reportedKwh = Number((expectedKwh * (1 + scenario.differencePercent / 100)).toFixed(1));
  const exactDiff = Number((((reportedKwh - expectedKwh) / expectedKwh) * 100).toFixed(1));

  // Determine photo lat/lng offset
  const latOffset = scenario.gpsOffsetMeters > 100 ? 0.0015 : 0.0003;
  const lngOffset = scenario.gpsOffsetMeters > 100 ? 0.0012 : 0.0002;

  const photos: PhotoEvidenceItem[] = [
    {
      id: `p-${assetId}-1`,
      type: 'panel',
      title: 'Solar PV Array & Irrigation Pump',
      url: '/assets/evidence/photo1_hero.jpg',
      uploadedAt: scenario.photoOverdue ? '2025-10-15 10:14 AM' : '2026-02-28 09:42 AM',
      status: 'passed',
      notes: scenario.photoOverdue ? 'Overdue for quarterly refresh (135+ days old).' : 'Geotagged installation view showing solar array and crop context.'
    },
    {
      id: `p-${assetId}-2`,
      type: 'pump',
      title: 'Water Discharge Point',
      url: '/assets/evidence/photo4_discharge.jpg',
      uploadedAt: scenario.photoOverdue ? '2025-10-15 10:20 AM' : '2026-02-28 09:46 AM',
      status: scenario.inspectionPriority === 'PRIORITY_1' ? 'warning' : 'passed',
      notes: scenario.inspectionPriority === 'PRIORITY_1' ? 'Discharge head showing cavitation vibration.' : 'Visible water discharge from irrigation outlet.'
    }
  ];

  if (!scenario.photoOverdue) {
    photos.push({
      id: `p-${assetId}-3`,
      type: 'meter',
      title: 'MPPT Controller & Electrical Assembly',
      url: '/assets/evidence/photo2_controller.jpg',
      uploadedAt: '2026-02-28 09:50 AM',
      status: 'passed',
      notes: 'Close-up evidence of installed control equipment and mounting structure.'
    });
  }

  // 7-day historical data
  const days = ['24 Feb', '25 Feb', '26 Feb', '27 Feb', '28 Feb', '01 Mar', '02 Mar'];
  const historical7Days = days.map((day, idx) => {
    const variance = (Math.sin(idx * 1.5) * 0.2);
    const exp = Number((expectedKwh + variance).toFixed(1));
    const rep = Number((repFromExp(exp, scenario.differencePercent, idx)).toFixed(1));
    return { date: day, expected: exp, reported: rep };
  });

  function repFromExp(e: number, diffPct: number, idx: number): number {
    const noise = ((idx % 2 === 0 ? 0.1 : -0.1));
    return Math.max(0.5, e * (1 + diffPct / 100) + noise);
  }

  const timeline: TimelineEvent[] = [
    {
      id: `t-${assetId}-1`,
      date: scenario.installationDate.toUpperCase(),
      title: 'Asset Loan Disbursed',
      description: `Financing approved for ${scenario.borrowerName} (${scenario.pumpCapacityHp} HP pump).`,
      type: 'info'
    },
    {
      id: `t-${assetId}-2`,
      date: 'TODAY',
      title: 'Digital Verification Ingestion',
      description: `Automated assessment: ${scenario.trustScore}/100 Verification Confidence assigned.`,
      type: scenario.trustScore >= 80 ? 'success' : scenario.trustScore >= 60 ? 'warning' : 'alert'
    }
  ];

  return {
    id: assetId,
    borrowerName: scenario.borrowerName,
    loanAmount: scenario.loanAmount,
    financingDate: scenario.installationDate,
    pumpManufacturer: scenario.pumpManufacturer,
    pumpModel: scenario.pumpModel,
    pumpCapacityHp: scenario.pumpCapacityHp,
    solarCapacityKwp: scenario.solarCapacityKwp,
    expectedDailyHours: scenario.expectedDailyHours,
    installerName: scenario.installerName,
    registeredLocation: {
      lat: scenario.lat,
      lng: scenario.lng,
      village: scenario.village,
      district: scenario.district,
      state: scenario.state
    },
    photoLocation: {
      lat: Number((scenario.lat + latOffset).toFixed(4)),
      lng: Number((scenario.lng + lngOffset).toFixed(4)),
      village: scenario.village,
      district: scenario.district,
      state: scenario.state
    },
    gpsOffsetMeters: scenario.gpsOffsetMeters,
    trustScore: scenario.trustScore,
    scoreBreakdown: scenario.scoreBreakdown,
    verificationStatus: scenario.verificationStatus,
    inspectionPriority: scenario.inspectionPriority,
    evidenceChecklist: {
      equipmentVisible: true,
      solarPanelVisible: true,
      locationMetadataAvailable: scenario.gpsOffsetMeters < 100,
      timestampAvailable: !scenario.photoOverdue,
      serialNumberVisible: scenario.trustScore > 60,
      evidenceConfidence: scenario.evidenceConfidence
    },
    photos,
    performance: {
      expectedKwhPerDay: expectedKwh,
      reportedKwhPerDay: reportedKwh,
      differencePercent: exactDiff,
      solarIrradianceKwhM2: scenario.solarIrradianceKwhM2,
      ambientTempCelsius: scenario.ambientTempCelsius,
      cloudCoverPercent: scenario.cloudCoverPercent,
      operatingHoursReported: Number((scenario.expectedDailyHours * (1 + scenario.differencePercent / 120)).toFixed(1)),
      statusText: scenario.inspectionPriority === 'PRIORITY_1'
        ? 'PERFORMANCE ANOMALY'
        : scenario.inspectionPriority === 'PRIORITY_2'
        ? 'UNDERPERFORMING'
        : 'WITHIN EXPECTED RANGE',
      historical7Days
    },
    anomaly: scenario.anomalyReason ? {
      detectedDate: 'TODAY',
      deviationPercent: exactDiff,
      potentialExplanations: [
        scenario.anomalyReason,
        'Satellite solar irradiance models show higher generation potential.',
        'Seasonal variation or dust accumulation on panel surface.'
      ],
      recommendedAction: 'Schedule field inspection',
      responsibleAiNote: 'Verification flag prioritizes operational audits and evidence review, not credit distress.'
    } : undefined,
    timeline,
    lastEvidenceDate: scenario.photoOverdue ? '2025-10-15' : '2026-02-28'
  };
}
