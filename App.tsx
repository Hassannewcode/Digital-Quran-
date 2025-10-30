import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Surah, Ayah, PlayingState, Reciter, Translation, Bookmark, Note } from './types';
import { getSurahsWithTranslation } from './services/quranService';
import { generateSpeech } from './services/geminiService';
import { getCachedAudio, setCachedAudio } from './services/dbService';
import Header from './components/Header';
import SurahList from './components/SurahList';
import SurahDetail from './components/SurahDetail';
import BookmarksView from './components/BookmarksView';
import SettingsView from './components/SettingsView';
import { decode, decodeAudioData } from './utils/audioUtils';
import { useLocalStorage } from './hooks/useLocalStorage';
import { RECITERS, TRANSLATIONS } from './constants/settings';

type View = 'list' | 'detail' | 'bookmarks' | 'settings';

const App: React.FC = () => {
  const [view, setView] = useState<View>('list');
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);
  const [playingState, setPlayingState] = useState<PlayingState>({ status: 'idle' });

  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 
    () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const [selectedReciterId, setSelectedReciterId] = useLocalStorage('reciter', RECITERS[0].id);
  const [selectedTranslationId, setSelectedTranslationId] = useLocalStorage('translation', TRANSLATIONS[0].id);
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('bookmarks', []);
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const playNextTimeoutRef = useRef<number | null>(null);

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

  const handlePlayAyah = useCallback(async (ayah: Ayah, surahId: number, continuous = false) => {
    if (playingState.status !== 'idle') {
      stopPlayback();
    }
    
    setPlayingState({ status: 'loading', surahId, ayahId: ayah.id, continuous });

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
        
        let base64Audio = await getCachedAudio(cacheKey);

        if (!base64Audio) {
            base64Audio = await generateSpeech(ayah.text, voiceName, stylePrompt);
            // Don't await this, let it happen in the background
            setCachedAudio(cacheKey, base64Audio).catch(console.error);
        }
        
        const audioData = decode(base64Audio);
        const audioBuffer = await decodeAudioData(audioData, audioContext, 24000, 1);

        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        
        audioSourceRef.current = source;
        setPlayingState({ status: 'playing', surahId, ayahId: ayah.id, continuous });

        source.onended = () => {
            if (audioSourceRef.current !== source) return;
            audioSourceRef.current = null;

            if (continuous) {
                const currentSurah = surahs.find(s => s.id === surahId);
                if (!currentSurah) { stopPlayback(); return; }
                
                const currentAyahIndex = currentSurah.ayahs.findIndex(a => a.id === ayah.id);
                if (currentAyahIndex > -1 && currentAyahIndex < currentSurah.ayahs.length - 1) {
                    const nextAyah = currentSurah.ayahs[currentAyahIndex + 1];
                    playNextTimeoutRef.current = window.setTimeout(() => {
                        handlePlayAyah(nextAyah, surahId, true);
                    }, 1500); // 1.5-second pause for recitation feel
                } else {
                    stopPlayback(); // End of surah
                }
            } else {
                setPlayingState({ status: 'idle' });
            }
        };

    } catch (error) {
      console.error("Error playing audio:", error);
      setPlayingState({ status: 'error', surahId, ayahId: ayah.id, continuous });
    }
  }, [playingState, stopPlayback, selectedReciterId, surahs]);
  
  const handleToggleSurahPlay = useCallback((surah: Surah) => {
    const isPlayingThisSurah = playingState.status !== 'idle' && playingState.surahId === surah.id && playingState.continuous;

    if(isPlayingThisSurah) {
        stopPlayback();
    } else {
        const firstAyah = surah.ayahs[0];
        if (firstAyah) {
            handlePlayAyah(firstAyah, surah.id, true);
        }
    }
  }, [playingState, stopPlayback, handlePlayAyah]);

  const handleSelectSurah = (surah: Surah) => {
    stopPlayback();
    setSelectedSurah(surah);
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

  const renderContent = () => {
    switch(view) {
        case 'detail':
            return selectedSurah ? (
                <SurahDetail 
                    surah={selectedSurah} 
                    onPlay={handlePlayAyah} 
                    playingState={playingState}
                    isBookmarked={isBookmarked}
                    getNoteForAyah={getNoteForAyah}
                    onToggleBookmark={handleToggleBookmark}
                    onSaveNote={handleSaveNote}
                    onToggleSurahPlay={handleToggleSurahPlay}
                    notes={notes}
                    reciters={RECITERS}
                    translations={TRANSLATIONS}
                    selectedReciterId={selectedReciterId}
                    selectedTranslationId={selectedTranslationId}
                    onReciterChange={setSelectedReciterId}
                    onTranslationChange={setSelectedTranslationId}
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
      <footer className="text-center py-6 text-slate-500 dark:text-zinc-500 text-sm">
        <p>Quranic Reciter - Experience the Holy Quran with AI-powered recitation.</p>
        <p className="mt-2">Text from Tanzil Project. Audio by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;