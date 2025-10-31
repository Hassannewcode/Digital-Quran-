import React, { useState, useEffect } from 'react';
import { Ayah, PlayingState, Surah } from '../types';
import { LoadingSpinner, PlayIcon, StopIcon, ErrorIcon } from './icons/PlaybackIcons';
import { BookmarkIcon, NoteIcon, RegenerateIcon, LearnIcon } from './icons/FeatureIcons';

interface AyahViewProps {
  ayah: Ayah;
  surah: Surah;
  onPlay: () => void;
  onStop: () => void;
  onStartLearning: () => void;
  playingState: PlayingState;
  isBookmarked: boolean;
  note: string;
  onToggleBookmark: () => void;
  onSaveNote: (text: string) => void;
  onRegenerate: () => void;
  isHighlighted: boolean;
}

const AyahView: React.FC<AyahViewProps> = ({ 
    ayah, 
    surah, 
    onPlay, 
    onStop, 
    onStartLearning, 
    playingState, 
    isBookmarked, 
    note, 
    onToggleBookmark, 
    onSaveNote, 
    onRegenerate,
    isHighlighted
}) => {
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState(note);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);

  useEffect(() => {
    setNoteText(note);
  }, [note]);

  const isPlayingOrLoadingThisAyah = playingState.status !== 'idle' && playingState.surahId === surah.id && playingState.ayahId === ayah.id && playingState.mode === 'single';
  
  const handleNoteSave = () => {
    onSaveNote(noteText);
    setShowNote(false);
    setShowSaveConfirmation(true);
    setTimeout(() => {
        setShowSaveConfirmation(false);
    }, 2000);
  };

  const handleToggleLearning = () => {
    onStop(); // Stop any playback before starting learning mode
    onStartLearning();
  }

  const renderPlayButton = () => {
    if (isPlayingOrLoadingThisAyah) {
        switch (playingState.status) {
            case 'loading': return <LoadingSpinner />;
            case 'error': return <ErrorIcon />;
            case 'playing':
            case 'paused':
                return <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">volume_up</span>;
        }
    }
    return <PlayIcon />;
  };

  return (
    <div className={`px-4 md:px-6 py-12 group transition-colors duration-300 ${isHighlighted ? 'bg-blue-50 dark:bg-zinc-800/50' : ''}`}>
        <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <span className="font-sans text-sm text-slate-400 dark:text-zinc-500 select-none">{surah.id}:{ayah.id}</span>
                <button 
                    onClick={isPlayingOrLoadingThisAyah ? undefined : onPlay}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${
                        isPlayingOrLoadingThisAyah
                            ? 'bg-blue-100 dark:bg-blue-900/50'
                            : 'bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-blue-400'
                    }`}
                    aria-label={`Play Ayah ${surah.id}:${ayah.id}`}
                    disabled={isPlayingOrLoadingThisAyah && playingState.status !== 'error'}
                >
                    {renderPlayButton()}
                </button>
                 <button 
                    onClick={onToggleBookmark}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 ${isBookmarked ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50' : 'text-zinc-400 hover:bg-slate-200 dark:text-zinc-500 dark:hover:bg-zinc-800'}`}
                    aria-label={isBookmarked ? `Remove bookmark from Ayah ${surah.id}:${ayah.id}`: `Bookmark Ayah ${surah.id}:${ayah.id}`}
                >
                    <BookmarkIcon filled={isBookmarked} />
                </button>
                <button
                    onClick={handleToggleLearning}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 text-zinc-400 hover:text-blue-600 hover:bg-slate-200 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-blue-400`}
                    aria-label={`Enter learning mode for Ayah ${surah.id}:${ayah.id}`}
                    title="Learning Mode"
                >
                    <LearnIcon />
                </button>
                 <div className="relative">
                    <button 
                        onClick={() => setShowNote(!showNote)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 ${note || showNote ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50' : 'text-zinc-400 hover:bg-slate-200 dark:text-zinc-500 dark:hover:bg-zinc-800'}`}
                        aria-label={note ? `Edit note for Ayah ${surah.id}:${ayah.id}` : `Add note to Ayah ${surah.id}:${ayah.id}`}
                    >
                        <NoteIcon hasNote={!!note} />
                    </button>
                     {showSaveConfirmation && (
                        <div className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 rounded-md text-xs font-semibold shadow-md whitespace-nowrap animate-fade-out-up">
                            Saved
                        </div>
                    )}
                 </div>
                 <button
                    onClick={onRegenerate}
                    className="w-10 h-10 flex items-center justify-center rounded-full text-zinc-400 hover:bg-slate-200 dark:text-zinc-500 dark:hover:bg-zinc-800"
                    aria-label={`Regenerate audio for Ayah ${surah.id}:${ayah.id}`}
                    title="Regenerate audio"
                >
                    <RegenerateIcon />
                </button>
            </div>
            <div className="flex-1">
                <p dir="rtl" className="text-3xl md:text-4xl leading-loose font-amiri-quran text-right text-slate-900 dark:text-zinc-100 mb-4">
                    {ayah.text}
                     <span className="text-2xl font-amiri-quran select-none text-blue-500 dark:text-blue-400 mx-2">﴿{ayah.id.toLocaleString('ar')}﴾</span>
                </p>
                {ayah.translation && (
                    <p dir="ltr" className="text-slate-600 dark:text-zinc-400 text-left leading-relaxed">
                        {ayah.translation}
                    </p>
                )}
                 {showNote && (
                    <div className="mt-4">
                        <div className="p-3 bg-slate-50 dark:bg-zinc-800/50 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-sm">
                            <textarea
                                value={noteText}
                                onChange={(e) => setNoteText(e.target.value)}
                                className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-zinc-800 dark:border-zinc-600 dark:text-zinc-200 text-sm"
                                placeholder="Write your notes and reflections here..."
                                rows={4}
                                aria-label={`Note for Ayah ${surah.id}:${ayah.id}`}
                            ></textarea>
                            <div className="flex justify-end gap-2 mt-2">
                                <button onClick={() => {setShowNote(false); setNoteText(note);}} className="px-3 py-1.5 text-sm font-semibold text-slate-700 bg-slate-200 hover:bg-slate-300 dark:text-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-md transition-colors">Cancel</button>
                                <button onClick={handleNoteSave} className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">Save Note</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default AyahView;