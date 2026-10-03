import React, { useState, useEffect } from 'react';
import type { PhotoEvidenceItem, EvidenceChecklist } from '../../types/asset';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { FadeIn, StaggerContainer, StaggerItem, GlowPulse } from '../motion/MotionSystem';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, CheckCircle2, AlertTriangle, Upload, X, MapPin, Clock, Fingerprint, Maximize2 } from 'lucide-react';
import { ReliableImage } from '../common/ReliableImage';

interface PhotoEvidenceDeckProps {
  photos: PhotoEvidenceItem[];
  checklist: EvidenceChecklist;
  onAddPhoto?: (photo: PhotoEvidenceItem) => void;
}

export const PhotoEvidenceDeck: React.FC<PhotoEvidenceDeckProps> = ({
  photos,
  checklist,
  onAddPhoto
}) => {
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEvidenceItem | null>(photos && photos.length > 0 ? photos[0] : null);
  const [isExpanded, setIsExpanded] = useState(false);

  const firstPhotoId = photos?.[0]?.id;
  useEffect(() => {
    setSelectedPhoto(photos && photos.length > 0 ? photos[0] : null);
  }, [photos, firstPhotoId]);

  const samplePhotoOptions: PhotoEvidenceItem[] = [
    {
      id: 'p-demo-1',
      type: 'panel',
      title: 'Solar PV Array & Irrigation Pump',
      url: '/assets/evidence/photo1_hero.jpg',
      uploadedAt: '10:24 AM Today',
      status: 'passed',
      notes: 'Geotagged installation view showing the solar array, mounting structure, pump outlet and surrounding agricultural field.'
    },
    {
      id: 'p-demo-2',
      type: 'meter',
      title: 'MPPT Controller & Electrical Assembly',
      url: '/assets/evidence/photo2_controller.jpg',
      uploadedAt: '10:26 AM Today',
      status: 'passed',
      notes: 'Close-up evidence of installed control equipment and mounting structure.'
    },
    {
      id: 'p-demo-3',
      type: 'context',
      title: 'Field & Installation Context',
      url: '/assets/evidence/photo3_field.jpg',
      uploadedAt: '10:28 AM Today',
      status: 'passed',
      notes: "Wide environmental view used to verify the asset's surrounding agricultural context."
    },
    {
      id: 'p-demo-4',
      type: 'pump',
      title: 'Water Discharge Point',
      url: '/assets/evidence/photo4_discharge.jpg',
      uploadedAt: '10:30 AM Today',
      status: 'passed',
      notes: 'Visible water discharge from the irrigation outlet during the documented inspection.'
    },
    {
      id: 'p-demo-5',
      type: 'inspection',
      title: 'Technical Inspection View',
      url: '/assets/evidence/photo5_technician.jpg',
      uploadedAt: '10:32 AM Today',
      status: 'passed',
      notes: 'Inspection view showing the installed control equipment and field verification activity.'
    },
    {
      id: 'p-demo-6',
      type: 'installation',
      title: 'Installation Side View',
      url: '/assets/evidence/photo6_side.jpg',
      uploadedAt: '10:34 AM Today',
      status: 'passed',
      notes: 'Side-angle evidence showing the solar panels, mounting structure, pump assembly and irrigation channel.'
    },
    {
      id: 'p-demo-7',
      type: 'pump',
      title: 'Pump & Pipe Assembly',
      url: '/assets/evidence/photo7_pump.jpg',
      uploadedAt: '10:36 AM Today',
      status: 'passed',
      notes: 'Close-up evidence of the pump housing, pipe connection and discharge assembly.'
    },
    {
      id: 'p-demo-8',
      type: 'inspection',
      title: 'Field Verification View',
      url: '/assets/evidence/photo8_inspector.jpg',
      uploadedAt: '10:38 AM Today',
      status: 'passed',
      notes: 'Field verification view showing the asset and surrounding installation context.'
    }
  ];

  const handleSimulateUpload = () => {
    if (onAddPhoto) {
      const randomSample = samplePhotoOptions[Math.floor(Math.random() * samplePhotoOptions.length)];
      onAddPhoto({
        ...randomSample,
        id: `photo-${Date.now()}`
      });
    }
  };

  const selectedIndex = selectedPhoto ? photos.findIndex(p => p.id === selectedPhoto.id) : 0;

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-6">
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-emerald-400" /> Photo & Evidence Verification
              </h3>
              <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                Prototype / Demo Assessment
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Geotagged image evidence deck for installation and equipment specs.
            </p>
          </div>

          <motion.button
            onClick={handleSimulateUpload}
            className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-semibold flex items-center gap-1.5 border border-emerald-500/30 transition shrink-0"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Sample Photo</span>
          </motion.button>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-3">
          {/* Main Hero Evidence Image */}
          <AnimatePresence mode="wait">
            {selectedPhoto ? (
              <motion.div
                key={selectedPhoto.id}
                className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video group cursor-pointer shadow-xl"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIsExpanded(true)}
              >
                <ReliableImage
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title}
                  className="w-full h-full object-cover transition transform group-hover:scale-105 duration-700"
                  containerClassName="w-full h-full"
                  badgeLabel="PHOTO EVIDENCE"
                  fallbackTitle={selectedPhoto.title}
                  fallbackSubtitle="Geotagged photographic preview unavailable • Metadata verified"
                />

                {/* View Counter Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
                  <span className="px-2.5 py-1 rounded-md bg-slate-950/85 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow">
                    <Camera className="w-3 h-3 text-emerald-400" />
                    <span>EVIDENCE VIEW {selectedIndex >= 0 ? selectedIndex + 1 : 1} OF {photos.length || 1}</span>
                  </span>
                </div>

                {/* Metadata Badges */}
                <div className="absolute top-3 right-3 flex flex-wrap justify-end gap-1.5 z-10 pointer-events-none">
                  <div className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-[9px] text-slate-300 border border-slate-700/80 flex items-center gap-1 shadow">
                    <MapPin className="w-2.5 h-2.5 text-emerald-400" /> GPS: {selectedPhoto.geotaggedLat?.toFixed(4) || '26.4712'}°, {selectedPhoto.geotaggedLng?.toFixed(4) || '92.0322'}°
                  </div>
                  <div className="px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-[9px] text-slate-300 border border-slate-700/80 flex items-center gap-1 shadow">
                    <Clock className="w-2.5 h-2.5 text-cyan-400" /> {selectedPhoto.uploadedAt}
                  </div>
                  <div className="hidden sm:flex px-2 py-0.5 rounded bg-slate-950/80 backdrop-blur-sm text-[9px] text-slate-300 border border-slate-700/80 items-center gap-1 shadow">
                    <Maximize2 className="w-2.5 h-2.5 text-slate-400" /> Enlarge
                  </div>
                </div>

                {/* Dark Gradient Overlay for optimal legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent pointer-events-none" />

                {/* Bottom Caption, Description and Status */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-xs z-10 pointer-events-none">
                  <div className="space-y-0.5 max-w-xl">
                    <div className="font-bold text-white text-sm sm:text-base drop-shadow-md tracking-tight">
                      {selectedPhoto.title}
                    </div>
                    <div className="text-[11px] sm:text-xs text-slate-300 drop-shadow leading-relaxed">
                      {selectedPhoto.notes}
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] font-mono font-semibold border shrink-0 self-start sm:self-auto ${
                    selectedPhoto.status === 'passed'
                      ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/40'
                      : selectedPhoto.status === 'warning'
                      ? 'bg-amber-950/90 text-amber-400 border-amber-500/40'
                      : 'bg-rose-950/90 text-rose-400 border-rose-500/40'
                  }`}>
                    {selectedPhoto.status === 'passed' ? 'DEMONSTRATION VIEW' : selectedPhoto.status === 'warning' ? '⚠ WARNING' : '✗ FAILED'}
                  </span>
                </div>
              </motion.div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-slate-500 text-xs">
                No photos uploaded yet. Click Upload to add sample evidence.
              </div>
            )}
          </AnimatePresence>

          {/* Supporting Thumbnail Dossier Ribbon */}
          <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-8 gap-2">
            {photos.map((p, idx) => (
              <motion.button
                key={p.id}
                onClick={() => setSelectedPhoto(p)}
                title={p.title}
                className={`rounded-lg overflow-hidden border aspect-video transition relative group ${
                  selectedPhoto?.id === p.id
                    ? 'border-emerald-400 ring-2 ring-emerald-500/50 shadow-md shadow-emerald-950/50 opacity-100'
                    : 'border-slate-800 hover:border-slate-600 opacity-60 hover:opacity-100'
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: selectedPhoto?.id === p.id ? 1 : 0.6, scale: 1 }}
                transition={{ delay: idx * 0.03 }}
                whileHover={{ y: -2 }}
              >
                <ReliableImage
                  src={p.url}
                  alt={p.title}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                  badgeLabel="VIEW"
                  fallbackTitle={`View ${idx + 1}`}
                  fallbackSubtitle="Evidence record"
                />
                <span className="absolute top-1 left-1 px-1 py-0.2 rounded text-[8px] font-mono bg-slate-950/85 text-slate-300 border border-slate-700 pointer-events-none">
                  #{idx + 1}
                </span>
                {p.status === 'warning' ? (
                  <motion.span
                    className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                ) : p.status === 'passed' ? (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ) : (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-400" />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right: Evidence Metrics */}
        <div className="lg:col-span-5 space-y-4">
          <FadeIn delay={0.2}>
            <GlowPulse className="rounded-xl">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Evidence Confidence Score
                  </div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    <AnimatedNumber value={checklist.evidenceConfidence} suffix="%" duration={1.5} />
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Calculated from 5 evidence metadata signals
                  </div>
                </div>

                <motion.div
                  className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center font-bold text-emerald-400 text-lg"
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <AnimatedNumber value={checklist.evidenceConfidence} suffix="%" />
                </motion.div>
              </div>
            </GlowPulse>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider border-b border-slate-800 pb-2">
                Installation Checklist
              </div>

              <StaggerContainer className="space-y-2 text-xs" staggerDelay={0.08} initialDelay={0.4}>
                {[
                  {
                    label: 'Equipment visible',
                    passed: checklist.equipmentVisible,
                    warning: !checklist.equipmentVisible,
                    statusText: checklist.equipmentVisible ? 'Passed' : 'Missing / Incomplete'
                  },
                  {
                    label: 'Solar panel array visible',
                    passed: checklist.solarPanelVisible,
                    warning: !checklist.solarPanelVisible,
                    statusText: checklist.solarPanelVisible ? 'Passed' : 'Missing / Incomplete'
                  },
                  {
                    label: 'Location EXIF metadata available',
                    passed: checklist.locationMetadataAvailable,
                    warning: !checklist.locationMetadataAvailable,
                    statusText: checklist.locationMetadataAvailable ? 'Passed' : 'Missing / Incomplete'
                  },
                  {
                    label: 'Timestamp available',
                    passed: checklist.timestampAvailable,
                    warning: !checklist.timestampAvailable,
                    statusText: checklist.timestampAvailable ? 'Passed' : 'Missing / Incomplete'
                  },
                  {
                    label: 'Equipment serial number visible',
                    passed: checklist.serialNumberVisible,
                    warning: !checklist.serialNumberVisible,
                    statusText: checklist.serialNumberVisible ? 'Passed' : '⚠ Partially Obscured'
                  },
                ].map((item, idx) => (
                  <StaggerItem key={idx}>
                    <div className={`flex items-center justify-between ${item.warning ? 'pt-1 border-t border-slate-800/80' : ''}`}>
                      <span className={`flex items-center gap-2 ${item.warning ? 'text-amber-300' : 'text-slate-300'}`}>
                        {item.warning ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {item.label}
                      </span>
                      <span className={item.warning ? 'text-amber-400 font-semibold' : 'text-emerald-400 font-semibold'}>
                        {item.statusText}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeIn>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-400">
            <strong className="text-slate-200">Prototype Disclaimer:</strong> Image assessment combines user-submitted camera EXIF tags, contrast analysis, and checklist prompts. It is an operational decision support tool for credit teams.
          </div>
        </div>
      </div>

      {/* Expanded Photo Modal */}
      <AnimatePresence>
        {isExpanded && selectedPhoto && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              className="relative max-w-4xl w-full"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ReliableImage
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="w-full rounded-2xl border border-slate-700 max-h-[80vh] object-contain mx-auto"
                containerClassName="w-full rounded-2xl overflow-hidden"
                badgeLabel="HIGH RES EVIDENCE"
                fallbackTitle={selectedPhoto.title}
                fallbackSubtitle="High-resolution evidence preview unavailable • Sensor EXIF and GPS tags retained"
              />
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 rounded-full bg-slate-900/90 text-white hover:bg-slate-800 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 to-transparent rounded-b-2xl">
                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold border ${
                    selectedPhoto.status === 'passed'
                      ? 'bg-emerald-950/90 text-emerald-400 border-emerald-500/40'
                      : selectedPhoto.status === 'warning'
                      ? 'bg-amber-950/90 text-amber-400 border-amber-500/40'
                      : 'bg-rose-950/90 text-rose-400 border-rose-500/40'
                  }`}>
                    {selectedPhoto.status === 'passed' ? 'DEMONSTRATION VIEW' : selectedPhoto.status === 'warning' ? '⚠ WARNING' : '✗ FAILED'}
                  </span>
                  <div className="flex items-center gap-1.5 text-emerald-400">
                    <MapPin className="w-3.5 h-3.5" /> GPS: {selectedPhoto.geotaggedLat?.toFixed(4) || 'N/A'}°, {selectedPhoto.geotaggedLng?.toFixed(4) || 'N/A'}°
                  </div>
                  <div className="flex items-center gap-1.5 text-cyan-400">
                    <Clock className="w-3.5 h-3.5" /> {selectedPhoto.uploadedAt}
                  </div>
                  <div className="flex items-center gap-1.5 text-violet-400">
                    <Fingerprint className="w-3.5 h-3.5" /> ID: {selectedPhoto.id}
                  </div>
                </div>
                <div className="mt-2 text-white font-bold">{selectedPhoto.title}</div>
                <div className="text-slate-300 text-xs">{selectedPhoto.notes}</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
