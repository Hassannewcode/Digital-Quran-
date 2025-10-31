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
  const [prefetchedBuffer, setPrefetchedBuffer] = useState<{ key: string; buffer: AudioBuffer } | null>(null);

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
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

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
    setPrefetchedBuffer(null);
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

  const prefetchAyah = useCallback(async (ayah: Ayah, surahId: number) => {
    if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    const audioContext = audioContextRef.current;
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }

    const reciter = RECITERS.find(r => r.id === selectedReciterId);
    if (!reciter) return;
    
    const cacheKey = `${reciter.id}-${surahId}-${ayah.id}`;
    
    if (prefetchedBuffer?.key === cacheKey) return;

    try {
        let base64Audio = await getCachedAudio(cacheKey);
        if (!base64Audio) {
            base64Audio = await generateSpeech(ayah.text, reciter.voice, reciter.stylePrompt);
            setCachedAudio(cacheKey, base64Audio).catch(console.error);
        }
        
        const audioData = decode(base64Audio);
        const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
        
        setPrefetchedBuffer({ key: cacheKey, buffer: audioBuffer });
    } catch (error) {
        console.error(`Error prefetching audio for ayah ${surahId}:${ayah.id}:`, error);
        setPrefetchedBuffer(null);
    }
  }, [selectedReciterId, prefetchedBuffer]);

  const handlePlayAyah = useCallback(async (ayah: Ayah, surahId: number, mode: PlayingMode, isContinuation = false) => {
    if (playingState.status !== 'idle' && !isContinuation) {
      stopPlayback();
    }
    
    if (!isContinuation) {
        playCountRef.current = 1;
    }
    
    // Pre-fetch next ayah immediately for 'asap-continuous' mode
    if (mode === 'asap-continuous') {
        const currentSurah = surahs.find(s => s.id === surahId);
        if (currentSurah) {
            let nextAyahToPrefetch: Ayah | undefined;
            const isLastAyahInCurrentRange = ayah.id === playbackRange.end;
    
            if (isLastAyahInCurrentRange) {
                 if (isInfinite || playCountRef.current < repeatCount + 1) {
                    nextAyahToPrefetch = currentSurah.ayahs.find(a => a.id === playbackRange.start);
                 }
            } else {
                const currentAyahIndex = currentSurah.ayahs.findIndex(a => a.id === ayah.id);
                if (currentAyahIndex > -1 && currentAyahIndex < currentSurah.ayahs.length - 1) {
                    const nextAyahInSequence = currentSurah.ayahs[currentAyahIndex + 1];
                     if (nextAyahInSequence.id <= playbackRange.end) {
                        nextAyahToPrefetch = nextAyahInSequence;
                    }
                }
            }
            
            if (nextAyahToPrefetch) {
                prefetchAyah(nextAyahToPrefetch, surahId); // Fire-and-forget
            } else {
                if (prefetchedBuffer) setPrefetchedBuffer(null);
            }
        }
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
        const cacheKey = `${selectedReciterId}-${surahId}-${ayah.id}`;
        
        let audioBuffer: AudioBuffer;

        if (mode === 'asap-continuous' && prefetchedBuffer?.key === cacheKey) {
            audioBuffer = prefetchedBuffer.buffer;
            setPrefetchedBuffer(null); // Consume the buffer
        } else {
            let base64Audio = await getCachedAudio(cacheKey);

            if (!base64Audio) {
                base64Audio = await generateSpeech(ayah.text, voiceName, stylePrompt);
                setCachedAudio(cacheKey, base64Audio).catch(console.error);
            }
            
            const audioData = decode(base64Audio);
            audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        
        audioSourceRef.current = source;
        setPlayingState({ status: 'playing', surahId, ayahId: ayah.id, mode });

        source.onended = () => {
            if (audioSourceRef.current !== source) return;
            audioSourceRef.current = null;
            
            const isRangePlayback = mode === 'verse-by-verse' || mode === 'continuous' || mode === 'asap-continuous';

            if (isRangePlayback) {
                const currentSurah = surahs.find(s => s.id === surahId);
                if (!currentSurah) { stopPlayback(); return; }
                
                const isLastAyahInRange = ayah.id === playbackRange.end;

                if (isLastAyahInRange) {
                    if (isInfinite || playCountRef.current < repeatCount + 1) {
                        playCountRef.current += 1;
                        const firstAyah = currentSurah.ayahs.find(a => a.id === playbackRange.start);
                        if (firstAyah) {
                             const delay = mode === 'continuous' ? 50 : (mode === 'verse-by-verse' ? 500 : 0);
                             playNextTimeoutRef.current = window.setTimeout(() => {
                                handlePlayAyah(firstAyah, surahId, mode, true);
                            }, delay);
                        } else {
                            stopPlayback();
                        }
                    } else {
                        stopPlayback();
                    }
                } else {
                    const currentAyahIndex = currentSurah.ayahs.findIndex(a => a.id === ayah.id);
                    if (currentAyahIndex > -1 && currentAyahIndex < currentSurah.ayahs.length - 1) {
                        const nextAyah = currentSurah.ayahs[currentAyahIndex + 1];
                        const delay = mode === 'continuous' ? 50 : (mode === 'verse-by-verse' ? 500 : 0);
                        playNextTimeoutRef.current = window.setTimeout(() => {
                            handlePlayAyah(nextAyah, surahId, mode, true);
                        }, delay);
                    } else {
                        stopPlayback();
                    }
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
  }, [playingState.status, stopPlayback, selectedReciterId, surahs, playbackRange, repeatCount, isInfinite, prefetchedBuffer, prefetchAyah]);
  
  const handlePlayFullSurah = useCallback(async (surah: Surah) => {
    const isPlayingThisMode = playingState.status !== 'idle' && playingState.mode === 'full-surah' && playingState.surahId === surah.id;
    if (isPlayingThisMode) {
        stopPlayback();
        return;
    }
    
    stopPlayback(); // stop any other playback before starting

    setPlayingState({ status: 'loading', surahId: surah.id, ayahId: playbackRange.start, mode: 'full-surah' });

    try {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }
        const audioContext = audioContextRef.current;
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        const ayahsInRange = surah.ayahs.slice(playbackRange.start - 1, playbackRange.end);
        let fullText = ayahsInRange.map(a => a.text).join(' ');

        if (surah.id !== 1 && surah.id !== 9 && playbackRange.start === 1) {
            fullText = "بِسْمِ اللَّهِ الرَّحْمَـٰنِ الرَّحِيمِ " + fullText;
        }

        const reciter = RECITERS.find(r => r.id === selectedReciterId);
        if (!reciter) throw new Error("Reciter not found");
        
        const voiceName = reciter.voice;
        const stylePrompt = reciter.stylePrompt;
        
        const cacheKey = `${reciter.id}-${surah.id}-${playbackRange.start}-${playbackRange.end}-full`;
        
        let base64Audio = await getCachedAudio(cacheKey);

        if (!base64Audio) {
            base64Audio = await generateSpeech(fullText, voiceName, stylePrompt);
            await setCachedAudio(cacheKey, base64Audio);
        }
        
        const audioData = decode(base64Audio);
        const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        
        audioSourceRef.current = source;
        setPlayingState({ status: 'playing', surahId: surah.id, ayahId: playbackRange.start, mode: 'full-surah' });

        source.onended = () => {
            if (audioSourceRef.current !== source) return;
            stopPlayback();
        };

    } catch (error) {
      console.error("Error playing full surah audio:", error);
      let message = "Audio generation for the full range failed. Please try a shorter range.";
      if (error instanceof Error && error.message.includes("No audio data returned")) {
          message = "Audio generation failed. The voice may be busy or unavailable.";
      }
      setToastMessage(message);
      setPlayingState({ status: 'error', surahId: surah.id, ayahId: playbackRange.start, mode: 'full-surah' });
    }
}, [playingState.status, stopPlayback, selectedReciterId, playbackRange]);


  const handlePlayRange = useCallback((surah: Surah, mode: 'verse-by-verse' | 'continuous' | 'full-surah' | 'asap-continuous') => {
    if(mode === 'full-surah'){
        handlePlayFullSurah(surah);
        return;
    }
    const isPlayingThisMode = playingState.status !== 'idle' && playingState.mode === mode && playingState.surahId === surah.id;

    if(isPlayingThisMode) {
        stopPlayback();
    } else {
        const firstAyahInRange = surah.ayahs.find(a => a.id === playbackRange.start);
        if (firstAyahInRange) {
            handlePlayAyah(firstAyahInRange, surah.id, mode);
        }
    }
  }, [playingState, stopPlayback, handlePlayAyah, playbackRange.start, handlePlayFullSurah]);

  const handleSelectSurah = (surah: Surah) => {
    stopPlayback();
    setSelectedSurah(surah);
    setPlaybackRange({ start: 1, end: surah.ayahs.length });
    setView('detail');
    window.scrollTo(0, 0);
  };
  
  const handleThemeToggle = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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