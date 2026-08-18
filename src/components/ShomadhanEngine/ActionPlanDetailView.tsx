import React from 'react';
import { ShomadhanOutput, AppLanguage } from '../../types';
import { SolutionTree } from './SolutionTree';
import { LocationMap } from './LocationMap';
import { SourceVerifier } from './SourceVerifier';
import { VoicePlayer } from '../VoiceCompanion/VoicePlayer';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

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
      <div className="flex items-center justify-between bg-[#EBE3A7] dark:bg-[#131924] p-4 rounded-2xl border border-[#D9D092] dark:border-slate-800/80 shadow-md">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold text-[#0F172A] dark:text-slate-300 hover:opacity-90 bg-[#DCD396] dark:bg-[#090D14] border border-[#C5BC7F] dark:border-slate-800 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
          <span>← Back to Document Directory</span>
        </button>

        <div className="flex items-center space-x-2 text-xs text-[#0F172A] dark:text-slate-400 font-extrabold">
          <ShieldCheck className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
          <span className="hidden sm:inline">Grounded Public Service Intelligence</span>
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
          className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-extrabold text-[#0F172A] dark:text-slate-300 hover:opacity-90 bg-[#EBE3A7] dark:bg-[#131924] border border-[#D9D092] dark:border-slate-800 transition-all shadow-md"
        >
          <ArrowLeft className="w-4 h-4 text-emerald-800 dark:text-emerald-400" />
          <span>Return to Document Directory</span>
        </button>
      </div>

    </div>
  );
};
