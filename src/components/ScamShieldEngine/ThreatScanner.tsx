import React, { useState, useRef } from 'react';
import { Upload, AlertTriangle, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { ZeroPiiBanner } from '../ZeroPiiBanner';

interface ThreatScannerProps {
  onScanText: (text: string, file?: File | null) => void;
  isLoading: boolean;
  onLoadPreset: (presetKey: string) => void;
}

export const ThreatScanner: React.FC<ThreatScannerProps> = ({
  onScanText,
  isLoading,
  onLoadPreset,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    }
  };

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText && !selectedFile) return;
    const query = inputText.trim() || 'Analyze uploaded screenshot for phishing threats and UI risk bounding boxes';
    onScanText(query, selectedFile);
  };

  return (
    <div className="space-y-4">
      {/* Zero PII Sanitizer Banner */}
      <ZeroPiiBanner currentInputText={inputText} />

      {/* Input Container */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#EBE3A7] dark:bg-gradient-to-br dark:from-[#131924] dark:via-[#0E1420] dark:to-[#131924] border border-[#D9D092] dark:border-[#1E2638] shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D9D092] dark:border-[#1E2638] pb-3">
          <div className="flex items-center space-x-2.5">
            <ShieldAlert className="w-6 h-6 text-rose-700 dark:text-rose-400 animate-pulse flex-shrink-0" />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#0F172A] dark:text-slate-100 flex flex-wrap items-center gap-2">
                <span>ScamShield Multimodal Threat Scanner</span>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-950 dark:text-rose-300 border border-rose-600/30">
                  Visual Bounding Box HUD
                </span>
              </h3>
              <p className="text-xs text-[#334155] dark:text-slate-400 font-extrabold">
                Upload suspicious SMS screenshots, paste suspicious URLs, or enter message text for Gemini 2.5 Flash analysis.
              </p>
            </div>
          </div>

          {/* Quick Hackathon Demo Scenarios */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => onLoadPreset('bkash_phishing')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-[#DCD396] dark:bg-rose-500/10 text-[#B91C1C] dark:text-rose-300 border border-[#C5BC7F] dark:border-rose-500/30 text-xs font-extrabold hover:scale-105 transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400" />
              <span>Demo: bKash Phishing SMS</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleScan} className="space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              placeholder="Paste suspicious SMS text, URL (e.g. bkash-bonus-offer2026.xyz), or fraud message here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full p-4 rounded-xl bg-[#FFF8D6] dark:bg-[#090D14] border border-[#C5BC7F] dark:border-[#1E2638] text-[#0F172A] dark:text-slate-100 placeholder-[#475569] dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500/40 font-extrabold text-xs sm:text-sm shadow-inner"
            />
          </div>

          {/* Image Upload Area */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-xl bg-[#FFF8D6] dark:bg-[#090D14]/70 border border-dashed border-[#C5BC7F] dark:border-slate-700">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {imagePreview ? (
              <div className="flex items-center space-x-3">
                <img src={imagePreview} alt="Screenshot Preview" className="w-14 h-14 object-cover rounded-lg border border-[#C5BC7F] dark:border-slate-700 shadow-sm" />
                <div className="text-xs">
                  <p className="font-extrabold text-[#0F172A] dark:text-slate-200">{selectedFile?.name}</p>
                  <p className="text-[#334155] dark:text-slate-400 font-bold">{(selectedFile!.size / 1024).toFixed(1)} KB • Ready for Multimodal Analysis</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setImagePreview(null); }}
                  className="text-xs text-rose-700 dark:text-rose-400 font-extrabold hover:underline ml-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-3 cursor-pointer text-[#334155] dark:text-slate-400 hover:text-[#0F172A] dark:hover:text-slate-200 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-[#DCD396] dark:bg-slate-800 text-cyan-900 dark:text-cyan-400 border border-[#C5BC7F] dark:border-slate-700">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <p className="font-extrabold text-[#0F172A] dark:text-slate-200">Upload Screenshot for Bounding Box Overlay</p>
                  <p className="text-[#334155] dark:text-slate-400 font-bold">PNG, JPG, WEBP screenshots of SMS, bKash, or web pages</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!inputText && !selectedFile)}
              className={`flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-lg flex-shrink-0 ${
                isLoading || (!inputText && !selectedFile)
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-rose-700 via-crimson-600 to-amber-700 dark:from-rose-600 dark:via-crimson-500 dark:to-amber-600 text-white hover:opacity-95 hover:scale-105 active:scale-95 glow-crimson'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Scanning Threat Telemetry...</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4" />
                  <span>Run Multimodal Threat Scan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
