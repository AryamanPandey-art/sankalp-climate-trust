export type VerificationStatus = 'VERIFIED' | 'PARTIAL' | 'ANOMALY' | 'UNVERIFIED';

export type BadgeType = 'VERIFIED' | 'ESTIMATED' | 'REPORTED' | 'UNVERIFIED' | 'ANOMALY' | 'PARTIAL';

export type InspectionPriorityLevel = 'PRIORITY_1' | 'PRIORITY_2' | 'PRIORITY_3';

export interface LocationCoords {
  lat: number;
  lng: number;
  village: string;
  district: string;
  state: string;
}

export interface PhotoEvidenceItem {
  id: string;
  type: 'pump' | 'panel' | 'installation' | 'meter' | 'context' | 'inspection' | string;
  title: string;
  url: string;
  uploadedAt: string;
  geotaggedLat?: number;
  geotaggedLng?: number;
  status: 'passed' | 'warning' | 'failed';
  notes: string;
}

export interface EvidenceChecklist {
  equipmentVisible: boolean;
  solarPanelVisible: boolean;
  locationMetadataAvailable: boolean;
  timestampAvailable: boolean;
  serialNumberVisible: boolean;
  evidenceConfidence: number; // e.g. 87%
}

export interface ScoreBreakdown {
  installationEvidence: number; // %
  locationEvidence: number;     // %
  equipmentMatch: number;        // %
  performanceConsistency: number;// %
  evidenceFreshness: number;     // %
}

export interface PerformanceData {
  expectedKwhPerDay: number;
  reportedKwhPerDay: number;
  differencePercent: number;
  solarIrradianceKwhM2: number; // kWh/m2/day
  ambientTempCelsius: number;
  cloudCoverPercent: number;
  operatingHoursReported: number;
  statusText: 'WITHIN EXPECTED RANGE' | 'PERFORMANCE ANOMALY' | 'UNDERPERFORMING' | 'PENDING DATA';
  historical7Days: {
    date: string;
    expected: number;
    reported: number;
  }[];
}

export interface AnomalyDetails {
  detectedDate: string;
  deviationPercent: number;
  potentialExplanations: string[];
  recommendedAction: 'Request updated evidence' | 'Schedule field inspection' | 'Remote monitoring';
  responsibleAiNote: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export interface SolarPumpAsset {
  id: string;                    // e.g. SOL-ASSAM-00128
  borrowerName: string;          // Borrower name
  loanAmount: number;            // e.g. 185000 (₹)
  financingDate: string;
  pumpManufacturer: string;      // e.g. Shakti Pumps / Tata Power Solar / Texmo
  pumpModel: string;             // e.g. 5HP Submersible DC
  pumpCapacityHp: number;        // e.g. 5.0 HP
  solarCapacityKwp: number;      // e.g. 4.8 kWp
  expectedDailyHours: number;    // e.g. 7.5 hours
  installerName: string;         // e.g. Assam Green Energy Co-op
  registeredLocation: LocationCoords;
  photoLocation?: LocationCoords;
  gpsOffsetMeters: number;       // e.g. 42m
  
  trustScore: number;            // 0-100 score
  scoreBreakdown: ScoreBreakdown;
  verificationStatus: VerificationStatus;
  inspectionPriority: InspectionPriorityLevel;
  
  evidenceChecklist: EvidenceChecklist;
  photos: PhotoEvidenceItem[];
  performance: PerformanceData;
  anomaly?: AnomalyDetails;
  timeline: TimelineEvent[];
  lastEvidenceDate: string;
}

export interface SimulationParams {
  totalAssets: number;
  costPerInspection: number; // ₹
  percentRequiringInspection: number; // %
}
