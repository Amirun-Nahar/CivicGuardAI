import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { analyzePiiRedactions } from '../lib/piiScrubber';

interface ZeroPiiBannerProps {
  currentInputText?: string;
}

export const ZeroPiiBanner: React.FC<ZeroPiiBannerProps> = ({ currentInputText = '' }) => {
  const [showInspector, setShowInspector] = useState(false);
  const piiAnalysis = analyzePiiRedactions(currentInputText);

  return (
    <div className="w-full text-xs">
      <div className="flex items-center justify-between py-2 px-3.5 rounded-xl bg-[#DCD396] dark:bg-[#0E1420]/80 border border-[#C5BC7F] dark:border-slate-800 shadow-sm">
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
          <span className="font-extrabold text-[#0F172A] dark:text-slate-200">Zero-PII Layer Active</span>
          <span className="text-[#334155] dark:text-slate-300 font-extrabold hidden sm:inline">• Phone (+8801...), NID & OTPs auto-masked</span>
        </div>

        <div className="flex items-center space-x-2">
          {piiAnalysis.redactionsCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-950 dark:text-amber-300 font-extrabold text-[10px] border border-amber-600/40">
              ⚠️ {piiAnalysis.redactionsCount} Redacted
            </span>
          )}

          <button
            onClick={() => setShowInspector(!showInspector)}
            className="flex items-center space-x-1.5 text-[#0F172A] hover:text-cyan-900 dark:text-slate-300 dark:hover:text-cyan-400 text-xs font-extrabold transition-colors py-0.5 px-2 rounded-lg bg-[#EBE3A7] dark:bg-slate-800 border border-[#C5BC7F] dark:border-slate-700 shadow-xs"
          >
            {showInspector ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showInspector ? 'Hide Inspector' : 'Inspect PII'}</span>
          </button>
        </div>
      </div>

      {/* PII Live Inspector Drawer */}
      {showInspector && (
        <div className="mt-2 p-3.5 rounded-xl bg-[#FFF8D6] dark:bg-[#131924] border border-[#C5BC7F] dark:border-cyan-500/30 text-[#0F172A] dark:text-slate-200 space-y-2.5 shadow-md">
          <div className="flex items-center justify-between text-cyan-900 dark:text-cyan-400 font-extrabold text-xs border-b border-[#C5BC7F] dark:border-slate-800 pb-2">
            <span className="flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-cyan-800 dark:text-cyan-400" />
              <span>Client-Side Zero-PII Sanitization Stream</span>
            </span>
            <span className="text-[10px] text-[#334155] dark:text-slate-400 font-bold">Regex Scrubber Rule v2.4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 rounded-lg bg-[#DCD396] dark:bg-black/40 border border-[#C5BC7F] dark:border-slate-700">
              <span className="text-[#0F172A] dark:text-slate-400 font-extrabold block mb-1">RAW INPUT (Before Sanitization):</span>
              <p className="font-mono text-[#0F172A] dark:text-slate-300 break-all font-bold">
                {currentInputText || 'Example: NID 1994269201923, Phone 01712345678, OTP: 492019'}
              </p>
            </div>

            <div className="p-2.5 rounded-lg bg-[#DCECC7] dark:bg-emerald-950/30 border border-emerald-600/40 dark:border-emerald-500/30">
              <span className="text-[#047857] dark:text-emerald-400 font-extrabold block mb-1">AI PAYLOAD (Sanitized & Masked):</span>
              <p className="font-mono text-[#047857] dark:text-emerald-300 break-all font-extrabold">
                {piiAnalysis.cleanedText || 'Example: NID [REDACTED_NID], Phone [REDACTED_PHONE], OTP: [REDACTED_OTP]'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
