import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ZeroPiiBanner } from './components/ZeroPiiBanner';
import { SettingsDrawer } from './components/SettingsDrawer';
import { ActionPlanDetailView } from './components/ShomadhanEngine/ActionPlanDetailView';
import { DocumentDirectory } from './components/ShomadhanEngine/DocumentDirectory';
import { SolutionTree } from './components/ShomadhanEngine/SolutionTree';
import { LocationMap } from './components/ShomadhanEngine/LocationMap';
import { SourceVerifier } from './components/ShomadhanEngine/SourceVerifier';
import { GdPdfModal } from './components/ShomadhanEngine/GdPdfModal';
import { ThreatScanner } from './components/ScamShieldEngine/ThreatScanner';
import { VisualHudOverlay } from './components/ScamShieldEngine/VisualHudOverlay';
import { RiskTelemetry } from './components/ScamShieldEngine/RiskTelemetry';
import { IncidentMode } from './components/ScamShieldEngine/IncidentMode';
import { VoiceBar } from './components/VoiceCompanion/VoiceBar';
import { VoicePlayer } from './components/VoiceCompanion/VoicePlayer';
import { processCivicGuardQuery, DEMO_PRESETS } from './lib/geminiService';
import { CivicGuardResponse, AppLanguage, AppRoute } from './types';
import { Search, Sparkles, RefreshCw, Zap } from 'lucide-react';

