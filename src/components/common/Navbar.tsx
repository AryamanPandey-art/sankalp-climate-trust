import React from 'react';
import {
  ShieldCheck,
  PlusCircle,
  LayoutDashboard,
  Calculator,
  AlertOctagon,
  Sparkles,
  Box,
  Search,
  Bell
} from 'lucide-react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { useTheme } from '../../context/ThemeContext';

interface NavbarProps {
  currentTab: 'landing' | 'dashboard' | 'register' | 'asset' | 'anomaly' | 'inspections' | 'simulator';
  onSelectTab: (tab: 'landing' | 'dashboard' | 'register' | 'asset' | 'anomaly' | 'inspections' | 'simulator') => void;
  isTourActive: boolean;
  onToggleTour: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  isTourActive,
  onToggleTour
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <header className={`w-full border-b backdrop-blur-md sticky top-0 z-40 transition-colors duration-300 ${
      isLight
        ? 'bg-[#faf8f2]/90 border-[#e5ded3]'
        : 'bg-[#090e17]/90 border-white/10'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand (Matching Reference Image) */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => onSelectTab('landing')}
        >
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white shadow-sm ${
            isLight ? 'bg-[#1b7340]' : 'bg-[#10b981]'
          }`}>
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm sm:text-base font-bold tracking-tight font-display ${
                isLight ? 'text-[#18221b]' : 'text-white'
              }`}>
                Rural Climate Asset Trust
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider hidden lg:inline-block">
                SANKALP
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar (Matching Reference Image Command Center header) */}
        <div className="hidden md:flex flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search assets, villages, or IDs..."
              onClick={() => {
                if (currentTab !== 'dashboard') onSelectTab('dashboard');
              }}
              className={`w-full text-xs rounded-full pl-9 pr-4 py-2 border transition focus:outline-none focus:ring-1 focus:ring-emerald-500 ${
                isLight
                  ? 'bg-white/95 border-[#e2dcce] text-[#18221b] placeholder-slate-400'
                  : 'bg-[#0d1522]/90 border-white/10 text-white placeholder-slate-500'
              }`}
            />
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1 p-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/60">
          <button
            onClick={() => onSelectTab('landing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              currentTab === 'landing'
                ? isLight ? 'bg-white text-[#1b7340] shadow-sm' : 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            Platform
          </button>
          
          <button
            onClick={() => onSelectTab('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              currentTab === 'dashboard' || currentTab === 'asset'
                ? isLight ? 'bg-white text-[#1b7340] shadow-sm' : 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => onSelectTab('register')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              currentTab === 'register'
                ? isLight ? 'bg-white text-[#1b7340] shadow-sm' : 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Register
          </button>

          <button
            onClick={() => onSelectTab('inspections')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              currentTab === 'inspections' || currentTab === 'anomaly'
                ? isLight ? 'bg-white text-[#1b7340] shadow-sm' : 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <AlertOctagon className="w-3.5 h-3.5" />
            Inspections
          </button>

          <button
            onClick={() => onSelectTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
              currentTab === 'simulator'
                ? isLight ? 'bg-white text-[#1b7340] shadow-sm' : 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            Simulation
          </button>
        </nav>

        {/* Right Section: Theme Toggle, Notifications, User Profile (Priya S / Lender) */}
        <div className="flex items-center gap-2.5">
          <ThemeSwitcher />

          <button
            className={`p-2 rounded-full border transition hidden sm:flex ${
              isLight
                ? 'bg-white/80 border-[#e5ded3] text-slate-600 hover:bg-slate-100'
                : 'bg-slate-900/80 border-white/10 text-slate-400 hover:text-white'
            }`}
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          {/* User Profile Pill: Priya S / Lender (Matching Reference Image) */}
          <div className={`hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full border ${
            isLight
              ? 'bg-white/90 border-[#e5ded3] text-[#18221b]'
              : 'bg-[#0e1624]/90 border-white/10 text-slate-200'
          }`}>
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-bold">
              P
            </div>
            <div className="text-left leading-tight pr-1">
              <div className="text-xs font-bold">Priya S</div>
              <div className="text-[9px] text-slate-400">Lender</div>
            </div>
          </div>

          <button
            onClick={onToggleTour}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition border ${
              isTourActive
                ? 'bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40'
                : isLight
                ? 'bg-white hover:bg-slate-50 text-slate-700 border-[#e5ded3]'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">{isTourActive ? 'Exit Pitch' : 'Pitch Mode'}</span>
          </button>

          <button
            onClick={() => onSelectTab('register')}
            className={`px-3.5 py-1.5 rounded-full text-white font-semibold text-xs flex items-center gap-1.5 transition shadow-sm ${
              isLight ? 'bg-[#1b7340] hover:bg-[#145a32]' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Register</span>
          </button>
        </div>
      </div>
    </header>
  );
};
