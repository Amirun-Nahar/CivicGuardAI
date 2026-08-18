import React from 'react';
import { Shield, Sun, Moon, Key, FileText, AlertTriangle } from 'lucide-react';
import { AppTheme, AppLanguage, AppRoute } from '../types';

interface HeaderProps {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  activeRoute: AppRoute;
  setActiveRoute: (route: AppRoute) => void;
  openSettings: () => void;
  hasCustomKey: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  setTheme,
  language,
  setLanguage,
  activeRoute,
  setActiveRoute,
  openSettings,
  hasCustomKey,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#D9D092] dark:border-slate-800/60 bg-[#EBE3A7]/95 dark:bg-[#090D14]/90 backdrop-blur-md transition-colors duration-300 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 min-h-16 py-2.5 sm:py-0 flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5">
        
        {/* Brand Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer group"
          onClick={() => setActiveRoute('SHOMADHAN')}
        >
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-500/20 dark:bg-emerald-500/10 border border-emerald-700/40 dark:border-emerald-500/30 text-emerald-900 dark:text-emerald-400 group-hover:scale-105 transition-transform shadow-sm">
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-emerald-900 to-cyan-900 dark:from-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent">
              CIVIC GUARD
            </span>
            <span className="text-[9px] sm:text-[10px] font-extrabold text-[#334155] dark:text-slate-500 ml-1 font-mono">v2.5</span>
          </div>
        </div>

        {/* Center Minimal Twin Engine Switcher */}
        <div className="flex items-center p-0.5 sm:p-1 rounded-xl bg-[#DCD396] dark:bg-[#131924] border border-[#C5BC7F] dark:border-slate-800/80 shadow-inner">
          <button
            onClick={() => setActiveRoute('SHOMADHAN')}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-extrabold transition-all ${
              activeRoute === 'SHOMADHAN'
                ? 'bg-emerald-700 dark:bg-emerald-500 text-white shadow-sm'
                : 'text-[#0F172A] dark:text-slate-400 hover:text-emerald-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Shomadhan <span className="hidden md:inline">(Core)</span></span>
          </button>

          <button
            onClick={() => setActiveRoute('SCAMSHIELD')}
            className={`flex items-center space-x-1 sm:space-x-1.5 px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-extrabold transition-all ${
              activeRoute === 'SCAMSHIELD'
                ? 'bg-rose-700 dark:bg-rose-600 text-white shadow-sm'
                : 'text-[#0F172A] dark:text-slate-400 hover:text-rose-900'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ScamShield <span className="hidden md:inline">(Defense)</span></span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          
          {/* Language Toggle */}
          <div className="flex items-center bg-[#DCD396] dark:bg-[#131924] rounded-lg p-0.5 border border-[#C5BC7F] dark:border-slate-800 text-[10px] sm:text-[11px]">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-1.5 sm:px-2 py-0.5 font-extrabold rounded ${
                language === 'bn' ? 'bg-emerald-700 dark:bg-emerald-500 text-white' : 'text-[#0F172A] dark:text-slate-400'
              }`}
            >
              BN
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-1.5 sm:px-2 py-0.5 font-extrabold rounded ${
                language === 'en' ? 'bg-emerald-700 dark:bg-emerald-500 text-white' : 'text-[#0F172A] dark:text-slate-400'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('both')}
              className={`px-1.5 sm:px-2 py-0.5 font-extrabold rounded ${
                language === 'both' ? 'bg-cyan-700 dark:bg-cyan-500 text-white' : 'text-[#0F172A] dark:text-slate-400'
              }`}
            >
              Both
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Light/Dark Theme"
            className="p-1.5 sm:p-2 rounded-lg bg-[#DCD396] dark:bg-[#131924] border border-[#C5BC7F] dark:border-slate-800 text-[#0F172A] dark:text-slate-300 hover:text-emerald-900 transition-colors shadow-sm"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-950 font-bold" />}
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={openSettings}
            title="API Settings"
            className={`p-1.5 sm:p-2 rounded-lg border transition-colors shadow-sm ${
              hasCustomKey
                ? 'bg-emerald-500/20 dark:bg-emerald-500/10 text-emerald-950 dark:text-emerald-400 border-emerald-700 dark:border-emerald-500/40'
                : 'bg-[#DCD396] dark:bg-[#131924] text-[#0F172A] dark:text-slate-400 border-[#C5BC7F] dark:border-slate-800'
            }`}
          >
            <Key className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
