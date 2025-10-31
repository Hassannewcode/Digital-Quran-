
import { useState, useEffect, useRef } from 'react';

// Bodge: The type definitions for SpeechRecognition are not always present in all TS environments.
declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}

// Fix: Add minimal type definitions for the Web Speech API to resolve TypeScript errors.
// These definitions provide type safety within this module for the otherwise 'any' typed SpeechRecognition API.
interface SpeechRecognitionEvent {
    readonly resultIndex: number;
    readonly results: {
        readonly isFinal: boolean;
        readonly [key: number]: {
            readonly transcript: string;
        };
        // Fix: Added readonly length property to correctly type SpeechRecognitionResult, which is array-like and was causing a compile error on line 60.
        readonly length: number;
    }[];
}

interface SpeechRecognitionErrorEvent {
    readonly error: string;
}

interface SpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: (event: SpeechRecognitionEvent) => void;
    onerror: (event: SpeechRecognitionErrorEvent) => void;
    onend: () => void;
    start: () => void;
    stop: () => void;
}


const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

export const useSpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.error("Speech Recognition not supported by this browser.");
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'ar-SA';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
       const newTranscript = Array.from(event.results)
        .map(result => result?.[0]?.transcript ?? '')
        .join('');
      setTranscript(newTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport: !!SpeechRecognition,
  };
};
