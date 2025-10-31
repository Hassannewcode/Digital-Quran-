import React, { useState, useEffect } from 'react';
import { Surah, PlayingState, LearningModeType } from '../types';
import { PlayIcon, StopIcon, LoadingSpinner } from './icons/PlaybackIcons';
import { LearnIcon } from './icons/FeatureIcons';

interface PlaybackControlsProps {
  surah: Surah;
  playingState: PlayingState;
  onPlayRange: (surah: Surah, mode: 'verse-by-verse' | 'continuous' | 'full-surah' | 'asap-continuous') => void;
  onStartLearning: (mode: LearningModeType) => void;
  isLargeForContinuous: boolean;
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
    onStartLearning,
    isLargeForContinuous,
    playbackRange,
    onPlaybackRangeChange,
    repeatCount,
    onRepeatCountChange,
    isInfinite,
    onIsInfiniteChange,
 }) => {

  const [fromInput, setFromInput] = useState(playbackRange.start.toString());
  const [toInput, setToInput] = useState(playbackRange.end.toString());
  const [repeatInput, setRepeatInput] = useState(repeatCount.toString());

  useEffect(() => {
    setFromInput(playbackRange.start.toString());
    setToInput(playbackRange.end.toString());
  }, [playbackRange, surah]);

  useEffect(() => {
    setRepeatInput(repeatCount.toString());
  }, [repeatCount]);

  const isPlayingVerseByVerse = playingState.status !== 'idle' && playingState.mode === 'verse-by-verse' && playingState.surahId === surah.id;
  const isLoadingVerseByVerse = playingState.status === 'loading' && playingState.mode === 'verse-by-verse' && playingState.surahId === surah.id;
  
  const isPlayingAsap = playingState.status !== 'idle' && playingState.mode === 'asap-continuous' && playingState.surahId === surah.id;
  const isLoadingAsap = playingState.status === 'loading' && playingState.mode === 'asap-continuous' && playingState.surahId === surah.id;
  
  const isPlayingFullSurah = playingState.status !== 'idle' && playingState.mode === 'full-surah' && playingState.surahId === surah.id;
  const isLoadingFullSurah = playingState.status === 'loading' && playingState.mode === 'full-surah' && playingState.surahId === surah.id;


  const handleFromBlur = () => {
    let num = parseInt(fromInput, 10);
    if (isNaN(num)) num = 1;
    num = Math.max(1, Math.min(surah.ayahs.length, num));
    setFromInput(num.toString());

    if (num > playbackRange.end) {
        onPlaybackRangeChange({ start: num, end: num });
    } else {
        onPlaybackRangeChange({ ...playbackRange, start: num });
    }
  };

  const handleToBlur = () => {
    let num = parseInt(toInput, 10);
    if (isNaN(num)) num = surah.ayahs.length;
    num = Math.max(playbackRange.start, Math.min(surah.ayahs.length, num));
    setToInput(num.toString());
    onPlaybackRangeChange({ ...playbackRange, end: num });
  };
  
  const handleRepeatBlur = () => {
    let num = parseInt(repeatInput, 10);
    if (isNaN(num) || num < 0) num = 0;
    if (num > 10000) num = 10000; // a reasonable limit
    setRepeatInput(num.toString());
    onRepeatCountChange(num);
  };

  const handleInfiniteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onIsInfiniteChange(e.target.checked);
  }
  
  const anyLoading = isLoadingVerseByVerse || isLoadingFullSurah || isLoadingAsap;

  return (
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
                    className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 dark:disabled:bg-blue-800/50 disabled:cursor-not-allowed"
                    aria-label={isPlayingVerseByVerse ? `Stop recitation of Surah ${surah.name}` : `Play Surah ${surah.name} verse by verse`}
                    disabled={anyLoading}
                >
                    {isLoadingVerseByVerse ? <LoadingSpinner/> : isPlayingVerseByVerse ? <StopIcon/> : <PlayIcon/>}
                    <span>{isPlayingVerseByVerse ? 'Stop' : 'Play (Verses)'}</span>
                </button>
                <button
                    onClick={() => onPlayRange(surah, 'asap-continuous')}
                    className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:bg-slate-400 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed"
                    aria-label={isPlayingAsap ? `Stop recitation` : `Play recitation non-stop, pre-loading verses`}
                    disabled={anyLoading}
                >
                    {isLoadingAsap ? <LoadingSpinner/> : isPlayingAsap ? <StopIcon/> : <PlayIcon/>}
                    <span>{isPlayingAsap ? 'Stop' : 'Play (NS-ASAP)'}</span>
                </button>
                <button
                    onClick={() => onPlayRange(surah, 'full-surah')}
                    className="flex items-center justify-center w-full sm:w-auto gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:bg-slate-400 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed"
                    aria-label={isPlayingFullSurah ? `Stop full recitation of Surah ${surah.name}` : `Play Surah ${surah.name} fully without pauses`}
                    disabled={anyLoading || isLargeForContinuous}
                    title={isLargeForContinuous ? "Full surah playback is disabled for long surahs to improve performance." : ""}
                >
                    {isLoadingFullSurah ? <LoadingSpinner/> : isPlayingFullSurah ? <StopIcon/> : <PlayIcon/>}
                    <span>{isPlayingFullSurah ? 'Stop' : 'Play (Non-stop)'}</span>
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

        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 justify-start flex-wrap">
            <h3 className="text-sm font-semibold text-slate-600 dark:text-zinc-400 self-center sm:self-auto w-full sm:w-auto">Playback Options:</h3>
            <div className="flex items-center gap-2">
                <label htmlFor="start-ayah" className="text-sm font-medium">From:</label>
                 <input 
                    id="start-ayah"
                    type="number"
                    value={fromInput}
                    onChange={(e) => setFromInput(e.target.value)}
                    onBlur={handleFromBlur}
                    min="1"
                    max={surah.ayahs.length}
                    className="block w-20 px-2 py-1.5 text-base bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                 />
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="end-ayah" className="text-sm font-medium">To:</label>
                <input
                    id="end-ayah"
                    type="number"
                    value={toInput}
                    onChange={(e) => setToInput(e.target.value)}
                    onBlur={handleToBlur}
                    min={playbackRange.start}
                    max={surah.ayahs.length}
                    className="block w-20 px-2 py-1.5 text-base bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                 />
            </div>
            <div className="flex items-center gap-2">
                <label htmlFor="repeat-count" className="text-sm font-medium">Repeat:</label>
                <input 
                    id="repeat-count"
                    type="number"
                    value={repeatInput}
                    onChange={(e) => setRepeatInput(e.target.value)}
                    onBlur={handleRepeatBlur}
                    min="0"
                    max="10000"
                    disabled={isInfinite}
                    className="block w-20 px-2 py-1.5 text-base bg-white dark:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md disabled:bg-slate-100 dark:disabled:bg-zinc-800/50"
                 />
            </div>
             <div className="flex items-center gap-2">
                <input
                    id="infinite-loop"
                    type="checkbox"
                    checked={isInfinite}
                    onChange={handleInfiniteChange}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="infinite-loop" className="text-sm font-medium">Infinite</label>
            </div>
        </div>
    </div>
  );
};

export default PlaybackControls;