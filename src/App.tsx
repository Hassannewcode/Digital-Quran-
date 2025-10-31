
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Surah, Ayah, PlayingState, Reciter, Translation, Bookmark, Note, PlayingMode, LearningModeType, View } from './types';
import { getSurahsWithTranslation } from './services/quranService';
import { generateSpeech } from './services/geminiService';
import { getCachedAudio, setCachedAudio, deleteCachedAudio } from './services/dbService';
import Header from './components/Header';
import SurahList from './components/SurahList';
import SurahDetail from './components/SurahDetail';
import BookmarksView from './components/BookmarksView';
import SettingsView from './components/SettingsView';
import Player from './components/Player';
import RecitationPractice from './components/learning/RecitationPractice';
import { decode, decodeAudioData } from './utils/audioUtils';
import { useLocalStorage } from './hooks/useLocalStorage';
import { RECITERS, TRANSLATIONS } from './constants/settings';
import Toast from './components/Toast';

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
  const [playerSurah, setPlayerSurah] = useState<Surah | null>(null);
  const [currentAyah, setCurrentAyah] = useState<Ayah | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [learningSession, setLearningSession] = useState<LearningSession | null>(null);

  const [playbackRange, setPlaybackRange] = useState<{ start: number; end: number }>({ start: 1, end: 1 });
  const [repeatCount, setRepeatCount] = useState(0); // 0 = off
  const [isInfinite, setIsInfinite] = useState(false);
  
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalTime, setTotalTime] = useState(0);

  const [volume, setVolume] = useLocalStorage('volume', 1);
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const [pitch, setPitch] = useLocalStorage('pitch', 1.0);
  const [speed, setSpeed] = useLocalStorage('speed', 1.0);

  const [selectedReciterId, setSelectedReciterId] = useLocalStorage('reciter', 'fenrir');
  const [selectedTranslationId, setSelectedTranslationId] = useLocalStorage('translation', 'none');
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('bookmarks', []);
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const audioBufferRef = useRef<AudioBuffer | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const playNextTimeoutRef = useRef<number | null>(null);
  const playCountRef = useRef(0);
  const elapsedTimeIntervalRef = useRef<number | null>(null);
  const playbackStartTimeRef = useRef(0);
  const pauseTimeRef = useRef(0);

  const selectedTranslation = useMemo(() => TRANSLATIONS.find(t => t.id === selectedTranslationId), [selectedTranslationId]);
  const selectedReciter = useMemo(() => RECITERS.find(r => r.id === selectedReciterId), [selectedReciterId]);
  
  useEffect(() => {
    if (selectedReciter) {
        setPitch(selectedReciter.defaultPitch ?? 1.0);
        setSpeed(selectedReciter.defaultSpeed ?? 1.0);
    }
  }, [selectedReciter, setPitch, setSpeed]);


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    setSurahs(getSurahsWithTranslation(selectedTranslation?.data || null));
    if (playerSurah) {
        setPlayerSurah(s => s ? getSurahsWithTranslation(selectedTranslation?.data || null).find(newS => newS.id === s.id) || null : null);
    }
    if(currentAyah && playerSurah){
        const surah = getSurahsWithTranslation(selectedTranslation?.data || null).find(s => s.id === playerSurah.id);
        if(surah){
            const ayah = surah.ayahs.find(a => a.id === currentAyah.id);
            if(ayah) setCurrentAyah(ayah);
        }
    }
  }, [selectedTranslation]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const stopElapsedTimer = useCallback(() => {
      if (elapsedTimeIntervalRef.current) {
          clearInterval(elapsedTimeIntervalRef.current);
          elapsedTimeIntervalRef.current = null;
      }
  }, []);

  const startElapsedTimer = useCallback(() => {
    stopElapsedTimer();
    if (!audioContextRef.current) return;
    
    playbackStartTimeRef.current = audioContextRef.current.currentTime - elapsedTime;
    
    elapsedTimeIntervalRef.current = window.setInterval(() => {
        if (audioContextRef.current && audioSourceRef.current && playingState.status === 'playing') {
            const currentElapsedTime = audioContextRef.current.currentTime - playbackStartTimeRef.current;
            setElapsedTime(Math.min(currentElapsedTime, totalTime));
        }
    }, 100);
  }, [totalTime, elapsedTime, playingState.status, stopElapsedTimer]);


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
    stopElapsedTimer();
    setElapsedTime(0);
    setTotalTime(0);
    if (playingState.status !== 'idle') {
      setPlayingState({ status: 'idle' });
      setCurrentAyah(null);
      setPlayerSurah(null);
      audioBufferRef.current = null;
    }
  }, [playingState.status, stopElapsedTimer]);

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

  // Forward-declare handlePlayRange for mutual recursion with handlePlayAyah
  const handlePlayRangeRef = useRef<((surah: Surah, mode: PlayingMode, isContinuation?: boolean) => void) | null>(null);

  const playAudioBuffer = useCallback( (buffer: AudioBuffer, offset = 0) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    
    if (audioSourceRef.current) {
      audioSourceRef.current.onended = null;
      try { audioSourceRef.current.stop(); } catch(e) {/*ignore*/}
    }

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(gainNodeRef.current);
    source.start(0, offset);
    audioSourceRef.current = source;
    setElapsedTime(offset);
    startElapsedTimer();

    return source;
  }, [startElapsedTimer]);

  const handlePlayAyah = useCallback(async (
    ayah: Ayah, 
    surah: Surah, 
    mode: PlayingMode, 
    cacheKey: string,
    isContinuation = false
  ) => {
    if (playingState.status !== 'idle' && !isContinuation) {
      stopPlayback();
    }
    
    if (!isContinuation) {
        playCountRef.current = 1;
        setElapsedTime(0);
    }
    
    setPlayingState({ status: 'loading', surahId: surah.id, ayahId: ayah.id, mode });
    setPlayerSurah(surah);
    setCurrentAyah(ayah);

    try {
        if (!audioContextRef.current) {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            audioContextRef.current = context;
            gainNodeRef.current = context.createGain();
            gainNodeRef.current.gain.value = volume;
            gainNodeRef.current.connect(context.destination);
        }
        const audioContext = audioContextRef.current;
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        const reciter = RECITERS.find(r => r.id === selectedReciterId);
        const voiceName = reciter?.voice || 'Zephyr';
        const stylePrompt = reciter?.stylePrompt;
        
        let base64Audio = await getCachedAudio(cacheKey);

        if (!base64Audio) {
            base64Audio = await generateSpeech(ayah.text, voiceName, stylePrompt, pitch, speed);
            setCachedAudio(cacheKey, base64Audio).catch(console.error);
        }
        
        const audioData = decode(base64Audio);
        const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);
        audioBufferRef.current = audioBuffer;
        
        if (!isContinuation) {
            setTotalTime(audioBuffer.duration);
        }

        const source = playAudioBuffer(audioBuffer);
        
        setPlayingState({ status: 'playing', surahId: surah.id, ayahId: ayah.id, mode });

        source.onended = () => {
            if (audioSourceRef.current !== source) return;
            
            const isLastAyahInRange = ayah.id === playbackRange.end;
            const shouldLoop = isInfinite || playCountRef.current < repeatCount + 1;
            
            if (mode !== 'single' && shouldLoop && isLastAyahInRange) {
                 playCountRef.current += 1;
                 const delay = mode === 'verse-by-verse' ? 500 : 250;
                 playNextTimeoutRef.current = window.setTimeout(() => {
                    handlePlayRangeRef.current?.(surah, mode, true);
                 }, delay);
            } else if (mode === 'verse-by-verse' && !isLastAyahInRange) {
                const currentAyahIndex = surah.ayahs.findIndex(a => a.id === ayah.id);
                if (currentAyahIndex > -1 && currentAyahIndex < surah.ayahs.length - 1) {
                    const nextAyah = surah.ayahs[currentAyahIndex + 1];
                    const nextCacheKey = `${selectedReciterId}-${surah.id}-${nextAyah.id}`;
                    playNextTimeoutRef.current = window.setTimeout(() => {
                        handlePlayAyah(nextAyah, surah, mode, nextCacheKey, true);
                    }, 500);
                } else {
                    stopPlayback();
                }
            } else if (mode === 'single' && shouldLoop) {
                 playCountRef.current += 1;
                 playNextTimeoutRef.current = window.setTimeout(() => {
                    handlePlayAyah(ayah, surah, 'single', cacheKey, true);
                }, 500);
            }
            else {
                 stopPlayback();
            }
        };

    } catch (error) {
        console.error("Error playing audio:", error);
        let message = "Audio playback failed. Please try again.";
        if (error instanceof Error) {
            if (error.message.includes("No audio data returned")) {
                message = "Audio generation failed. The voice may be busy or the Surah is too long for this mode.";
            } else if (error.message.includes("API_KEY is not configured")) {
                message = "API Key is not configured for this deployment.";
            }
        }
        setToastMessage(message);
        setPlayingState({ status: 'error', surahId: surah.id, ayahId: ayah.id, mode });
        stopPlayback();
    }
  }, [playingState.status, stopPlayback, selectedReciterId, volume, playAudioBuffer, playbackRange.end, isInfinite, repeatCount, pitch, speed]);

  const handlePlayRange = useCallback((surah: Surah, mode: 'verse-by-verse' | 'full-surah', isContinuation = false) => {
    if (!isContinuation) stopPlayback();
    
    const BISMILLAH = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ ';
    const addBismillah = surah.id !== 9 && playbackRange.start > 1 && !isContinuation;

    if (mode === 'full-surah') {
        const ayahsInRange = surah.ayahs.filter(a => a.id >= playbackRange.start && a.id <= playbackRange.end);
        if (ayahsInRange.length === 0) return;
        let combinedText = ayahsInRange.map(a => a.text.replace(/[۞۩]/g, '').trim()).join(' ');
        
        let cacheKey = `${selectedReciterId}-${surah.id}-${playbackRange.start}-${playbackRange.end}`;
        
        if (addBismillah) {
            combinedText = BISMILLAH + combinedText;
            cacheKey += '-with-bismillah';
        }

        const fakeAyah: Ayah = { id: playbackRange.start, text: combinedText, translation: ayahsInRange[0].translation };
        handlePlayAyah(fakeAyah, surah, 'full-surah', cacheKey, isContinuation);

    } else { // verse-by-verse
        const firstAyahInRange = surah.ayahs.find(a => a.id === playbackRange.start);
        if (firstAyahInRange) {
            const ayahToPlay = { ...firstAyahInRange };
            let cacheKey = `${selectedReciterId}-${surah.id}-${firstAyahInRange.id}`;

            if (addBismillah) {
                ayahToPlay.text = BISMILLAH + ayahToPlay.text;
                cacheKey += '-with-bismillah';
            }
            
            handlePlayAyah(ayahToPlay, surah, mode, cacheKey, isContinuation);
        }
    }
  }, [stopPlayback, playbackRange.start, playbackRange.end, selectedReciterId, handlePlayAyah]);
  
  handlePlayRangeRef.current = handlePlayRange;

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

  // Fix: The previous implementation of `handlePlayPause` was not type-safe and could lead to a corrupted state object, causing crashes elsewhere.
  // This version is type-safe by ensuring `playingState` is not stale and correctly narrowed before spreading.
  const handlePlayPause = useCallback(() => {
    if (!audioContextRef.current) return;
    const audioContext = audioContextRef.current;
    
    if (audioContext.state === 'running' && playingState.status === 'playing') {
      audioContext.suspend();
      stopElapsedTimer();
      pauseTimeRef.current = audioContext.currentTime;
      setPlayingState({ ...playingState, status: 'paused' });
    } else if (audioContext.state === 'suspended' && playingState.status === 'paused') {
      audioContext.resume();
      const pauseDuration = audioContext.currentTime - pauseTimeRef.current;
      playbackStartTimeRef.current += pauseDuration;
      startElapsedTimer();
      setPlayingState({ ...playingState, status: 'playing' });
    }
  }, [playingState, stopElapsedTimer, startElapsedTimer]);
  
  // FIX: Restructured conditional to use a guard clause. This helps TypeScript correctly
  // narrow the type of `playingState`, resolving the error where `mode` was not
  // found on the 'idle' state.
  const changeVerse = useCallback((direction: 'next' | 'previous') => {
    if (playingState.status === 'idle' || !playerSurah) {
      return;
    }

    if (playingState.mode !== 'full-surah') {
      const { ayahId } = playingState;
      const currentIdx = playerSurah.ayahs.findIndex(a => a.id === ayahId);
      
      const newIdx = direction === 'next' ? currentIdx + 1 : currentIdx - 1;

      if (newIdx >= 0 && newIdx < playerSurah.ayahs.length) {
          const newAyah = playerSurah.ayahs[newIdx];
          const newCacheKey = `${selectedReciterId}-${playerSurah.id}-${newAyah.id}`;
          stopPlayback();
          setTimeout(() => handlePlayAyah(newAyah, playerSurah, 'single', newCacheKey), 100);
      }
    }
  }, [playerSurah, playingState, selectedReciterId, handlePlayAyah, stopPlayback]);

  const handleSeek = (time: number) => {
    if (playingState.status === 'idle' || playingState.mode !== 'full-surah' || !audioBufferRef.current || !audioContextRef.current) return;
    playAudioBuffer(audioBufferRef.current, time);
    // Ensure state is playing, in case it was paused
    if (playingState.status === 'paused') {
        setPlayingState(prev => ({ ...prev as Exclude<PlayingState, {status: 'idle'}>, status: 'playing' }));
    }
  };
  
  const handleVolumeChange = (newVolume: number) => {
      setVolume(newVolume);
      if (gainNodeRef.current) {
          gainNodeRef.current.gain.value = newVolume;
      }
  };

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
                    onPlay={(ayah) => {
                      const surahForPlay = surahs.find(s => s.id === selectedSurah.id);
                      if (surahForPlay) {
                        const cacheKey = `${selectedReciterId}-${surahForPlay.id}-${ayah.id}`;
                        handlePlayAyah(ayah, surahForPlay, 'single', cacheKey);
                      }
                    }} 
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
                    pitch={pitch}
                    onPitchChange={setPitch}
                    speed={speed}
                    onSpeedChange={setSpeed}
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
                // Fix: Pass pitch and speed controls to SettingsView.
                pitch={pitch}
                onPitchChange={setPitch}
                speed={speed}
                onSpeedChange={setSpeed}
            />;
        case 'list':
        default:
            return <SurahList surahs={surahs} onSelect={handleSelectSurah} />;
    }
  }
  
  const mainContentPadding = playingState.status !== 'idle' ? 'pb-40' : 'pb-8';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-zinc-950 dark:text-zinc-300">
      <Header 
        currentView={view} 
        selectedSurah={selectedSurah} 
        onNavigate={handleNavigate}
        theme={theme}
        onThemeToggle={handleThemeToggle} 
      />
      <main className={`container mx-auto px-4 py-8 ${mainContentPadding}`}>
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
      {playingState.status !== 'idle' && playerSurah && currentAyah && (
        <Player
          playingState={playingState}
          surah={playerSurah}
          ayah={currentAyah}
          elapsedTime={elapsedTime}
          totalTime={totalTime}
          onClose={stopPlayback}
          onPlayPause={handlePlayPause}
          onNext={() => changeVerse('next')}
          onPrevious={() => changeVerse('previous')}
          onSeek={handleSeek}
          volume={volume}
          onVolumeChange={handleVolumeChange}
          surahTotalAyahs={playerSurah.ayahs.length}
          playbackRange={playbackRange}
          onPlaybackRangeChange={setPlaybackRange}
          repeatCount={repeatCount}
          onRepeatCountChange={setRepeatCount}
          isInfinite={isInfinite}
          onIsInfiniteChange={setIsInfinite}
        />
      )}
    </div>
  );
};

export default App;
