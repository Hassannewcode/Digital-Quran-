import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Surah, Ayah, PlayingState, Reciter, Translation, Bookmark, Note, PlayingMode, LearningModeType } from './types';
import { getSurahsWithTranslation } from './services/quranService';
import { generateSpeech } from './services/geminiService';
import { getCachedAudio, setCachedAudio, deleteCachedAudio } from './services/dbService';
import Header from './components/Header';
import SurahList from './components/SurahList';
import SurahDetail from './components/SurahDetail';
import BookmarksView from './components/BookmarksView';
import SettingsView from './components/SettingsView';
import RecitationPractice from './components/learning/RecitationPractice';
import { decode, decodeAudioData } from './utils/audioUtils';
import { useLocalStorage } from './hooks/useLocalStorage';
import { RECITERS, TRANSLATIONS } from './constants/settings';
import Toast from './components/Toast';

type View = 'list' | 'detail' | 'bookmarks' | 'settings';
type LearningSession = {
  surah: Surah;
  range: { start: number; end: number };
  mode: LearningModeType;
};

const App: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [playingState, setPlayingState] = useState<PlayingState>({ status: 'idle' });
  const [toastMessage, setToastMessage] = useState<string>('');
  const [learningSession, setLearningSession] = useState<LearningSession | null>(null);

  const [playbackRange, setPlaybackRange] = useState<{ start: number; end: number }>({ start: 1, end: 1 });
  const [repeatCount, setRepeatCount] = useState(0); // 0 = off
  const [isInfinite, setIsInfinite] = useState(false);

  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const [selectedReciterId, setSelectedReciterId] = useLocalStorage('reciter', 'fenrir');
  const [selectedTranslationId, setSelectedTranslationId] = useLocalStorage('translation', TRANSLATIONS[0].id);
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('bookmarks', []);
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const playNextTimeoutRef = useRef<number | null>(null);
  const playCountRef = useRef(0);

  const selectedTranslation = useMemo(() => TRANSLATIONS.find(t => t.id === selectedTranslationId), [selectedTranslationId]);

  useEffect(() => {
    // This effect runs once on mount to set the initial theme from the state loaded via useLocalStorage
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []); // Empty dependency array ensures this runs only once

  useEffect(() => {
    setSurahs(getSurahsWithTranslation(selectedTranslation?.data || null));
  }, [selectedTranslation]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const stopPlayback = useCallback(() => {
    if (playNextTimeoutRef.current) {
        clearTimeout(playNextTimeoutRef.current);
        playNextTimeoutRef.current = null;
    }
    if (audioSourceRef.current) {
      audioSourceRef.current.onended = null;
      try {
        audioSourceRef.current.stop();
        audioSourceRef.current.disconnect();
      } catch (e) {
        // Ignore errors if source is already stopped
      } finally {
        audioSourceRef.current = null;
      }
    }
    if (playingState.status !== 'idle') {
      setPlayingState({ status: 'idle' });
    }
  }, [playingState.status]);

  const handleRegenerateAyah = useCallback(async (surahId: number, ayahId: number) => {
    const reciter = RECITERS.find(r => r.id === selectedReciterId);
    if (!reciter) return;

    const cacheKey = `${reciter.id}-${surahId}-${ayahId}`;
    try {
      await deleteCachedAudio(cacheKey);
      setToastMessage('Audio will be regenerated on next play.');
    } catch (error) {
      console.error('Failed to delete cached audio:', error);
      setToastMessage('Error clearing audio cache.');
    }
  }, [selectedReciterId]);

  const handlePlayAyah = useCallback(async (ayah: Ayah, surahId: number, mode: PlayingMode, isContinuation = false) => {
    if (playingState.status !== 'idle' && !isContinuation) {
      stopPlayback();
    }
    
    if (!isContinuation) {
        playCountRef.current = 1;
    }
    
    setPlayingState({ status: 'loading', surahId, ayahId: ayah.id, mode });

    try {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioContext = audioContextRef.current;
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        const reciter = RECITERS.find(r => r.id === selectedReciterId);
        const voiceName = reciter?.voice || 'Zephyr';
        const stylePrompt = reciter?.stylePrompt;
        
        // For full-surah mode, the cache key includes the range
        const cacheKey = mode === 'full-surah' 
            ? `${selectedReciterId}-${surahId}-${playbackRange.start}-${playbackRange.end}`
            : `${selectedReciterId}-${surahId}-${ayah.id}`;
        
        let base64Audio = await getCachedAudio(cacheKey);

        if (!base64Audio) {
            base64Audio = await generateSpeech(ayah.text, voiceName, stylePrompt);
            setCachedAudio(cacheKey, base64Audio).catch(console.error);
        }
        
        const audioData = decode(base64Audio);
        const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        
        audioSourceRef.current = source;
        setPlayingState({ status: 'playing', surahId, ayahId: ayah.id, mode });

        source.onended = () => {
            if (audioSourceRef.current !== source) return;
            audioSourceRef.current = null;
            
            const currentSurah = surahs.find(s => s.id === surahId);
            if (!currentSurah) { stopPlayback(); return; }

            if (mode === 'verse-by-verse' || mode === 'full-surah') {
                 const isLastAyahInRange = ayah.id === playbackRange.end;
                 const shouldLoop = isInfinite || playCountRef.current < repeatCount + 1;
                 
                 if (shouldLoop && (mode === 'full-surah' || isLastAyahInRange)) {
                     playCountRef.current += 1;
                     const firstAyah = currentSurah.ayahs.find(a => a.id === playbackRange.start);
                     if (firstAyah) {
                        const delay = mode === 'verse-by-verse' ? 500 : 250;
                        playNextTimeoutRef.current = window.setTimeout(() => {
                           handlePlayRange(currentSurah, mode, true);
                        }, delay);
                     } else {
                        stopPlayback();
                     }
                 } else if (mode === 'verse-by-verse' && !isLastAyahInRange) {
                    const currentAyahIndex = currentSurah.ayahs.findIndex(a => a.id === ayah.id);
                    if (currentAyahIndex > -1 && currentAyahIndex < currentSurah.ayahs.length - 1) {
                        const nextAyah = currentSurah.ayahs[currentAyahIndex + 1];
                        playNextTimeoutRef.current = window.setTimeout(() => {
                            handlePlayAyah(nextAyah, surahId, mode, true);
                        }, 500);
                    } else {
                        stopPlayback();
                    }
                 } else {
                     stopPlayback();
                 }
            } else { // Single Ayah Mode
                 if (isInfinite || playCountRef.current < repeatCount + 1) {
                     playCountRef.current += 1;
                     playNextTimeoutRef.current = window.setTimeout(() => {
                        handlePlayAyah(ayah, surahId, 'single', true);
                    }, 500);
                 } else {
                    setPlayingState({ status: 'idle' });
                 }
            }
        };

    } catch (error) {
      console.error("Error playing audio:", error);
      let message = "Audio playback failed. Please try again.";
      if (error instanceof Error && error.message.includes("No audio data returned")) {
          message = "Audio generation failed. The voice may be busy or unavailable.";
      }
      setToastMessage(message);
      setPlayingState({ status: 'error', surahId, ayahId: ayah.id, mode });
    }
  }, [playingState.status, stopPlayback, selectedReciterId, surahs, playbackRange, repeatCount, isInfinite]);

  const handlePlayRange = useCallback((surah: Surah, mode: 'verse-by-verse' | 'full-surah', isContinuation = false) => {
    const isPlayingThisMode = playingState.status !== 'idle' && playingState.mode === mode && playingState.surahId === surah.id;

    if(isPlayingThisMode && !isContinuation) {
        stopPlayback();
        return;
    } 

    if (!isContinuation) {
        stopPlayback();
    }
    
    if (mode === 'full-surah') {
        const ayahsInRange = surah.ayahs.filter(a => a.id >= playbackRange.start && a.id <= playbackRange.end);
        const combinedText = ayahsInRange.map(a => a.text).join(' ');
        
        const fakeAyah: Ayah = { id: playbackRange.start, text: combinedText };
        handlePlayAyah(fakeAyah, surah.id, 'full-surah', isContinuation);

    } else { // verse-by-verse
        const firstAyahInRange = surah.ayahs.find(a => a.id === playbackRange.start);
        if (firstAyahInRange) {
            handlePlayAyah(firstAyahInRange, surah.id, mode, isContinuation);
        }
    }
  }, [playingState, stopPlayback, handlePlayAyah, playbackRange.start, playbackRange.end]);

  const handleSelectSurah = (surah: Surah) => {
    stopPlayback();
    setSelectedSurah(surah);
    setPlaybackRange({ start: 1, end: surah.ayahs.length });
    setView('detail');
    window.scrollTo(0, 0);
  };
  
  const handleThemeToggle = () => {
    setTheme(prev => {
        const newTheme = prev === 'light' ? 'dark' : 'light';
        if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        return newTheme;
    });
  };

  const handleNavigate = (newView: View) => {
    stopPlayback();
    if (newView === 'list') {
      setSelectedSurah(null);
    }
    setView(newView);
    window.scrollTo(0, 0);
  }
  
  const handleToggleBookmark = useCallback((surahId: number, ayahId: number) => {
    setBookmarks(prev => {
        const exists = prev.some(b => b.surahId === surahId && b.ayahId === ayahId);
        if (exists) {
            return prev.filter(b => !(b.surahId === surahId && b.ayahId === ayahId));
        } else {
            return [...prev, { surahId, ayahId }];
        }
    });
  }, [setBookmarks]);

  const handleSaveNote = useCallback((surahId: number, ayahId: number, text: string) => {
    setNotes(prev => {
        const existingNoteIndex = prev.findIndex(n => n.surahId === surahId && n.ayahId === ayahId);
        if (text.trim() === '') {
            if (existingNoteIndex > -1) {
                return prev.filter((_, index) => index !== existingNoteIndex);
            }
            return prev;
        }

        if (existingNoteIndex > -1) {
            const newNotes = [...prev];
            newNotes[existingNoteIndex] = { surahId, ayahId, text };
            return newNotes;
        } else {
            return [...prev, { surahId, ayahId, text }];
        }
    });
  }, [setNotes]);

  const getNoteForAyah = (surahId: number, ayahId: number) => {
    return notes.find(n => n.surahId === surahId && n.ayahId === ayahId)?.text || '';
  };
  
  const isBookmarked = (surahId: number, ayahId: number) => {
      return bookmarks.some(b => b.surahId === surahId && b.ayahId === ayahId);
  }

  const handleStartLearning = (surah: Surah, range: { start: number, end: number }, mode: LearningModeType) => {
    stopPlayback();
    setLearningSession({ surah, range, mode });
  };


  const renderContent = () => {
    switch(view) {
        case 'detail':
            return selectedSurah ? (
                <SurahDetail 
                    surah={selectedSurah} 
                    onPlay={(ayah, surahId) => handlePlayAyah(ayah, surahId, 'single')} 
                    onStop={stopPlayback}
                    playingState={playingState}
                    isBookmarked={isBookmarked}
                    getNoteForAyah={getNoteForAyah}
                    onToggleBookmark={handleToggleBookmark}
                    onSaveNote={handleSaveNote}
                    onPlayRange={handlePlayRange}
                    onStartLearning={handleStartLearning}
                    notes={notes}
                    reciters={RECITERS}
                    translations={TRANSLATIONS}
                    selectedReciterId={selectedReciterId}
                    selectedTranslationId={selectedTranslationId}
                    onReciterChange={setSelectedReciterId}
                    onTranslationChange={setSelectedTranslationId}
                    playbackRange={playbackRange}
                    onPlaybackRangeChange={setPlaybackRange}
                    repeatCount={repeatCount}
                    onRepeatCountChange={setRepeatCount}
                    isInfinite={isInfinite}
                    onIsInfiniteChange={setIsInfinite}
                    onRegenerateAyah={handleRegenerateAyah}
                />
            ) : <SurahList surahs={surahs} onSelect={handleSelectSurah} />;
        case 'bookmarks':
            return <BookmarksView 
                bookmarks={bookmarks} 
                allSurahs={surahs} 
                onNavigate={handleSelectSurah} 
            />;
        case 'settings':
            return <SettingsView
                reciters={RECITERS}
                translations={TRANSLATIONS}
                selectedReciterId={selectedReciterId}
                selectedTranslationId={selectedTranslationId}
                onReciterChange={setSelectedReciterId}
                onTranslationChange={setSelectedTranslationId}
            />;
        case 'list':
        default:
            return <SurahList surahs={surahs} onSelect={handleSelectSurah} />;
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-zinc-900 dark:text-zinc-300">
      <Header 
        currentView={view} 
        selectedSurah={selectedSurah} 
        onNavigate={handleNavigate}
        theme={theme}
        onThemeToggle={handleThemeToggle} 
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
      {toastMessage && <Toast message={toastMessage} />}
      {learningSession && (
        <RecitationPractice
          session={learningSession}
          onClose={() => setLearningSession(null)}
        />
      )}
      <footer className="text-center py-6 text-slate-500 dark:text-zinc-500 text-sm">
        <p>Quranic Reciter - Experience the Holy Quran with AI-powered recitation.</p>
        <p className="mt-2">Text from Tanzil Project. Audio by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
