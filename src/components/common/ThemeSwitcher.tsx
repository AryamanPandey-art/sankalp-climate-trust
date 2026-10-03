import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme, isTransitioning } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="relative">
      <motion.button
        onClick={toggleTheme}
        className={`relative flex items-center gap-1.5 p-1 rounded-full text-xs font-semibold transition-all border shadow-sm ${
          isLight
            ? 'bg-amber-50/80 border-amber-200/80 text-amber-900'
            : 'bg-slate-900/90 border-slate-700/80 text-slate-200'
        }`}
        title={`Switch to ${isLight ? 'Night / Dark Mode' : 'Day / Light Mode'}`}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        aria-label={`Toggle theme: currently ${isLight ? 'Day' : 'Night'}`}
      >
        {/* Day Pill */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all duration-300 ${
            isLight
              ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-slate-950 font-bold shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sun className={`w-3.5 h-3.5 ${isLight ? 'text-slate-950 animate-pulse' : 'text-slate-400'}`} />
          <span className="text-[11px] tracking-wide">DAY</span>
        </div>

        {/* Night Pill */}
        <div
          className={`flex items-center gap-1 px-2.5 py-1 rounded-full transition-all duration-300 ${
            !isLight
              ? 'bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-300 font-bold shadow-sm'
              : 'text-amber-800/60 hover:text-amber-900'
          }`}
        >
          <Moon className={`w-3.5 h-3.5 ${!isLight ? 'text-cyan-300' : 'text-amber-700'}`} />
          <span className="text-[11px] tracking-wide">NIGHT</span>
        </div>

        {/* Atmospheric transition flash */}
        {isTransitioning && (
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-r from-amber-400/30 via-orange-400/30 to-indigo-500/30 blur-sm"
            initial={{ opacity: 0.8, scale: 1 }}
            animate={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.button>
    </div>
  );
};
