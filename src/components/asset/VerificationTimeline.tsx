import React from 'react';
import type { TimelineEvent } from '../../types/asset';
import { Clock, CheckCircle2, AlertTriangle, Info } from 'lucide-react';

interface VerificationTimelineProps {
  timeline: TimelineEvent[];
}

export const VerificationTimeline: React.FC<VerificationTimelineProps> = ({ timeline }) => {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-emerald-400" /> Evidence & Verification Audit Trail
        </h3>
        <span className="text-xs text-slate-400 font-mono">
          {timeline.length} Recorded Events
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.map((event, idx) => {
          let dotColor = 'bg-slate-700 text-slate-300';
          if (event.type === 'success') dotColor = 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40';
          if (event.type === 'alert') dotColor = 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse';
          if (event.type === 'warning') dotColor = 'bg-amber-500/20 text-amber-400 border border-amber-500/40';

          return (
            <div key={event.id || idx} className="relative group">
              <div className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${dotColor}`}>
                {event.type === 'success' && <CheckCircle2 className="w-3 h-3" />}
                {event.type === 'alert' && <AlertTriangle className="w-3 h-3" />}
                {event.type === 'warning' && <AlertTriangle className="w-3 h-3" />}
                {event.type === 'info' && <Info className="w-3 h-3" />}
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{event.title}</span>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">{event.date}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">{event.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
