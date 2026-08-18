import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { SpeechRecognizer } from '../../lib/elevenLabsService';

interface VoiceBarProps {
  onTranscript: (text: string) => void;
}

export const VoiceBar: React.FC<VoiceBarProps> = ({ onTranscript }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [liveText, setLiveText] = useState('');
  const [recognizer, setRecognizer] = useState<SpeechRecognizer | null>(null);
  const [sttLang, setSttLang] = useState<'bn-BD' | 'en-US'>('bn-BD');

  useEffect(() => {
    const rec = new SpeechRecognizer();
    setRecognizer(rec);
  }, []);

  const toggleRecording = () => {
    if (!recognizer || !recognizer.isSupported) {
      alert('Speech Recognition is not supported in this browser. Please use Chrome/Edge.');
      return;
    }

    if (isRecording) {
      recognizer.stop();
      setIsRecording(false);
    } else {
      recognizer.setLanguage(sttLang);
      setIsRecording(true);
      setLiveText('');
      recognizer.start(
        (text, isFinal) => {
          setLiveText(text);
          if (isFinal) {
            onTranscript(text);
            setIsRecording(false);
          }
        },
        () => setIsRecording(false),
        (err) => {
          console.warn('Speech Rec Error', err);
          setIsRecording(false);
        }
      );
    }
  };

  return (
    <div className="flex items-center space-x-2 bg-[#090D14] dark:bg-[#090D14] light:bg-[#DCD396] p-1.5 rounded-2xl border border-slate-800 light:border-[#C5BC7F] shadow-sm">
      
      {/* STT Language Switcher */}
      <div className="flex items-center space-x-1 bg-[#131924] dark:bg-[#131924] light:bg-[#EBE3A7] p-1 rounded-xl border border-slate-800/80 light:border-[#D9D092]">
        <button
          onClick={() => setSttLang('bn-BD')}
          className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
            sttLang === 'bn-BD'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-slate-400 dark:text-slate-400 light:text-[#0F172A] hover:text-white'
          }`}
        >
          বাংলা Voice
        </button>
        <button
          onClick={() => setSttLang('en-US')}
          className={`px-2.5 py-1 text-[11px] font-extrabold rounded-lg transition-all ${
            sttLang === 'en-US'
              ? 'bg-emerald-500 text-white shadow-sm'
              : 'text-slate-400 dark:text-slate-400 light:text-[#0F172A] hover:text-white'
          }`}
        >
          EN Voice
        </button>
      </div>

      {/* Mic Record Button */}
      <button
        onClick={toggleRecording}
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all shadow-md flex-shrink-0 ${
          isRecording
            ? 'bg-rose-600 text-white animate-pulse glow-crimson'
            : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:opacity-95 glow-emerald hover:scale-105'
        }`}
      >
        {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        <span>{isRecording ? 'Listening...' : 'Voice Search'}</span>
      </button>

      {/* Live Waveform Indicator */}
      {isRecording && (
        <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-300 text-xs font-mono border border-rose-500/30">
          <span className="w-1.5 h-4 bg-rose-500 animate-bounce" />
          <span className="w-1.5 h-6 bg-rose-400 animate-bounce delay-75" />
          <span className="w-1.5 h-3 bg-rose-500 animate-bounce delay-150" />
          <span className="truncate max-w-[150px] font-bold">{liveText || 'Transcribing...'}</span>
        </div>
      )}
    </div>
  );
};
