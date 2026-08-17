/**
 * ElevenLabs Voice Dispatch Engine & Web Speech API Fallback
 * Provides Speech-to-Text (STT) and Text-to-Speech (TTS) for Bangla & English.
 */

// Recommended ElevenLabs Voice IDs for multilingual / natural speech
export const ELEVENLABS_VOICE_ID = 'pNInz6obpgDQGcFmaJgB'; // Adam / Multilingual v2

export interface VoiceState {
  isPlaying: boolean;
  isListening: boolean;
  transcript: string;
  error?: string;
}

export async function speakText(
  text: string,
  apiKey?: string,
  onStart?: () => void,
  onEnd?: () => void
): Promise<HTMLAudioElement | null> {
  if (!text) return null;
  const activeKey = (apiKey || (import.meta as any).env?.VITE_ELEVENLABS_API_KEY || '').trim();

  // 1. Try ElevenLabs API if Key is provided
  if (activeKey) {
    try {
      if (onStart) onStart();
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, {
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

      if (!response.ok) {
        throw new Error(`ElevenLabs HTTP ${response.status}`);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.onended = () => {
        if (onEnd) onEnd();
      };
      await audio.play();
      return audio;
    } catch (err) {
      console.warn('ElevenLabs API call failed, falling back to Web Speech API', err);
    }
  }

  // 2. Fallback to Browser Speech Synthesis API
  if ('speechSynthesis' in window) {
    if (onStart) onStart();
    window.speechSynthesis.cancel(); // Stop any active speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Try finding Bangla or South Asian voice if text contains Bangla characters
    const isBangla = /[\u0980-\u09FF]/.test(text);
    utterance.lang = isBangla ? 'bn-BD' : 'en-US';

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find((v) => v.lang.startsWith(isBangla ? 'bn' : 'en'));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onend = () => {
      if (onEnd) onEnd();
    };
    utterance.onerror = () => {
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return null;
  } else {
    alert('Speech Synthesis is not supported in this browser.');
    if (onEnd) onEnd();
    return null;
  }
}

export function stopSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export class SpeechRecognizer {
  private recognition: any = null;
  public isSupported = false;

  constructor() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.isSupported = true;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'bn-BD'; // Default Bangla
    }
  }

  public setLanguage(lang: 'bn-BD' | 'en-US') {
    if (this.recognition) {
      this.recognition.lang = lang;
    }
  }

  public start(
    onResult: (transcript: string, isFinal: boolean) => void,
    onEnd: () => void,
    onError: (err: any) => void
  ) {
    if (!this.recognition) {
      onError('Speech recognition not supported in this browser.');
      return;
    }

    this.recognition.onresult = (event: any) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }

      onResult(final || interim, Boolean(final));
    };

    this.recognition.onend = () => {
      onEnd();
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error);
    };

    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition start error', e);
    }
  }

  public stop() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }
}
