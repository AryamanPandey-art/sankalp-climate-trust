import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface ReliableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  containerClassName?: string;
  badgeLabel?: string;
  aspectRatio?: string;
  fallbackSrc?: string;
}

export const ReliableImage: React.FC<ReliableImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  fallbackTitle = 'Evidence preview unavailable',
  fallbackSubtitle = 'Evidence metadata & sensor telemetry intact',
  badgeLabel = 'ASSET PHOTO',
  aspectRatio,
  fallbackSrc = '/assets/hero_light.jpg',
  ...props
}) => {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [triedFallback, setTriedFallback] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setCurrentSrc(src);
    setTriedFallback(false);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  const handleError = () => {
    // If the primary image failed and we have a valid alternative fallback source, try it first
    if (fallbackSrc && !triedFallback && fallbackSrc !== currentSrc) {
      setTriedFallback(true);
      setCurrentSrc(fallbackSrc);
      setIsLoading(true);
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  if (!currentSrc || hasError) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center p-6 text-center bg-slate-900/90 dark:bg-slate-950/90 border border-slate-800/80 rounded-xl overflow-hidden select-none ${containerClassName}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-amber-500/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center space-y-2 max-w-[260px]">
          <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-400 shadow-inner">
            <Camera className="w-5 h-5 text-emerald-400/80" />
          </div>
          <span className="text-[9px] font-mono tracking-widest uppercase text-emerald-500 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
            {badgeLabel}
          </span>
          <p className="text-xs font-semibold text-slate-200 dark:text-slate-300 leading-tight">
            {fallbackTitle}
          </p>
          <p className="text-[10px] text-slate-400/80 leading-normal">
            {fallbackSubtitle}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`} style={aspectRatio ? { aspectRatio } : undefined}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/60 animate-pulse flex items-center justify-center z-10">
          <Camera className="w-5 h-5 text-slate-600 animate-bounce" />
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt || 'Rural climate asset verification evidence'}
        onError={handleError}
        onLoad={() => setIsLoading(false)}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-300'}`}
        {...props}
      />
    </div>
  );
};
