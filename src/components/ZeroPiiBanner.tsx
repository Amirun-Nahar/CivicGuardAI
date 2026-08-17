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
    <div className="w-full text-xs text-slate-400">
      <div className="flex items-center justify-between py-1.5 px-3 rounded-xl bg-[#0E1420]/60 dark:bg-[#0E1420]/60 light:bg-slate-100 border border-slate-800/60 light:border-slate-200">
        <div className="flex items-center space-x-2">
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span className="font-semibold text-slate-300 light:text-slate-700">Zero-PII Layer Active</span>
          <span className="text-slate-500 hidden sm:inline">• Phone (+8801...), NID & OTPs auto-masked</span>
        </div>

        <div className="flex items-center space-x-2">
          {piiAnalysis.redactionsCount > 0 && (
            <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
              ⚠️ {piiAnalysis.redactionsCount} Redacted
            </span>
          )}

          <button
            onClick={() => setShowInspector(!showInspector)}
            className="flex items-center space-x-1 text-slate-400 hover:text-cyan-400 text-[11px] font-medium transition-colors"
          >
            {showInspector ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showInspector ? 'Hide Inspector' : 'Inspect PII'}</span>
          </button>
        </div>
      </div>

      {/* PII Live Inspector Drawer */}
      {showInspector && (
        <div className="mt-2 p-3 rounded-xl bg-[#131924] border border-cyan-500/30 text-slate-200 space-y-2">
          <div className="flex items-center justify-between text-cyan-400 font-bold text-xs">
            <span className="flex items-center space-x-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Client-Side Zero-PII Sanitization Stream</span>
            </span>
            <span className="text-[10px] text-slate-400">Regex Scrubber Rule v2.4</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
            <div className="p-2 rounded bg-black/40 border border-slate-700">
              <span className="text-slate-400 font-semibold block mb-1">RAW INPUT (Before Sanitization):</span>
              <p className="font-mono text-slate-300 break-all">
                {currentInputText || 'Example: NID 1994269201923, Phone 01712345678, OTP: 492019'}
              </p>
            </div>

            <div className="p-2 rounded bg-emerald-950/30 border border-emerald-500/30">
              <span className="text-emerald-400 font-semibold block mb-1">AI PAYLOAD (Sanitized & Masked):</span>
              <p className="font-mono text-emerald-300 break-all">
                {piiAnalysis.cleanedText || 'Example: NID [REDACTED_NID], Phone [REDACTED_PHONE], OTP: [REDACTED_OTP]'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
