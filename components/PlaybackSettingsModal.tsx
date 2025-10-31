import React, { useState, useEffect, useCallback } from 'react';
import { Surah } from '../types';
import { CloseIcon } from './icons/PlaybackIcons';

interface PlaybackSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  surah: Surah;
  playbackRange: { start: number; end: number };
  onPlaybackRangeChange: (range: { start: number; end: number }) => void;
  repeatCount: number;
  onRepeatCountChange: (count: number) => void;
  isInfinite: boolean;
  onIsInfiniteChange: (isInfinite: boolean) => void;
}

const PlaybackSettingsModal: React.FC<PlaybackSettingsModalProps> = ({
  isOpen,
  onClose,
  surah,
  playbackRange,
  onPlaybackRangeChange,
  repeatCount,
  onRepeatCountChange,
  isInfinite,
  onIsInfiniteChange,
}) => {
  const [startInput, setStartInput] = useState(playbackRange.start.toString());
  const [endInput, setEndInput] = useState(playbackRange.end.toString());
  const [repeatInput, setRepeatInput] = useState(repeatCount.toString());
  const [isInfiniteChecked, setIsInfiniteChecked] = useState(isInfinite);

  useEffect(() => {
    if (isOpen) {
        setStartInput(playbackRange.start.toString());
        setEndInput(playbackRange.end.toString());
        setIsInfiniteChecked(isInfinite);
        setRepeatInput(isInfinite ? '0' : repeatCount.toString());
    }
  }, [isOpen, playbackRange, repeatCount, isInfinite]);

  const applyChanges = useCallback(() => {
    let start = parseInt(startInput, 10);
    if (isNaN(start) || start < 1) start = 1;
    if (start > surah.ayahs.length) start = surah.ayahs.length;
    setStartInput(start.toString());

    let end = parseInt(endInput, 10);
    if (isNaN(end) || end > surah.ayahs.length) end = surah.ayahs.length;
    if (end < start) end = start;
    setEndInput(end.toString());

    onPlaybackRangeChange({ start, end });

    let repeat = parseInt(repeatInput, 10);
    if (isNaN(repeat) || repeat < 0) repeat = 0;
    setRepeatInput(repeat.toString());
    
    onRepeatCountChange(repeat);
    onIsInfiniteChange(isInfiniteChecked);
  }, [startInput, endInput, repeatInput, isInfiniteChecked, onPlaybackRangeChange, onRepeatCountChange, onIsInfiniteChange, surah.ayahs.length]);
  
  const handleClose = useCallback(() => {
      applyChanges();
      onClose();
  }, [applyChanges, onClose]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
          e.currentTarget.blur();
      }
  };

  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={handleClose}
        aria-modal="true"
        role="dialog"
    >
      <div 
        className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-slate-800 dark:text-zinc-200">Playback Settings</h2>
          <button onClick={handleClose} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-700">
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-zinc-300">Verse Range</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label htmlFor="start-ayah" className="block text-sm font-medium text-slate-600 dark:text-zinc-400">From</label>
                <input
                  id="start-ayah"
                  type="number"
                  value={startInput}
                  onChange={(e) => setStartInput(e.target.value)}
                  onBlur={applyChanges}
                  onKeyDown={handleKeyDown}
                  min="1"
                  max={surah.ayahs.length}
                  className="mt-1 block w-full px-3 py-2 text-base bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="end-ayah" className="block text-sm font-medium text-slate-600 dark:text-zinc-400">To</label>
                <input
                  id="end-ayah"
                  type="number"
                  value={endInput}
                  onChange={(e) => setEndInput(e.target.value)}
                  onBlur={applyChanges}
                  onKeyDown={handleKeyDown}
                  min={parseInt(startInput, 10) || 1}
                  max={surah.ayahs.length}
                  className="mt-1 block w-full px-3 py-2 text-base bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2 text-slate-700 dark:text-zinc-300">Repetition</h3>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label htmlFor="repeat-count" className="block text-sm font-medium text-slate-600 dark:text-zinc-400">Repeat Count</label>
                <input
                  id="repeat-count"
                  type="number"
                  value={repeatInput}
                  onChange={(e) => setRepeatInput(e.target.value)}
                  onBlur={applyChanges}
                  onKeyDown={handleKeyDown}
                  min="0"
                  max="1000"
                  disabled={isInfiniteChecked}
                  className="mt-1 block w-full px-3 py-2 text-base bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md disabled:bg-slate-100 dark:disabled:bg-zinc-800/50"
                />
              </div>
              <div className="flex items-center self-end pb-2 pt-6">
                 <input
                    id="infinite-loop"
                    type="checkbox"
                    checked={isInfiniteChecked}
                    onChange={(e) => setIsInfiniteChecked(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="infinite-loop" className="ml-2 text-sm font-medium text-slate-700 dark:text-zinc-300">Loop</label>
              </div>
            </div>
          </div>
          <div className="pt-2">
            <button
              onClick={handleClose}
              className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-zinc-800"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybackSettingsModal;