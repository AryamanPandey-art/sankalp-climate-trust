import React from 'react';
import type { BadgeType } from '../../types/asset';
import { CheckCircle2, Calculator, FileText, AlertTriangle, HelpCircle } from 'lucide-react';

interface BadgeProps {
  type: BadgeType;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const DistinctionBadge: React.FC<BadgeProps> = ({ type, label, size = 'md' }) => {
  const displayLabel = label || type;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs font-medium',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  };

  switch (type) {
    case 'VERIFIED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 ${sizeClasses[size]}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>{displayLabel}</span>
        </span>
      );
    case 'ESTIMATED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 ${sizeClasses[size]}`}>
          <Calculator className="w-3.5 h-3.5 text-cyan-400" />
          <span>{displayLabel}</span>
        </span>
      );
    case 'REPORTED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 ${sizeClasses[size]}`}>
          <FileText className="w-3.5 h-3.5 text-indigo-400" />
          <span>{displayLabel}</span>
        </span>
      );
    case 'PARTIAL':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 ${sizeClasses[size]}`}>
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>{displayLabel}</span>
        </span>
      );
    case 'UNVERIFIED':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 ${sizeClasses[size]}`}>
          <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>{displayLabel}</span>
        </span>
      );
    case 'ANOMALY':
      return (
        <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse ${sizeClasses[size]}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          <span>{displayLabel}</span>
        </span>
      );
    default:
      return null;
  }
};
