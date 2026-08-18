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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/60 dark:border-slate-800/60 light:border-[#D9D092] bg-[#090D14]/90 dark:bg-[#090D14]/90 light:bg-[#EBE3A7]/95 backdrop-blur-md transition-colors duration-300 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          className="flex items-center space-x-2.5 cursor-pointer group"
          onClick={() => setActiveRoute('SHOMADHAN')}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 dark:text-emerald-400 light:text-emerald-900 group-hover:scale-105 transition-transform shadow-sm">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 dark:from-emerald-400 dark:to-cyan-400 light:from-emerald-900 light:to-cyan-900 bg-clip-text text-transparent">
              CIVIC GUARD
            </span>
            <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-500 light:text-[#334155] ml-1.5 font-mono">v2.5</span>
          </div>
        </div>

        {/* Center Minimal Twin Engine Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#131924] dark:bg-[#131924] light:bg-[#DCD396] border border-slate-800/80 light:border-[#C5BC7F] shadow-inner">
          <button
            onClick={() => setActiveRoute('SHOMADHAN')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              activeRoute === 'SHOMADHAN'
                ? 'bg-emerald-500 dark:bg-emerald-500 light:bg-emerald-700 text-white shadow-sm'
                : 'text-slate-400 dark:text-slate-400 light:text-[#0F172A] hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Shomadhan (Core)</span>
          </button>

          <button
            onClick={() => setActiveRoute('SCAMSHIELD')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              activeRoute === 'SCAMSHIELD'
                ? 'bg-rose-600 dark:bg-rose-600 light:bg-rose-700 text-white shadow-sm'
                : 'text-slate-400 dark:text-slate-400 light:text-[#0F172A] hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ScamShield (Defense)</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          
          {/* Language Toggle */}
          <div className="flex items-center bg-[#131924] dark:bg-[#131924] light:bg-[#DCD396] rounded-lg p-0.5 border border-slate-800 light:border-[#C5BC7F] text-[11px]">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2 py-0.5 font-extrabold rounded ${
                language === 'bn' ? 'bg-emerald-500 light:bg-emerald-700 text-white' : 'text-slate-400 dark:text-slate-400 light:text-[#0F172A]'
              }`}
            >
              BN
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 font-extrabold rounded ${
                language === 'en' ? 'bg-emerald-500 light:bg-emerald-700 text-white' : 'text-slate-400 dark:text-slate-400 light:text-[#0F172A]'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('both')}
              className={`px-2 py-0.5 font-extrabold rounded ${
                language === 'both' ? 'bg-cyan-500 light:bg-cyan-700 text-white' : 'text-slate-400 dark:text-slate-400 light:text-[#0F172A]'
              }`}
            >
              Both
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Light/Dark Theme"
            className="p-2 rounded-lg bg-[#131924] dark:bg-[#131924] light:bg-[#DCD396] border border-slate-800 light:border-[#C5BC7F] text-slate-300 dark:text-slate-300 light:text-[#0F172A] hover:text-emerald-400 transition-colors shadow-sm"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-amber-950 font-bold" />}
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={openSettings}
            title="API Settings"
            className={`p-2 rounded-lg border transition-colors shadow-sm ${
              hasCustomKey
                ? 'bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-emerald-500/20 text-emerald-400 dark:text-emerald-400 light:text-emerald-950 border-emerald-500/40 light:border-emerald-700'
                : 'bg-[#131924] dark:bg-[#131924] light:bg-[#DCD396] text-slate-400 dark:text-slate-400 light:text-[#0F172A] border-slate-800 light:border-[#C5BC7F]'
            }`}
          >
            <Key className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
