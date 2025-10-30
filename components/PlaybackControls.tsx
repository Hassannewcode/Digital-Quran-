import React from 'react';
import { Surah, PlayingState } from '../types';
import { PlayIcon, StopIcon, LoadingSpinner } from './icons/PlaybackIcons';

interface PlaybackControlsProps {
  surah: Surah;
  playingState: PlayingState;
  onTogglePlay: (surah: Surah) => void;
  isLarge: boolean;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({ surah, playingState, onTogglePlay, isLarge }) => {
  const isPlayingThisSurah = playingState.status !== 'idle' && playingState.surahId === surah.id && playingState.continuous;
  const isLoadingThisSurah = playingState.status === 'loading' && playingState.surahId === surah.id && playingState.continuous;

  const renderButtonContent = () => {
    if (isLoadingThisSurah) {
      return (
        <>
          <LoadingSpinner />
          <span>Loading...</span>
        </>
      );
    }
    if (isPlayingThisSurah) {
      return (
        <>
          <StopIcon />
          <span>Stop Recitation</span>
        </>
      );
    }
    return (
      <>
        <PlayIcon />
        <span>Play Surah</span>
      </>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-slate-200 dark:border-zinc-800">
        <div className="mb-4 sm:mb-0">
            <h2 className="text-lg font-bold text-slate-800 dark:text-zinc-200">Full Surah Recitation</h2>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              {isLarge 
                ? "Continuous playback is disabled for long surahs."
                : "Play the full surah from the beginning."
              }
            </p>
        </div>
        <button
            onClick={() => onTogglePlay(surah)}
            className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:bg-slate-400 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed"
            aria-label={isPlayingThisSurah ? `Stop recitation of Surah ${surah.name}` : `Play Surah ${surah.name}`}
            disabled={isLoadingThisSurah || isLarge}
        >
            {renderButtonContent()}
        </button>
    </div>
  );
};

export default PlaybackControls;
