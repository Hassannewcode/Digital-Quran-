import React, { useEffect, useMemo, useRef } from 'react';
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

const Word: React.FC<{ word: string, status: WordStatus, mode: LearningModeType, isVisible: boolean }> = ({ word, status, mode, isVisible }) => {
    if (mode === 'memory' && !isVisible) {
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
  
  const contentRef = useRef<HTMLDivElement>(null);

  const { originalWords } = useMemo(() => getFullTextAndWordMap(surah, range), [surah, range]);

  const { wordStatuses, currentWordIndex } = useMemo(() => {
    return getWordStatuses(originalWords, transcript);
  }, [originalWords, transcript]);

  useEffect(() => {
    const wordEl = contentRef.current?.querySelector(`[data-word-index='${currentWordIndex}']`);
    if(wordEl) {
        wordEl.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
    }
  }, [currentWordIndex]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const handleReset = () => {
      stopListening();
      // This will trigger a re-render with fresh statuses because the transcript becomes ''
      // which the useSpeechRecognition hook handles upon starting again.
      startListening(); 
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
    <div className="fixed inset-0 bg-slate-100 dark:bg-zinc-900 z-50 flex flex-col p-4 sm:p-8">
      <header className="flex-shrink-0 flex items-center justify-between pb-4 border-b border-slate-300 dark:border-zinc-700">
        <div>
            <h2 className="text-xl sm:text-2xl font-bold font-arabic">{surah.name}: {range.start}{range.start !== range.end && `-${range.end}`}</h2>
            <p className="text-slate-600 dark:text-zinc-400 capitalize">{mode} Mode</p>
        </div>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800">
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      <main ref={contentRef} className="flex-1 overflow-y-auto py-8">
        <div dir="rtl" className="text-3xl md:text-4xl lg:text-5xl leading-loose font-amiri-quran text-right max-w-4xl mx-auto">
          {ayahsInRange.map(ayah => (
              <div key={ayah.id} className="mb-4">
                  {ayah.text.split(/\s+/).filter(Boolean).map((word, wordIdx) => {
                      const globalIndex = wordCounter;
                      wordCounter++;
                      return (
                          <span key={`${ayah.id}-${wordIdx}`} data-word-index={globalIndex}>
                              <Word 
                                word={word} 
                                status={wordStatuses[globalIndex]} 
                                mode={mode}
                                isVisible={mode === 'highlight' || globalIndex <= currentWordIndex}
                              />
                          </span>
                      )
                  })}
                   <span className="text-xl font-sans select-none text-blue-500 dark:text-blue-400 mr-2">﴿{ayah.id}﴾</span>
              </div>
          ))}
        </div>
      </main>

      <footer className="flex-shrink-0 pt-4 border-t border-slate-300 dark:border-zinc-700">
         <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <div className="flex gap-2">
                <button
                    onClick={handleToggleListening}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg text-white font-semibold transition-colors text-lg ${
                        isListening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                    >
                    <MicrophoneIcon />
                    <span>{isListening ? 'Stop' : 'Start'}</span>
                </button>
                 <button
                    onClick={handleReset}
                    className="flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-200 text-slate-700 dark:bg-zinc-700 dark:text-zinc-200 font-semibold transition-colors text-lg hover:bg-slate-300 dark:hover:bg-zinc-600"
                    title="Restart Practice"
                >
                    <span className="material-symbols-outlined">refresh</span>
                </button>
            </div>
            <div className="flex-1 px-6 text-right">
                {isListening ? (
                    <div className="text-slate-500 dark:text-zinc-400 animate-pulse">Listening...</div>
                ) : (
                    <p dir="rtl" className="text-slate-600 dark:text-zinc-400 font-arabic truncate" title={transcript}>{transcript || "Press 'Start' to begin reciting."}</p>
                )}
            </div>
         </div>
      </footer>
    </div>
  );
};

export default RecitationPractice;