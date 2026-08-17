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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/60 dark:border-slate-800/60 light:border-slate-200 bg-[#090D14]/90 dark:bg-[#090D14]/90 light:bg-white/95 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div
          className="flex items-center space-x-2.5 cursor-pointer group"
          onClick={() => setActiveRoute('SHOMADHAN')}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              CIVIC GUARD
            </span>
            <span className="text-[10px] font-bold text-slate-500 ml-1.5 font-mono">v2.5</span>
          </div>
        </div>

        {/* Center Minimal Twin Engine Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-[#131924] dark:bg-[#131924] light:bg-slate-100 border border-slate-800/80 light:border-slate-200">
          <button
            onClick={() => setActiveRoute('SHOMADHAN')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeRoute === 'SHOMADHAN'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Shomadhan (Core)</span>
          </button>

          <button
            onClick={() => setActiveRoute('SCAMSHIELD')}
            className={`flex items-center space-x-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeRoute === 'SCAMSHIELD'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>ScamShield (Defense)</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          
          {/* Language Toggle */}
          <div className="flex items-center bg-[#131924] light:bg-slate-100 rounded-lg p-0.5 border border-slate-800 light:border-slate-200 text-[11px]">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2 py-0.5 font-bold rounded ${
                language === 'bn' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              BN
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 font-bold rounded ${
                language === 'en' ? 'bg-emerald-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('both')}
              className={`px-2 py-0.5 font-bold rounded ${
                language === 'both' ? 'bg-cyan-500 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Both
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            title="Toggle Light/Dark Theme"
            className="p-2 rounded-lg bg-[#131924] dark:bg-[#131924] light:bg-slate-100 border border-slate-800 light:border-slate-200 text-slate-300 hover:text-emerald-400 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={openSettings}
            title="API Settings"
            className={`p-2 rounded-lg border transition-colors ${
              hasCustomKey
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40'
                : 'bg-[#131924] text-slate-400 border-slate-800 hover:border-slate-600'
            }`}
          >
            <Key className="w-4 h-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
