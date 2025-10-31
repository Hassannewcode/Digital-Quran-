
import React, { useState, ChangeEvent } from 'react';
// Fix: Import `PlayingMode` type to resolve TypeScript error.
import { Ayah, PlayingState, Surah, PlayingMode } from '../types';
import { PlayIcon, StopIcon, LoadingSpinner, PreviousIcon, NextIcon, CloseIcon } from './icons/PlaybackIcons';
import PlaybackSettingsModal from './PlaybackSettingsModal';

interface PlayerProps {
    playingState: PlayingState;
    surah: Surah;
    ayah: Ayah;
    elapsedTime: number;
    totalTime: number;
    onClose: () => void;
    onPlayPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onSeek: (time: number) => void;
    volume: number;
    onVolumeChange: (volume: number) => void;
    surahTotalAyahs: number;
    playbackRange: { start: number; end: number };
    onPlaybackRangeChange: (range: { start: number; end: number }) => void;
    repeatCount: number;
    onRepeatCountChange: (count: number) => void;
    isInfinite: boolean;
    onIsInfiniteChange: (isInfinite: boolean) => void;
}

const formatTime = (seconds: number) => {
    const roundedSeconds = Math.floor(seconds);
    const mins = Math.floor(roundedSeconds / 60);
    const secs = roundedSeconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const Player: React.FC<PlayerProps> = ({
    playingState, surah, ayah, elapsedTime, totalTime,
    onClose, onPlayPause, onNext, onPrevious, onSeek, volume, onVolumeChange,
    ...modalProps
}) => {
    const { status, mode } = playingState as { status: Exclude<PlayingState['status'], 'idle'>, mode: PlayingMode };
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const isSeeking = React.useRef(false);
    const [seekValue, setSeekValue] = useState(0);

    const handleSeekMouseDown = () => {
        isSeeking.current = true;
    };

    const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
        const time = parseFloat(e.currentTarget.value);
        onSeek(time);
        isSeeking.current = false;
    };
    
    const handleSeekChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSeekValue(parseFloat(e.target.value));
    };

    const progress = totalTime > 0 ? (elapsedTime / totalTime) * 100 : 0;
    const currentSliderValue = isSeeking.current ? seekValue : elapsedTime;

    const isFullSurahMode = mode === 'full-surah';

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800/95 dark:bg-zinc-900/95 backdrop-blur-sm text-white shadow-lg-top">
                <div className="container mx-auto px-4 py-2">
                    <div className="flex items-center gap-3">
                        <span className="text-xs w-10 text-center">{formatTime(currentSliderValue)}</span>
                        <input
                            type="range"
                            min="0"
                            max={totalTime || 1}
                            value={currentSliderValue}
                            onChange={handleSeekChange}
                            onMouseDown={handleSeekMouseDown}
                            onMouseUp={handleSeekMouseUp}
                            disabled={!isFullSurahMode}
                            className="w-full h-1.5 bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md"
                            style={{ backgroundSize: `${isFullSurahMode ? progress : 0}% 100%` }}
                        />
                        <span className="text-xs w-10 text-center">{formatTime(totalTime)}</span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                        <div className="w-1/4">
                            <p className="font-bold truncate text-sm">{surah.name} ({playingState.status !== 'idle' && playingState.ayahId})</p>
                            <p className="text-xs text-slate-300 truncate">{isFullSurahMode ? 'Continuous Recitation' : ayah.translation}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-slate-300 hover:text-white transition-colors" title="Playback Settings">
                                <span className="material-symbols-outlined">more_horiz</span>
                            </button>
                            <button onClick={onPrevious} disabled={isFullSurahMode} className="p-2 text-slate-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <PreviousIcon />
                            </button>
                            <button onClick={onPlayPause} className="w-12 h-12 flex items-center justify-center rounded-full bg-white text-slate-800 hover:bg-slate-200 transition-colors">
                                {status === 'loading' ? <LoadingSpinner /> : status === 'playing' ? <StopIcon /> : <PlayIcon />}
                            </button>
                            <button onClick={onNext} disabled={isFullSurahMode} className="p-2 text-slate-300 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                                <NextIcon />
                            </button>
                            <div className="group flex items-center gap-2">
                                <span className="material-symbols-outlined text-slate-300">volume_up</span>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={volume}
                                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                                    className="w-20 h-1 bg-slate-600 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                                />
                            </div>
                        </div>

                        <div className="w-1/4 flex items-center justify-end">
                            <button onClick={onClose} className="p-2 text-slate-300 hover:text-white transition-colors" title="Close Player">
                                <CloseIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <PlaybackSettingsModal 
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                surah={surah}
                {...modalProps}
            />
        </>
    );
};

export default Player;
