import React, { useState, useEffect } from 'react';
import { Mic, MicOff, AlertCircle } from 'lucide-react';

export interface VoiceInputProps {
  onSpeechResult: (text: string) => void;
  disabled?: boolean;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onSpeechResult, disabled = false }) => {
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const SpeechRecognitionClass =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setIsSupported(false);
      return;
    }

    try {
      const rec = new SpeechRecognitionClass();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          onSpeechResult(transcript);
        }
        setIsListening(false);
      };

      rec.onerror = (event: any) => {
        console.warn('[VoiceInput] Speech recognition error:', event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg('Microphone access was denied. Please allow mic permissions in browser.');
        } else if (event.error !== 'no-speech') {
          setErrorMsg('Speech recognition error. You can continue using text input.');
        }
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    } catch (e) {
      setIsSupported(false);
    }
  }, [onSpeechResult]);

  const toggleListening = () => {
    if (!recognition) return;
    setErrorMsg(null);

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      try {
        recognition.start();
        setIsListening(true);
      } catch (e) {
        console.error('[VoiceInput] Failed to start recognition:', e);
      }
    }
  };

  if (!isSupported) {
    return (
      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
        Voice input is not supported in this browser. You can continue using text input.
      </div>
    );
  }

  return (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        title={isListening ? 'Stop listening' : 'Start voice input (Speak your response)'}
        style={{
          padding: '0.55rem 0.85rem',
          borderRadius: 'var(--radius-md)',
          background: isListening ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-surface-elevated)',
          border: isListening ? '1px solid var(--error)' : '1px solid var(--border-color)',
          color: isListening ? 'var(--error)' : 'var(--text-main)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.85rem',
          fontWeight: 600,
          transition: 'all 0.2s ease',
        }}
      >
        {isListening ? <MicOff size={16} /> : <Mic size={16} />}
        <span>{isListening ? 'Listening...' : 'Voice'}</span>
      </button>

      {errorMsg && (
        <div style={{ fontSize: '0.72rem', color: 'var(--error)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          <AlertCircle size={12} />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
