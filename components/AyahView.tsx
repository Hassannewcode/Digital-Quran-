import React, { useState, useEffect } from 'react';
import { Ayah, PlayingState, Surah } from '../types';
import { LoadingSpinner, PlayIcon, StopIcon, ErrorIcon } from './icons/PlaybackIcons';
import { BookmarkIcon, NoteIcon } from './icons/FeatureIcons';

interface AyahViewProps {
  ayah: Ayah;
  surah: Surah;
  onPlay: () => void;
  playingState: PlayingState;
  isBookmarked: boolean;
  note: string;
  onToggleBookmark: () => void;
  onSaveNote: (text: string) => void;
}

const AyahView: React.FC<AyahViewProps> = ({ ayah, surah, onPlay, playingState, isBookmarked, note, onToggleBookmark, onSaveNote }) => {
  const [showNote, setShowNote] = useState(false);
  const [noteText, setNoteText] = useState(note);

  useEffect(() => {
    setNoteText(note);
  }, [note]);

  const isCurrentAyah = (playingState.status !== 'idle' && playingState.surahId === surah.id && playingState.ayahId === ayah.id);
  
  const handleNoteSave = () => {
    onSaveNote(noteText);
    setShowNote(false);
  };

  const renderPlayButton = () => {
    if (isCurrentAyah && !playingState.continuous) {
        switch (playingState.status) {
            case 'loading': return <LoadingSpinner />;
            case 'playing': return <StopIcon />;
            case 'error': return <ErrorIcon />;
        }
    }
    return <PlayIcon />;
  };

  return (
    <div className={`p-4 md:p-6 group transition-colors duration-300 ${isCurrentAyah ? 'bg-blue-50 dark:bg-zinc-800/50' : ''}`}>
        <div className="flex items-start gap-4">
            <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <span className="font-sans text-sm text-slate-400 dark:text-zinc-500 select-none">{surah.id}:{ayah.id}</span>
                <button 
                    onClick={onPlay}
                    className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-blue-100 hover:text-blue-600 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:hover:text-blue-400 transition-all duration-200"
                    aria-label={`Play Ayah ${surah.id}:${ayah.id}`}
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
                    onClick={() => setShowNote(!showNote)}
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-200 ${note || showNote ? 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/50' : 'text-zinc-400 hover:bg-slate-200 dark:text-zinc-500 dark:hover:bg-zinc-800'}`}
                    aria-label={note ? `Edit note for Ayah ${surah.id}:${ayah.id}` : `Add note to Ayah ${surah.id}:${ayah.id}`}
                 >
                    <NoteIcon hasNote={!!note} />
                 </button>
            </div>
            <div className="flex-1">
                <p dir="rtl" className="text-3xl md:text-4xl leading-loose font-amiri-quran text-right text-slate-900 dark:text-zinc-100 mb-4">
                    {ayah.text}
                </p>
                {ayah.translation && (
                    <p dir="ltr" className="text-slate-600 dark:text-zinc-400 text-left leading-relaxed">
                        {ayah.translation}
                    </p>
                )}
            </div>
        </div>
        {showNote && (
            <div className="mt-4 ml-14 rtl:mr-14">
                <textarea
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200"
                    placeholder="Write your notes here..."
                    rows={3}
                    aria-label={`Note for Ayah ${surah.id}:${ayah.id}`}
                ></textarea>
                <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => {setShowNote(false); setNoteText(note);}} className="px-3 py-1 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 dark:text-zinc-300 dark:bg-zinc-700 dark:hover:bg-zinc-600 rounded-md">Cancel</button>
                    <button onClick={handleNoteSave} className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md">Save Note</button>
                </div>
            </div>
        )}
    </div>
  );
};

export default AyahView;