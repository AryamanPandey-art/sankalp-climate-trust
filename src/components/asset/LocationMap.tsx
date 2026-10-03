import React from 'react';
import type { LocationCoords } from '../../types/asset';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import { AnimatedNumber } from '../motion/AnimatedNumber';
import { FadeIn, StaggerContainer, StaggerItem, DataPulse } from '../motion/MotionSystem';
import { motion } from 'framer-motion';
import { Navigation, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface LocationMapProps {
  registeredLocation: LocationCoords;
  photoLocation?: LocationCoords;
  gpsOffsetMeters: number;
}

const createCustomIcon = (colorHex: string, label: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background: ${colorHex};
        color: white;
        border: 2px solid white;
        border-radius: 9999px;
        padding: 4px 8px;
        font-size: 10px;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        gap: 4px;
        white-space: nowrap;
      ">
        <span style="width: 8px; height: 8px; background: white; border-radius: 50%; display: inline-block;"></span>
        ${label}
      </div>
    `,
    iconSize: [120, 30],
    iconAnchor: [60, 15]
  });
};

export const LocationMap: React.FC<LocationMapProps> = ({
  registeredLocation,
  photoLocation,
  gpsOffsetMeters
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const isConsistent = gpsOffsetMeters <= 100;
  const isWarning = gpsOffsetMeters > 100 && gpsOffsetMeters <= 500;
  const isAnomaly = gpsOffsetMeters > 500;

  const centerLat = registeredLocation.lat;
  const centerLng = registeredLocation.lng;

  const photoLat = photoLocation ? photoLocation.lat : registeredLocation.lat + 0.0003;
  const photoLng = photoLocation ? photoLocation.lng : registeredLocation.lng + 0.0003;

  const regColor = isLight ? '#235327' : '#10B981';
  const photoColor = isAnomaly
    ? isLight ? '#c05638' : '#F43F5E'
    : isWarning
    ? isLight ? '#c07a10' : '#F59E0B'
    : isLight ? '#0284c7' : '#06B6D4';

  const regIcon = createCustomIcon(regColor, 'Registered Farm');
  const photoIcon = createCustomIcon(photoColor, 'Photo Geotag');

  return (
    <div className={`p-5 sm:p-6 rounded-2xl border space-y-4 transition ${
      isLight
        ? 'bg-white border-slate-200 shadow-sm'
        : 'glass-panel border-slate-800'
    }`}>
      <FadeIn>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Geographic Location Verification
              </h3>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                EXIF GPS Cross-Check
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Geotagged EXIF coordinates vs registered farm land parcel boundary.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {isConsistent && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> LOCATION CONSISTENT
              </span>
            )}
            {isWarning && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> SLIGHT OFFSET ({gpsOffsetMeters}m)
              </span>
            )}
            {isAnomaly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/30 text-xs font-bold">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" /> LOCATION MISMATCH (<AnimatedNumber value={gpsOffsetMeters} suffix="m" />)
              </span>
            )}
          </div>
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-3" staggerDelay={0.08} initialDelay={0.1}>
        <StaggerItem>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
              <DataPulse color={regColor} size={6} /> REGISTERED FARMLAND
            </div>
            <div className="text-slate-900 dark:text-white font-mono font-bold mt-1">
              Lat: {registeredLocation.lat.toFixed(4)}°
            </div>
            <div className="text-slate-900 dark:text-white font-mono font-bold">
              Lng: {registeredLocation.lng.toFixed(4)}°
            </div>
            <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium mt-1">
              {registeredLocation.village}, {registeredLocation.district}
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
            <div className="text-slate-500 dark:text-slate-400 font-semibold flex items-center gap-1.5">
              <DataPulse color={photoColor} size={6} /> PHOTO EXIF GEOTAG
            </div>
            <div className="text-slate-900 dark:text-white font-mono font-bold mt-1">
              Lat: {photoLat.toFixed(4)}°
            </div>
            <div className="text-slate-900 dark:text-white font-mono font-bold">
              Lng: {photoLng.toFixed(4)}°
            </div>
            <div className="text-[11px] text-sky-700 dark:text-cyan-400 font-medium mt-1">
              Camera EXIF Metadata Check
            </div>
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs flex flex-col justify-between">
            <div className="text-slate-500 dark:text-slate-400 font-semibold">CALCULATED GROUND OFFSET</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className={`text-2xl font-black font-mono ${
                isAnomaly
                  ? 'text-rose-600 dark:text-rose-400'
                  : isWarning
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                <AnimatedNumber value={gpsOffsetMeters} duration={1.2} suffix=" m" />
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">
                {isConsistent ? '(&lt; 100m threshold)' : '(Requires verification)'}
              </span>
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Haversine geodesic distance algorithm</div>
          </div>
        </StaggerItem>
      </StaggerContainer>

      <FadeIn delay={0.25}>
        <motion.div
          className={`w-full h-72 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 relative z-10 ${
            isLight ? 'light-map' : 'dark-map'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={14}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={[centerLat, centerLng]} icon={regIcon}>
              <Popup>
                <div className="text-xs text-slate-900">
                  <strong>Registered Farmland</strong><br />
                  {registeredLocation.village}, {registeredLocation.district}
                </div>
              </Popup>
            </Marker>

            <Marker position={[photoLat, photoLng]} icon={photoIcon}>
              <Popup>
                <div className="text-xs text-slate-900">
                  <strong>Photo EXIF Geotag</strong><br />
                  Distance: {gpsOffsetMeters} meters
                </div>
              </Popup>
            </Marker>

            <Polyline
              positions={[
                [centerLat, centerLng],
                [photoLat, photoLng]
              ]}
              pathOptions={{
                color: isAnomaly ? '#F43F5E' : '#10B981',
                dashArray: '6, 6',
                weight: 3
              }}
            />
          </MapContainer>
        </motion.div>
      </FadeIn>
    </div>
  );
};
