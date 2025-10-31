import React, { useState } from 'react';
import { Surah, PlayingState, LearningModeType } from '../types';
import { PlayIcon, StopIcon, LoadingSpinner } from './icons/PlaybackIcons';
import { LearnIcon } from './icons/FeatureIcons';
import PlaybackSettingsModal from './PlaybackSettingsModal';

interface PlaybackControlsProps {
  surah: Surah;
  playingState: PlayingState;
  onPlayRange: (surah: Surah, mode: 'verse-by-verse' | 'full-surah') => void;
  onStop: () => void;
  onStartLearning: (mode: LearningModeType) => void;
  playbackRange: { start: number; end: number };
  onPlaybackRangeChange: (range: { start: number; end: number }) => void;
  repeatCount: number;
  onRepeatCountChange: (count: number) => void;
  isInfinite: boolean;
  onIsInfiniteChange: (isInfinite: boolean) => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({ 
    surah, 
    playingState, 
    onPlayRange,
    onStop,
    onStartLearning,
    playbackRange,
    onPlaybackRangeChange,
    repeatCount,
    onRepeatCountChange,
    isInfinite,
    onIsInfiniteChange,
 }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isAnyPlaybackActive = playingState.status !== 'idle';
  const isLoadingContinuous = playingState.status === 'loading' && playingState.mode === 'full-surah' && playingState.surahId === surah.id;
  const isLoadingVerseByVerse = playingState.status === 'loading' && playingState.mode === 'verse-by-verse' && playingState.surahId === surah.id;

  return (
    <>
    <div className="mb-6 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-slate-200 dark:border-zinc-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="mb-4 sm:mb-0">
                <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">Full Surah Recitation</h2>
                <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xs">
                  Play, listen, and practice your recitation.
                </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <button
                    onClick={() => onPlayRange(surah, 'verse-by-verse')}
                    className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed"
                    aria-label={`Play Surah ${surah.name} verse by verse`}
                    disabled={isAnyPlaybackActive}
                >
                    {isLoadingVerseByVerse ? <LoadingSpinner/> : <PlayIcon/>}
                    <span>Play (Verses)</span>
                </button>

                 <button
                    onClick={() => onPlayRange(surah, 'full-surah')}
                    className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:bg-slate-400 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed"
                    aria-label={`Play recitation non-stop`}
                    disabled={isAnyPlaybackActive}
                >
                    {isLoadingContinuous ? <LoadingSpinner/> : <PlayIcon />}
                    <span>{isLoadingContinuous ? 'Generating...' : 'Play Continuous'}</span>
                </button>
                 <button
                    onClick={() => setIsSettingsOpen(true)}
                    className="flex items-center justify-center w-full sm:w-auto px-4 py-2 rounded-lg bg-slate-200 text-slate-700 dark:bg-zinc-700 dark:text-zinc-200 font-semibold transition-colors hover:bg-slate-300 dark:hover:bg-zinc-600"
                    title="Playback Settings"
                >
                    <span className="material-symbols-outlined">tune</span>
                </button>
            </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <div className="mb-4 sm:mb-0">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">Practice Mode</h2>
                   <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-xs">
                      Recite the selected range and get real-time feedback.
                  </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                 <button
                    onClick={() => onStartLearning('highlight')}
                    className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-colors"
                >
                    <LearnIcon/>
                    <span>Highlight Mode</span>
                </button>
                 <button
                    onClick={() => onStartLearning('memory')}
                    className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white font-semibold hover:bg-sky-700 transition-colors"
                >
                    <span className="material-symbols-outlined">psychology</span>
                    <span>Memory Mode</span>
                </button>
              </div>
          </div>
        </div>
    </div>
    <PlaybackSettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        surah={surah}
        playbackRange={playbackRange}
        onPlaybackRangeChange={onPlaybackRangeChange}
        repeatCount={repeatCount}
        onRepeatCountChange={onRepeatCountChange}
        isInfinite={isInfinite}
        onIsInfiniteChange={onIsInfiniteChange}
    />
    </>
  );
};

export default PlaybackControls;