export function App() {
  // Theme & Language State
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<AppLanguage>('bn');
  const [activeRoute, setActiveRoute] = useState<AppRoute>('SHOMADHAN');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // API Keys (Auto-loaded from .env if present)
  const [geminiKey, setGeminiKey] = useState<string>(((import.meta as any).env?.VITE_GEMINI_API_KEY || '').trim());
  const [elevenLabsKey, setElevenLabsKey] = useState<string>(((import.meta as any).env?.VITE_ELEVENLABS_API_KEY || '').trim());

  // Input & Query State
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeResponse, setActiveResponse] = useState<CivicGuardResponse>(DEMO_PRESETS['lost_nid']);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isIncidentMode, setIsIncidentMode] = useState(false);

  // Navigation state for standalone detail page view
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>('lost_nid');
  const [activeViewMode, setActiveViewMode] = useState<'DIRECTORY' | 'DETAIL'>('DIRECTORY');
  const [uploadedImagePreview, setUploadedImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleQuerySubmit = async (queryText?: string, file?: File | null) => {
    const query = queryText || userInput;
    if (!query && !file) return;

    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setUploadedImagePreview(previewUrl);
    }

    setIsLoading(true);
    try {
      const response = await processCivicGuardQuery(query, file, geminiKey);
      setActiveResponse(response);
      setActiveRoute(response.route_type);
      if (response.route_type === 'SHOMADHAN') {
        setActiveViewMode('DETAIL');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Processing query failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadPreset = (key: string) => {
    if (DEMO_PRESETS[key]) {
      const preset = DEMO_PRESETS[key];
      setActiveResponse(preset);
      setActiveRoute(preset.route_type);
      setActiveCategoryKey(key);
      setIsIncidentMode(false);
      if (preset.route_type === 'SHOMADHAN') {
        setActiveViewMode('DETAIL');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  return (
    <div className={`min-h-screen font-sans ${theme === 'dark' ? 'bg-[#090D14] text-slate-100' : 'bg-[#FFF4BF] text-slate-900'} transition-colors duration-300`}>
      
      {/* Top Navigation */}
      <Header
        theme={theme}
        setTheme={setTheme}
        language={language}
        setLanguage={setLanguage}
        activeRoute={activeRoute}
        setActiveRoute={setActiveRoute}
        openSettings={() => setIsSettingsOpen(true)}
        hasCustomKey={Boolean(geminiKey || elevenLabsKey)}
      />

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Hero Command Hub (Directory Page Mode) */}
        {activeViewMode === 'DIRECTORY' && (
          <div className="p-6 sm:p-8 rounded-3xl bg-[#131924] dark:bg-[#131924] light:bg-[#EBE3A7] border border-slate-800/80 light:border-[#D9D092] shadow-xl space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-slate-100 dark:text-slate-100 light:text-[#0F172A]">
                  Understand the Problem.{' '}
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 light:from-emerald-700 light:to-cyan-800 bg-clip-text text-transparent">
                    Navigate the Solution.
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-400 light:text-[#334155] font-semibold mt-1">
                  AI-powered public service action plans, police GD drafts, and threat defense for Bangladesh.
                </p>
              </div>

              {/* Voice Recording Widget */}
              <VoiceBar onTranscript={(transcript) => {
                setUserInput(transcript);
                handleQuerySubmit(transcript);
              }} />
            </div>

            {/* Unified Query Search Input */}
            {activeRoute === 'SHOMADHAN' && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleQuerySubmit();
                }}
                className="flex items-center space-x-2"
              >
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 light:text-slate-600 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    placeholder="Ask Shomadhan AI e.g., 'I lost my Smart NID card', 'Passport renewal', 'Bank fraud'..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#090D14] light:bg-[#FFF8D6] border border-slate-800 light:border-[#C5BC7F] text-slate-100 light:text-[#0F172A] light:placeholder-[#475569] focus:outline-none focus:border-emerald-500 font-semibold text-xs sm:text-sm shadow-inner"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || !userInput}
                  className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm flex items-center space-x-2 transition-all ${
                    isLoading || !userInput
                      ? 'bg-slate-800 light:bg-slate-300 text-slate-500 light:text-slate-600 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md'
                  }`}
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden sm:inline">Get Action Plan</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick Demo Scenario Chips */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="font-extrabold text-slate-400 dark:text-slate-400 light:text-[#0F172A] flex items-center space-x-1 mr-1">
                <Zap className="w-3.5 h-3.5 text-amber-400 light:text-amber-700" />
                <span>Quick Scenarios:</span>
              </span>

              <button
                onClick={() => handleLoadPreset('lost_nid')}
                className="px-3 py-1 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/10 light:bg-[#DCD396] text-emerald-300 dark:text-emerald-300 light:text-[#047857] border border-emerald-500/20 light:border-[#C5BC7F] font-bold transition-colors shadow-sm"
              >
                📌 Lost NID & Police GD
              </button>

              <button
                onClick={() => handleLoadPreset('bkash_phishing')}
                className="px-3 py-1 rounded-xl bg-rose-500/10 dark:bg-rose-500/10 light:bg-[#DCD396] text-rose-300 dark:text-rose-300 light:text-[#B91C1C] border border-rose-500/20 light:border-[#C5BC7F] font-bold transition-colors shadow-sm"
              >
                🚨 bKash Phishing SMS Scanner
              </button>

              <button
                onClick={() => handleLoadPreset('bank_dispute')}
                className="px-3 py-1 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/10 light:bg-[#DCD396] text-cyan-300 dark:text-cyan-300 light:text-[#0369A1] border border-cyan-500/20 light:border-[#C5BC7F] font-bold transition-colors shadow-sm"
              >
                💳 Bank Fraud Dispute Claim
              </button>
            </div>

            {/* Integrated Compact Zero-PII Status */}
            <ZeroPiiBanner currentInputText={userInput} />
          </div>
        )}

        {/* ElevenLabs Bangla Voice Output Player (Directory mode) */}
        {activeResponse.voice_summary_bn && activeViewMode === 'DIRECTORY' && (
          <VoicePlayer
            voiceSummaryBn={activeResponse.voice_summary_bn}
            elevenLabsApiKey={elevenLabsKey}
          />
        )}

        {/* Engine 1: SHOMADHAN AI CORE */}
        {activeRoute === 'SHOMADHAN' && activeResponse.shomadhan_data && (
          <div className="space-y-6">
            {activeViewMode === 'DIRECTORY' ? (
              <DocumentDirectory
                onSelectCategory={handleLoadPreset}
                activeCategoryKey={activeCategoryKey}
                language={language}
              />
            ) : (
              <ActionPlanDetailView
                data={activeResponse.shomadhan_data}
                language={language}
                voiceSummaryBn={activeResponse.voice_summary_bn}
                elevenLabsApiKey={elevenLabsKey}
                onBack={() => {
                  setActiveViewMode('DIRECTORY');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onOpenPdfModal={() => setIsPdfModalOpen(true)}
              />
            )}
          </div>
        )}

        {/* Engine 2: SCAMSHIELD AI DEFENSE */}
        {activeRoute === 'SCAMSHIELD' && (
          <div className="space-y-6">
            <ThreatScanner
              onScanText={(text, file) => handleQuerySubmit(text, file)}
              isLoading={isLoading}
              onLoadPreset={handleLoadPreset}
            />

            {activeResponse.scamshield_data && (
              <>
                {/* Visual HUD Canvas Bounding Box */}
                <VisualHudOverlay
                  imageSrc={uploadedImagePreview}
                  boundingBoxes={activeResponse.scamshield_data.bounding_boxes}
                  riskLevel={activeResponse.scamshield_data.risk_level}
                />

                {/* Telemetry Gauge & Indicators */}
                <RiskTelemetry
                  data={activeResponse.scamshield_data}
                  onTriggerIncidentMode={() => setIsIncidentMode(true)}
                />

                {/* Emergency Incident Triage Button */}
                <div className="text-center pt-2">
                  <button
                    onClick={() => setIsIncidentMode(true)}
                    className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs sm:text-sm shadow-xl glow-crimson transition-all animate-pulse"
                  >
                    🚨 I Already Clicked It — Start Emergency Triage
                  </button>
                </div>

                {/* Incident Mode Protocol Modal/View */}
                {isIncidentMode && (
                  <IncidentMode
                    onClose={() => setIsIncidentMode(false)}
                    elevenLabsApiKey={elevenLabsKey}
                  />
                )}
              </>
            )}
          </div>
        )}

      </main>

      {/* Settings Modal */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        geminiKey={geminiKey}
        setGeminiKey={setGeminiKey}
        elevenLabsKey={elevenLabsKey}
        setElevenLabsKey={setElevenLabsKey}
      />

      {/* 1-Click Police GD & Bank Dispute PDF Generator Modal */}
      {isPdfModalOpen && activeResponse.shomadhan_data && (
        <GdPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          templateType={activeResponse.shomadhan_data.pdf_template_type || 'POLICE_GD_LOST_DOC'}
          problemTitle={activeResponse.shomadhan_data.problem_summary_en}
        />
      )}

    </div>
  );
}

export default App;
