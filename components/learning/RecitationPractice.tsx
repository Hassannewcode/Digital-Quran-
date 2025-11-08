import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { getWordStatuses, getFullTextAndWordMap, WordStatus } from '../../utils/textComparison';
import { MicrophoneIcon } from '../icons/FeatureIcons';
import { LearningModeType, Surah } from '../../types';

interface RecitationPracticeProps {
  session: {
    surah: Surah;
    range: { start: number; end: number };
    mode: LearningModeType;
  };
  onClose: () => void;
}

const Word: React.FC<{ word: string, status: WordStatus, mode: LearningModeType }> = ({ word, status, mode }) => {
    let isHidden = mode === 'memory' && (status === 'pending' || status === 'current');
    
    // In memory mode, if a word is incorrect, reveal it for feedback.
    if (mode === 'memory' && status === 'incorrect') {
        isHidden = false;
    }

    if (isHidden) {
        // Render a placeholder that has the same width as the word to avoid layout shifts.
        return <span className="word-hidden mx-1 px-1 py-0.5" dangerouslySetInnerHTML={{ __html: word.replace(/./g, '&nbsp;') }}></span>;
    }
    return (
        <span className={`transition-colors duration-200 mx-1 px-1 py-0.5 highlight-${status}`}>
            {word}
        </span>
    );
};


