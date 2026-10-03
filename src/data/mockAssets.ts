import type { SolarPumpAsset } from '../types/asset';

export const INITIAL_ASSETS: SolarPumpAsset[] = [
  {
    id: 'SOL-ASSAM-00214',
    borrowerName: 'Anil Saikia',
    loanAmount: 175000,
    financingDate: '2025-08-14',
    pumpManufacturer: 'Shakti Pumps Ltd',
    pumpModel: 'SP-5HP-DC Submersible',
    pumpCapacityHp: 5.0,
    solarCapacityKwp: 4.8,
    expectedDailyHours: 7.5,
    installerName: 'Pragjyotish Solar Solutions',
    registeredLocation: {
      lat: 26.4710,
      lng: 92.0320,
      village: 'Mangaldai',
      district: 'Darrang',
      state: 'Assam'
    },
    photoLocation: {
      lat: 26.4712,
      lng: 92.0322,
      village: 'Mangaldai',
      district: 'Darrang',
      state: 'Assam'
    },
    gpsOffsetMeters: 28,
    trustScore: 88,
    scoreBreakdown: {
      installationEvidence: 96,
      locationEvidence: 100,
      equipmentMatch: 95,
      performanceConsistency: 92,
      evidenceFreshness: 90
    },
    verificationStatus: 'VERIFIED',
    inspectionPriority: 'PRIORITY_3',
    evidenceChecklist: {
      equipmentVisible: true,
      solarPanelVisible: true,
      locationMetadataAvailable: true,
      timestampAvailable: true,
      serialNumberVisible: true,
      evidenceConfidence: 88
    },
    photos: [
      {
        id: 'ev-214-1',
        type: 'panel',
        title: 'Solar PV Array & Irrigation Pump',
        url: '/assets/evidence/photo1_hero.jpg',
        uploadedAt: '2026-02-20 09:30 AM',
        geotaggedLat: 26.4712,
        geotaggedLng: 92.0322,
        status: 'passed',
        notes: 'Geotagged installation view showing the solar array, mounting structure, pump outlet and surrounding agricultural field.'
      },
      {
        id: 'ev-214-2',
        type: 'meter',
        title: 'MPPT Controller & Electrical Assembly',
        url: '/assets/evidence/photo2_controller.jpg',
        uploadedAt: '2026-02-20 09:32 AM',
        geotaggedLat: 26.4712,
        geotaggedLng: 92.0322,
        status: 'passed',
        notes: 'Close-up evidence of installed control equipment and mounting structure.'
      },
      {
        id: 'ev-214-3',
        type: 'context',
        title: 'Field & Installation Context',
        url: '/assets/evidence/photo3_field.jpg',
        uploadedAt: '2026-02-20 09:34 AM',
        geotaggedLat: 26.4712,
        geotaggedLng: 92.0322,
        status: 'passed',
        notes: "Wide environmental view used to verify the asset's surrounding agricultural context."
      },
      {
        id: 'ev-214-4',
        type: 'pump',
        title: 'Water Discharge Point',
        url: '/assets/evidence/photo4_discharge.jpg',
        uploadedAt: '2026-02-20 09:35 AM',
        geotaggedLat: 26.4712,
        geotaggedLng: 92.0322,
        status: 'passed',
        notes: 'Visible water discharge from the irrigation outlet during the documented inspection.'
      },
      {
        id: 'ev-214-5',
        type: 'inspection',
        title: 'Technical Inspection View',
        url: '/assets/evidence/photo5_technician.jpg',
        uploadedAt: '2026-02-20 09:38 AM',
        geotaggedLat: 26.4712,
        geotaggedLng: 92.0322,
        status: 'passed',
        notes: 'Inspection view showing the installed control equipment and field verification activity.'
      },
      {
        id: 'ev-214-6',
        type: 'installation',
        title: 'Installation Side View',
        url: '/assets/evidence/photo6_side.jpg',
        uploadedAt: '2026-02-20 09:40 AM',
        geotaggedLat: 26.4712,
        geotaggedLng: 92.0322,
        status: 'passed',
        notes: 'Side-angle evidence showing the solar panels, mounting structure, pump assembly and irrigation channel.'
      },
      {
        id: 'ev-214-7',
        type: 'pump',
        title: 'Pump & Pipe Assembly',
        url: '/assets/evidence/photo7_pump.jpg',
        uploadedAt: '2026-02-20 09:42 AM',
        geotaggedLat: 26.4712,
        geotaggedLng: 92.0322,
        status: 'passed',
        notes: 'Close-up evidence of the pump housing, pipe connection and discharge assembly.'
      },
      {
        id: 'ev-214-8',
        type: 'inspection',
        title: 'Field Verification View',
        url: '/assets/evidence/photo8_inspector.jpg',
        uploadedAt: '2026-02-20 09:45 AM',
        geotaggedLat: 26.4712,
        geotaggedLng: 92.0322,
        status: 'passed',
        notes: 'Field verification view showing the asset and surrounding installation context.'
      }
    ],
    performance: {
      expectedKwhPerDay: 5.8,
      reportedKwhPerDay: 5.7,
      differencePercent: -1.7,
      solarIrradianceKwhM2: 5.45,
      ambientTempCelsius: 28.0,
      cloudCoverPercent: 10,
      operatingHoursReported: 7.4,
      statusText: 'WITHIN EXPECTED RANGE',
      historical7Days: [
        { date: '25 Feb', expected: 5.7, reported: 5.7 },
        { date: '26 Feb', expected: 5.8, reported: 5.7 },
        { date: '27 Feb', expected: 5.8, reported: 5.6 },
        { date: '28 Feb', expected: 5.9, reported: 5.8 },
        { date: '01 Mar', expected: 5.8, reported: 5.7 },
        { date: '02 Mar', expected: 5.7, reported: 5.7 },
        { date: '03 Mar', expected: 5.8, reported: 5.7 }
      ]
    },
    timeline: [
      { id: 't50', date: '14 AUG 2025', title: 'Asset registered', description: 'Loan approved & setup verified.', type: 'info' },
      { id: 't51', date: '20 FEB 2026', title: 'Routine evidence update', description: 'Remote monitoring verified. All specs match.', type: 'success' }
    ],
    lastEvidenceDate: '2026-02-20'
  },
  {
    id: 'SOL-ASSAM-00128',
    borrowerName: 'Bhaben Kalita',
    loanAmount: 185000,
    financingDate: '2025-11-15',
    pumpManufacturer: 'Shakti Pumps Ltd',
    pumpModel: 'SP-5HP-DC Submersible',
    pumpCapacityHp: 5.0,
    solarCapacityKwp: 4.8,
    expectedDailyHours: 7.5,
    installerName: 'Pragjyotish Solar Solutions',
    registeredLocation: {
      lat: 26.4421,
      lng: 92.0345,
      village: 'Mangaldai',
      district: 'Darrang',
      state: 'Assam'
    },
    photoLocation: {
      lat: 26.4423,
      lng: 92.0347,
      village: 'Mangaldai',
      district: 'Darrang',
      state: 'Assam'
    },
    gpsOffsetMeters: 28,
    trustScore: 88,
    scoreBreakdown: {
      installationEvidence: 96,
      locationEvidence: 100,
      equipmentMatch: 95,
      performanceConsistency: 92,
      evidenceFreshness: 90
    },
    verificationStatus: 'VERIFIED',
    inspectionPriority: 'PRIORITY_3',
    evidenceChecklist: {
      equipmentVisible: true,
      solarPanelVisible: true,
      locationMetadataAvailable: true,
      timestampAvailable: true,
      serialNumberVisible: false,
      evidenceConfidence: 87
    },
    photos: [
      {
        id: 'p1',
        type: 'panel',
        title: 'Solar PV Array & Irrigation Pump',
        url: '/assets/evidence/photo1_hero.jpg',
        uploadedAt: '2026-02-14 10:24 AM',
        geotaggedLat: 26.4423,
        geotaggedLng: 92.0347,
        status: 'passed',
        notes: 'Geotagged installation view showing the solar array, mounting structure, pump outlet and surrounding agricultural field.'
      },
      {
        id: 'p2',
        type: 'pump',
        title: 'Water Discharge Point',
        url: '/assets/evidence/photo4_discharge.jpg',
        uploadedAt: '2026-02-14 10:26 AM',
        geotaggedLat: 26.4423,
        geotaggedLng: 92.0347,
        status: 'passed',
        notes: 'Visible water discharge from the irrigation outlet during the documented inspection.'
      },
      {
        id: 'p3',
        type: 'installation',
        title: 'Installation Side View',
        url: '/assets/evidence/photo6_side.jpg',
        uploadedAt: '2026-02-14 10:28 AM',
        geotaggedLat: 26.4423,
        geotaggedLng: 92.0347,
        status: 'passed',
        notes: 'Side-angle evidence showing the solar panels, mounting structure, pump assembly and irrigation channel.'
      },
      {
        id: 'p4',
        type: 'meter',
        title: 'MPPT Controller & Electrical Assembly',
        url: '/assets/evidence/photo2_controller.jpg',
        uploadedAt: '2026-02-14 10:30 AM',
        geotaggedLat: 26.4423,
        geotaggedLng: 92.0347,
        status: 'warning',
        notes: '⚠ Equipment serial sticker partially obscured by glare.'
      }
    ],
    performance: {
      expectedKwhPerDay: 5.8,
      reportedKwhPerDay: 5.7,
      differencePercent: -1.7,
      solarIrradianceKwhM2: 5.42,
      ambientTempCelsius: 28.5,
      cloudCoverPercent: 12,
      operatingHoursReported: 7.4,
      statusText: 'WITHIN EXPECTED RANGE',
      historical7Days: [
        { date: '25 Feb', expected: 5.8, reported: 5.7 },
        { date: '26 Feb', expected: 5.8, reported: 5.7 },
        { date: '27 Feb', expected: 5.7, reported: 5.6 },
        { date: '28 Feb', expected: 5.9, reported: 5.8 },
        { date: '01 Mar', expected: 5.8, reported: 5.7 },
        { date: '02 Mar', expected: 5.7, reported: 5.6 },
        { date: '03 Mar', expected: 5.8, reported: 5.7 }
      ]
    },
    timeline: [
      { id: 't1', date: '01 JUN 2025', title: 'Asset registered', description: 'Loan application approved & asset profile initialized by partner rural lender.', type: 'info' },
      { id: 't2', date: '08 JUN 2025', title: 'Installation photo uploaded', description: 'Vendor uploaded 4 high-resolution geotagged evidence photos.', type: 'success' },
      { id: 't3', date: '08 JUN 2025', title: 'Location verified', description: 'GPS geotag confirmed within 42 meters of registered farm coordinates.', type: 'success' },
      { id: 't4', date: '15 JUL 2025', title: 'Performance evidence received', description: 'Initial telemetry sample verified against regional NASA POWER irradiance.', type: 'success' },
      { id: 't5', date: '15 AUG 2025', title: 'Updated evidence requested', description: 'Quarterly compliance check notification issued to borrower.', type: 'info' },
      { id: 't6', date: '14 FEB 2026', title: 'Verification audit refreshed', description: 'Verification confidence re-calculated at 88/100 HIGH CONFIDENCE.', type: 'success' }
    ],
    lastEvidenceDate: '2026-02-14'
  },
  {
    id: 'SOL-ASSAM-00130',
    borrowerName: 'Hiren Das',
    loanAmount: 210000,
    financingDate: '2025-09-20',
    pumpManufacturer: 'Tata Power Solar Ltd',
    pumpModel: 'TPS-7.5HP Submersible',
    pumpCapacityHp: 7.5,
    solarCapacityKwp: 6.5,
    expectedDailyHours: 8.0,
    installerName: 'GreenTech Agro Assam',
    registeredLocation: {
      lat: 26.1445,
      lng: 91.7362,
      village: 'Hazo',
      district: 'Kamrup',
      state: 'Assam'
    },
    photoLocation: {
      lat: 26.1528,
      lng: 91.7480,
      village: 'Hazo North',
      district: 'Kamrup',
      state: 'Assam'
    },
    gpsOffsetMeters: 1420,
    trustScore: 48,
    scoreBreakdown: {
      installationEvidence: 60,
      locationEvidence: 35,
      equipmentMatch: 65,
      performanceConsistency: 42,
      evidenceFreshness: 40
    },
    verificationStatus: 'ANOMALY',
    inspectionPriority: 'PRIORITY_1',
    evidenceChecklist: {
      equipmentVisible: true,
      solarPanelVisible: true,
      locationMetadataAvailable: true,
      timestampAvailable: false,
      serialNumberVisible: false,
      evidenceConfidence: 48
    },
    photos: [
      {
        id: 'p10',
        type: 'panel',
        title: 'Solar PV Array & Irrigation Pump',
        url: '/assets/evidence/photo1_hero.jpg',
        uploadedAt: '2025-11-02 03:15 PM',
        geotaggedLat: 26.1528,
        geotaggedLng: 91.7480,
        status: 'warning',
        notes: 'Current geotag differs from registered parcel by approximately 1,420m. Location evidence requires re-verification before digital clearance.'
      },
      {
        id: 'p11',
        type: 'meter',
        title: 'MPPT Controller & Electrical Assembly',
        url: '/assets/evidence/photo2_controller.jpg',
        uploadedAt: '2025-11-02 03:18 PM',
        geotaggedLat: 26.1528,
        geotaggedLng: 91.7480,
        status: 'failed',
        notes: 'Reported 3.1 kWh/day generation vs expected 5.9 kWh/day (-47.5% deviation).'
      }
    ],
    performance: {
      expectedKwhPerDay: 5.9,
      reportedKwhPerDay: 3.1,
      differencePercent: -47.5,
      solarIrradianceKwhM2: 5.65,
      ambientTempCelsius: 30.2,
      cloudCoverPercent: 8,
      operatingHoursReported: 3.8,
      statusText: 'PERFORMANCE ANOMALY',
      historical7Days: [
        { date: '25 Feb', expected: 5.9, reported: 3.2 },
        { date: '26 Feb', expected: 5.9, reported: 3.1 },
        { date: '27 Feb', expected: 5.9, reported: 3.0 },
        { date: '28 Feb', expected: 5.9, reported: 3.1 },
        { date: '01 Mar', expected: 5.9, reported: 3.1 },
        { date: '02 Mar', expected: 5.9, reported: 3.2 },
        { date: '03 Mar', expected: 5.9, reported: 3.1 }
      ]
    },
    anomaly: {
      detectedDate: '2026-01-15',
      deviationPercent: -47.5,
      potentialExplanations: [
        'Possible contributor: severe panel dust, bio-soiling or localized environmental shading',
        'Possible contributor: pump impeller silt degradation or motor mechanical wear',
        'Possible contributor: sensor telemetry calibration drift or meter log reporting typo',
        'Possible contributor: geotag coordinate discrepancy requiring ground re-verification'
      ],
      recommendedAction: 'Schedule field inspection',
      responsibleAiNote: 'Weather alone does not explain the deviation. High irradiance and low cloud cover indicate that weather conditions are unlikely to fully account for the observed performance gap. Human verification is prioritized without inferring borrower misconduct.'
    },
    timeline: [
      { id: 't20', date: '20 SEP 2025', title: 'Asset registered', description: 'Loan disbursed for 7.5HP Tata Power Solar pump system.', type: 'info' },
      { id: 't21', date: '02 NOV 2025', title: 'Evidence submitted', description: 'Geotag differs from registered parcel by 1,420m; pending re-verification.', type: 'warning' },
      { id: 't22', date: '15 JAN 2026', title: 'Performance deviation flagged', description: 'Reported generation dropped to 3.1 kWh (-47.5% vs expected 5.9 kWh under clear skies).', type: 'alert' },
      { id: 't23', date: '18 FEB 2026', title: 'Technical verification prioritized', description: 'Assigned to Priority 1 queue for targeted technical inspection.', type: 'alert' }
    ],
    lastEvidenceDate: '2025-11-02'
  },
  {
    id: 'SOL-ASSAM-00129',
    borrowerName: 'Mukesh Sharma',
    loanAmount: 160000,
    financingDate: '2025-10-10',
    pumpManufacturer: 'Texmo Industries',
    pumpModel: 'T-3HP Surface Solar',
    pumpCapacityHp: 3.0,
    solarCapacityKwp: 3.2,
    expectedDailyHours: 6.5,
    installerName: 'Brahmaputra Energy Co',
    registeredLocation: {
      lat: 26.4421,
      lng: 91.4389,
      village: 'Ghopa',
      district: 'Nalbari',
      state: 'Assam'
    },
    photoLocation: {
      lat: 26.4426,
      lng: 91.4392,
      village: 'Ghopa',
      district: 'Nalbari',
      state: 'Assam'
    },
    gpsOffsetMeters: 65,
    trustScore: 71,
    scoreBreakdown: {
      installationEvidence: 78,
      locationEvidence: 95,
      equipmentMatch: 80,
      performanceConsistency: 88,
      evidenceFreshness: 45
    },
    verificationStatus: 'PARTIAL',
    inspectionPriority: 'PRIORITY_2',
    evidenceChecklist: {
      equipmentVisible: true,
      solarPanelVisible: true,
      locationMetadataAvailable: true,
      timestampAvailable: true,
      serialNumberVisible: false,
      evidenceConfidence: 71
    },
    photos: [
      {
        id: 'p30',
        type: 'panel',
        title: 'Solar PV Array & Irrigation Pump',
        url: '/assets/evidence/photo1_hero.jpg',
        uploadedAt: '2025-10-25 11:00 AM',
        status: 'passed',
        notes: 'Geotagged installation view showing the solar array, mounting structure, pump outlet and surrounding agricultural field.'
      }
    ],
    performance: {
      expectedKwhPerDay: 4.2,
      reportedKwhPerDay: 4.1,
      differencePercent: -2.4,
      solarIrradianceKwhM2: 5.10,
      ambientTempCelsius: 27.8,
      cloudCoverPercent: 15,
      operatingHoursReported: 6.3,
      statusText: 'WITHIN EXPECTED RANGE',
      historical7Days: [
        { date: '25 Feb', expected: 4.1, reported: 4.0 },
        { date: '26 Feb', expected: 4.2, reported: 4.1 },
        { date: '27 Feb', expected: 4.2, reported: 4.0 },
        { date: '28 Feb', expected: 4.3, reported: 4.2 },
        { date: '01 Mar', expected: 4.2, reported: 4.1 },
        { date: '02 Mar', expected: 4.1, reported: 4.1 },
        { date: '03 Mar', expected: 4.2, reported: 4.1 }
      ]
    },
    timeline: [
      { id: 't30', date: '10 OCT 2025', title: 'Asset registered', description: 'Loan approved for 3HP Texmo surface solar pump.', type: 'info' },
      { id: 't31', date: '25 OCT 2025', title: 'Initial photos uploaded', description: 'Incomplete evidence set uploaded (missing controller photo).', type: 'warning' },
      { id: 't32', date: '20 JAN 2026', title: 'Evidence freshness warning', description: 'Photos older than 90 days. Updated photo requested.', type: 'warning' }
    ],
    lastEvidenceDate: '2025-10-25'
  },
  {
    id: 'SOL-ASSAM-00491',
    borrowerName: 'Rina Gogoi',
    loanAmount: 195000,
    financingDate: '2025-12-01',
    pumpManufacturer: 'Lubi Pumps Ltd',
    pumpModel: 'LUB-5HP DC Solar',
    pumpCapacityHp: 5.0,
    solarCapacityKwp: 4.8,
    expectedDailyHours: 7.0,
    installerName: 'Assam Green Energy Co-op',
    registeredLocation: {
      lat: 26.3480,
      lng: 92.6840,
      village: 'Raha',
      district: 'Nagaon',
      state: 'Assam'
    },
    gpsOffsetMeters: 110,
    trustScore: 64,
    scoreBreakdown: {
      installationEvidence: 50,
      locationEvidence: 85,
      equipmentMatch: 75,
      performanceConsistency: 82,
      evidenceFreshness: 30
    },
    verificationStatus: 'PARTIAL',
    inspectionPriority: 'PRIORITY_2',
    evidenceChecklist: {
      equipmentVisible: true,
      solarPanelVisible: false,
      locationMetadataAvailable: true,
      timestampAvailable: true,
      serialNumberVisible: false,
      evidenceConfidence: 64
    },
    photos: [],
    performance: {
      expectedKwhPerDay: 5.6,
      reportedKwhPerDay: 5.2,
      differencePercent: -7.1,
      solarIrradianceKwhM2: 5.30,
      ambientTempCelsius: 29.0,
      cloudCoverPercent: 10,
      operatingHoursReported: 6.8,
      statusText: 'WITHIN EXPECTED RANGE',
      historical7Days: [
        { date: '25 Feb', expected: 5.5, reported: 5.1 },
        { date: '26 Feb', expected: 5.6, reported: 5.2 },
        { date: '27 Feb', expected: 5.5, reported: 5.1 },
        { date: '28 Feb', expected: 5.7, reported: 5.3 },
        { date: '01 Mar', expected: 5.6, reported: 5.2 },
        { date: '02 Mar', expected: 5.5, reported: 5.2 },
        { date: '03 Mar', expected: 5.6, reported: 5.2 }
      ]
    },
    timeline: [
      { id: 't40', date: '01 DEC 2025', title: 'Asset registered', description: 'Solar irrigation loan disbursed.', type: 'info' },
      { id: 't41', date: '10 FEB 2026', title: 'Incomplete photo evidence', description: 'Missing solar panel array photo. Flagged for digital update.', type: 'warning' }
    ],
    lastEvidenceDate: '2025-12-05'
  }
];
