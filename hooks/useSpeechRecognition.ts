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
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = 0; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result && result[0]) {
            if (result.isFinal) {
                finalTranscript += result[0].transcript + ' ';
            } else {
                interimTranscript += result[0].transcript;
            }
        }
      }
      setTranscript(finalTranscript + interimTranscript);
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