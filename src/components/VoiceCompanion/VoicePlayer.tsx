import React, { useState } from 'react';
import { Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { speakText, stopSpeech } from '../../lib/elevenLabsService';

interface VoicePlayerProps {
  voiceSummaryBn: string;
  elevenLabsApiKey?: string;
}

export const VoicePlayer: React.FC<VoicePlayerProps> = ({ voiceSummaryBn, elevenLabsApiKey }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);

  const handleTogglePlay = async () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
      return;
    }

    setLoadingAudio(true);
    await speakText(
      voiceSummaryBn,
      elevenLabsApiKey,
      () => {
        setLoadingAudio(false);
        setIsPlaying(true);
      },
      () => {
        setLoadingAudio(false);
        setIsPlaying(false);
      }
    );
  };

  return (
    <div className="p-4 rounded-2xl bg-[#EBE3A7] dark:bg-[#131924] border border-[#D9D092] dark:border-cyan-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
      
      <div className="flex items-center space-x-3 text-[#0F172A] dark:text-slate-200">
        <div className="p-3 rounded-xl bg-[#DCD396] dark:bg-cyan-500/10 text-cyan-950 dark:text-cyan-400 border border-[#C5BC7F] dark:border-cyan-500/30 glow-cyan">
          <Volume2 className={`w-6 h-6 ${isPlaying ? 'animate-bounce text-cyan-900 dark:text-cyan-300' : ''}`} />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-sm text-[#0F172A] dark:text-slate-100">ElevenLabs Natural Voice Guidance</span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-500/30 dark:bg-cyan-500/20 text-cyan-950 dark:text-cyan-300 border border-cyan-600/40 dark:border-cyan-500/30">
              Voice AI Track
            </span>
          </div>
          <p className="text-xs text-[#047857] dark:text-emerald-400 font-bangla font-extrabold">
            "{voiceSummaryBn}"
          </p>
        </div>
      </div>

      <button
        onClick={handleTogglePlay}
        disabled={loadingAudio}
        className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all shadow-md flex-shrink-0 ${
          isPlaying
            ? 'bg-amber-500 text-black glow-amber'
            : 'bg-gradient-to-r from-cyan-600 to-emerald-600 text-white hover:scale-105 glow-cyan'
        }`}
      >
        {loadingAudio ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
            <span>Synthesizing Voice...</span>
          </>
        ) : isPlaying ? (
          <>
            <VolumeX className="w-4 h-4" />
            <span>Pause Audio</span>
          </>
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>Play Bangla Voice</span>
          </>
        )}
      </button>

    </div>
  );
};