const RecitationPractice: React.FC<RecitationPracticeProps> = ({ session, onClose }) => {
  const { surah, range, mode } = session;
  const {
    isListening,
    transcript,
    startListening,
    stopListening,
    hasRecognitionSupport,
  } = useSpeechRecognition();
  
  const [score, setScore] = useState<{ correct: number, incorrect: number, accuracy: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerElementRef = useRef<HTMLElement | null>(null);


  const { originalWords, wordMap } = useMemo(() => getFullTextAndWordMap(surah, range), [surah, range]);

  const { statuses: wordStatuses, currentWordIndex, correctCount, incorrectCount } = useMemo(() => {
    return getWordStatuses(originalWords, transcript);
  }, [originalWords, transcript]);
  
  const currentAyahId = (currentWordIndex < wordMap.length) ? wordMap[currentWordIndex].ayahId : null;
  const progress = originalWords.length > 0 ? ((correctCount + incorrectCount) / originalWords.length) * 100 : 0;

  useEffect(() => {
    const wordEl = contentRef.current?.querySelector(`[data-word-index='${currentWordIndex}']`);
    if(wordEl) {
        wordEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [currentWordIndex]);
  
  useEffect(() => {
    if (!isListening && transcript.length > 0) {
      const totalWordsAttempted = correctCount + incorrectCount;
      if (totalWordsAttempted > 0) {
        setScore({
          correct: correctCount,
          incorrect: incorrectCount,
          accuracy: Math.round((correctCount / totalWordsAttempted) * 100)
        });
      }
    }
  }, [isListening, transcript, correctCount, incorrectCount]);

  // Accessibility: Focus trap for the modal view
  useEffect(() => {
    triggerElementRef.current = document.activeElement as HTMLElement;
    const focusableElements = containerRef.current?.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusableElements || focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    firstElement.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    const container = containerRef.current;
    container?.addEventListener('keydown', handleKeyDown);

    return () => {
      container?.removeEventListener('keydown', handleKeyDown);
      triggerElementRef.current?.focus();
    };
  }, []);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      setScore(null);
      startListening();
    }
  };
  
  const handleTryAgain = () => {
      stopListening();
      setScore(null);
      setTimeout(() => startListening(), 100);
  }

  if (!hasRecognitionSupport) {
    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center">
            <div className="bg-white dark:bg-zinc-800 p-6 rounded-lg shadow-xl text-center">
                <p className="text-red-500 font-semibold">Speech recognition is not supported by your browser.</p>
                <p className="text-sm mt-2 text-slate-600 dark:text-zinc-400">Please try using a modern browser like Google Chrome.</p>
                <button onClick={onClose} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">Close</button>
            </div>
        </div>
    );
  }

  const ayahsInRange = surah.ayahs.slice(range.start - 1, range.end);

  let wordCounter = 0;

  return (
    <div ref={containerRef} className="fixed inset-0 bg-slate-100 dark:bg-zinc-900 z-50 flex flex-col p-4 sm:p-8" role="dialog" aria-modal="true" aria-labelledby="practice-title">
      <header className="flex-shrink-0 flex items-center justify-between pb-4 border-b border-slate-300 dark:border-zinc-700">
        <div>
            <h2 id="practice-title" className="text-xl sm:text-2xl font-bold font-arabic">{surah.name}: {range.start}{range.start !== range.end && `-${range.end}`}</h2>
            <p className="text-slate-600 dark:text-zinc-400 capitalize">{mode} Mode</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800" aria-label="Close recitation practice">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <div className="flex-shrink-0 px-4 sm:px-8 pt-4">
        <div className="w-full bg-slate-200 dark:bg-zinc-700 rounded-full h-2.5" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
        {!isListening && !score && (
          <p className="text-center text-sm text-slate-500 dark:text-zinc-400 mt-2">
            Press 'Recite' and begin reading. Your words will be highlighted as you speak.
          </p>
        )}
      </div>

      <main ref={contentRef} className="flex-1 overflow-y-auto pt-4 pb-8">
        <div dir="rtl" className="text-3xl md:text-4xl lg:text-5xl leading-loose font-amiri-quran text-right max-w-4xl mx-auto">
          {ayahsInRange.map(ayah => {
            const isCurrentAyah = ayah.id === currentAyahId;
            return (
              <div key={ayah.id} className={`mb-4 p-2 transition-colors duration-300 rounded-lg ${isCurrentAyah ? 'bg-blue-50 dark:bg-zinc-800/50' : ''}`}>
                  {ayah.text.split(/\s+/).filter(Boolean).map((word, wordIdx) => {
                      const globalIndex = wordCounter;
                      wordCounter++;
                      return (
                          <span key={`${ayah.id}-${wordIdx}`} data-word-index={globalIndex}>
                              <Word 
                                word={word} 
                                status={wordStatuses[globalIndex]} 
                                mode={mode}
                              />
                          </span>
                      )
                  })}
                   <span className="text-2xl font-amiri-quran select-none text-blue-500 dark:text-blue-400 mr-2">﴿{ayah.id.toLocaleString('ar')}﴾</span>
              </div>
          )})}
        </div>
      </main>

      <footer className="flex-shrink-0 pt-4 border-t border-slate-300 dark:border-zinc-700">
         <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex gap-2 order-2 sm:order-1">
                <button
                    onClick={handleToggleListening}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-colors text-lg ${
                        isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    >
                    <MicrophoneIcon />
                    <span>{isListening ? 'Stop' : 'Recite'}</span>
                </button>
                 <button
                    onClick={handleTryAgain}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-200 text-slate-700 dark:bg-zinc-700 dark:text-zinc-200 font-semibold transition-colors text-lg hover:bg-slate-300 dark:hover:bg-zinc-600 disabled:opacity-50"
                    title="Try Again"
                    disabled={isListening}
                    aria-label="Try Again"
                >
                    <span className="material-symbols-outlined">refresh</span>
                </button>
            </div>
            <div className="flex-1 px-4 text-center order-1 sm:order-2 w-full">
                {isListening ? (
                    <div className="flex items-center justify-center gap-6 text-slate-700 dark:text-zinc-300">
                        <p className="text-lg font-medium">Correct: <span className="font-bold text-green-500">{correctCount}</span></p>
                        <p className="text-lg font-medium">Incorrect: <span className="font-bold text-red-500">{incorrectCount}</span></p>
                    </div>
                 ) : score !== null ? (
                    <div className="text-center">
                        <p className="font-bold text-2xl text-slate-800 dark:text-zinc-200">{score.accuracy}% Accuracy</p>
                        <p className="text-sm text-slate-500 dark:text-zinc-400">
                            <span className="text-green-600 dark:text-green-400">{score.correct} correct</span>
                            <span className="mx-2">·</span>
                            <span className="text-red-600 dark:text-red-400">{score.incorrect} incorrect</span>
                        </p>
                    </div>
                ) : (
                    <p dir="rtl" className="text-slate-600 dark:text-zinc-400 font-arabic truncate" title={transcript}>{transcript || "Press 'Recite' to begin."}</p>
                )}
            </div>
            <div className="order-3 hidden sm:block w-[150px]"></div>
         </div>
      </footer>
    </div>
  );
};

export default RecitationPractice;