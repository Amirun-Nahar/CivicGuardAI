import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Sparkles, RefreshCw } from 'lucide-react';
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
    <div className="flex items-center space-x-2 bg-[#131924] dark:bg-[#131924] light:bg-slate-100 p-2 rounded-2xl border border-[#1E2638] light:border-slate-300">
      
      {/* STT Language Switcher */}
      <div className="flex items-center space-x-1 bg-[#090D14] p-1 rounded-xl">
        <button
          onClick={() => setSttLang('bn-BD')}
          className={`px-2 py-0.5 text-[11px] font-bold rounded ${
            sttLang === 'bn-BD' ? 'bg-emerald-500 text-white' : 'text-slate-400'
          }`}
        >
          বাংলা Voice
        </button>
        <button
          onClick={() => setSttLang('en-US')}
          className={`px-2 py-0.5 text-[11px] font-bold rounded ${
            sttLang === 'en-US' ? 'bg-emerald-500 text-white' : 'text-slate-400'
          }`}
        >
          EN Voice
        </button>
      </div>

      {/* Mic Record Button */}
      <button
        onClick={toggleRecording}
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md ${
          isRecording
            ? 'bg-rose-600 text-white animate-pulse glow-crimson'
            : 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:opacity-90 glow-emerald'
        }`}
      >
        {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        <span>{isRecording ? 'Listening (Speak Now)...' : 'Voice Search'}</span>
      </button>

      {/* Live Waveform Indicator */}
      {isRecording && (
        <div className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-300 text-xs font-mono border border-rose-500/30">
          <span className="w-1.5 h-4 bg-rose-500 animate-bounce" />
          <span className="w-1.5 h-6 bg-rose-400 animate-bounce delay-75" />
          <span className="w-1.5 h-3 bg-rose-500 animate-bounce delay-150" />
          <span className="truncate max-w-[150px]">{liveText || 'Transcribing...'}</span>
        </div>
      )}
    </div>
  );
};
