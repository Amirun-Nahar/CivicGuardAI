/**
 * ElevenLabs & Web Speech AI Integration Engine
 * Provides ElevenLabs Multilingual v2 Text-to-Speech & Speech-to-Text Recognition
 */

let activeAudio: HTMLAudioElement | null = null;

export async function speakText(
  text: string,
  apiKey?: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<HTMLAudioElement | null> {
  if (!text) return null;

  // Stop any currently playing audio or web speech
  stopSpeech();

  const activeKey = (apiKey || (import.meta as any).env?.VITE_ELEVENLABS_API_KEY || '').trim();

  // 1. Try ElevenLabs API if Key is provided
  if (activeKey) {
    try {
      if (onStart) onStart();

      // Official Rachel Voice ID / Multilingual v2 Voice
      const voiceId = '21m00Tcm4TlvDq8ikWAM';
      const endpoint = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': activeKey
        },
        body: JSON.stringify({
          text: text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        activeAudio = audio;

        audio.onended = () => {
          activeAudio = null;
          if (onEnd) onEnd();
        };

        audio.onerror = (e) => {
          console.warn('ElevenLabs audio play error', e);
          fallbackWebSpeech(text, onStart, onEnd);
        };

        await audio.play();
        return audio;
      } else {
        console.warn(`ElevenLabs API HTTP ${response.status}. Falling back to Web Speech synthesis.`);
      }
    } catch (err) {
      console.warn('ElevenLabs Speech API failed, using browser Web Speech fallback.', err);
    }
  }

  // 2. High-fidelity Web Speech API Fallback (Works with Bangla bn-BD & English)
  fallbackWebSpeech(text, onStart, onEnd);
  return null;
}

function fallbackWebSpeech(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    if (onEnd) onEnd();
    return;
  }

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'bn-BD';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;

  utterance.onstart = () => {
    if (onStart) onStart();
  };

  utterance.onend = () => {
    if (onEnd) onEnd();
  };

  utterance.onerror = (err) => {
    console.warn('Web Speech synthesis error', err);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
}

export function stopSpeech() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio.currentTime = 0;
    activeAudio = null;
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speech Recognition Class for Speech-to-Text Microphone Recording
 */
export class SpeechRecognizer {
  public isSupported: boolean;
  private recognition: any = null;
  private currentLanguage: string = 'bn-BD';

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    this.isSupported = Boolean(SpeechRecognition);

    if (this.isSupported) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = this.currentLanguage;
    }
  }

  public setLanguage(lang: 'bn-BD' | 'en-US') {
    this.currentLanguage = lang;
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onEnd?: () => void,
    onError?: (err: any) => void
  ) {
    if (!this.isSupported || !this.recognition) {
      if (onError) onError('Speech Recognition API not supported in browser.');
      return;
    }

    try {
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const currentText = finalTranscript || interimTranscript;
        const isFinal = Boolean(finalTranscript);
        onResult(currentText, isFinal);
      };

      this.recognition.onend = () => {
        if (onEnd) onEnd();
      };

      this.recognition.onerror = (err: any) => {
        if (onError) onError(err);
      };

      this.recognition.start();
    } catch (e) {
      console.warn('Failed to start speech recognition', e);
      if (onError) onError(e);
    }
  }

  public stop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Error stopping speech recognition', e);
      }
    }
  }
}
