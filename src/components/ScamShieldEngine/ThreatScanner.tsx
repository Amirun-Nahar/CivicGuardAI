import React, { useState, useRef } from 'react';
import { Upload, AlertTriangle, ShieldAlert, Link as LinkIcon, FileText, Image as ImageIcon, Sparkles, RefreshCw } from 'lucide-react';
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
    onScanText(inputText, selectedFile);
  };

  return (
    <div className="space-y-4">
      {/* Zero PII Sanitizer Banner */}
      <ZeroPiiBanner currentInputText={inputText} />

      {/* Input Container */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#131924] via-[#0E1420] to-[#131924] border border-[#1E2638] shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E2638] pb-3">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-6 h-6 text-crimsondanger-500 animate-pulse" />
            <div>
              <h3 className="font-extrabold text-lg text-slate-100 flex items-center space-x-2">
                <span>ScamShield Multimodal Threat Scanner</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-crimsondanger-500/20 text-crimsondanger-500 border border-crimsondanger-500/30">
                  Visual Bounding Box HUD
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Upload suspicious SMS screenshots, paste suspicious URLs, or enter message text for Gemini 2.5 Flash analysis.
              </p>
            </div>
          </div>

          {/* Quick Hackathon Demo Scenarios */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onLoadPreset('bkash_phishing')}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-crimsondanger-500/10 text-rose-300 border border-crimsondanger-500/30 text-xs font-bold hover:bg-crimsondanger-500/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span>Demo 1: bKash Phishing SMS</span>
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
              className="w-full p-4 rounded-xl bg-[#090D14] border border-[#1E2638] text-slate-100 placeholder-slate-500 focus:outline-none focus:border-crimsondanger-500 font-sans text-sm"
            />
          </div>

          {/* Image Upload Area */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#090D14]/70 border border-dashed border-slate-700">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {imagePreview ? (
              <div className="flex items-center space-x-3">
                <img src={imagePreview} alt="Screenshot Preview" className="w-14 h-14 object-cover rounded-lg border border-slate-700" />
                <div className="text-xs">
                  <p className="font-bold text-slate-200">{selectedFile?.name}</p>
                  <p className="text-slate-500">{(selectedFile!.size / 1024).toFixed(1)} KB • Ready for Multimodal Analysis</p>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setImagePreview(null); }}
                  className="text-xs text-rose-400 hover:underline ml-2"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-3 cursor-pointer text-slate-400 hover:text-slate-200 transition-colors"
              >
                <div className="p-2.5 rounded-xl bg-slate-800 text-cyan-400">
                  <Upload className="w-5 h-5" />
                </div>
                <div className="text-xs">
                  <p className="font-semibold text-slate-200">Upload Screenshot for Bounding Box Overlay</p>
                  <p className="text-slate-500">PNG, JPG, WEBP screenshots of SMS, bKash, or web pages</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || (!inputText && !selectedFile)}
              className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-extrabold text-sm transition-all shadow-lg ${
                isLoading || (!inputText && !selectedFile)
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-crimson-600 via-rose-600 to-amber-600 text-white hover:opacity-95 glow-crimson'
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
