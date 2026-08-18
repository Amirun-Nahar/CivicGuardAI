import React, { useState } from 'react';
import { AlertOctagon, PhoneCall, Volume2, CheckSquare, Square, X } from 'lucide-react';
import { speakText, stopSpeech } from '../../lib/elevenLabsService';

interface IncidentModeProps {
  onClose: () => void;
  elevenLabsApiKey?: string;
}

export const IncidentMode: React.FC<IncidentModeProps> = ({ onClose, elevenLabsApiKey }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const emergencyActions = [
    {
      title: 'Freeze Mobile Financial Service (MFS) PIN',
      details: 'Dial *247# (bKash) or *167# (Nagad) immediately -> Go to My bKash -> Change PIN or lock PIN entry.',
      actionBtn: 'Dial *247# Now',
      phone: '*247#'
    },
    {
      title: 'Block Bank Cards & Internet Banking',
      details: 'Call your bank 24/7 hotline (Dutch-Bangla 16216, City Bank 16234, Brac 16221) and request instant freeze.',
      actionBtn: 'Call Cyber Helpdesk 13219',
      phone: '13219'
    },
    {
      title: 'Revoke Active Browser & Account Sessions',
      details: 'Open Google/Facebook Security settings -> Click "Sign Out of All Other Devices" to terminate compromised sessions.',
      actionBtn: 'Open Security Settings',
      phone: ''
    },
    {
      title: 'File Digital Cyber Crime Complaint',
      details: 'Report incident to Bangladesh Police Cyber Helpline 13219 or online at cybercrime.police.gov.bd.',
      actionBtn: 'Call 13219',
      phone: '13219'
    }
  ];

  const handleSpeakEmergency = () => {
    if (isPlayingAudio) {
      stopSpeech();
      setIsPlayingAudio(false);
      return;
    }

    const banglaEmergencyText =
      'জরুরি অ্যালার্ট! যদি আপনি কোনো ফিশিং লিংকে পিন বা ওটিপি প্রদান করে থাকেন, অবিলম্বে বিকাশ বা রকেটের ক্ষেত্রে স্টার ২৪৭ হ্যাশে ডায়াল করে পিন ব্লক বা পরিবর্তন করুন। ব্যাংকিং কার্ডের জন্য ব্যাংক হেল্পলাইনে কল করুন এবং সাইবার পুলিশ হেল্পলাইন ১৩২১৯ এ কল দিন।';

    setIsPlayingAudio(true);
    speakText(
      banglaEmergencyText,
      elevenLabsApiKey,
      () => setIsPlayingAudio(true),
      () => setIsPlayingAudio(false)
    );
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-[#EBE3A7] dark:bg-gradient-to-br dark:from-crimson-950/80 dark:via-[#131924] dark:to-[#0E1420] border-2 border-rose-600 dark:border-crimsondanger-500 shadow-2xl space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-rose-600/40 dark:border-crimsondanger-500/30 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 sm:p-3 rounded-xl bg-rose-700 dark:bg-crimsondanger-500 text-white animate-bounce flex-shrink-0">
            <AlertOctagon className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-[#0F172A] dark:text-rose-200 tracking-tight flex flex-wrap items-center gap-2">
              <span>INCIDENT RESPONSE TRIAGE MODE</span>
              <span className="text-xs px-2 py-0.5 rounded bg-rose-700 text-white font-extrabold">EMERGENCY PROTOCOL</span>
            </h2>
            <p className="text-xs text-[#334155] dark:text-rose-300 font-extrabold">Follow these 4 immediate steps to limit damage and secure your funds</p>
          </div>
        </div>

        <button onClick={onClose} className="p-1 rounded-lg text-[#0F172A] dark:text-slate-400 hover:text-rose-700 dark:hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Emergency Voice Audio Checklist Dispatcher */}
      <div className="p-4 rounded-xl bg-[#FFF8D6] dark:bg-rose-950/40 border border-rose-600/40 dark:border-rose-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center space-x-3 text-xs text-[#0F172A] dark:text-rose-200">
          <Volume2 className="w-5 h-5 text-rose-700 dark:text-rose-400 flex-shrink-0 animate-pulse" />
          <div>
            <span className="font-extrabold block text-sm">ElevenLabs Emergency Voice Audio Guide (Bangla)</span>
            Listen to natural voice instructions on your phone speaker.
          </div>
        </div>

        <button
          onClick={handleSpeakEmergency}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center space-x-2 transition-all shadow-md flex-shrink-0 ${
            isPlayingAudio
              ? 'bg-amber-500 text-black animate-pulse'
              : 'bg-rose-700 dark:bg-rose-600 text-white hover:bg-rose-800'
          }`}
        >
          <Volume2 className="w-4 h-4" />
          <span>{isPlayingAudio ? 'Stop Panic Audio' : 'Stream Voice Checklist'}</span>
        </button>
      </div>

      {/* Triage Steps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {emergencyActions.map((step, idx) => {
          const isDone = Boolean(completedSteps[idx]);
          return (
            <div
              key={idx}
              onClick={() => toggleStep(idx)}
              className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 shadow-sm ${
                isDone
                  ? 'bg-[#DCECC7] dark:bg-emerald-950/30 border-emerald-600 dark:border-emerald-500/50 text-[#047857] dark:text-emerald-200'
                  : 'bg-[#FFF8D6] dark:bg-[#090D14] border-rose-600/30 dark:border-rose-500/30 text-[#0F172A] dark:text-slate-200 hover:border-rose-600'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button className="text-rose-700 dark:text-rose-400">
                    {isDone ? <CheckSquare className="w-5 h-5 text-emerald-800 dark:text-emerald-400" /> : <Square className="w-5 h-5" />}
                  </button>
                  <span className="font-extrabold text-sm text-[#0F172A] dark:text-slate-100">{step.title}</span>
                </div>

                {step.phone && (
                  <a
                    href={`tel:${step.phone}`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-rose-700 dark:bg-rose-600 text-white text-[11px] font-extrabold shadow-xs flex-shrink-0"
                  >
                    <PhoneCall className="w-3 h-3" />
                    <span>{step.phone}</span>
                  </a>
                )}
              </div>

              <p className="text-xs text-[#334155] dark:text-slate-300 pl-7 leading-relaxed font-semibold">{step.details}</p>
            </div>
          );
        })}
      </div>

    </div>
  );
};
