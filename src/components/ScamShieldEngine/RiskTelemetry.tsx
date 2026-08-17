import React from 'react';
import { ScamShieldOutput } from '../../types';
import { ShieldAlert, AlertOctagon, CheckCircle2, Flame, ShieldX } from 'lucide-react';

interface RiskTelemetryProps {
  data: ScamShieldOutput;
  onTriggerIncidentMode: () => void;
}

export const RiskTelemetry: React.FC<RiskTelemetryProps> = ({ data, onTriggerIncidentMode }) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'from-crimson-600 to-rose-600 text-rose-300 border-crimson-500/50';
      case 'HIGH':
        return 'from-amber-600 to-rose-600 text-amber-300 border-amber-500/50';
      case 'MEDIUM':
        return 'from-amber-500 to-yellow-500 text-yellow-300 border-yellow-500/50';
      default:
        return 'from-emerald-500 to-cyan-500 text-emerald-300 border-emerald-500/50';
    }
  };

  return (
    <div className="space-y-6">

      {/* Telemetry Header Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#131924] via-[#0E1420] to-[#131924] border border-[#1E2638] shadow-2xl space-y-4">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#1E2638] pb-4">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              ScamShield AI Security Telemetry
            </span>
            <div className="flex items-center space-x-3">
              <h2 className="text-2xl font-extrabold text-slate-100">Threat Evaluation Score</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-extrabold border bg-gradient-to-r ${getRiskColor(data.risk_level)} shadow-md`}>
                {data.risk_level} THREAT
              </span>
            </div>
          </div>

          {/* Risk Score Dial Meter */}
          <div className="flex items-center space-x-3 bg-[#090D14] px-5 py-3 rounded-2xl border border-slate-800">
            <div className="text-right">
              <span className="text-3xl font-extrabold text-rose-500 tracking-tight">{data.risk_score}</span>
              <span className="text-xs text-slate-500 font-bold block">/ 100 Risk Index</span>
            </div>
            <div className="w-12 h-12 rounded-full border-4 border-rose-500/30 flex items-center justify-center bg-rose-500/10">
              <Flame className="w-6 h-6 text-rose-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Emergency Incident Trigger Banner */}
        <div className="p-4 rounded-xl bg-crimsondanger-500/10 border border-crimsondanger-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-3 text-xs text-rose-200">
            <AlertOctagon className="w-6 h-6 text-rose-400 flex-shrink-0" />
            <div>
              <span className="font-extrabold block text-sm">Did you already click this link or share your PIN?</span>
              Trigger immediate triage mode to lock accounts & generate emergency voice checklist.
            </div>
          </div>

          <button
            onClick={onTriggerIncidentMode}
            className="flex-shrink-0 px-5 py-2.5 rounded-xl font-extrabold text-xs bg-gradient-to-r from-crimson-600 to-rose-600 text-white shadow-lg glow-crimson hover:scale-105 transition-transform"
          >
            🚨 "I ALREADY CLICKED IT" (Emergency Triage)
          </button>
        </div>

        {/* Threat Indicators Breakdown */}
        <div className="space-y-3 pt-2">
          <h3 className="font-extrabold text-sm text-slate-200 flex items-center space-x-2">
            <ShieldX className="w-4 h-4 text-rose-400" />
            <span>Detected Threat Indicators ({data.threat_indicators.length})</span>
          </h3>

          <div className="grid grid-cols-1 gap-2.5">
            {data.threat_indicators.map((ind, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3 rounded-xl bg-[#090D14]/80 border border-rose-500/20 text-xs text-slate-200"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <span className="font-medium leading-relaxed">{ind}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Immediate Recommended Safety Actions */}
        <div className="space-y-3 pt-2">
          <h3 className="font-extrabold text-sm text-slate-200 flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Recommended Safety Actions</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {data.immediate_safety_actions.map((act, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-2.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200"
              >
                <span className="font-bold text-emerald-400 flex-shrink-0">{idx + 1}.</span>
                <span className="leading-relaxed">{act}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
