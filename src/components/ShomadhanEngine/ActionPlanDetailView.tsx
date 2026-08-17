import React from 'react';
import { ShomadhanOutput, AppLanguage } from '../../types';
import { SolutionTree } from './SolutionTree';
import { LocationMap } from './LocationMap';
import { SourceVerifier } from './SourceVerifier';
import { VoicePlayer } from '../VoiceCompanion/VoicePlayer';
import { ArrowLeft, Sparkles, Download, ShieldCheck } from 'lucide-react';

interface ActionPlanDetailViewProps {
  data: ShomadhanOutput;
  language: AppLanguage;
  voiceSummaryBn?: string;
  elevenLabsApiKey?: string;
  onBack: () => void;
  onOpenPdfModal: () => void;
}

export const ActionPlanDetailView: React.FC<ActionPlanDetailViewProps> = ({
  data,
  language,
  voiceSummaryBn,
  elevenLabsApiKey,
  onBack,
  onOpenPdfModal,
}) => {
  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Detail Navigation Bar */}
      <div className="flex items-center justify-between bg-[#131924] dark:bg-[#131924] light:bg-white p-4 rounded-2xl border border-slate-800/80 light:border-slate-200 shadow-md">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-emerald-400 bg-[#090D14] hover:bg-slate-900 border border-slate-800 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Document Directory</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline font-medium">Grounded Public Service Intelligence</span>
        </div>
      </div>

      {/* ElevenLabs Bangla Voice Output Player */}
      {voiceSummaryBn && (
        <VoicePlayer
          voiceSummaryBn={voiceSummaryBn}
          elevenLabsApiKey={elevenLabsApiKey}
        />
      )}

      {/* Main Solution Tree Detail Component */}
      <SolutionTree
        data={data}
        language={language}
        onOpenPdfModal={onOpenPdfModal}
      />

      {/* Physical Locations Mapping */}
      <LocationMap
        locations={data.official_locations}
        language={language}
      />

      {/* Grounded Source Verification */}
      <SourceVerifier sources={data.verified_sources} />

      {/* Bottom Back Button */}
      <div className="pt-4 text-center">
        <button
          onClick={onBack}
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-[#131924] hover:bg-slate-800 border border-slate-800 transition-all shadow"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-400" />
          <span>Return to Document Directory</span>
        </button>
      </div>

    </div>
  );
};
