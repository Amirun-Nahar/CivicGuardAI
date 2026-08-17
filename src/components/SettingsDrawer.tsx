import React, { useState } from 'react';
import { X, Key, Sparkles, CheckCircle2, ShieldAlert } from 'lucide-react';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  geminiKey: string;
  setGeminiKey: (key: string) => void;
  elevenLabsKey: string;
  setElevenLabsKey: (key: string) => void;
}

export const SettingsDrawer: React.FC<SettingsDrawerProps> = ({
  isOpen,
  onClose,
  geminiKey,
  setGeminiKey,
  elevenLabsKey,
  setElevenLabsKey,
}) => {
  const [tempGemini, setTempGemini] = useState(geminiKey);
  const [tempEleven, setTempEleven] = useState(elevenLabsKey);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setGeminiKey(tempGemini);
    setElevenLabsKey(tempEleven);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-[#131924] dark:bg-[#131924] light:bg-white rounded-2xl border border-[#1E2638] light:border-slate-300 p-6 shadow-2xl space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-4">
          <div className="flex items-center space-x-2">
            <Key className="w-5 h-5 text-cyan-400" />
            <h3 className="font-extrabold text-lg text-slate-100 light:text-slate-900">
              API Configuration Drawer
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Mode Notice */}
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start space-x-2">
          <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Standalone Hackathon Preset Engine Enabled</span>
            If you leave keys empty, CIVIC GUARD AI runs using built-in high-fidelity Gemini & ElevenLabs preset models for zero latency.
          </div>
        </div>

        {/* Form Inputs */}
        <div className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-bold text-slate-300 light:text-slate-700 mb-1">
              Google Gemini API Key (Best Use of Gemini API Track)
            </label>
            <input
              type="password"
              placeholder="AIzaSy..."
              value={tempGemini}
              onChange={(e) => setTempGemini(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#090D14] light:bg-slate-100 border border-[#1E2638] light:border-slate-300 text-slate-100 light:text-slate-900 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">Used for live Gemini 2.5 Flash multimodal threat scanning & solution trees.</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 light:text-slate-700 mb-1">
              ElevenLabs API Key (Voice AI Side Track)
            </label>
            <input
              type="password"
              placeholder="xi-api-key..."
              value={tempEleven}
              onChange={(e) => setTempEleven(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#090D14] light:bg-slate-100 border border-[#1E2638] light:border-slate-300 text-slate-100 light:text-slate-900 focus:outline-none focus:border-cyan-500 font-mono text-xs"
            />
            <p className="text-[11px] text-slate-500 mt-1">Streams natural Bangla speech guidance. Browser speech synthesis acts as fallback.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg glow-emerald hover:opacity-90 transition-opacity"
          >
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Key className="w-4 h-4" />}
            <span>{saved ? 'Saved Successfully!' : 'Save Credentials'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
